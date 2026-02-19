"use client";

import { useState, useRef } from "react";
import {
  MapPin,
  Send,
  CheckCircle,
  Loader2,
  Image as ImageIcon,
  AlertCircle,
  LocateFixed,
  X,
} from "lucide-react";

interface Coordinates {
  lat: number;
  lng: number;
}

interface FormErrors {
  image?: string;
  description?: string;
  location?: string;
  submit?: string;
}

export default function ComplaintForm() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [locating, setLocating] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Image handling ── */
  const handleImageChange = (file: File | null) => {
    if (!file) return;
    const allowed = ["image/jpeg", "image/png"];
    if (!allowed.includes(file.type)) {
      setErrors((p) => ({ ...p, image: "Only JPG/PNG images are accepted." }));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrors((p) => ({ ...p, image: "Image must be under 10 MB." }));
      return;
    }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((p) => ({ ...p, image: undefined }));
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ── Geolocation ── */
  const getLocation = () => {
    if (!navigator.geolocation) {
      setErrors((p) => ({ ...p, location: "Geolocation not supported by your browser." }));
      return;
    }
    setLocating(true);
    setErrors((p) => ({ ...p, location: undefined }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoordinates({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setErrors((p) => ({
          ...p,
          location: "Could not retrieve location. Please try again.",
        }));
        setLocating(false);
      }
    );
  };

  /* ── Validation ── */
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!image) newErrors.image = "Please upload an image of the complaint.";
    if (!description.trim()) newErrors.description = "Description is required.";
    else if (description.trim().length < 20)
      newErrors.description = "Please provide at least 20 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setErrors((p) => ({ ...p, submit: "You must be logged in to submit a complaint." }));
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", image!);
    formData.append("description", description);
    if (address.trim()) formData.append("adress", address.trim()); // matches API key spelling
    if (coordinates) {
      formData.append("latitude", String(coordinates.lat));
      formData.append("longitude", String(coordinates.lng));
    }

    try {
      const res = await fetch("http://localhost:5000/api/complaints", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || `Server error: ${res.status}`);
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setImage(null);
        setImagePreview(null);
        setDescription("");
        setAddress("");
        setCoordinates(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }, 3000);
    } catch (err: any) {
      setErrors((p) => ({
        ...p,
        submit: err.message || "Submission failed. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  const fieldBase =
    "w-full bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm px-4 py-3 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-slate-600";
  const fieldError =
    "border-red-500 bg-red-950/20 focus:border-red-500 focus:ring-red-500/20";

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-blue-500 to-violet-500" />
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
              Report a Complaint
            </h1>
          </div>
          <p className="text-slate-500 text-sm pl-4">
            Submit photographic evidence with location details
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

          {/* ── Image Upload ── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Photo Evidence <span className="text-blue-500">*</span>
            </label>

            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleImageChange(e.dataTransfer.files[0] || null);
                }}
                className={`
                  flex flex-col items-center justify-center gap-3 py-10 px-5
                  border-2 border-dashed rounded-2xl cursor-pointer
                  transition-all duration-200
                  ${errors.image
                    ? "border-red-500 bg-red-950/10"
                    : "border-slate-700 bg-slate-900 hover:border-blue-500 hover:bg-slate-900/80"
                  }
                `}
              >
                <ImageIcon className="text-slate-600" size={36} />
                <div className="text-center">
                  <p className="text-slate-400 text-sm">
                    Drag & drop or{" "}
                    <span className="text-blue-400 font-semibold">browse</span>
                  </p>
                  <p className="text-slate-600 text-xs mt-1">JPG, PNG · max 10 MB</p>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-slate-700">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-full max-h-60 object-cover block"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2.5 right-2.5 bg-black/60 hover:bg-black/80 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                >
                  <X size={14} className="text-white" />
                </button>
                <div className="absolute bottom-2.5 left-2.5 bg-black/55 rounded-lg px-2.5 py-1 text-xs text-slate-300">
                  {image?.name}
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
            />
            {errors.image && (
              <p className="flex items-center gap-1 text-xs text-red-400 mt-0.5">
                <AlertCircle size={12} /> {errors.image}
              </p>
            )}
          </div>

          {/* ── Description ── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Description <span className="text-blue-500">*</span>
            </label>
            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description)
                    setErrors((p) => ({ ...p, description: undefined }));
                }}
                rows={4}
                maxLength={500}
                placeholder="Describe the issue in detail..."
                className={`${fieldBase} resize-none ${errors.description ? fieldError : ""}`}
              />
              <span
                className={`absolute bottom-3 right-3 text-xs tabular-nums pointer-events-none ${
                  description.length > 450 ? "text-orange-400 font-semibold" : "text-slate-600"
                }`}
              >
                {description.length}/500
              </span>
            </div>
            {errors.description && (
              <p className="flex items-center gap-1 text-xs text-red-400">
                <AlertCircle size={12} /> {errors.description}
              </p>
            )}
          </div>

          {/* ── Address (optional) ── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Address{" "}
              <span className="text-slate-600 normal-case tracking-normal font-normal">
                (optional)
              </span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 281/33 Main Street"
              className={fieldBase}
            />
          </div>

          {/* ── GPS Location ── */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              GPS Location
            </label>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={getLocation}
                disabled={locating}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-400 text-sm hover:border-blue-500 hover:text-blue-400 hover:bg-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {locating ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <LocateFixed size={14} />
                )}
                {locating ? "Locating…" : "Get My Location"}
              </button>

              {coordinates && (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-950/40 border border-blue-800/50 text-blue-400 text-xs">
                  <MapPin size={12} />
                  {coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)}
                </div>
              )}
            </div>
            {errors.location && (
              <p className="flex items-center gap-1 text-xs text-red-400">
                <AlertCircle size={12} /> {errors.location}
              </p>
            )}
          </div>

          {/* ── Submit error ── */}
          {errors.submit && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-950/30 border border-red-800/60">
              <AlertCircle size={14} className="text-red-400 shrink-0" />
              <span className="text-red-400 text-sm">{errors.submit}</span>
            </div>
          )}

          {/* ── Submit Button ── */}
          <button
            type="submit"
            disabled={loading || success}
            className={`
              w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl
              text-white text-sm font-semibold tracking-wide
              transition-all duration-200
              disabled:opacity-60 disabled:cursor-not-allowed
              ${success
                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                : "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 hover:-translate-y-0.5 active:translate-y-0"
              }
            `}
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Submitting…</>
            ) : success ? (
              <><CheckCircle size={16} /> Complaint Submitted!</>
            ) : (
              <><Send size={15} /> Submit Complaint</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}