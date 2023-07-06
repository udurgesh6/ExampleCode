import fs from "fs";
import formidable from "formidable";
import AWS from "aws-sdk/";

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
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, file) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: err });
        return;
      }
      const bucketName = process.env.BUCKET_NAME;
      try {
        await createFolderInS3(req.query.product_id, bucketName);
        // File
        let folderName = req.query.product_id;
        var filePath = file.image.filepath;
        var fileKey = `${folderName}/${file.image.originalFilename}`;
        var buffer = fs.readFileSync(filePath);
        // S3 Upload options
        var bucket = process.env.BUCKET_NAME;

        // Upload
        var startTime = new Date();
        var partNum = 0;
        var partSize = 1024 * 1024 * 5; // Minimum 5MB per chunk (except the last part) http://docs.aws.amazon.com/AmazonS3/latest/API/mpUploadComplete.html
        var numPartsLeft = Math.ceil(buffer.length / partSize);
        var maxUploadTries = 3;
        var multiPartParams = {
          Bucket: bucket,
          Key: fileKey,
          // ContentType: "application/pdf",
        };
        var multipartMap = {
          Parts: [],
        };

        function completeMultipartUpload(s3, doneParams) {
          s3.completeMultipartUpload(doneParams, function (err, data) {
            if (err) {
              console.log(
                "An error occurred while completing the multipart upload"
              );
              console.log(err);
            } else {
              var delta = (new Date() - startTime) / 1000;
              console.log("Completed upload in", delta, "seconds");
              console.log("Final upload data:", data);
              res.status(200).json({
                message: "File uploaded successfully.",
                defaultImageUrl: data.Location,
              });
            }
          });
        }

        function uploadPart(s3, multipart, partParams, tryNum) {
          var tryNum = tryNum || 1;
          s3.uploadPart(partParams, function (multiErr, mData) {
            if (multiErr) {
              console.log("multiErr, upload part error:", multiErr);
              if (tryNum < maxUploadTries) {
                console.log(
                  "Retrying upload of part: #",
                  partParams.PartNumber
                );
                uploadPart(s3, multipart, partParams, tryNum + 1);
              } else {
                console.log("Failed uploading part: #", partParams.PartNumber);
              }
              return;
            }
            multipartMap.Parts[this.request.params.PartNumber - 1] = {
              ETag: mData.ETag,
              PartNumber: Number(this.request.params.PartNumber),
            };
            console.log("Completed part", this.request.params.PartNumber);
            console.log("mData", mData);
            if (--numPartsLeft > 0) return; // complete only when all parts uploaded

            var doneParams = {
              Bucket: bucket,
              Key: fileKey,
              MultipartUpload: multipartMap,
              UploadId: multipart.UploadId,
            };

            console.log("Completing upload...");
            completeMultipartUpload(s3, doneParams);
          });
        }

        // Multipart
        console.log("Creating multipart upload for:", fileKey);
        s3.createMultipartUpload(multiPartParams, function (mpErr, multipart) {
          if (mpErr) {
            console.log("Error!", mpErr);
            return;
          }
          console.log("Got upload ID", multipart.UploadId);

          // Grab each partSize chunk and upload it as a part
          for (
            var rangeStart = 0;
            rangeStart < buffer.length;
            rangeStart += partSize
          ) {
            partNum++;
            var end = Math.min(rangeStart + partSize, buffer.length),
              partParams = {
                Body: buffer.slice(rangeStart, end),
                Bucket: bucket,
                Key: fileKey,
                PartNumber: String(partNum),
                UploadId: multipart.UploadId,
              };

            // Send a single part
            console.log(
              "Uploading part: #",
              partParams.PartNumber,
              ", Range start:",
              rangeStart
            );
            uploadPart(s3, multipart, partParams);
          }
        });
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
