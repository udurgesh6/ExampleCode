import React, { useState } from "react";
import axios from "axios";
import { setProjects, editProject } from "@/slices/projectsSlice";
import { selectUserState } from "@/slices/userSlice";
import { useDispatch } from "react-redux";
import cuid from "cuid";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShowCreateProjectModal = ({
  setShowCreateProjectModal,
  creatingANewProject,
  name,
  setProjectName,
  pincode,
  setPincode,
  project_phase,
  setProjectPhase,
  project_type,
  setProjectType,
  project_area,
  setProjectArea,
  address,
  setAddress,
  setProjectSelected,
  setCreatingANewProject,
  projectsSelected,
}) => {
  const dispatch = useDispatch();
  const user_details = useSelector(selectUserState);

  const [loading, setLoading] = useState(false);

  const onProjectSubmission = (e) => {
    e.preventDefault();
    setLoading(true);
    let project_id = cuid();
    axios
      .post("../api/createProject", {
        project_id: project_id,
        name: name,
        pincode: pincode,
        project_type: project_type,
        project_phase: project_phase,
        project_area: project_area,
        user_id: user_details.user_id,
        address: address,
      })
      .then(() => {
        toast("Project created successfully!");
        dispatch(
          setProjects({
            project_id: project_id,
            name: name,
            pincode: pincode,
            project_phase: project_phase,
            project_type: project_type,
            project_area: project_area,
            products: [],
            address: address,
            delivery_at: "",
            status: "Active",
          })
        );
        setPincode("");
        setProjectArea("");
        setProjectName("");
        setProjectPhase("Concept");
        setProjectType("Residential");
        setAddress("");
        setShowCreateProjectModal(false);
      })
      .catch(() => {
        toast("Something went wrong while creating the project!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onEditProjectSubmission = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .put("../api/updateProject", {
        project_id: projectsSelected.project_id,
        name: name,
        pincode: pincode,
        project_phase: project_phase,
        project_type: project_type,
        project_area: project_area,
        address: address,
      })
      .then(() => {
        toast("Project updated successfully!");
        dispatch(
          editProject({
            project_id: projectsSelected.project_id,
            name: name,
            pincode: pincode,
            project_phase: project_phase,
            project_type: project_type,
            project_area: project_area,
            address: address,
            status: projectsSelected.status,
            delivery_at: projectsSelected.delivery_at,
          })
        );
        setProjectSelected((projectsSelected) => ({
          project_id: projectsSelected.project_id,
          name: name,
          pincode: pincode,
          project_phase: project_phase,
          project_type: project_type,
          project_area: project_area,
          address: address,
          status: projectsSelected.status,
          delivery_at: projectsSelected.delivery_at,
        }));
        setPincode("");
        setProjectArea("");
        setProjectName("");
        setProjectPhase("Concept");
        setProjectType("Residential");
        setShowCreateProjectModal(false);
        setCreatingANewProject(true);
      })
      .catch(() => {
        toast("Something went wrong while editing the project!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onDecline = () => {
    setShowCreateProjectModal(false);
    setPincode("");
    setProjectArea("");
    setProjectName("");
    setProjectPhase("Concept");
    setProjectType("Residential");
    setCreatingANewProject(true);
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto ">
      <ToastContainer />
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 transition-opacity"
          onClick={() => setShowCreateProjectModal(false)}
        >
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
        </div>
        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <div className="flex items-start justify-between p-4 border-b rounded-t ">
            <h3 className="text-xl font-semibold text-gray-900 ">
              {creatingANewProject
                ? "Let's create your project"
                : "Edit your project details"}
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
              data-modal-hide="defaultModal"
              onClick={() => setShowCreateProjectModal(false)}
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          <div className="p-6 space-y-6">
            <form
              className="w-full max-w-lg"
              onSubmit={(e) => {
                if (creatingANewProject) {
                  onProjectSubmission(e);
                } else {
                  onEditProjectSubmission(e);
                }
              }}
            >
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-first-name"
                  >
                    Enter project name
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id="grid-first-name"
                    type="text"
                    placeholder="Project name"
                    required
                    value={name}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-1/2 px-3">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-last-name"
                  >
                    Pincode
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-last-name"
                    type="text"
                    placeholder="Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-8">
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-city"
                  >
                    Project Phase
                  </label>
                  <div className="relative">
                    <select
                      className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-city"
                      onChange={(e) => {
                        setProjectPhase(e.target.value);
                      }}
                      required
                      value={project_phase}
                    >
                      <option value="Concept">Concept</option>
                      <option value="Design Development">
                        Design Development
                      </option>
                      <option value="Under Construction">
                        Under Construction
                      </option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-state"
                  >
                    Project Type
                  </label>
                  <div className="relative">
                    <select
                      className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-state"
                      onChange={(e) => {
                        setProjectType(e.target.value);
                      }}
                      value={project_type}
                      required
                    >
                      <option>Residential</option>
                      <option>Commercial</option>
                      <option>Other</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-zip"
                  >
                    Input Project Area
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-zip"
                    type="text"
                    placeholder="90210"
                    value={project_area}
                    onChange={(e) => setProjectArea(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-2">
                <div className="w-full px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-address"
                  >
                    Project Address
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id="grid-address"
                    type="text"
                    placeholder="Project address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
              <div className="pt-4 flex items-center space-x-2 border-t border-gray-200 rounded-b ">
                <button
                  data-modal-hide="defaultModal"
                  type="submit"
                  className="text-white bg-gray-700 hover:bg-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-[140px]"
                >
                  {loading ? (
                    <div className="flex flex-col items-center justify-center text-white">
                      <div className="flex items-center justify-center">
                        <div
                          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                          role="status"
                        >
                          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                            Loading...
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : creatingANewProject ? (
                    "Create Project"
                  ) : (
                    "Update Project"
                  )}
                </button>
                <button
                  data-modal-hide="defaultModal"
                  type=""
                  className="text-gray-700 bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 "
                  onClick={onDecline}
                >
                  Decline
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowCreateProjectModal;
