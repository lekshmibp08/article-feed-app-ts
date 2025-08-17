import { createSlice } from "@reduxjs/toolkit";
import { IAuthState } from "../../types/types";

const token = sessionStorage.getItem('token');

const initialState: IAuthState = {
    user: null,
    token: token, 
    isAuthenticated: !!token,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      loginSuccess: (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
  
        sessionStorage.setItem('token', action.payload.token)
      },
      logout: (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
  
        sessionStorage.removeItem('token');

      },
      updateUser: (state, action) => {
        state.user = { ...state.user, ...action.payload };
      },
      updateToken: (state, action) => {
        state.token = action.payload;
        sessionStorage.setItem("token", action.payload);
      },
    },
  });
  
  export const { loginSuccess, logout, updateUser, updateToken } = authSlice.actions;
  export default authSlice.reducer; 