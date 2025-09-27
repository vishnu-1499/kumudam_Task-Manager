import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Api } from "../pages/Api";
const token = localStorage.getItem("token") || null;

const saveToStorage = (token) => {
  localStorage.setItem("token", token);
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      return await Api({ method: "POST", url: "/register", data });
    } catch (err) {
      return rejectWithValue(err.response?.data || err);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      return await Api({ method: "POST", url: "/login", data });
    } catch (err) {
      return rejectWithValue(err.response?.data || err);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: { token, loading: false, error: null },
  reducers: {
    logout: (state) => {
      state.token = null;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    const setPending = (s) => {
      s.loading = true;
      s.error = null;
    };
    const setFulfilled = (s, a) => {
      s.loading = false;
      s.token = a.payload.token;
      saveToStorage(a.payload.token);
    };
    const setRejected = (s, a) => {
      s.loading = false;
      s.error = a.payload?.message || "Request failed";
    };

    builder
      .addCase(registerUser.pending, setPending)
      .addCase(registerUser.fulfilled, setFulfilled)
      .addCase(registerUser.rejected, setRejected)
      .addCase(loginUser.pending, setPending)
      .addCase(loginUser.fulfilled, setFulfilled)
      .addCase(loginUser.rejected, setRejected);
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
