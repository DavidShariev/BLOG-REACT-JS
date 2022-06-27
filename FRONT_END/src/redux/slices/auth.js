import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

const initialState = {
  data: null,
  status: "loading",
};

export const fetchAuth = createAsyncThunk("auth/fetchAuth", async (params) => {
  const { data } = await axios.post("/auth/login", params);
  return data;
});

export const fetchRegister = createAsyncThunk(
  "auth/fetchRegister",
  async (params) => {
    const data = await axios.post("/auth/register", params);
    console.log(data);
    return data;
  }
);

export const fetchAuthMe = createAsyncThunk("auth/fetchAuthMe", async () => {
  const { data } = await axios.get("/auth/me");
  return data.userData;
});

export const selectIsAuth = (state) => Boolean(state.auth.data);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
    },
  },
  extraReducers: {
    [fetchAuth.pending]: (state, action) => {
      state.user = null;
      state.status = "loading";
    },
    [fetchAuth.fulfilled]: (state, action) => {
      state.status = "loaded";
      state.data = action.payload;
    },
    [fetchAuth.rejected]: (state, action) => {
      state.status = "error";
      state.user = null;
    },
    [fetchAuthMe.pending]: (state, action) => {
      state.user = null;
      state.status = "loading";
    },
    [fetchAuthMe.fulfilled]: (state, action) => {
      state.status = "loaded";
      state.data = action.payload;
    },
    [fetchAuthMe.rejected]: (state, action) => {
      state.status = "error";
      state.user = null;
    },
    [fetchRegister.pending]: (state, action) => {
      state.user = null;
      console.log("dispatch payload", action.payload);
      state.data = action.payload;
      state.status = "loading";
    },
    [fetchRegister.fulfilled]: (state, action) => {
      state.status = "loaded";
      state.data = action.payload;
    },
    [fetchRegister.rejected]: (state, action) => {
      state.status = "error";
      state.user = null;
    },
  },
});

export const authReducer = authSlice.reducer;

export const { logout } = authSlice.actions;
