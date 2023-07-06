import prisma from "./lib/prisma";

export default async (req, res) => {
  try {
    const result = await prisma.projects.create({
      data: {
        project_id: req.body.project_id,
        name: req.body.name,
        pincode: req.body.pincode,
        project_type: req.body.project_type,
        project_phase: req.body.project_phase,
        project_area: req.body.project_area,
        user_id: req.body.user_id,
        address: req.body.address,
      },
    });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: err });
  }
};
