import prisma from "./lib/prisma";
export default async (req, res) => {
  try {
    let deletedProduct = await prisma.products.deleteMany({
      where: {
        product_id: req.query.keyword,
      },
    });
    res.status(200).json(deletedProduct);
  } catch (err) {
    console.log(err);
    res.status(403).json({
      err: "Error occured while deleting a product",
    });
  }
};
