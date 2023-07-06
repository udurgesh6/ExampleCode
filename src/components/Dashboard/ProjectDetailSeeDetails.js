import React from "react";

const ProjectDetailSeeDetails = ({
  showProjectDetails,
  setShowProjectDetails,
  projectsSelected,
}) => {
  return (
    <div id="accordion-collapse" data-accordion="collapse" className="mt-2">
      <h2 id="accordion-collapse-heading-1">
        <button
          type="button"
          className="flex text-lg items-center justify-between w-full font-large text-left text-600 border border-t-0 border-gray-400 rounded-t-xl  p-3"
          data-accordion-target="#accordion-collapse-body-1"
          aria-expanded="true"
          aria-controls="accordion-collapse-body-1"
          style={{ fontWeight: "500", fontSize: "21px" }}
          onClick={() => setShowProjectDetails(() => !showProjectDetails)}
        >
          <span className="text-gray-800 text-md font-semibold">
            See Details
          </span>
          <svg
            data-accordion-icon
            className={
              !showProjectDetails
                ? "w-6 h-6 rotate-180 shrink-0"
                : "w-6 h-6 shrink-0"
            }
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </h2>
      <div
        id="accordion-collapse-body-1"
        className={showProjectDetails ? "hidden" : ""}
        aria-labelledby="accordion-collapse-heading-1"
      >
        <div className="p-3 font-light border border-b-0 border-gray-300 flex flex-col">
          <div className="flex flex-row justify-between">
            <div style={{ width: "50%", marginBottom: "10px" }}>
              <label className="font-semibold text-gray-700 text-sm">
                Project Area
              </label>
              <p>{projectsSelected.project_area}</p>
            </div>
            <div style={{ width: "50%" }}>
              <label className="font-semibold text-gray-700 text-sm">
                Project Type
              </label>
              <p>{projectsSelected.project_type}</p>
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div style={{ width: "50%", marginBottom: "10px" }}>
              <label className="font-semibold text-gray-700 text-sm">
                Project Phase
              </label>
              <p>{projectsSelected.project_phase}</p>
            </div>
            <div style={{ width: "50%" }}>
              <label className="font-semibold text-gray-700 text-sm">
                Zip Code
              </label>
              <p>{projectsSelected.pincode}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailSeeDetails;
