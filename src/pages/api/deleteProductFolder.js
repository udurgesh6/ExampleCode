import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

export default async (req, res) => {
  console.log(req.query.dir);
  try {
    const listParams = {
      Bucket: process.env.BUCKET_NAME,
      Prefix: req.query.dir,
    };

    const listedObjects = await s3.listObjectsV2(listParams).promise();

    if (listedObjects.Contents.length === 0) {
      res.send(200);
    }

    const deleteParams = {
      Bucket: process.env.BUCKET_NAME,
      Delete: { Objects: [] },
    };

    listedObjects.Contents.forEach(({ Key }) => {
      deleteParams.Delete.Objects.push({ Key });
    });

    await s3.deleteObjects(deleteParams).promise();

    if (listedObjects.IsTruncated) {
      await emptyS3Directory(bucket, dir);
    }

    res.send(200);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: err });
  }
};
