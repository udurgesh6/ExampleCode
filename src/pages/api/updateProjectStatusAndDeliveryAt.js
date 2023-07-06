import prisma from "./lib/prisma";
export default async (req, res) => {
  try {
    const updatedProjectStatus = await prisma.projects.update({
      where: {
        project_id: req.body.project_id,
      },
      data: {
        status: req.body.status,
        delivery_at: req.body.delivery_at,
      },
    });
    res.status(200).json(updatedProjectStatus);
  } catch (err) {
    res.status(403).json({
      err: "Something went wrong while updating project status",
    });
  }
};
