import prisma from "./lib/prisma";
export default async (req, res) => {
  try {
    const updateUserPhone = await prisma.users.update({
      where: {
        user_id: req.body.user_id,
      },
      data: {
        contact: req.body.contact,
      },
    });
    res.status(200).json(updateUserPhone);
  } catch (err) {
    console.log(err);
    res.status(403).json({
      err: "Something went wrong while updating user's phone ",
    });
  }
};
