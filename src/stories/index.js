import { ENV } from "@/config";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {},
  devTools: ENV === "development",
});
