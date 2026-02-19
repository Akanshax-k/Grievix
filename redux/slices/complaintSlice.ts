import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ImageVerificationData {
  trustLevel: "high" | "medium" | "low";
  hasExif: boolean;
  hasGps: boolean;
  locationSource: "exif" | "gps" | "manual";
  hasTimestamp: boolean;
  takenAt: string | null;
  cameraMake: string | null;
  cameraModel: string | null;
  warnings: string[];
}
export interface ComplaintResult {
  _id: string;
  userId: string;
  description: string;
  imageUrl: string;
  location: {
    type: string;
    coordinates: [number, number];
    address: string | null;
  };
  category: string;
  severity: string;
  department: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
    imageVerification?: {
    trustLevel: "high" | "medium" | "low";
    hasExif: boolean;
    hasGps: boolean;
    locationSource: "exif" | "gps" | "manual";
    hasTimestamp: boolean;
    takenAt: string | null;
    cameraMake: string | null;
    cameraModel: string | null;
    warnings: string[];
  } | null;
}

interface ComplaintState {
  lastCreated: ComplaintResult | null;
  createSuccess: boolean | null; // null = no attempt, true = success, false = failed
  createError: string | null;
}

const initialState: ComplaintState = {
  lastCreated: null,
  createSuccess: null,
  createError: null,
};

const complaintSlice = createSlice({
  name: "complaint",
  initialState,
  reducers: {
    setLastCreated: (state, action: PayloadAction<ComplaintResult>) => {
      state.lastCreated = action.payload;
      state.createSuccess = true;
      state.createError = null;
    },
    setCreateError: (state, action: PayloadAction<string>) => {
      state.lastCreated = null;
      state.createSuccess = false;
      state.createError = action.payload;
    },
    clearComplaintResult: (state) => {
      state.lastCreated = null;
      state.createSuccess = null;
      state.createError = null;
    },
  },
});

export const { setLastCreated, setCreateError, clearComplaintResult } =
  complaintSlice.actions;
export default complaintSlice.reducer;
