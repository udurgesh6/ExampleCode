import prisma from "./lib/prisma";
export default async (req, res) => {
  const { searchTags } = req.query;
  const words = searchTags.split(" ");

  try {
    const tagFilters = words.map((word) => ({
      tag_name: {
        contains: word.toLowerCase(),
      },
    }));

    const tags = await prisma.tags.findMany({
      where: {
        OR: tagFilters,
      },
    });

    res.status(200).json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
