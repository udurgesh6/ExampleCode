import prisma from "./lib/prisma";
export default async (req, res) => {
  try {
    const updatedProduct = await prisma.products.update({
      where: {
        product_id: req.body.product_id,
      },
      data: {
        image_link: req.body.image_link,
      },
    });
    res.status(200).json(updatedProduct);
  } catch (err) {
    res
      .status(403)
      .json({ err: "Something went wrong while updating a product!" });
  }
};
