import React from "react";
import { Check, Upload, MapPin, FileText, Sparkles, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepItem {
  number: number;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
}

export const REPORT_STEPS: StepItem[] = [
  { number: 1, label: "Evidence", shortLabel: "Photo", icon: Upload },
  { number: 2, label: "Location", shortLabel: "Location", icon: MapPin },
  { number: 3, label: "Describe", shortLabel: "Details", icon: FileText },
  { number: 4, label: "AI Analysis", shortLabel: "AI Review", icon: Sparkles },
  { number: 5, label: "Publish", shortLabel: "Publish", icon: Send },
];

interface StepIndicatorProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
  maxStepReached: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  onStepClick,
  maxStepReached,
}) => {
  return (
    <div className="w-full">
      {/* Desktop Progress Bar */}
      <div className="hidden sm:flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-emerald-600 -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (REPORT_STEPS.length - 1)) * 100}%` }}
        />

        {REPORT_STEPS.map((step) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          const isAccessible = step.number <= maxStepReached;
          const Icon = step.icon;

          return (
            <button
              key={step.number}
              type="button"
              disabled={!isAccessible}
              onClick={() => isAccessible && onStepClick?.(step.number)}
              className={cn(
                "relative z-10 flex flex-col items-center group focus:outline-none transition-transform",
                isAccessible ? "cursor-pointer" : "cursor-not-allowed opacity-60"
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold transition-all shadow-xs",
                  isCompleted
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : isCurrent
                    ? "bg-white border-emerald-600 text-emerald-700 ring-4 ring-emerald-500/20"
                    : "bg-white border-slate-300 text-slate-400"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 stroke-[3]" />
                ) : (
                  <Icon className={cn("h-4 w-4", isCurrent ? "text-emerald-600" : "text-slate-400")} />
                )}
              </div>
              <span
                className={cn(
                  "text-[11px] font-semibold mt-1.5 transition-colors whitespace-nowrap",
                  isCurrent ? "text-emerald-800 font-bold" : isCompleted ? "text-slate-700" : "text-slate-400"
                )}
              >
                {step.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile Compact Progress Bar */}
      <div className="flex sm:hidden flex-col space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-emerald-800 flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px] font-bold">
              {currentStep}
            </span>
            <span>{REPORT_STEPS[currentStep - 1]?.label}</span>
          </span>
          <span className="text-slate-400 text-[11px] font-medium">
            Step {currentStep} of {REPORT_STEPS.length}
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / REPORT_STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
