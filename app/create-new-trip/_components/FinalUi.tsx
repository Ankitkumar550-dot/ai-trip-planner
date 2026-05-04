import React from "react";
import { Button } from "@/components/ui/button";
import { Globe2 } from "lucide-react";

type FinalUiProps = {
  viewTrip?: () => void;
  loading?: boolean;
};

function FinalUi({ viewTrip, loading = true }: FinalUiProps) {
  return (
    <div className="mt-4 w-full rounded-2xl bg-white p-6 shadow-sm border flex flex-col items-center text-center">
      <div className="flex justify-center mb-2">
        <Globe2 className={`h-8 w-8 text-[#f25e3d] ${loading ? "animate-spin" : ""}`} />
      </div>

      <h2 className="text-lg font-bold text-[#f25e3d] flex items-center justify-center gap-2">
        ✈️ Planning your dream trip...
      </h2>

      <p className="mt-2 text-sm text-gray-500 max-w-sm">
        Gathering best destinations, activities, and travel details for you.
      </p>

      <Button
        onClick={viewTrip}
        disabled={loading}
        className="mt-6 bg-[#f25e3d] hover:bg-[#d95234] text-white px-8 rounded-xl font-medium disabled:opacity-60 disabled:cursor-not-allowed"
      >
        View Trip
      </Button>
    </div>
  );
}

export default FinalUi;