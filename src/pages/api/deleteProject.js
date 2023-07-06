import prisma from "./lib/prisma";
export default async (req, res) => {
  try {
    let deletedProject = await prisma.projects.deleteMany({
      where: {
        project_id: req.query.project_id,
      },
    });
    res.status(200).json(deletedProject);
  } catch (err) {
    res.status(403).json({
      err: "Error occured while deleting a project",
    });
  }
};
