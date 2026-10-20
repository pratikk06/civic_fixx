import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Bell, Search, PlusCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface HeaderProps {
  onSearchClick?: () => void;
  currentUser?: { name: string; avatarUrl?: string; role?: string } | null;
}

export const Header: React.FC<HeaderProps> = ({ currentUser }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/85 backdrop-blur-md px-4 sm:px-6">
      {/* Mobile Brand / Back link */}
      <div className="flex items-center gap-3 md:hidden">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-lg font-black tracking-tight text-slate-900">
            Civic<span className="text-emerald-600">Fix</span>
          </span>
        </Link>
      </div>

      {/* Desktop Search / Quick filter input */}
      <div className="hidden md:flex items-center max-w-md w-full relative">
        <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search civic issues, locations, departments..."
          className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/70 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile quick report */}
        <Button
          size="sm"
          variant="civic"
          className="md:hidden text-xs px-2.5 h-8 font-semibold shadow-xs"
          leftIcon={<PlusCircle className="h-3.5 w-3.5" />}
          onClick={() => navigate("/report")}
        >
          Report
        </Button>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50/80 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
        </button>

        {/* User profile / Login */}
        {currentUser ? (
          <Link
            to="/profile"
            className="flex items-center gap-2 rounded-xl p-1 pr-2 hover:bg-slate-100 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs border border-emerald-200">
              {currentUser.name.charAt(0)}
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-slate-800">
              {currentUser.name}
            </span>
          </Link>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-9 px-3 gap-1.5 font-medium border-slate-200"
            leftIcon={<LogIn className="h-3.5 w-3.5 text-slate-500" />}
            onClick={() => navigate("/login")}
          >
            <span className="hidden xs:inline">Sign In</span>
            <span className="xs:hidden">Login</span>
          </Button>
        )}
      </div>
    </header>
  );
};
