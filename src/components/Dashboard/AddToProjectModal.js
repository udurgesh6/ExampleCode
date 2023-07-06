import CancelSvg from "@/components/CancelSvg";
import Image from "next/image";
import { useRouter } from "next/router";
const AddToProjectModal = ({
  setShowAddToProjectModal,
  onCancelProductsAddToProject,
  allProjectsOfUser,
  projectsSelected,
  onSaveProductToSelectedProjects,
  setProjectsSelected,
  loading,
}) => {
  const router = useRouter();
  const selectOrUnSelectProjectsForProduct = (project_id) => {
    let temp_projectsSelected = [...projectsSelected];
    if (temp_projectsSelected.includes(project_id)) {
      temp_projectsSelected = temp_projectsSelected.filter(
        (current_temp_project_id) => current_temp_project_id !== project_id
      );
      setProjectsSelected(temp_projectsSelected);
    } else {
      setProjectsSelected([...temp_projectsSelected, project_id]);
    }
  };
  const routeToMyProjects = () => {
    router.push("/dashboard/my-projects");
  };
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto ">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 transition-opacity"
          onClick={() => setShowAddToProjectModal(false)}
        >
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
        </div>
        <div className="relative bg-white rounded-lg shadow w-[350px]">
          <div className="flex flex-row items-center justify-between p-4 border-b rounded-t ">
            <h3 className="text-lg font-semibold text-gray-800 mr-2">
              Check projects to add this product to & call for sample 💫
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-2 ml-auto inline-flex items-center border border-gray-300"
              data-modal-hide="defaultModal"
              onClick={onCancelProductsAddToProject}
            >
              <CancelSvg />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="px-4 mt-2">
            <div
              className="flex flex-row items-center pr-4 hover:bg-gray-200 p-2 rounded-lg cursor-pointer border border-gray-300 shadow-sm"
              onClick={routeToMyProjects}
            >
              <div className="h-[38px] w-[38px] rounded-lg flex flex-row items-center justify-center border border-gray-200 shadow-md mr-2">
                <p className="font-bold text-2xl p-0 m-0 text-gray-800">+</p>
              </div>
              <p className=" text-md font-medium text-gray-700 cursor-pointer ">
                Create New
              </p>
            </div>
          </div>

          {allProjectsOfUser.length > 0 ? (
            <div className="p-4 space-y-3">
              <div className="max-h-[150px] overflow-y-auto">
                {allProjectsOfUser.map((current_project) =>
                  current_project.status === "Locked" ? (
                    <></>
                  ) : (
                    <div
                      className="flex flex-row items-center justify-between mb-1 pr-4 hover:bg-gray-200 p-2 rounded-l-lg cursor-pointer"
                      key={current_project.project_id}
                      onClick={() =>
                        selectOrUnSelectProjectsForProduct(
                          current_project.project_id
                        )
                      }
                    >
                      <div className="flex flex-row items-center">
                        <Image
                          height="4"
                          width="40"
                          className="rounded-md mr-2 shadow-md"
                          src={
                            current_project.products.length > 0
                              ? current_project.products[0].product.image_link
                              : "https://i.ibb.co/pWxB0Hf/Untitled-design-4.png"
                          }
                        />
                        <label className=" text-md font-medium text-gray-700 cursor-pointer">
                          {current_project.name}
                        </label>
                      </div>

                      <input
                        id={current_project.project_id}
                        type="checkbox"
                        checked={projectsSelected.includes(
                          current_project.project_id
                        )}
                        className={
                          "w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded-full "
                        }
                        onChange={() =>
                          selectOrUnSelectProjectsForProduct(
                            current_project.project_id
                          )
                        }
                        disabled={current_project.status === "Locked"}
                        title={
                          current_project.status === "Locked"
                            ? "This project's products have been already called for sample"
                            : ""
                        }
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="px-4 space-y-4 mt-4">
              <p className="text-md font-medium text-gray-700 ">
                No projects! Please create one to add products
              </p>
            </div>
          )}
          <div className="flex items-center p-4 space-x-2 border-t border-gray-200 rounded-b ">
            {allProjectsOfUser.length > 0 && (
              <button
                data-modal-hide="defaultModal"
                type="button"
                className="text-white bg-gray-900 hover:bg-black  font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full"
                onClick={onSaveProductToSelectedProjects}
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
                ) : (
                  "Save"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToProjectModal;
