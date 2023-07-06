import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import {
  removeProductFromProject,
  updateProductsInProjectStatus,
  updateProjectAddress,
  updateDeliveryAt,
  updateProjectStatus,
  deleteProject,
  loadProjects,
} from "@/slices/projectsSlice";
import { selectProjectsState } from "@/slices/projectsSlice";
import {
  selectUserState,
  setUserContact,
  setCompanyAddress,
} from "@/slices/userSlice";
import { selectProductsState } from "@/slices/productsSlice";
import SidebarAndMainStyles from "../../styles/SidebarAndMain.module.css";
import axios from "axios";
import Router from "next/router";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShowCreateProjectModal from "../../components/Dashboard/ShowCreateProjectModal";
import CallForSampleModalOpen from "../../components/Dashboard/CallForSampleModalOpen";
import NoProjects from "../../components/Dashboard/NoProjects";
import AllProjects from "../../components/Dashboard/AllProjects";
import ProjectDetailHeader from "../../components/Dashboard/ProjectDetailHeader";
import ProjectDetailProductsTable from "../../components/Dashboard/ProjectDetailProductsTable";
import { useDispatch } from "react-redux";
import AddProjectSvg from "@/components/AddProjectSvg";
import Cookies from "js-cookie";
import { clearUserDetail } from "@/slices/userSlice";
import { clearProjectsData } from "@/slices/projectsSlice";
import { clearProductsData } from "@/slices/productsSlice";
import NewNavbar from "@/components/NewNavbar";
import Head from "next/head";

const MyProjects = () => {
  const dispatch = useDispatch();
  const allProjectsOfUser = useSelector(selectProjectsState);
  const user_details = useSelector(selectUserState);
  const products = useSelector(selectProductsState);

  const [projectsSelected, setProjectSelected] = useState(null);
  const [allProductsForSelProject, setAllProductsForSelProjects] = useState([]);
  const [showingProjectScreen, setShowingProjectScreen] =
    useState("MaterialList");
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [name, setProjectName] = useState("");
  const [pincode, setPincode] = useState("");
  const [project_phase, setProjectPhase] = useState("Concept");
  const [project_type, setProjectType] = useState("Residential");
  const [project_area, setProjectArea] = useState("");
  const [showAllProjects, setShowAllProjects] = useState(true);
  const [address, setAddress] = useState("");
  const [creatingANewProject, setCreatingANewProject] = useState(true);
  const [callForSampleModalOpen, setCallForSampleModalOpen] = useState(false);
  const [addressDetails, setAddressDetails] = useState(() => ({
    addressType: "",
    client_address: "",
    company_address:
      user_details?.company_address?.length > 0
        ? user_details.company_address
        : "",
  }));
  const [contact, setContact] = useState(
    user_details.contact?.length > 0 ? user_details.contact : ""
  );
  const [loading, setLoading] = useState(false);

  const onCloseProject = () => {
    setProjectSelected(null);
    setAllProductsForSelProjects([]);
    setProjectName("");
    setPincode("");
    setProjectPhase("Concept");
    setProjectType("Residential");
    setProjectArea("");
    setShowAllProjects(true);
    setCreatingANewProject(true);
  };

  useEffect(() => {
    if (Cookies.get("uid") && user_details?.user_id?.length > 0) {
      axios
        .get(`../api/getProjects?user_id=${user_details.user_id}`)
        .then((projects_received) => {
          console.log(projects_received);
          if (projects_received.status === 200) {
            let tall_project_detail = projects_received.data.map(
              (current_project) => ({
                ...current_project,
                products: current_project.ProductsInProject,
              })
            );
            dispatch(loadProjects(tall_project_detail));
            setLoading(false);
          } else {
            toast("Something went wrong while getting your projects!");
          }
        });
    } else {
      dispatch(clearUserDetail());
      dispatch(clearProjectsData());
      dispatch(clearProductsData());
      Router.push({
        pathname: "/auth/authenticate",
        query: { authType: "login" },
      });
    }
  }, []);

  const onEditProject = () => {
    setShowCreateProjectModal(true);
    setCreatingANewProject(false);
    setProjectName(projectsSelected.name);
    setPincode(projectsSelected.pincode);
    setProjectPhase(projectsSelected.project_phase);
    setProjectType(projectsSelected.project_type);
    setProjectArea(projectsSelected.project_area);
    setAddress(projectsSelected.address);
  };

  const addProductsImagesTo = (inproducts) => {
    let temp_inproducts = [];
    inproducts.forEach((ip) => {
      let prodDetail = products.filter(
        (prod) => prod.product_id === ip.product_id
      );
      temp_inproducts.push({ ...prodDetail[0], ...ip });
    });
    setAllProductsForSelProjects(temp_inproducts);
  };

  const removeProduct = (product_id) => {
    if (
      window.confirm("Are you sure you want to remove this product?") === true
    ) {
      axios
        .delete(
          `../api/deleteProductFromProject?product_id=${product_id}&project_id=${projectsSelected.project_id}`
        )
        .then(() => {
          toast("Product removed successfully!");
          dispatch(
            removeProductFromProject({
              project_id: projectsSelected.project_id,
              product_id: product_id,
            })
          );
          let temp_allProductsForSelProjects = [...allProductsForSelProject];
          temp_allProductsForSelProjects =
            temp_allProductsForSelProjects.filter(
              (tapf) => tapf.product_id !== product_id
            );
          setAllProductsForSelProjects(temp_allProductsForSelProjects);
        })
        .catch(() => {
          toast("Something went wrong while removing this product!");
        });
    }
  };

  const deleteThisProject = () => {
    if (
      window.confirm("Are your sure you want to delete this project?") === true
    ) {
      axios
        .delete(
          `../api/deleteAllProductsFromProject?project_id=${projectsSelected.project_id}`
        )
        .then(() => {
          axios
            .delete(
              `../api/deleteProject?project_id=${projectsSelected.project_id}`
            )
            .then(() => {
              toast("Project deleted successfully!");
              dispatch(
                deleteProject({
                  project_id: projectsSelected.project_id,
                })
              );
              setShowAllProjects(true);
            })
            .catch(() => {
              toast("Something went wrong while deleting this project!");
            });
        })
        .catch(() => {
          toast("Something went wrong while deleting this project!");
        });
    }
  };

  const callProductsForSample = () => {
    if (allProductsForSelProject.length < 1) {
      toast("No products to call for sample!");
    } else {
      setCallForSampleModalOpen(true);
    }
  };

  const callProductsForMeasurement = () => {
    setLoading(true);
    axios
      .put("../api/changeProductStatus", {
        productsInProject: JSON.stringify(
          allProductsForSelProject.map((apsp) => apsp.products_in_project_id)
        ),
        status: "Quotation Generated",
      })
      .then(() => {
        toast(
          "Your request for a measurement call has been successfully recorded!"
        );
        dispatch(
          updateProductsInProjectStatus({
            project_id: projectsSelected.project_id,
            productsSelected: allProductsForSelProject.map(
              (apsp) => apsp.products_in_project_id
            ),
            status: "Quotation Generated",
          })
        );
        let updatedProject = allProjectsOfUser.filter(
          (pm) => pm.project_id === projectsSelected.project_id
        );
        let updatedProductsOfProject = updatedProject[0].products.map(
          (current_product) => ({
            ...current_product,
            status: "Quotation Generated",
          })
        );
        setProjectSelected(() => ({
          project_id: updatedProject[0].project_id,
          name: updatedProject[0].name,
          pincode: updatedProject[0].pincode,
          project_phase: updatedProject[0].project_phase,
          project_type: updatedProject[0].project_type,
          project_area: updatedProject[0].project_area,
          address: updatedProject[0].address,
          delivery_at: updatedProject[0].delivery_at,
          status: updatedProject[0].status,
          products: updatedProductsOfProject,
        }));
        addProductsImagesTo(updatedProductsOfProject);
      })
      .catch(() => {
        toast("Something went wrong while calling products for measurement!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onAddressTypeClick = (at) => {
    setAddressDetails((addressDetails) => ({
      ...addressDetails,
      addressType: at,
    }));
  };

  const onCallForSampleDetailsSubmission = async (e) => {
    e.preventDefault();
    if (
      window.confirm(
        "Are your sure you want to call these products for sample?\nOnce called, you won't be able to add more products to this project!"
      ) === true
    ) {
      setLoading(true);
      try {
        if (
          addressDetails.addressType === "company" &&
          user_details.company_address !== addressDetails.company_address
        ) {
          // update company address for the user
          await axios.put("../api/updateUserCompanyAddress", {
            company_address: addressDetails.company_address,
            user_id: user_details.user_id,
          });
          dispatch(
            setCompanyAddress({
              company_address: addressDetails.company_address,
            })
          );
        }
        if (
          addressDetails.addressType === "client" &&
          projectsSelected.address !== addressDetails.client_address
        ) {
          // update client address for the user
          await axios.put("../api/updateProjectAddress", {
            client_address: addressDetails.client_address,
            project_id: projectsSelected.project_id,
          });
          dispatch(
            updateProjectAddress({
              address: addressDetails.client_address,
              project_id: projectsSelected.project_id,
            })
          );
        }
        if (user_details.contact !== contact) {
          //update contact of the user
          await axios.put("../api/updateUserContact", {
            contact: contact,
            user_id: user_details.user_id,
          });
          dispatch(
            setUserContact({
              contact: contact,
              project_id: projectsSelected.project_id,
            })
          );
        }
        await axios.put("../api/updateProjectStatusAndDeliveryAt", {
          project_id: projectsSelected.project_id,
          status: "Locked",
          delivery_at: addressDetails.addressType,
        });
        dispatch(
          updateDeliveryAt({
            project_id: projectsSelected.project_id,
            delivery_at: addressDetails.addressType,
          })
        );
        dispatch(
          updateProjectStatus({
            status: "Locked",
            project_id: projectsSelected.project_id,
          })
        );
        await axios.put("../api/changeProductStatus", {
          productsInProject: JSON.stringify(
            allProductsForSelProject.map((apsp) => apsp.products_in_project_id)
          ),
          status: "Address Verification In Progress",
        });

        dispatch(
          updateProductsInProjectStatus({
            project_id: projectsSelected.project_id,
            productsSelected: allProductsForSelProject.map(
              (apsp) => apsp.products_in_project_id
            ),
            status: "Address Verification In Progress",
          })
        );

        let updatedProject = allProjectsOfUser.filter(
          (pm) => pm.project_id === projectsSelected.project_id
        );
        let updatedProductsOfProject = updatedProject[0].products.map(
          (current_product) => ({
            ...current_product,
            status: "Address Verification In Progress",
          })
        );

        setProjectSelected(() => ({
          project_id: updatedProject[0].project_id,
          name: updatedProject[0].name,
          pincode: updatedProject[0].pincode,
          project_phase: updatedProject[0].project_phase,
          project_type: updatedProject[0].project_type,
          project_area: updatedProject[0].project_area,
          address: updatedProject[0].address,
          delivery_at: updatedProject[0].delivery_at,
          status: "Locked",
          products: updatedProductsOfProject,
        }));
        addProductsImagesTo(updatedProductsOfProject);
        toast("Products called for sample, successfully!");
      } catch (err) {
        toast("Something went wrong while calling products for sample!");
      } finally {
        setLoading(false);
        setCallForSampleModalOpen(false);
      }
    }
  };

  return (
    <>
      <Head>
        <title>boho</title>
        <meta
          name="description"
          content="Helping interior designers build better tomorrow"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/tab_logo.webp" />
      </Head>
      <ToastContainer />
      <div className={SidebarAndMainStyles.sidebarAndMain}>
        <NewNavbar />
        <div className={SidebarAndMainStyles.sidebarAndMain__bottom}>
          <div className="flex flex-col overflow-auto w-full scroll-smooth pt-4 bg-white">
            {allProjectsOfUser?.length < 1 && (
              <NoProjects
                allProjectsOfUser={allProjectsOfUser}
                showAllProjects={showAllProjects}
                setShowCreateProjectModal={setShowCreateProjectModal}
                setShowAllProjects={setShowAllProjects}
              />
            )}
            {showAllProjects && allProjectsOfUser?.length > 0 && (
              <div className="flex flex-row items-center justify-center w-full my-4">
                <div
                  className="flex flex-row items-center justify-center p-3 border border-gray-200 shadow-sm cursor-pointer rounded-full"
                  onClick={() => setShowCreateProjectModal(true)}
                >
                  <p className="text-gray-700 text-2xl font-bold mr-3">
                    Create Project
                  </p>
                  <button className="pointer">
                    <AddProjectSvg />
                  </button>
                </div>
              </div>
            )}
            {showAllProjects && allProjectsOfUser?.length > 0 && (
              <AllProjects
                allProjectsOfUser={allProjectsOfUser}
                setProjectSelected={setProjectSelected}
                setShowAllProjects={setShowAllProjects}
                addProductsImagesTo={addProductsImagesTo}
                setAddressDetails={setAddressDetails}
                user_details={user_details}
                setContact={setContact}
              />
            )}
            {!showAllProjects && (
              <div className="w-full p-4 flex flex-col items-center h-full">
                <div className="w-full flex flex-col p-2 h-full">
                  <ProjectDetailHeader
                    projectsSelected={projectsSelected}
                    onEditProject={onEditProject}
                    allProductsForSelProject={allProductsForSelProject}
                    callProductsForMeasurement={callProductsForMeasurement}
                    deleteThisProject={deleteThisProject}
                    callProductsForSample={callProductsForSample}
                    setShowAllProjects={setShowAllProjects}
                    onCloseProject={onCloseProject}
                  />

                  {showingProjectScreen === "MaterialList" && (
                    <ProjectDetailProductsTable
                      allProductsForSelProject={allProductsForSelProject}
                      removeProduct={removeProduct}
                    />
                  )}
                </div>
              </div>
            )}
            {showCreateProjectModal && (
              <ShowCreateProjectModal
                setShowCreateProjectModal={setShowCreateProjectModal}
                creatingANewProject={creatingANewProject}
                name={name}
                setProjectName={setProjectName}
                pincode={pincode}
                setPincode={setPincode}
                project_phase={project_phase}
                setProjectPhase={setProjectPhase}
                project_type={project_type}
                setProjectType={setProjectType}
                project_area={project_area}
                setProjectArea={setProjectArea}
                address={address}
                setAddress={setAddress}
                setProjectSelected={setProjectSelected}
                setCreatingANewProject={setCreatingANewProject}
                projectsSelected={projectsSelected}
              />
            )}
            {callForSampleModalOpen && (
              <CallForSampleModalOpen
                setCallForSampleModalOpen={setCallForSampleModalOpen}
                onCallForSampleDetailsSubmission={
                  onCallForSampleDetailsSubmission
                }
                contact={contact}
                setContact={setContact}
                addressDetails={addressDetails}
                onAddressTypeClick={onAddressTypeClick}
                setAddressDetails={setAddressDetails}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProjects;
