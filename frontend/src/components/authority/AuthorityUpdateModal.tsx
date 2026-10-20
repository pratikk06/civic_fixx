import React, { useState } from "react";
import { X, Send, Calendar, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AuthorityIssueItem } from "@/types";

interface AuthorityUpdateModalProps {
  issue: AuthorityIssueItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { message: string; actionTaken?: string; expectedCompletionDate?: string }) => void;
  isLoading?: boolean;
}

export const AuthorityUpdateModal: React.FC<AuthorityUpdateModalProps> = ({
  issue,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [message, setMessage] = useState("");
  const [actionTaken, setActionTaken] = useState("");
  const [expectedDate, setExpectedDate] = useState("");

  if (!isOpen || !issue) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSubmit({
      message,
      actionTaken: actionTaken.trim() || undefined,
      expectedCompletionDate: expectedDate || undefined,
    });
    setMessage("");
    setActionTaken("");
    setExpectedDate("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Post Official Authority Update</h3>
            <p className="text-xs text-slate-500 font-medium">Issue: {issue.title}</p>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Official Update Message *</label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Department inspection completed. Contractor team assigned to site."
              className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Planned Action / Work Description</label>
            <input
              type="text"
              value={actionTaken}
              onChange={(e) => setActionTaken(e.target.value)}
              placeholder="e.g. Laying hot mix asphalt patch and leveling road"
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-indigo-600" />
              Expected Completion Date (Optional)
            </label>
            <input
              type="date"
              value={expectedDate}
              onChange={(e) => setExpectedDate(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            />
          </div>

          <div className="rounded-xl bg-indigo-50 p-3 text-xs text-indigo-900 border border-indigo-100 flex items-start gap-2">
            <Info className="h-4 w-4 text-indigo-600 flex-shrink-0 mt-0.5" />
            <span>This official update will be immediately published to the public transparency timeline for citizens to track.</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="default" size="sm" isLoading={isLoading} rightIcon={<Send className="h-3.5 w-3.5" />}>
              Publish Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
