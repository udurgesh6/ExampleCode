import prisma from "./lib/prisma";
export default async (req, res) => {
  try {
    const updatedProjectAddress = await prisma.projects.update({
      where: {
        project_id: req.body.project_id,
      },
      data: {
        address: req.body.client_address,
      },
    });
    res.status(200).json(updatedProjectAddress);
  } catch (err) {
    console.log(err);
    res.status(403).json({
      err: "Something went wrong while updating project address",
    });
  }
};
