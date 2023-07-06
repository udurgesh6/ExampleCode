import prisma from "./lib/prisma";

export default async (req, res) => {
  try {
    const result = await prisma.productsInProject.deleteMany({
      where: {
        project_id: req.query.project_id,
      },
    });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res
      .status(403)
      .json({ err: "Error occured while deleting all products from project" });
  }
};
