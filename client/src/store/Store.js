import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Auth";
import tasksReducer from "./Task";

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
  },
});

export default store;
