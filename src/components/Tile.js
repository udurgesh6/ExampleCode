import React from "react";
import Image from "next/image";
const Tile = ({ m, current_project }) => {
  let product_image_url =
    m <= current_project.products.length
      ? current_project.products[m - 1].product.image_link
      : "https://i.ibb.co/pWxB0Hf/Untitled-design-4.png";

  return (
    <Image
      key={m}
      className={`bg-center bg-cover bg-no-repeat object-cover w-[33%] ${
        m === 1
          ? "rounded-tl-lg"
          : m === 3
          ? "rounded-tr-lg"
          : m === 4
          ? "rounded-bl-lg"
          : m === 6
          ? "rounded-br-lg"
          : ""
      }`}
      alt={m}
      src={product_image_url}
      width={100}
      height={100}
    />
  );
};

export default Tile;
