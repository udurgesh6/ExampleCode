import prisma from "./lib/prisma";
export default async (req, res) => {
  const { page } = req.query;
  const pageSize = 30;
  const offset = (page - 1) * pageSize;
  try {
    let tagsArray = req.query.tags.split(" ");

    tagsArray = [...new Set(tagsArray)];
    tagsArray = tagsArray.filter((tag) => tag.length > 0);
    console.log(tagsArray);
    const products = await prisma.products.findMany({
      take: pageSize,
      skip: offset,
      where: {
        OR: [
          ...tagsArray.map((keyword) => ({
            name: { contains: keyword, mode: "insensitive" },
          })),
          ...tagsArray.map((keyword) => ({
            description: { contains: keyword, mode: "insensitive" },
          })),
          ...tagsArray.map((keyword) => ({
            specifications: { contains: keyword, mode: "insensitive" },
          })),
        ],
      },
    });
    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(403).json({
      err: "Error occured while getting products from provided keyword",
    });
  }
};
