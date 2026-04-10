import React from "react";
import { Button } from "@/components/ui/button";
import { Globe2, MapPinned, Sparkles, Plane } from "lucide-react";

type FinalUiProps = {
  viewTrip?: () => void;
  loading?: boolean;
};

function FinalUi({ viewTrip, loading = true }: FinalUiProps) {
  return (
    <div className="mt-6 w-full rounded-3xl border border-gray-100 bg-white p-6 shadow-md">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 shadow-sm">
          <Globe2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </div>

      {/* Heading */}
      <div className="mt-5 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Planning your dream trip...
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          We’re finding the best destinations, hotels, transport, and fun
          activities just for you.
        </p>
      </div>

      {/* Loading steps */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-3 rounded-2xl bg-indigo-50 p-4">
          <MapPinned className="h-5 w-5 text-indigo-600" />
          <p className="text-sm text-gray-700">
            Finding top places to visit
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-purple-50 p-4">
          <Plane className="h-5 w-5 text-purple-600" />
          <p className="text-sm text-gray-700">
            Optimizing your travel route
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-orange-50 p-4">
          <Sparkles className="h-5 w-5 text-orange-500" />
          <p className="text-sm text-gray-700">
            Personalizing your itinerary
          </p>
        </div>
      </div>

      {/* Button */}
      <Button
        onClick={viewTrip}
        disabled={loading}
        className="mt-6 w-full rounded-2xl py-6 text-base font-medium"
      >
        {loading ? "Generating Your Trip Plan..." : "View My Trip"}
      </Button>
    </div>
  );
}

export default FinalUi;