import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  Home,
  Flame,
  MapPin,
  PlusCircle,
  BookmarkCheck,
  User,
  ShieldCheck,
  Building2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
  isAuthority?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ className, isAuthority = true }) => {
  const navigate = useNavigate();

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/trending", label: "Trending", icon: Flame },
    { to: "/nearby", label: "Near Me", icon: MapPin },
    { to: "/report", label: "Report Issue", icon: PlusCircle },
    { to: "/following", label: "Following", icon: BookmarkCheck },
    { to: "/profile", label: "Profile", icon: User },
  ];

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen w-64 flex-col justify-between border-r border-slate-200/80 bg-white/90 backdrop-blur-md p-4 hidden md:flex",
        className
      )}
    >
      <div className="flex flex-col space-y-6">
        {/* Brand Logo & Tagline */}
        <Link to="/" className="flex items-center gap-3 px-2 py-1 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-slate-900 font-sans">
              Civic<span className="text-emerald-600">Fix</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
              Accountability Platform
            </span>
          </div>
        </Link>

        {/* Primary CTA */}
        <div className="px-1">
          <Button
            size="lg"
            variant="civic"
            className="w-full justify-center shadow-emerald-600/25 shadow-md hover:shadow-lg transition-all"
            leftIcon={<PlusCircle className="h-5 w-5" />}
            onClick={() => navigate("/report")}
          >
            Report an Issue
          </Button>
        </div>

        {/* Main Navigation Links */}
        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-emerald-50 text-emerald-800 font-semibold shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"
                      )}
                    />
                    <span>{item.label}</span>
                    {item.label === "Trending" && (
                      <span className="ml-auto flex h-2 w-2 rounded-full bg-amber-500" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Area: Authority Portal Link & System Status */}
      <div className="flex flex-col space-y-3 pt-4 border-t border-slate-100">
        {isAuthority && (
          <NavLink
            to="/authority"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all border",
                isActive
                  ? "bg-blue-50 border-blue-200 text-blue-800"
                  : "bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-blue-50/70 hover:border-blue-200 hover:text-blue-700"
              )
            }
          >
            <Building2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <div className="flex flex-col text-left">
              <span className="font-bold">Authority Portal</span>
              <span className="text-[10px] text-slate-500 font-normal">Department Action Desk</span>
            </div>
          </NavLink>
        )}

        <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50/50 p-3 border border-emerald-100/80 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-800 mb-1">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>AI Civic Routing</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Reports are verified & routed directly to responsible municipal departments.
          </p>
        </div>
      </div>
    </aside>
  );
};
