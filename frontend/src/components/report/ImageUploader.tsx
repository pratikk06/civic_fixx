import React, { useRef, useState } from "react";
import { Upload, Camera, Trash2, RefreshCw, CheckCircle, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  imagePreview: string | null;
  onImageSelected: (file: File | null, previewUrl: string | null) => void;
}

const SAMPLE_CIVIC_PHOTOS = [
  {
    label: "Road Pothole",
    url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Garbage Dump",
    url: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Water Leakage",
    url: "https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Broken Light",
    url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
  },
];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imagePreview,
  onImageSelected,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelected(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelected(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSampleClick = (url: string) => {
    onImageSelected(null, url);
  };

  const handleRemove = () => {
    onImageSelected(null, null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      {/* Hidden Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {imagePreview ? (
        /* Image Preview Box */
        <div className="space-y-3">
          <div className="relative w-full rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md bg-slate-950">
            <img
              src={imagePreview}
              alt="Issue Evidence Preview"
              className="w-full h-64 sm:h-80 object-cover object-center"
            />
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5" />
                Evidence Attached
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-semibold"
              leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
            >
              Replace Photo
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50"
              leftIcon={<Trash2 className="h-3.5 w-3.5" />}
            >
              Remove Photo
            </Button>
          </div>
        </div>
      ) : (
        /* Upload Area */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "group relative flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center",
            isDragging
              ? "border-emerald-500 bg-emerald-50/60 scale-[1.01]"
              : "border-slate-300 bg-white hover:border-emerald-500 hover:bg-slate-50/70 shadow-xs"
          )}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:scale-105 transition-transform mb-4">
            <Upload className="h-8 w-8 stroke-[1.75]" />
          </div>

          <h3 className="text-base font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
            Click to upload or drag and drop photo
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Supports high-resolution JPG, JPEG, PNG, or WEBP evidence photos.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6" onClick={(e) => e.stopPropagation()}>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-semibold"
              leftIcon={<ImageIcon className="h-4 w-4 text-slate-500" />}
            >
              Browse Files
            </Button>
            <Button
              type="button"
              size="sm"
              variant="civic"
              onClick={() => cameraInputRef.current?.click()}
              className="text-xs font-bold"
              leftIcon={<Camera className="h-4 w-4" />}
            >
              Take Photo
            </Button>
          </div>
        </div>
      )}

      {/* Quick Sample Photos for Hackathon Testing */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs space-y-2">
        <div className="font-semibold text-slate-700 flex items-center justify-between">
          <span>⚡ Quick Test Sample Photos:</span>
          <span className="text-[10px] text-slate-400 font-normal">Click any to auto-fill</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {SAMPLE_CIVIC_PHOTOS.map((sample) => (
            <button
              key={sample.label}
              type="button"
              onClick={() => handleSampleClick(sample.url)}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 font-semibold text-[11px] text-slate-700 transition-all text-center truncate shadow-2xs"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
