import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-slate-200 shadow-md text-center">
        <CardContent className="p-8 space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-100">
            <AlertCircle className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 font-sans">404</h1>
            <h2 className="text-base font-bold text-slate-800">Page Not Found</h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              The civic page or issue report you are looking for does not exist or has been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
            <Link to="/" className="w-full sm:w-auto">
              <Button
                variant="civic"
                size="sm"
                className="w-full text-xs font-semibold"
                leftIcon={<Home className="h-4 w-4" />}
              >
                Back to Home Feed
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
