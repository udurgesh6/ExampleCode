import prisma from "./lib/prisma";

const createTaggedProducts = async (taggedData, res) => {
  console.log(taggedData);
  try {
    await prisma.$transaction(async (prisma) => {
      await prisma.productTags.createMany({
        data: taggedData,
      });
    });
    console.log("Tagging done successfully.");
    res.status(200).json("OK");
  } catch (error) {
    console.error("Error Tagging", error);
    res.status(403).json({ err: error });
  } finally {
    await prisma.$disconnect();
  }
};

export default async (req, res) => {
  try {
    createTaggedProducts(JSON.parse(req.body.taggedData), res);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: err });
  }
};
