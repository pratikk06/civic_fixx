import React, { useState } from "react";
import { Navigation, MapPin, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IssueLocation } from "@/types";

interface LocationPickerProps {
  location: IssueLocation;
  onLocationChange: (location: IssueLocation) => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  location,
  onLocationChange,
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const detectLocation = () => {
    setIsLocating(true);
    setGeoError(null);
    setStatusMessage("Accessing device GPS coordinates...");

    if (!("geolocation" in navigator)) {
      setGeoError("Geolocation is not supported by your browser. Please enter address manually.");
      setIsLocating(false);
      setStatusMessage(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setStatusMessage(`GPS locked (${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°). Reverse geocoding locality...`);

        let detectedLocality = "";
        let detectedAddress = "";
        let detectedCity = "";
        let detectedState = "";

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            
            const suburb = addr.suburb || addr.neighbourhood || addr.residential || addr.subdistrict || addr.quarter || addr.village || "";
            const city = addr.city || addr.town || addr.municipality || addr.county || addr.state_district || "";
            const road = addr.road || addr.pedestrian || addr.footway || addr.amenity || "";

            detectedState = addr.state || "";
            detectedCity = city;

            if (suburb && city) {
              detectedLocality = `${suburb}, ${city}`;
            } else if (city) {
              detectedLocality = city;
            } else if (suburb) {
              detectedLocality = suburb;
            }

            if (road) {
              detectedAddress = road;
            }
          }
        } catch {
          // If nominatim request fails or network restricted, fallback cleanly
        }

        onLocationChange({
          address: detectedAddress || location.address || `Near ${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`,
          locality: detectedLocality || location.locality || "Detected GPS Area",
          city: detectedCity || location.city || "Local District",
          state: detectedState || location.state || "State",
          latitude: parseFloat(latitude.toFixed(6)),
          longitude: parseFloat(longitude.toFixed(6)),
        });

        setIsLocating(false);
        setStatusMessage(null);
      },
      (error) => {
        let msg = "Unable to retrieve your device location.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Location permission denied. Please enter your neighborhood / sector address manually below.";
        }
        setGeoError(msg);
        setIsLocating(false);
        setStatusMessage(null);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-4">
      {/* Geolocation Detection Banner */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
              <MapPin className="h-4 w-4 text-emerald-600" />
              <span>Instant GPS Ward Detection</span>
            </div>
            <p className="text-xs text-slate-500">
              One-click precise GPS location and reverse neighborhood resolution.
            </p>
          </div>

          <Button
            type="button"
            variant="civic"
            size="sm"
            onClick={detectLocation}
            isLoading={isLocating}
            className="text-xs font-bold shadow-xs shrink-0"
            leftIcon={isLocating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Navigation className="h-3.5 w-3.5" />}
          >
            {isLocating ? "Detecting..." : "Detect My Location"}
          </Button>
        </div>

        {statusMessage && (
          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50/90 p-2.5 rounded-xl border border-emerald-200">
            <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0 text-emerald-600" />
            <span>{statusMessage}</span>
          </div>
        )}

        {geoError && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{geoError}</span>
          </div>
        )}

        {location.latitude !== 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-emerald-800 bg-white/90 px-3 py-2 rounded-xl border border-emerald-100 shadow-2xs">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                GPS Locked: {location.latitude.toFixed(4)}° N, {location.longitude.toFixed(4)}° E
              </span>
            </div>
            {location.locality && (
              <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {location.locality}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Manual Locality / Address Fields */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <label htmlFor="locality" className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span>Neighborhood / Locality / Sector *</span>
            <span className="text-[10px] text-slate-400 font-normal">e.g. Sector 21, Gurgaon</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              id="locality"
              type="text"
              required
              placeholder="e.g. Sector 21, Gurgaon"
              value={location.locality}
              onChange={(e) =>
                onLocationChange({ ...location, locality: e.target.value })
              }
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-xs"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="address" className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span>Specific Landmark / Street Address</span>
            <span className="text-[10px] text-slate-400 font-normal">Optional</span>
          </label>
          <input
            id="address"
            type="text"
            placeholder="e.g. Main road opposite DAV School Gate 2"
            value={location.address}
            onChange={(e) =>
              onLocationChange({ ...location, address: e.target.value })
            }
            className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-xs"
          />
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-3.5 border border-slate-200/80 text-xs text-slate-600">
        <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong className="text-slate-800">Privacy Guarantee:</strong> Your exact GPS coordinates are used by municipal field teams to locate the defect. Public posts display your generalized neighborhood.
        </p>
      </div>
    </div>
  );
};
