import { createSlice } from "@reduxjs/toolkit";

const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    projects: [],
  },
  reducers: {
    loadProjects: (state, action) => {
      state.projects = [...action.payload];
    },
    addProductToProject: (state, action) => {
      let temp_projects = [...state.projects];
      let indexOfProject = temp_projects.findIndex(
        (current_project) =>
          current_project.project_id === action.payload.project_id
      );
      temp_projects[indexOfProject].products.push(action.payload);
      state.projects = [...temp_projects];
    },
    addOrRemoveProductFromProjects: (state, action) => {
      let temp_projects = [...state.projects];
      state.projects.forEach((pids, pids_index) => {
        if (action.payload.projects.includes(pids.project_id)) {
          if (
            !state.projects[pids_index].products.includes(
              action.payload.product_id.product_id
            )
          ) {
            temp_projects[pids_index].products = [
              ...temp_projects[pids_index].products,
              {
                product_id: action.payload.product_id.product_id,
                status: "Product Added",
              },
            ];
          }
        } else {
          if (
            state.projects[pids_index].products.includes(
              action.payload.product_id.product_id
            )
          ) {
            temp_projects[pids_index].products = temp_projects[
              pids_index
            ].products.filter(
              (tps) => tps !== action.payload.product_id.product_id
            );
          }
        }
      });
      state.projects = temp_projects;
    },
    setProjects: (state, action) => {
      console.log("first");
      state.projects = [...state.projects, action.payload];
    },
    removeProductFromProject: (state, action) => {
      console.log(action.payload);
      let temp_projects = [...state.projects];
      let indexOfProject = temp_projects.findIndex(
        (current_temp_project) =>
          current_temp_project.project_id === action.payload.project_id
      );
      let products_of_current_project = [
        ...temp_projects[indexOfProject].products,
      ];
      temp_projects[indexOfProject].products =
        products_of_current_project.filter(
          (current_product) =>
            current_product.product_id !== action.payload.product_id
        );
      console.log(temp_projects);
      state.projects = temp_projects;
    },
    editProject: (state, action) => {
      let indexOfEditProject = state.projects.findIndex(
        (current_project) =>
          current_project.project_id === action.payload.project_id
      );
      let tempEdit__allProjects = [...state.projects];
      tempEdit__allProjects[indexOfEditProject] = {
        ...tempEdit__allProjects[indexOfEditProject],
        name: action.payload.name,
        pincode: action.payload.pincode,
        project_type: action.payload.project_type,
        project_phase: action.payload.project_phase,
        project_area: action.payload.project_area,
        address: action.payload.address,
      };
      state.projects = tempEdit__allProjects;
    },
    updateProductsInProjectStatus: (state, action) => {
      let u_indexOfEditProject = state.projects.findIndex(
        (current_project) =>
          current_project.project_id === action.payload.project_id
      );
      let u_tempEdit__allProjects = [...state.projects];
      u_tempEdit__allProjects[u_indexOfEditProject].products.forEach(
        (current_temp_project, current_temp_project_index) => {
          if (
            action.payload.productsSelected.includes(
              current_temp_project.products_in_project_id
            )
          ) {
            u_tempEdit__allProjects[u_indexOfEditProject].products[
              current_temp_project_index
            ].status = action.payload.status;
          }
        }
      );
      state.projects = u_tempEdit__allProjects;
    },
    updateProjectAddress: (state, action) => {
      let temp_projects = [...state.projects];
      let indexOfProject = temp_projects.findIndex(
        (current_project) =>
          current_project.project_id === action.payload.project_id
      );
      temp_projects[indexOfProject].address = action.payload.address;
      state.projects = temp_projects;
    },
    updateDeliveryAt: (state, action) => {
      let temp_projects = [...state.projects];
      let indexOfProject = temp_projects.findIndex(
        (current_project) =>
          current_project.project_id === action.payload.project_id
      );
      temp_projects[indexOfProject].delivery_at = action.payload.delivery_at;
      state.projects = temp_projects;
    },
    updateProjectStatus: (state, action) => {
      let temp_projects = [...state.projects];
      let indexOfProject = temp_projects.findIndex(
        (current_project) =>
          current_project.project_id === action.payload.project_id
      );
      temp_projects[indexOfProject].status = action.payload.status;
      state.projects = temp_projects;
    },
    deleteProject: (state, action) => {
      let temp_projects = [...state.projects];
      state.projects = temp_projects.filter(
        (current_project) =>
          current_project.project_id !== action.payload.project_id
      );
    },
    clearProjectsData: (state, action) => {
      state.projects = [];
    },
  },
});

export const {
  loadProjects,
  addOrRemoveProductFromProjects,
  setProjects,
  removeProductFromProject,
  editProject,
  updateProductsInProjectStatus,
  updateProjectAddress,
  updateDeliveryAt,
  updateProjectStatus,
  deleteProject,
  addProductToProject,
  clearProjectsData,
} = projectsSlice.actions;
export const selectProjectsState = (state) => state.projects.projects;
export default projectsSlice;
