import prisma from "./lib/prisma";

export default async (req, res) => {
  try {
    const all_tags = await prisma.tags.findMany();
    res.status(200).json(all_tags);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error while getting the tags" });
  }
};
