import prisma from "./lib/prisma";

export default async (req, res) => {
  try {
    const all_users = await prisma.users.findMany();
    res.status(200).json(all_users);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error while getting the users" });
  }
};
