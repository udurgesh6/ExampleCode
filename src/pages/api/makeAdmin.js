import prisma from "./lib/prisma";
export default async (req, res) => {
  try {
    const updatedUser = await prisma.users.update({
      where: {
        user_id: req.body.user_id,
      },
      data: {
        access: "admin",
      },
    });
    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    res
      .status(403)
      .json({ err: "Something went wrong while making user an admin" });
  }
};
