"use client";

import { useState } from "react";
import UploadSection from "./UploadSection";
import ComplaintDetailsCard from "./Complaintdetailscard";
import LocationSection from "./LocationSection";
import SubmitButton from "./SubmitButton";

interface Coordinates {
  lat: number;
  lng: number;
}

export default function MainForm() {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [coordinates, setCoordinates] = useState<Coordinates | null>({
    lat: 28.6139,
    lng: 77.209,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((res) => setTimeout(res, 2000));
    const payload = {
      description,
      images: images.map((f) => f.name),
      coordinates,
      submittedAt: new Date().toISOString(),
    };
    console.log("Grievance Submitted:", payload);
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setDescription("");
      setImages([]);
      setCoordinates({ lat: 28.6139, lng: 77.209 });
    }, 3000);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* ── 3 equal cards side by side ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Card 1 — Evidence Gallery */}
        <UploadSection images={images} onImagesChange={setImages} />

        {/* Card 2 — Complaint Details */}
        <ComplaintDetailsCard
          description={description}
          onDescriptionChange={setDescription}
        />

        {/* Card 3 — Incident Location */}
        <LocationSection
          coordinates={coordinates}
          onLocationChange={setCoordinates}
        />
      </div>

      {/* Submit button — centered below cards */}
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <SubmitButton loading={loading} success={success} />
        </div>
      </div>
    </form>
  );
}