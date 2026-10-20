import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileNavigation } from "./MobileNavigation";
import { RightSidebar } from "./RightSidebar";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  showRightSidebar?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = () => {
  const location = useLocation();

  // Pages that display the right sidebar (Feed/Home and Trending)
  const isFeedView = location.pathname === "/" || location.pathname === "/trending" || location.pathname === "/nearby";
  // Full-width pages like Authority or Create Issue might want custom container
  const isAuthorityView = location.pathname.startsWith("/authority");
  const isAuthView = location.pathname === "/login";

  if (isAuthView) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      {/* Desktop Left Sidebar */}
      <Sidebar isAuthority={true} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        {/* Top Header */}
        <Header />

        {/* Dynamic Page Container */}
        <div className="flex-1 flex justify-center w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 gap-6">
          {/* Main Outlet (Center Feed or Focused Page) */}
          <main
            className={cn(
              "flex-1 min-w-0 w-full",
              isFeedView && "max-w-2xl",
              isAuthorityView && "max-w-full"
            )}
          >
            <Outlet />
          </main>

          {/* Right Sidebar for Public Feed / Discover views on desktop */}
          {isFeedView && <RightSidebar />}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNavigation isAuthority={true} />
    </div>
  );
};
