import prisma from "./lib/prisma";

export default async (req, res) => {
  try {
    const result = await prisma.users.create({
      data: {
        full_name: req.body.full_name,
        user_id: req.body.user_id,
        email: req.body.email,
        contact: req.body.contact,
        company_name: req.body.company_name,
        company_address: req.body.company_address,
        type: req.body.type,
        role: req.body.role,
      },
    });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(401).json({ err: "Error occured while creating a user" });
  }
};
