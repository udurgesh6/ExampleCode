import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user_id: "",
    email: "",
    company_name: "",
    company_address: "",
    contact: "",
    full_name: "",
    role: "",
    type: "",
    access: "",
  },
  reducers: {
    addUserDetail: (state, action) => {
      state.user_id = action.payload.user_id;
      state.email = action.payload.email;
      state.company_address = action.payload.company_address;
      state.contact = action.payload.contact;
      state.full_name = action.payload.full_name;
      state.company_name = action.payload.company_name;
      state.type = action.payload.type;
      state.role = action.payload.role;
      state.access = action.payload.access;
    },
    clearUserDetail: (state) => {
      state.user_id = "";
      state.email = "";
      state.company_address = "";
      state.contact = "";
      state.full_name = "";
      state.company_name = "";
      state.type = "";
      state.role = "";
      state.access = "";
    },
    setCompanyAddress: (state, action) => {
      state.company_address = action.payload.company_address;
    },
    setUserContact: (state, action) => {
      state.contact = action.payload.contact;
    },
  },
});

export const {
  addUserDetail,
  clearUserDetail,
  setCompanyAddress,
  setUserContact,
} = userSlice.actions;
export const selectUserState = (state) => state.user;

export default userSlice;
