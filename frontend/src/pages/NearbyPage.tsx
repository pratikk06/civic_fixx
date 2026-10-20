import React, { useState } from "react";
import { MapPin, Navigation, ShieldAlert } from "lucide-react";
import { useIssues } from "@/hooks/useIssues";
import { IssueCard } from "@/components/issues/IssueCard";
import { IssueCardSkeleton } from "@/components/ui/LoadingSkeleton";
import { Button } from "@/components/ui/Button";

export const NearbyPage: React.FC = () => {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>({
    lat: 37.7749,
    lng: -122.4194,
  });
  const [radiusKm, setRadiusKm] = useState<number>(5);
  const [locationDenied, setLocationDenied] = useState<boolean>(false);

  const { data: issues, isLoading } = useIssues({
    tab: "nearby",
    lat: coords?.lat,
    lng: coords?.lng,
    radiusKm,
  });

  const requestLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setLocationDenied(false);
        },
        () => {
          setLocationDenied(true);
        }
      );
    } else {
      setLocationDenied(true);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Heading */}
      <div className="flex flex-col gap-1 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold shadow-xs">
            <MapPin className="h-5 w-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-sans">
            Issues Near You
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Discover and support civic reports happening in your neighborhood.
        </p>
      </div>

      {/* Geolocation Controls & Radius Selector */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={requestLocation}
              leftIcon={<Navigation className="h-4 w-4" />}
            >
              Use My Location
            </Button>
            {coords && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Location Detected
              </span>
            )}
          </div>

          {/* Radius Selector */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <span>Radius:</span>
            {[2, 5, 10].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRadiusKm(r)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  radiusKm === r
                    ? "bg-slate-900 text-white font-bold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {r} km
              </button>
            ))}
          </div>
        </div>

        {locationDenied && (
          <div className="rounded-xl bg-amber-50 p-3 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-600 flex-shrink-0" />
            <span>Location unavailable. Displaying general neighborhood reports.</span>
          </div>
        )}
      </div>

      {/* Nearby Issues List */}
      {isLoading ? (
        <div className="space-y-4">
          <IssueCardSkeleton />
          <IssueCardSkeleton />
        </div>
      ) : !issues || issues.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-2">
          <MapPin className="h-8 w-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No Nearby Issues Found</h3>
          <p className="text-xs text-slate-500">No unresolved civic issues reported within {radiusKm} km.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
};
