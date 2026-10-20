import React, { useState } from "react";
import { ShieldCheck, LogOut, FileText, Heart, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useIssues } from "@/hooks/useIssues";
import { IssueCard } from "@/components/issues/IssueCard";
import { IssueCardSkeleton } from "@/components/ui/LoadingSkeleton";
import { useNavigate } from "react-router-dom";

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isLoggingOut } = useAuth();
  const [activeTab, setActiveTab] = useState<"my_reports" | "supported" | "following">("my_reports");

  const { data: allIssues, isLoading } = useIssues();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const myReports = allIssues ? allIssues.filter((i) => i.reporter.name === user?.name || i.reporter.isAnonymous) : [];
  const supportedIssues = allIssues ? allIssues.filter((i) => i.isSupportedByMe) : [];
  const followingIssues = allIssues ? allIssues.filter((i) => i.isFollowedByMe) : [];

  const getActiveTabIssues = () => {
    switch (activeTab) {
      case "supported":
        return supportedIssues;
      case "following":
        return followingIssues;
      default:
        return myReports;
    }
  };

  const currentTabIssues = getActiveTabIssues();

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Profile Header */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-2xl font-black shadow-md">
                {user?.name ? user.name.charAt(0).toUpperCase() : "C"}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl font-bold text-slate-900">{user?.name || "Citizen Reporter"}</h1>
                  <Badge variant="primary" className="text-[11px]">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Civic Contributor
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 font-medium">{user?.email || "citizen@civicfix.org"} • Member since Aug 2026</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              isLoading={isLoggingOut}
              onClick={handleLogout}
              className="text-xs text-slate-600 border-slate-200 hover:bg-slate-100"
              leftIcon={<LogOut className="h-3.5 w-3.5 text-slate-500" />}
            >
              Sign Out
            </Button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-slate-100">
            <div className="rounded-xl bg-slate-50 p-3 text-center border border-slate-100">
              <div className="text-xl font-black text-slate-900">{myReports.length}</div>
              <div className="text-[11px] text-slate-500 font-medium">My Reports</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 text-center border border-slate-100">
              <div className="text-xl font-black text-emerald-600">{supportedIssues.length}</div>
              <div className="text-[11px] text-slate-500 font-medium font-sans">Supported</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 text-center border border-slate-100">
              <div className="text-xl font-black text-indigo-600">{followingIssues.length}</div>
              <div className="text-[11px] text-slate-500 font-medium font-sans">Following</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("my_reports")}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
            activeTab === "my_reports"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          My Reports ({myReports.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("supported")}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
            activeTab === "supported"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Heart className="h-3.5 w-3.5" />
          Supported ({supportedIssues.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("following")}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
            activeTab === "following"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Eye className="h-3.5 w-3.5" />
          Following ({followingIssues.length})
        </button>
      </div>

      {/* Tab Feed Output */}
      {isLoading ? (
        <div className="space-y-4">
          <IssueCardSkeleton />
        </div>
      ) : currentTabIssues.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-3">
          <p className="text-xs text-slate-500">No issues found in this category.</p>
          <Button size="sm" variant="outline" onClick={() => navigate("/")}>
            Explore Public Feed
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {currentTabIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
};
