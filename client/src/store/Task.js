import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Api } from "../pages/Api";

export const addTask = createAsyncThunk(
  "tasks/add",
  async (data, { rejectWithValue }) => {
    try {
      return await Api({ method: "POST", url: "/create-TaskData", data });
    } catch (err) {
      return rejectWithValue(err.response?.data || err);
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await Api({ method: "POST", url: `/update-TaskData/${id}`, data });
    } catch (err) {
      return rejectWithValue(err.response?.data || err);
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (id, { rejectWithValue }) => {
    try {
      return await Api({ method: "POST", url: `/delete-TaskData/${id}` });
    } catch (err) {
      return rejectWithValue(err.response?.data || err);
    }
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.items = state.items.map((t) =>
          t._id === action.payload._id ? action.payload : t
        );
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.meta.arg);
      });
  },
});

export default tasksSlice.reducer;
