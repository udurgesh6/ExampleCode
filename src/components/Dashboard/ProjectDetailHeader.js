import React, { useState } from "react";
import {
  FacebookIcon,
  FacebookShareButton,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProjectDetailHeader = ({
  projectsSelected,
  onEditProject,
  allProductsForSelProject,
  callProductsForMeasurement,
  deleteThisProject,
  callProductsForSample,
  setShowAllProjects,
  onCloseProject,
}) => {
  console.log(projectsSelected);
  const domainUrl = `${
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : window.location.hostname
  }`;
  const [shareClicked, setShareClicked] = useState(false);
  return (
    <div className="flex flex-col w-full items-center justify-center mb-4">
      <ToastContainer />
      <p className="text-gray-900 text-3xl font-bold mb-1 p-2 rounded-md">
        {projectsSelected.name}
      </p>
      {projectsSelected.products.length > 0 && (
        <p className="text-gray-800 text-lg font-semibold mb-3">
          (
          {projectsSelected.products[0].status === "Product Added"
            ? "Call for sample"
            : projectsSelected.products[0].status === "Sample Delivered"
            ? "Call for measurement"
            : projectsSelected.products[0].status}
          )
        </p>
      )}
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center justify-center ">
          <button
            title="Go Back"
            className="p-3 border border-purple-400 bg-gray-100 hover:bg-gray-200 rounded-lg mr-3 shadow-md"
            onClick={() => {
              setShowAllProjects(true);
              onCloseProject();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-8 h-8"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
              />
            </svg>
          </button>
          {projectsSelected.status === "Active" && (
            <button
              onClick={callProductsForSample}
              title="Call for sample"
              className="p-3 border border-green-500 bg-gray-100 hover:bg-gray-200 rounded-lg mr-3 shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-8 h-8"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M20.25 3.75v4.5m0-4.5h-4.5m4.5 0l-6 6m3 12c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 00-.38 1.21 12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 011.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z"
                />
              </svg>
            </button>
          )}

          {projectsSelected.status === "Locked" &&
            allProductsForSelProject.filter(
              (ps) => ps.status === "Sample Delivered"
            ).length > 0 && (
              <button
                type="button"
                className="p-3 border border-green-500 bg-gray-100 hover:bg-gray-200 rounded-lg mr-3 shadow-lg"
                onClick={callProductsForMeasurement}
                title="Call for measurement"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-8 h-8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M20.25 3.75v4.5m0-4.5h-4.5m4.5 0l-6 6m3 12c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 00-.38 1.21 12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 011.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z"
                  />
                </svg>
              </button>
            )}
          {projectsSelected.status === "Active" && (
            <button
              onClick={onEditProject}
              title="Edit project"
              className="p-3 border border-yellow-400 bg-gray-100 hover:bg-gray-200 rounded-lg mr-3 shadow-md"
            >
              <svg
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="text-gray-700 pointer h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                ></path>
              </svg>
            </button>
          )}
          {projectsSelected.status === "Active" && (
            <button
              type="button"
              onClick={deleteThisProject}
              title="Delete project"
              className="shadow-md p-3 border border-red-400 bg-gray-100 hover:bg-gray-200 rounded-lg mr-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="text-gray-700 pointer h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
          )}
          <div>
            <button
              title="Share Project"
              className="p-3 border border-blue-400 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md relative"
              id="dropdownHoverButton"
              type="button"
              onClick={() => setShareClicked((shareClicked) => !shareClicked)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-8 h-8"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                />
              </svg>
              {shareClicked && (
                <div
                  id="dropdownHover"
                  class="z-30 bg-white divide-y divide-gray-100 rounded-lg shadow  rounded-lg shadow-lg top-16 left-0 absolute "
                >
                  <ul
                    class="py-2 bg-white z-30 text-sm text-gray-700  rounded-lg shadow-lg"
                    aria-labelledby="dropdownHoverButton"
                  >
                    <li className="w-full flex flex-row justify-center mb-2">
                      <p className="font-medium">Share</p>
                    </li>
                    <li className="flex flex-col items-center px-3">
                      <FacebookShareButton
                        url={`${domainUrl}/project?id=${projectsSelected.project_id}`}
                      >
                        <FacebookIcon size={32} round className="mb-2" />
                      </FacebookShareButton>
                      <TwitterShareButton
                        url={`${domainUrl}/project?id=${projectsSelected.project_id}`}
                      >
                        <TwitterIcon
                          size={32}
                          round
                          className="mb-2"
                          href={`${domainUrl}/project?id=${projectsSelected.project_id}`}
                        />
                      </TwitterShareButton>
                      <FacebookMessengerShareButton
                        url={`${domainUrl}/project?id=${projectsSelected.project_id}`}
                      >
                        <FacebookMessengerIcon
                          size={32}
                          round
                          className="mb-2"
                        />
                      </FacebookMessengerShareButton>
                      <WhatsappShareButton
                        url={`${domainUrl}/project?id=${projectsSelected.project_id}`}
                      >
                        <WhatsappIcon size={32} round className="mb-2" />
                      </WhatsappShareButton>
                      <TelegramShareButton
                        url={`${domainUrl}/project?id=${projectsSelected.project_id}`}
                      >
                        <TelegramIcon size={32} round className="mb-2" />
                      </TelegramShareButton>
                      <LinkedinShareButton
                        url={`${domainUrl}/project?id=${projectsSelected.project_id}`}
                      >
                        <LinkedinIcon size={32} round className=" mb-2" />
                      </LinkedinShareButton>
                      <button
                        className="border border-gray-600 rounded-full flex flex-row items-center justify-center mb-2 p-1"
                        title="Copy Url"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${domainUrl}/project?id=${projectsSelected.project_id}`
                          );
                          toast("Project url copied to clipboard.");
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="w-5 h-5  text-black"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                          />
                        </svg>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailHeader;
