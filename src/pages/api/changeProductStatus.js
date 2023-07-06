import prisma from "./lib/prisma";

export default async (req, res) => {
  console.log(req.body);
  try {
    const arrOfPinProj = JSON.parse(req.body.productsInProject).map((rbp) => ({
      products_in_project_id: {
        contains: rbp,
      },
    }));
    const updateProductsInProject = await prisma.productsInProject.updateMany({
      where: {
        OR: arrOfPinProj,
      },
      data: {
        status: req.body.status,
        last_updated_at: new Date(
          new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000
        ),
      },
    });
    res.status(200).json(updateProductsInProject);
  } catch (err) {
    console.log(err);
    res.status(403).json({
      err: "Something went wrong while updating a status for a product in a project",
    });
  }
};
