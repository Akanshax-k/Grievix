"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import UploadSection from "./UploadSection";
import ComplaintDetailsCard from "./Complaintdetailscard";
import LocationSection from "./LocationSection";
import ReviewStep from "./ReviewStep";
import { useCreateComplaintMutation } from "@/redux/api/complaintApi";
import {
  setLastCreated,
  setCreateError,
} from "@/redux/slices/complaintSlice";
import type { RootState } from "@/redux/store";
import { verifyImage, type ImageVerification } from "@/lib/imageVerification";
import {
  Camera,
  FileText,
  MapPin,
  ClipboardCheck,
  ChevronRight,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  Send,
} from "lucide-react";

interface Coordinates {
  lat: number;
  lng: number;
}

export type LocationSource = "exif" | "gps" | "manual";

const STEPS = [
  { label: "Evidence", icon: Camera },
  { label: "Details", icon: FileText },
  { label: "Location", icon: MapPin },
  { label: "Review", icon: ClipboardCheck },
] as const;

export default function MainForm() {
  const [step, setStep] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [imageVerification, setImageVerification] =
    useState<ImageVerification | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [locationSource, setLocationSource] = useState<LocationSource>("gps");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((s: RootState) => s.user.token);
  const user = useSelector((s: RootState) => s.user.user);
  const [createComplaint] = useCreateComplaintMutation();

  /* ── Image upload + EXIF verification ── */
  const handleImageChange = useCallback(
    async (file: File | null) => {
      setImage(file);
      setImageVerification(null);
      setCoordinates(null);
      setLocationSource("gps");

      if (!file) return;

      setVerifying(true);
      try {
        const v = await verifyImage(file);
        setImageVerification(v);

        // Use EXIF GPS if available
        if (v.hasGps && v.gps) {
          setCoordinates({ lat: v.gps.lat, lng: v.gps.lng });
          setLocationSource("exif");
        } else {
          // Fallback: browser GPS
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                setCoordinates({
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude,
                });
                setLocationSource("gps");
              },
              () => {},
              { timeout: 10000 }
            );
          }
        }
      } catch {
        // silent
      } finally {
        setVerifying(false);
      }
    },
    []
  );

  /* ── Step validation ── */
  const canProceed = (s: number) => {
    switch (s) {
      case 0:
        return !!image && !verifying;
      case 1:
        return true; // description is optional per backend
      case 2:
        return !!coordinates;
      default:
        return true;
    }
  };

  const next = () => {
    if (canProceed(step) && step < STEPS.length - 1) setStep(step + 1);
  };
  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    setFormError(null);

    if (!token) {
      setFormError("You must be logged in to submit a complaint.");
      return;
    }
    if (!image) {
      setFormError("Please upload an image as evidence.");
      return;
    }
    if (!coordinates) {
      setFormError("Location is required.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("description", description);
      formData.append("latitude", String(coordinates.lat));
      formData.append("longitude", String(coordinates.lng));
      if (address.trim()) {
        formData.append("adress", address.trim());
      }

      const res = await createComplaint(formData).unwrap();
      dispatch(setLastCreated(res.data));
      setSuccess(true);

      setTimeout(() => {
        router.push("/report");
      }, 1000);
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } };
      const msg =
        apiErr?.data?.message || "Failed to submit complaint. Please try again.";
      dispatch(setCreateError(msg));
      setFormError(msg);
      setLoading(false);
    }
  };

  /* ── Stepper UI ── */
  return (
    <div className="w-full">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-0 mb-8 px-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = i === step;
          const isDone = i < step;
          return (
            <div key={s.label} className="flex items-center">
              <button
                type="button"
                onClick={() => {
                  if (i < step) setStep(i);
                }}
                className={`flex flex-col items-center gap-1 transition-all duration-200 ${
                  i <= step ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white ring-4 ring-blue-100"
                      : isDone
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-400 border border-gray-200"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`text-[11px] font-medium ${
                    isActive
                      ? "text-blue-600"
                      : isDone
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
                >
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div className="w-16 sm:w-24 mx-1 mt-[-16px]">
                  <div
                    className={`h-[2px] rounded-full transition-all duration-300 ${
                      i < step ? "bg-blue-500" : "bg-gray-200"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Separator */}
      <div className="border-t border-gray-100 mb-6" />

      {/* Error banner */}
      {formError && (
        <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
          </svg>
          {formError}
        </div>
      )}

      {/* Step content */}
      <div className="min-h-[360px]">
        {step === 0 && (
          <UploadSection
            image={image}
            onImageChange={handleImageChange}
            verification={imageVerification}
            verifying={verifying}
          />
        )}
        {step === 1 && (
          <ComplaintDetailsCard
            description={description}
            onDescriptionChange={setDescription}
            address={address}
            onAddressChange={setAddress}
          />
        )}
        {step === 2 && (
          <LocationSection
            coordinates={coordinates}
            onLocationChange={setCoordinates}
            locationSource={locationSource}
            onLocationSourceChange={setLocationSource}
            verification={imageVerification}
          />
        )}
        {step === 3 && (
          <ReviewStep
            image={image}
            description={description}
            address={address}
            coordinates={coordinates}
            locationSource={locationSource}
            verification={imageVerification}
            username={user?.username ?? ""}
          />
        )}
      </div>

      {/* Separator */}
      <div className="border-t border-gray-100 mt-6 mb-5" />

      {/* Navigation buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className={`flex items-center gap-1 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
            step === 0
              ? "invisible"
              : "text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <span className="text-xs text-gray-400 tabular-nums">
          {step + 1} / {STEPS.length}
        </span>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={next}
            disabled={!canProceed(step)}
            className="flex items-center gap-1 text-sm font-medium px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || success || !canProceed(2)}
            className={`flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-lg text-white shadow-sm transition-all duration-200 ${
              success
                ? "bg-emerald-500"
                : "bg-blue-600 hover:bg-blue-700"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting…
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Submitted!
              </>
            ) : (
              <>
                Submit Grievance
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}