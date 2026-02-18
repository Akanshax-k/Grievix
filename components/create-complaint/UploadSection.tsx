"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon, Upload, X, ZoomIn } from "lucide-react";
import Image from "next/image";

interface UploadSectionProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
}

export default function UploadSection({ images, onImagesChange }: UploadSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files).filter(
      (f) => (f.type === "image/jpeg" || f.type === "image/png") && f.size <= 5 * 1024 * 1024
    );
    onImagesChange([...images, ...valid].slice(0, 4));
  };

  const removeImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    onImagesChange(updated);
  };

  const previews = images.map((f) => URL.createObjectURL(f));

  return (
    <>
      <Card className="rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
        <CardHeader className="pb-1 pt-5 px-5">
          <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-blue-600" />
            Evidence Gallery
          </CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">Upload clear photos of the issue</p>
        </CardHeader>

        <CardContent className="px-5 pb-5 flex flex-col flex-1 space-y-3">
          {/* Drop Zone */}
          <div
            onClick={() => inputRef.current?.click()}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFiles(e.dataTransfer.files);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            className={`flex-1 min-h-[160px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300
              ${dragOver
                ? "border-blue-400 bg-blue-50"
                : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
              }`}
          >
            {previews.length === 0 ? (
              <>
                <Upload className="w-7 h-7 text-slate-400" strokeWidth={1.5} />
                <div className="text-center">
                  <p className="text-xs font-medium text-slate-600">
                    {dragOver ? "Drop images here" : "Drag and drop images here"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Support for JPG, PNG (Max 5MB)
                  </p>
                </div>
              </>
            ) : (
              <div className="w-full p-2 grid grid-cols-2 gap-2">
                {previews.map((src, i) => (
                  <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-slate-100">
                    <Image
                      src={src}
                      alt={`Preview ${i + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setLightbox(src); }}
                        className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center"
                      >
                        <ZoomIn className="w-3 h-3 text-slate-700" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                        className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
                {previews.length < 4 && (
                  <div className="aspect-square rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-slate-300" />
                  </div>
                )}
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-2xl w-full aspect-square rounded-2xl overflow-hidden">
            <Image src={lightbox} alt="Preview" fill className="object-contain" />
          </div>
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      )}
    </>
  );
}