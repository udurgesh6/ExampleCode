import React from "react";
import Image from "next/image";
const NoProjects = ({
  allProjectsOfUser,
  showAllProjects,
  setShowCreateProjectModal,
  setShowAllProjects,
}) => {
  return (
    <div
      className={`w-[100%] ${
        allProjectsOfUser?.length > 0 ? "" : "h-[100%]"
      } flex flex-col items-center justify-center px-2 text-center`}
    >
      <Image
        src="/no_projects.png"
        width={200}
        height={200}
        className="mb-3"
        alt="No projects"
      />
      <p className="text-lg font-">No projects to show !</p>
      <p className="text-lg font-">
        Please create one to start adding products
      </p>
      <button
        onClick={() => {
          if (showAllProjects) {
            setShowCreateProjectModal(true);
          } else {
            setShowAllProjects(true);
          }
        }}
        className="bg-gray-700 hover:bg-gray-800 text-gray-100 font-semibold hover:text-white py-2 px-4 border border-gray-200 hover:border-transparent rounded h-11 mt-5 w-[130px]"
      >
        {showAllProjects ? "Add project" : "Back"}
      </button>
    </div>
  );
};

export default NoProjects;
