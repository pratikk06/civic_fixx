import React, { useState } from "react";
import { X, CheckCircle2, Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AuthorityIssueItem } from "@/types";

interface ResolutionUploadModalProps {
  issue: AuthorityIssueItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { afterImage: File; summary: string }) => void;
  isLoading?: boolean;
}

export const ResolutionUploadModal: React.FC<ResolutionUploadModalProps> = ({
  issue,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [summary, setSummary] = useState("");

  if (!isOpen || !issue) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    onSubmit({
      afterImage: selectedFile,
      summary: summary.trim() || "Road infrastructure repair completed and site cleared.",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              Submit Resolution Evidence
            </h3>
            <p className="text-xs text-slate-500 font-medium">Issue: {issue.title}</p>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Before Photo Preview */}
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">ORIGINAL BEFORE PHOTO</span>
          <div className="aspect-16/9 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            {issue.imageUrl ? (
              <img src={issue.imageUrl} alt="Original report" className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-slate-400">No original image</div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Upload After-Repair Resolution Image *</label>
            <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-emerald-500 transition-colors bg-slate-50">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {previewUrl ? (
                <div className="space-y-2">
                  <img src={previewUrl} alt="After repair preview" className="max-h-36 mx-auto rounded-lg object-cover" />
                  <span className="text-xs font-semibold text-emerald-700 block">Click or drop to replace photo</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload className="h-6 w-6 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">Click to select repaired site photo</p>
                  <p className="text-[10px] text-slate-400">Supports JPG, PNG, WebP up to 5MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Work Completion Summary</label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="e.g. Patching complete, asphalt cured, road reopened to traffic."
              className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
            />
          </div>

          <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-900 border border-emerald-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              AI Visual Resolution Assessment
            </div>
            <p className="text-[11px] leading-relaxed text-emerald-800">
              Upon submission, backend Groq Vision AI will evaluate before and after evidence images to compute visual verification scores.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={!selectedFile}
              isLoading={isLoading}
              rightIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
            >
              Verify & Complete Resolution
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
