import React from "react";
import { cn } from "@/lib/utils";

interface IssueFiltersProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  className?: string;
}

export const IssueFilters: React.FC<IssueFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
  className,
}) => {
  const categories = [
    { id: "All", label: "All Issues", emoji: "🏛" },
    { id: "Roads", label: "Roads", emoji: "🚧" },
    { id: "Garbage", label: "Garbage", emoji: "🗑" },
    { id: "Water", label: "Water", emoji: "💧" },
    { id: "Electricity", label: "Electricity", emoji: "💡" },
    { id: "Infrastructure", label: "Infrastructure", emoji: "🏗" },
  ];

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1",
        className
      )}
    >
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold transition-all duration-150 border select-none",
              isSelected
                ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                : "bg-white text-slate-600 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <span className="text-xs">{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
