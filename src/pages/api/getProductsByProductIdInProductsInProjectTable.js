import prisma from "./lib/prisma";
export default async (req, res) => {
  try {
    const products = await prisma.productsInProject.findMany({
      where: {
        OR: [
          {
            product_id: {
              contains: req.query.keyword,
            },
          },
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
