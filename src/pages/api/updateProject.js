import prisma from "./lib/prisma";
export default async (req, res) => {
  try {
    const updatedProject = await prisma.projects.update({
      where: {
        project_id: req.body.project_id,
      },
      data: {
        name: req.body.name,
        project_area: req.body.project_area,
        project_phase: req.body.project_phase,
        project_type: req.body.project_type,
        pincode: req.body.pincode,
        address: req.body.address,
      },
    });
    res.status(200).json(updatedProject);
  } catch (err) {
    console.log(err);
    res
      .status(403)
      .json({ err: "Something went wrong while updating a project!" });
  }
};
