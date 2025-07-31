import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser, logoutUser } from "../api/loginAPI";

const hasJwtCookie = document.cookie
  .split(";")
  .some((item) => item.trim().startsWith("jwt="));

const initialState = {
  userInfo: hasJwtCookie ? {} : null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk("auth/login", loginUser);
export const register = createAsyncThunk("auth/register", registerUser);
export const logout = createAsyncThunk("auth/logout", logoutUser);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = "Invalid email or password. Please try again.";
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Registration failed. Please try again.";
      })
      .addCase(logout.fulfilled, (state) => {
        state.userInfo = null;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
