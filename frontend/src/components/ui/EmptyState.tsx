import React from "react";
import { LucideIcon, Inbox, RotateCcw } from "lucide-react";
import { Button } from "./Button";
import { Card, CardContent } from "./Card";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <Card className="border-dashed border-slate-300 bg-white/60 p-8 text-center">
      <CardContent className="flex flex-col items-center justify-center p-0 space-y-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 border border-slate-200">
          <Icon className="h-7 w-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 max-w-sm">{description}</p>
        {actionLabel && onAction && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAction}
            className="text-xs font-semibold mt-2"
            leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
