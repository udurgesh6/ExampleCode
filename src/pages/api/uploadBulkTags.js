import prisma from "./lib/prisma";

const createTags = async (tagsData, res) => {
  console.log(tagsData);
  try {
    await prisma.$transaction(async (prisma) => {
      await prisma.tags.createMany({
        data: tagsData,
      });
    });
    console.log("Tags created successfully.");
    res.status(200).json("OK");
  } catch (error) {
    console.error("Error creating tags:", error);
    res.status(403).json({ err: error });
  } finally {
    await prisma.$disconnect();
  }
};

export default async (req, res) => {
  try {
    createTags(JSON.parse(req.body.tagsData), res);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: err });
  }
};
