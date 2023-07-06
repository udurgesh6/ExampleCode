import prisma from "./lib/prisma";

const createProducts = async (productData, res) => {
  console.log(productData);
  try {
    await prisma.$transaction(async (prisma) => {
      await prisma.products.createMany({
        data: productData,
      });
    });
    console.log("Products created successfully.");
    res.status(200).json("OK");
  } catch (error) {
    console.error("Error creating products:", error);
    res.status(403).json({ err: error });
  } finally {
    await prisma.$disconnect();
  }
};

export default async (req, res) => {
  try {
    createProducts(JSON.parse(req.body.productData), res);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: err });
  }
};
