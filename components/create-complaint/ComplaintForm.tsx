"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { User, Phone, FileText, AlignLeft, AlertCircle } from "lucide-react";
import CategoryDropdown from "./CategoryDropdown";
import UploadSection from "./UploadSection";
import LocationSection from "./LocationSection";
import SubmitButton from "./SubmitButton";

interface FormData {
  fullName: string;
  phone: string;
  title: string;
  description: string;
  category: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  title?: string;
  description?: string;
  category?: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

export default function ComplaintForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    title: "",
    description: "",
    category: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [images, setImages] = useState<File[]>([]);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\+?[\d\s\-()]{7,15}$/.test(formData.phone.trim())) newErrors.phone = "Enter a valid phone number";
    if (!formData.title.trim()) newErrors.title = "Complaint title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    else if (formData.description.trim().length < 20) newErrors.description = "Please provide at least 20 characters";
    if (!formData.category) newErrors.category = "Please select a category";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    // Simulate API call
    await new Promise((res) => setTimeout(res, 2000));

    const payload = {
      ...formData,
      images: images.map((f) => f.name),
      coordinates,
      submittedAt: new Date().toISOString(),
    };
    console.log("Grievance Submitted:", payload);

    setLoading(false);
    setSuccess(true);

    // Reset after 3s
    setTimeout(() => {
      setSuccess(false);
      setFormData({ fullName: "", phone: "", title: "", description: "", category: "" });
      setImages([]);
      setCoordinates(null);
    }, 3000);
  };

  const inputClass = (hasError?: string) =>
    `h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 text-sm
     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 transition-all duration-300
     ${hasError ? "border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400" : ""}`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">

      {/* ── Desktop: 3 cards in one row | Mobile: stacked ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

        {/* Card 1 — Personal Info */}
        <Card className="rounded-2xl border-slate-100 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-3 pt-5 px-5">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              Personal Info
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-500" />
                Full Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="fullName"
                placeholder="e.g. Arjun Sharma"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className={inputClass(errors.fullName)}
              />
              {errors.fullName && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.fullName}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-500" />
                Phone Number <span className="text-red-400">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={inputClass(errors.phone)}
              />
              {errors.phone && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.phone}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card 2 — Complaint Details */}
        <Card className="rounded-2xl border-slate-100 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-3 pt-5 px-5">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              Complaint Details
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                Complaint Title <span className="text-red-400">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g. Water supply blocked"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className={inputClass(errors.title)}
              />
              {errors.title && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.title}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <CategoryDropdown
                value={formData.category}
                onChange={(v) => handleChange("category", v)}
              />
              {errors.category && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1.5">
                  <AlertCircle className="w-3 h-3" /> {errors.category}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <AlignLeft className="w-3.5 h-3.5 text-blue-500" />
                Description <span className="text-red-400">*</span>
              </Label>
              <div className="relative">
                <Textarea
                  id="description"
                  placeholder="Exact landmark, duration, and impact on public health or safety..."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                  maxLength={500}
                  className={`rounded-xl border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 text-sm resize-none
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 transition-all duration-300
                    ${errors.description ? "border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400" : ""}`}
                />
                <span className={`absolute bottom-2.5 right-3 text-xs tabular-nums transition-colors duration-300 ${formData.description.length > 450 ? "text-orange-500 font-semibold" : "text-slate-400"}`}>
                  {formData.description.length}/500
                </span>
              </div>
              {errors.description && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.description}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card 3 — Upload */}
        <UploadSection images={images} onImagesChange={setImages} />

      </div>

      {/* ── Desktop: Location + Submit side by side | Mobile: stacked ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        <LocationSection coordinates={coordinates} onLocationChange={setCoordinates} />

        {/* Submit wrapper — vertically centered on desktop */}
        <div className="flex flex-col justify-center h-full pt-2 lg:pt-6">
          <p className="text-xs text-slate-400 mb-4 text-center lg:text-left leading-relaxed">
            By submitting, you confirm the information provided is accurate. Your complaint will be forwarded to the concerned municipal department.
          </p>
          <SubmitButton loading={loading} success={success} />
        </div>
      </div>

    </form>
  );
}