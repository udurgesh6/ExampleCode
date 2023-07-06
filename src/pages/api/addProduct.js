import prisma from "./lib/prisma";
export default async (req, res) => {
  try {
    const result = await prisma.products.create({
      data: {
        product_id: req.body.product_id,
        name: req.body.name,
        image_link: req.body.image_link,
        description: req.body.description,
        category: req.body.category,
        specifications: req.body.specifications,
      },
    });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: err });
  }
};
