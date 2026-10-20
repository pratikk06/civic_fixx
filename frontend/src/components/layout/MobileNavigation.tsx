import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Flame, MapPin, Plus, User, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavigationProps {
  isAuthority?: boolean;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ isAuthority = true }) => {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 bg-white/95 backdrop-blur-lg px-2 py-1.5 md:hidden shadow-float">
      <div className="flex items-center justify-around">
        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] font-medium transition-colors",
              isActive ? "text-emerald-700 font-semibold" : "text-slate-500 hover:text-slate-900"
            )
          }
        >
          {({ isActive }) => (
            <>
              <Home className={cn("h-5 w-5 mb-0.5", isActive ? "text-emerald-600" : "text-slate-400")} />
              <span>Home</span>
            </>
          )}
        </NavLink>

        {/* Trending */}
        <NavLink
          to="/trending"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] font-medium transition-colors",
              isActive ? "text-emerald-700 font-semibold" : "text-slate-500 hover:text-slate-900"
            )
          }
        >
          {({ isActive }) => (
            <>
              <Flame className={cn("h-5 w-5 mb-0.5", isActive ? "text-amber-600" : "text-slate-400")} />
              <span>Trending</span>
            </>
          )}
        </NavLink>

        {/* Center Floating Report Button */}
        <div className="-mt-5">
          <button
            type="button"
            onClick={() => navigate("/report")}
            aria-label="Report Civic Issue"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30 active:scale-95 transition-transform border-2 border-white ring-2 ring-emerald-500/20"
          >
            <Plus className="h-6 w-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Near Me */}
        <NavLink
          to="/nearby"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] font-medium transition-colors",
              isActive ? "text-emerald-700 font-semibold" : "text-slate-500 hover:text-slate-900"
            )
          }
        >
          {({ isActive }) => (
            <>
              <MapPin className={cn("h-5 w-5 mb-0.5", isActive ? "text-emerald-600" : "text-slate-400")} />
              <span>Near Me</span>
            </>
          )}
        </NavLink>

        {/* Profile or Authority */}
        {isAuthority ? (
          <NavLink
            to="/authority"
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] font-medium transition-colors",
                isActive ? "text-blue-700 font-semibold" : "text-slate-500 hover:text-slate-900"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Building2 className={cn("h-5 w-5 mb-0.5", isActive ? "text-blue-600" : "text-slate-400")} />
                <span>Authority</span>
              </>
            )}
          </NavLink>
        ) : (
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] font-medium transition-colors",
                isActive ? "text-emerald-700 font-semibold" : "text-slate-500 hover:text-slate-900"
              )
            }
          >
            {({ isActive }) => (
              <>
                <User className={cn("h-5 w-5 mb-0.5", isActive ? "text-emerald-600" : "text-slate-400")} />
                <span>Profile</span>
              </>
            )}
          </NavLink>
        )}
      </div>
    </nav>
  );
};
