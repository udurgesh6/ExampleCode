import Tile from "@/components/Tile";
import Image from "next/image";
import React from "react";

const AllProjects = ({
  allProjectsOfUser,
  setProjectSelected,
  setShowAllProjects,
  addProductsImagesTo,
  setAddressDetails,
  user_details,
  setContact,
}) => {
  const onProjectSelection = (current_project) => {
    setProjectSelected(current_project);
    setShowAllProjects(false);
    addProductsImagesTo(current_project.products);
    setAddressDetails(() => ({
      client_address: current_project.address,
      addressType: current_project.delivery_at,
      company_address: user_details.company_address,
    }));
    setContact(user_details.contact);
  };

  return (
    // <div className="p-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 ">
    //   {allProjectsOfUser.map((current_project) => (
    //     <div
    //       className="shadow-md shadow-md rounded-lg border border-gray-100 flex flex-col cursor-pointer"
    //       key={current_project.project_id}
    //       onClick={() => {
    //         onProjectSelection(current_project);
    //       }}
    //     >
    //       <div className="flex flex-row justify-between">
    //         {[1, 2, 3].map((m) => (
    //           <Tile m={m} current_project={current_project} />
    //         ))}
    //       </div>
    //       <div className="flex flex-row justify-between">
    //         {[4, 5, 6].map((m) => (
    //           <Tile m={m} current_project={current_project} />
    //         ))}
    //       </div>
    //       <p className="text-md text-gray-300 font-semibold text-md">
    //         {current_project.name}
    //       </p>
    //     </div>
    //   ))}
    // </div>
    <div className="p-4 grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 ">
      {allProjectsOfUser.map((current_project) => (
        <div className="flex flex-col " key={current_project.project_id}>
          <div
            className="flex flex-row rounded-xl shadow-lg mb-2 cursor-pointer hover:shadow-xl hover:opacity-90"
            onClick={() => {
              onProjectSelection(current_project);
            }}
          >
            <Image
              className={`bg-center bg-cover bg-no-repeat object-cover w-[65%]
            } rounded-l-xl border border-r-white`}
              src={
                1 <= current_project.products.length
                  ? current_project.products[0].product.image_link
                  : "https://i.ibb.co/pWxB0Hf/Untitled-design-4.png"
              }
              width={100}
              height={100}
            />
            <div className="flex flex-col h-full w-[35%] rounded-r-lg">
              <Image
                className={`bg-center bg-cover bg-no-repeat object-cover w-full h-[50%]
            } rounded-tr-xl border-b border-white`}
                src={
                  2 <= current_project.products.length
                    ? current_project.products[1].product.image_link
                    : "https://i.ibb.co/pWxB0Hf/Untitled-design-4.png"
                }
                width={50}
                height={50}
              />
              <Image
                className={`bg-center bg-cover bg-no-repeat object-cover w-full h-[50%]
            } rounded-br-xl`}
                src={
                  3 <= current_project.products.length
                    ? current_project.products[2].product.image_link
                    : "https://i.ibb.co/pWxB0Hf/Untitled-design-4.png"
                }
                width={50}
                height={50}
              />
            </div>
          </div>
          <p className="text-lg text-gray-900 font-semibold text-md truncate">
            {current_project.name}
          </p>
          <p className="text-sm text-gray-700">
            {current_project.products.length} product
            {current_project.products.length !== 1 ? "s" : ""}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AllProjects;
