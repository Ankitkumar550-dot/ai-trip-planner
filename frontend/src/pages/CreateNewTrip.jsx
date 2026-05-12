import React, { useState } from "react";
import ChatBox from "../components/custom/ChatBox";
import { Plane } from "lucide-react";
import Itinerary from "../components/custom/Itinerary";
import { useSearchParams } from "react-router-dom";

function CreateNewTrip() {
  const [searchParams] = useSearchParams();
  const initialInput = searchParams.get('input') || "";
  const [tripPlan, setTripPlan] = useState("");

  return (
    <div className="min-h-screen pt-28 px-6 md:px-10 bg-black font-outfit text-white">

      <div className="mb-8 text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Plan Your Next Trip ✈️
        </h1>
        <p className="text-gray-400 mt-2">
          Chat with AI and build your perfect travel experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Left: Chat Section */}
        <div className="relative group">
          <div className="absolute inset-0 bg-neutral-800 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition"></div>

          <div className="relative bg-neutral-900/80 backdrop-blur-lg rounded-2xl shadow-xl p-5 border border-white/10 hover:scale-[1.02] transition duration-300">
            <div className="flex items-center gap-2 mb-3">
              <Plane className="text-indigo-400" />
              <h2 className="font-semibold text-lg text-white">AI Trip Assistant</h2>
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

export default CreateNewTrip;
