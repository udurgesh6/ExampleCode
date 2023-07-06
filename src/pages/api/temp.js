import fs from "fs";
import formidable from "formidable";
import AWS from "aws-sdk/";
import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  S3Client,
} from "@aws-sdk/client-s3";
const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

async function uploadImageToS3(file, folderName, bucketName) {
  const fileContent = fs.readFileSync(file.filepath);

  const params = {
    Bucket: bucketName,
    Key: `${folderName}/${file.originalFilename}`,
    Body: fileContent,
  };

  try {
    let uploadedImage = await s3.upload(params).promise();
    return uploadedImage;
  } catch (err) {
    console.error(`Failed to upload file: ${file.name}`, err);
  }
}

async function createFolderInS3(folderName, bucketName) {
  const params = {
    Bucket: bucketName,
    Key: `${folderName}/`,
  };

  try {
    await s3.putObject(params).promise();
  } catch (err) {
    console.error(`Failed to create folder: ${folderName}`, err);
  }
}

export default async (req, res) => {
  try {
    const form = new formidable.IncomingForm({ multiples: true });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: err });
        return;
      }

      const bucketName = process.env.BUCKET_NAME;
      try {
        await createFolderInS3(req.query.product_id, bucketName);
        const imagesUrlList = [];
        // for (let i = 0; i < files[Object.keys(files)[0]].length; i++) {
        //   let uploadedImage = await uploadImageToS3(
        //     files[Object.keys(files)[0]][i],
        //     req.query.product_id,
        //     bucketName
        //   );
        //   imagesUrlList.push(uploadedImage.Location);
        // }

        for (let i = 0; i < files[Object.keys(files)[0]].length; i++) {
          let file = files[Object.keys(files)[0]][i];
          const fileStream = fs.createReadStream(file.filepath);
          const fileStat = fs.statSync(file.filepath);
          const fileSize = fileStat.size;

          const chunkSize = Math.ceil(fileSize / 5);
          const chunkCount = Math.ceil(fileSize / chunkSize);
          const parts = [];

          let bytesRead = 0;
          let partNumber = 1;

          fileStream.on("data", async (chunk) => {
            console.log("chunkCount", chunkCount);
            console.log("partNumber", partNumber);
            bytesRead += chunk.length;

            const isLastChunk = partNumber === chunkCount;
            const chunkBuffer = Buffer.from(chunk);

            // const response = await uploadPart(
            //   uploadId,
            //   partNumber,
            //   chunkBuffer
            // );
            // console.log("chunkBuffer", chunkBuffer);
            // parts.push({ PartNumber: partNumber, ETag: response.ETag });
            parts.push({ PartNumber: partNumber, chunkBuffer: chunkBuffer });

            if (isLastChunk) {
              console.log("parts", parts);
              console.log("Multipart upload completed.");
            }

            partNumber++;
          });

          fileStream.on("end", () => {
            console.log("File read complete.");
          });

          fileStream.on("error", (error) => {
            console.error("Error reading file:", error);
          });
        }

        // for (let i = 0; i < files[Object.keys(files)[0]].length; i++) {
        //   console.log("file", i);
        //   let file = files[Object.keys(files)[0]][i];
        //   let folderName = req.query.product_id;
        //   const s3Client = new S3Client({
        //     region: process.env.REGION,
        //     credentials: {
        //       accessKeyId: process.env.ACCESS_KEY_ID,
        //       secretAccessKey: process.env.SECRET_ACCESS_KEY,
        //     },
        //   });
        //   const bucketName = process.env.BUCKET_NAME;
        //   const key = `${folderName}/${file.originalFilename}`;
        //   let uploadId;

        //   try {
        //     const multipartUpload = await s3Client.send(
        //       new CreateMultipartUploadCommand({
        //         Bucket: bucketName,
        //         Key: key,
        //       })
        //     );

        //     uploadId = multipartUpload.UploadId;

        //     const uploadPromises = [];
        //     // Multipart uploads require a minimum size of 5 MB per part.
        //     const partSize = Math.ceil(file.size / 5);
        //     console.log("file", file);
        //     // Upload each part.
        //     for (let i = 0; i < 5; i++) {
        //       const start = i * partSize;
        //       const end = start + partSize;

        //       uploadPromises.push(
        //         s3Client
        //           .send(
        //             new UploadPartCommand({
        //               Bucket: bucketName,
        //               Key: key,
        //               UploadId: uploadId,
        //               Body: fs
        //                 .createReadStream(file.filepath)
        //                 .slice(start, end),
        //               PartNumber: i + 1,
        //             })
        //           )
        //           .then((d) => {
        //             console.log("Part", i + 1, "uploaded");
        //             return d;
        //           })
        //       );
        //     }

        //     const uploadResults = await Promise.all(uploadPromises);

        //     return await s3Client.send(
        //       new CompleteMultipartUploadCommand({
        //         Bucket: bucketName,
        //         Key: key,
        //         UploadId: uploadId,
        //         MultipartUpload: {
        //           Parts: uploadResults.map(({ ETag }, i) => ({
        //             ETag,
        //             PartNumber: i + 1,
        //           })),
        //         },
        //       })
        //     );

        //   } catch (err) {
        //     console.error(err);

        //     if (uploadId) {
        //       const abortCommand = new AbortMultipartUploadCommand({
        //         Bucket: bucketName,
        //         Key: key,
        //         UploadId: uploadId,
        //       });

        //       await s3Client.send(abortCommand);
        //     }
        //   }
        //   if (i === files[Object.keys(files)[0]].length - 1) {
        //     res.status(200).json({
        //       message: "Files uploaded successfully.",
        //       defaultImageUrl: imagesUrlList[0],
        //     });
        //   }
        // }
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: err });
  }
};
