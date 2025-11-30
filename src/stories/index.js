import { ENV } from "@/config";
import { configureStore } from "@reduxjs/toolkit";
import { authReducer, getUserAction } from "./auth";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  devTools: ENV === "development",
});

store.dispatch(getUserAction());
