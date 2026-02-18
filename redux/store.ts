import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (gDM) =>
    gDM().concat(authApi.middleware),
});
