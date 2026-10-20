import React from "react";
import { TimelineEvent } from "@/types";
import { CheckCircle2, Clock, FileText, Bot, Building2, User, Sparkles } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface TransparencyTimelineProps {
  events: TimelineEvent[];
}

export const TransparencyTimeline: React.FC<TransparencyTimelineProps> = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 text-center text-xs text-slate-500">
        No timeline events recorded yet.
      </div>
    );
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "reported":
        return <User className="h-4 w-4 text-blue-600" />;
      case "ai_analyzed":
      case "ai":
        return <Bot className="h-4 w-4 text-purple-600" />;
      case "routed":
        return <Building2 className="h-4 w-4 text-amber-600" />;
      case "acknowledged":
        return <CheckCircle2 className="h-4 w-4 text-teal-600" />;
      case "official_update":
        return <FileText className="h-4 w-4 text-indigo-600" />;
      case "action_underway":
        return <Clock className="h-4 w-4 text-orange-600" />;
      case "resolved":
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      default:
        return <Sparkles className="h-4 w-4 text-slate-600" />;
    }
  };

  const getEventBadge = (isOfficial?: boolean, actorType?: string) => {
    if (isOfficial || actorType === "authority") {
      return (
        <span className="inline-flex items-center gap-1 rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-800 border border-indigo-200">
          Official
        </span>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Clock className="h-4 w-4 text-emerald-600" />
          Public Transparency Timeline
        </h3>
        <span className="text-[11px] text-slate-500 font-medium">{events.length} Milestones</span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {events.map((event, idx) => (
          <div key={event.id || idx} className="relative group">
            <div className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white ring-4 ring-slate-50 shadow-xs border border-slate-200">
              {getEventIcon(event.type)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900">{event.title}</h4>
                  {getEventBadge(event.isOfficial)}
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {formatDate(event.timestamp)}
                </span>
              </div>

              {event.description && (
                <p className="text-xs text-slate-600 leading-normal">{event.description}</p>
              )}

              {event.actorName && (
                <span className="inline-block text-[10px] text-slate-400">
                  By {event.actorName}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
