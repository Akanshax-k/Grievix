"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Button } from "./button";
import { clearComplaintResult } from "@/redux/slices/complaintSlice";
import type { RootState } from "@/redux/store";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

const Report = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { lastCreated, createSuccess, createError } = useSelector(
    (s: RootState) => s.complaint
  );

  const handleGoToComplaints = () => {
    dispatch(clearComplaintResult());
    router.push("/complaint");
  };

  const handleSubmitAnother = () => {
    dispatch(clearComplaintResult());
    router.push("/create-complaint");
  };

  // Failure state
  if (createSuccess === false) {
    return (
      <div className="h-screen w-full flex justify-center items-center bg-[#EAEFEF]">
        <div className="flex flex-col items-center max-w-md px-4">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <p className="text-xl font-bold text-slate-800 mb-2">Submission Failed</p>
          <p className="text-sm text-slate-500 text-center mb-4">
            {createError || "Something went wrong while submitting your grievance."}
          </p>
          <Button onClick={handleSubmitAnother} className="w-full">
            Try Again →
          </Button>
        </div>
      </div>
    );
  }

  // No data state (direct navigation)
  if (!lastCreated) {
    return (
      <div className="h-screen w-full flex justify-center items-center bg-[#EAEFEF]">
        <div className="flex flex-col items-center max-w-md px-4">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-amber-500" />
          </div>
          <p className="text-xl font-bold text-slate-800 mb-2">No Report Data</p>
          <p className="text-sm text-slate-500 text-center mb-4">
            It looks like you navigated here directly. Submit a complaint first to see your report.
          </p>
          <div className="flex gap-3 w-full">
            <Button variant="outline" onClick={handleGoToComplaints} className="flex-1">
              My Complaints
            </Button>
            <Button onClick={handleSubmitAnother} className="flex-1">
              New Complaint →
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  const formattedDate = new Date(lastCreated.createdAt).toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="h-screen w-full flex justify-center items-center bg-[#EAEFEF]">
      <div className="flex flex-col items-center max-w-md px-4">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6 shadow-lg">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>

        <p className="text-xl font-bold text-slate-800 mb-1">Report Successful</p>
        <p className="text-sm text-slate-500 text-center mb-6">
          Your grievance has been officially recorded
        </p>

        {/* Details card */}
        <div className="w-full border border-slate-200 bg-white rounded-xl p-5 space-y-4 shadow-sm">
          {/* Header row */}
          <div className="flex justify-between items-center">
            <span className="text-blue-600 bg-blue-50 rounded-lg font-semibold text-xs py-1.5 px-3 border border-blue-200">
              Official Record
            </span>
            <span className="text-xs text-slate-400">
              Generated: {formattedDate}
            </span>
          </div>

          {/* Complaint ID */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-xs text-slate-400">Complaint ID</span>
            </div>
            <span className="text-xs font-bold text-slate-700 font-mono">
              {lastCreated._id.slice(-8).toUpperCase()}
            </span>
          </div>

          {/* Category */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-xs text-slate-400">Category</span>
            </div>
            <span className="text-xs font-bold text-slate-700">
              {lastCreated.category}
            </span>
          </div>

          {/* Department */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-16 0H3m2 0V5m14 0V5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-xs text-slate-400">Assigned To</span>
            </div>
            <span className="text-xs font-bold text-slate-700">
              {lastCreated.department}
            </span>
          </div>

          {/* Severity */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-xs text-slate-400">Severity</span>
            </div>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                lastCreated.severity === "High"
                  ? "bg-red-50 text-red-600"
                  : lastCreated.severity === "Medium"
                  ? "bg-amber-50 text-amber-600"
                  : "bg-green-50 text-green-600"
              }`}
            >
              {lastCreated.severity}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 w-full mt-6">
          <Button variant="outline" onClick={handleSubmitAnother} className="flex-1">
            Submit Another
          </Button>
          <Button onClick={handleGoToComplaints} className="flex-1">
            Go to My Complaints →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Report;
