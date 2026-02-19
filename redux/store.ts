import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authSlice";
import { complaintApi } from "./api/complaintApi";
import userReducer from "./slices/userSlice";
import complaintReducer from "./slices/complaintSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [complaintApi.reducerPath]: complaintApi.reducer,
    user: userReducer,
    complaint: complaintReducer,
  },
  middleware: (gDM) =>
    gDM().concat(authApi.middleware, complaintApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
