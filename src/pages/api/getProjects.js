import prisma from "./lib/prisma";

export default async (req, res) => {
  try {
    const projects = await prisma.projects.findMany({
      where: { user_id: req.query.user_id },
      include: {
        ProductsInProject: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
    res.status(200).json(projects);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: err });
  }
};
