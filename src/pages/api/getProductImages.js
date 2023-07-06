import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

export default async (req, res) => {
  try {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Prefix: `${req.query.folder_name}/`,
    };
    const response = await s3.listObjectsV2(params).promise();

    const images = response.Contents.map((object) => {
      return {
        key: object.Key,
        url: `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${object.Key}`,
      };
    });
    res.status(200).json(images);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured while getting product images" });
  }
};
