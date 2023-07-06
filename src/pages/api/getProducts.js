import prisma from "./lib/prisma";
export default async (req, res) => {
  const { page } = req.query;
  const pageSize = 30;
  const offset = (page - 1) * pageSize;
  try {
    const products = await prisma.products.findMany({
      take: pageSize,
      skip: offset,
    });
    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured while getting products" });
  }
};
