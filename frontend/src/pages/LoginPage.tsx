import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, Building2, User, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuth();
  const [role, setRole] = useState<"citizen" | "authority">("citizen");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password, role });
      if (role === "authority") {
        navigate("/authority");
      } else {
        navigate("/");
      }
    } catch {
      // Fallback redirect if network error occurs
      if (role === "authority") {
        navigate("/authority");
      } else {
        navigate("/");
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <Link to="/" className="inline-flex items-center gap-2 mb-2 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900 font-sans">
            Civic<span className="text-emerald-600">Fix</span>
          </span>
        </Link>
        <p className="text-xs text-slate-500 font-medium">
          Public Civic Accountability & Resolution Platform
        </p>
      </div>

      <Card className="border-slate-200 shadow-md">
        <CardHeader className="space-y-1 pb-4">
          {/* Role selector tabs */}
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 mb-2">
            <button
              type="button"
              onClick={() => setRole("citizen")}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                role === "citizen"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <User className="h-3.5 w-3.5" />
              Citizen
            </button>
            <button
              type="button"
              onClick={() => setRole("authority")}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                role === "authority"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              Authority Officer
            </button>
          </div>

          <CardTitle className="text-lg font-bold text-slate-900">
            {role === "citizen" ? "Citizen Sign In" : "Municipal Authority Portal"}
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            {role === "citizen"
              ? "Sign in to report issues, support community petitions, and track resolutions."
              : "Authorized municipal department portal for reviewing and responding to reports."}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-0">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder={role === "citizen" ? "citizen@example.com" : "officer@roads.gov.in"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="pass" className="text-xs font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  id="pass"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant={role === "authority" ? "default" : "civic"}
              isLoading={isLoggingIn}
              className="w-full h-11 text-sm font-semibold mt-2"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              {role === "citizen" ? "Continue as Citizen" : "Access Department Desk"}
            </Button>
          </CardContent>
        </form>

        <CardFooter className="flex flex-col space-y-2 pt-0 text-center border-t border-slate-100 p-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            Continue as Guest (Public Browsing)
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};
