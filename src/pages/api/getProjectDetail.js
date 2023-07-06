import prisma from "./lib/prisma";
export default async (req, res) => {
  try {
    const project = await prisma.projects.findUnique({
      where: {
        project_id: req.query.project_id,
      },
      include: {
        ProductsInProject: {
          include: {
            product: true,
          },
        },
      },
    });
    res.status(200).json(project);
  } catch (err) {
    console.log(err);
    res.status(403).json({
      err: "Error occured while getting project detail",
    });
  }
};
