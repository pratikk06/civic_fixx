import React, { useState } from "react";
import { ImageOff, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface IssueImageProps {
  src: string;
  alt: string;
  className?: string;
  category?: string;
}

export const IssueImage: React.FC<IssueImageProps> = ({
  src,
  alt,
  className,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError || !src) {
    return (
      <div
        className={cn(
          "w-full h-56 sm:h-72 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400 p-4",
          className
        )}
      >
        <ImageOff className="h-8 w-8 mb-2 stroke-[1.5]" />
        <span className="text-xs font-medium text-slate-500">
          Photographic Evidence Attached
        </span>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full overflow-hidden rounded-2xl bg-slate-900 border border-slate-200/80 group", className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        className={cn(
          "w-full h-64 sm:h-80 object-cover object-center transition-transform duration-300 group-hover:scale-[1.015]",
          isLoading ? "opacity-0" : "opacity-100"
        )}
      />
      <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-semibold text-white/90 flex items-center gap-1 shadow-xs pointer-events-none">
        <Sparkles className="h-3 w-3 text-emerald-400" />
        <span>Verified Citizen Evidence</span>
      </div>
    </div>
  );
};
