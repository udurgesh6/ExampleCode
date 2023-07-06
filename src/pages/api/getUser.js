import prisma from "./lib/prisma";

export default async (req, res) => {
  try {
    const user = await prisma.users.findFirst({
      where: { user_id: req.query.user_id },
    });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(403).json({
      err: "Something went wrong while fetching the user!",
    });
  }
};
