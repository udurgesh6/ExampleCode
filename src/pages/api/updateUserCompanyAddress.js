import prisma from "./lib/prisma";
export default async (req, res) => {
  try {
    const updatedUserCompanyAddress = await prisma.users.update({
      where: {
        user_id: req.body.user_id,
      },
      data: {
        company_address: req.body.company_address,
      },
    });
    res.status(200).json(updatedUserCompanyAddress);
  } catch (err) {
    console.log(err);
    res.status(403).json({
      err: "Something went wrong while updating user company address",
    });
  }
};
