import prisma from "./lib/prisma";
export default async (req, res) => {
  try {
    const updatedProduct = await prisma.products.update({
      where: {
        product_id: req.body.product_id,
      },
      data: {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        specifications: req.body.specifications,
        last_updated_at: new Date(
          new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000
        ),
      },
    });
    res.status(200).json(updatedProduct);
  } catch (err) {
    res
      .status(403)
      .json({ err: "Something went wrong while updating a product!" });
  }
};
