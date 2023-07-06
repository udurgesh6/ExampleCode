import prisma from "./lib/prisma";
export default async (req, res) => {
  try {
    const products = await prisma.productsInProject.findMany({
      include: {
        user: true,
        product: true,
        project: true,
      },
      orderBy: {
        last_updated_at: "desc",
      },
    });
    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(403).json({
      err: "Error occured while getting products from projects",
    });
  }
};
