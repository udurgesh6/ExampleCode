import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

export default async (req, res) => {
  console.log(req.query.key);
  try {
    var params = {
      Bucket: process.env.BUCKET_NAME,
      Key: req.query.key,
    };
    s3.deleteObject(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
        res.status(403).json({ err: err });
      } else {
        res.send(200).json(data);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured while getting product images" });
  }
};
