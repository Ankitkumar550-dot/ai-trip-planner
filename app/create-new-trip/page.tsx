"use client";

import React, { useState, Suspense } from "react";
import ChatBox from "./_components/ChatBox";
import { Plane } from "lucide-react";
import Itinerary from "./_components/Itinerary";
import { useSearchParams } from "next/navigation";

function CreateNewTripContent() {
  const searchParams = useSearchParams();
  const initialInput = searchParams.get('input') || "";
  const [tripPlan, setTripPlan] = useState<string>("");

  return (
    <div className="min-h-screen pt-28 px-6 md:px-10 bg-gradient-to-br from-indigo-100 via-white to-blue-100">

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Plan Your Next Trip ✈️
        </h1>
        <p className="text-gray-500 mt-2">
          Chat with AI and build your perfect travel experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Left: Chat Section */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition"></div>

          <div className="relative bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-5 border border-white/30 hover:scale-[1.02] transition duration-300">
            <div className="flex items-center gap-2 mb-3">
              <Plane className="text-indigo-500" />
              <h2 className="font-semibold text-lg">AI Trip Assistant</h2>
            </div>

            <ChatBox externalInput={initialInput} onTripPlanGenerate={setTripPlan} />
          </div>
        </div>

        {/* Right: Itinerary / Wallpaper Section */}
        <div className="flex flex-col gap-6">
           <Itinerary tripPlan={tripPlan} />
        </div>

      </div>
    </div>
  );
}

export default function CreateNewTrip() {
  return (
    <Suspense fallback={<div className="pt-32 text-center">Loading Planner...</div>}>
      <CreateNewTripContent />
    </Suspense>
  )
}