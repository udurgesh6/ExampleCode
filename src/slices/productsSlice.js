import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    filteredProducts: [],
    filter: "",
    page: 1,
    filteredPage: 1,
    filterId: "",
  },
  reducers: {
    addProducts: (state, action) => {
      state.products = action.payload.products;
      state.page = action.payload.page;
    },
    addFilteredProducts: (state, action) => {
      state.filteredProducts = action.payload.filtered_products;
      state.filter = action.payload.filter;
      state.filteredPage = action.payload.filteredPage;
      state.filterId = action.payload.filterId;
    },
    clearProductsData: (state, action) => {
      state.products = [];
      state.filteredProducts = [];
      state.filter = "";
      state.page = 1;
      state.filteredPage = 1;
      state.filterId = "";
    },
    clearFilteredProducts: (state, action) => {
      state.filteredProducts = [];
      state.filter = "";
      state.filteredPage = 1;
      state.filterId = "";
    },
  },
});

export const {
  addProducts,
  clearProductsData,
  addFilteredProducts,
  clearFilteredProducts,
} = productsSlice.actions;
export const selectProductsState = (state) => state.products.products;
export const selectFilteredProductsState = (state) =>
  state.products.filteredProducts;
export const selectedProductFilter = (state) => state.products.filter;
export const selectedFilteredPage = (state) => state.products.filteredPage;
export const selectedFilterId = (state) => state.products.filterId;
export const selectedPage = (state) => state.products.page;
export default productsSlice;
