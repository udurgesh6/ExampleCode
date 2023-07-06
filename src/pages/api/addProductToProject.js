import prisma from "./lib/prisma";
export default async (req, res) => {
  try {
    const result = await prisma.productsInProject.create({
      data: {
        project_id: req.body.project_id,
        product_id: req.body.product_id,
        user_id: req.body.user_id,
      },
    });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res
      .status(403)
      .json({ err: "Error occured while adding a product to project" });
  }
};
