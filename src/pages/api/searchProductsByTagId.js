import prisma from "./lib/prisma";
export default async (req, res) => {
  const { page } = req.query;
  const pageSize = 30;
  const offset = (page - 1) * pageSize;
  try {
    const products = await prisma.productTags.findMany({
      take: pageSize,
      skip: offset,
      where: {
        tag_id: req.query.tag_id,
      },
      include: {
        product: true,
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
