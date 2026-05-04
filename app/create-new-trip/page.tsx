"use client";

import React, { useState } from "react";
import ChatBox from "./_components/ChatBox";
import { Plane } from "lucide-react";

import Itinerary from "./_components/Itinerary";



export default function CreateNewTrip() {
  const [selectedLocation, setSelectedLocation] = useState<string>("");
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

            <ChatBox externalInput={selectedLocation} onTripPlanGenerate={setTripPlan} />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Itinerary />

          <div className="relative bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-5 border border-white/30 hover:scale-[1.02] transition duration-300">
            <h2 className="font-semibold text-lg mb-3">
              📍 Your Trip Plan
            </h2>

            <div className="text-gray-600 max-h-[300px] overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed">
              {tripPlan ? (
                <div className="p-4 bg-white rounded-xl shadow-inner border border-gray-100">
                  {tripPlan}
                </div>
              ) : (
                <ul className="space-y-3">
                  <li className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition">
                    Day 1: Arrival & Local Sightseeing
                  </li>
                  <li className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition">
                    Day 2: Adventure Activities
                  </li>
                  <li className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition">
                    Day 3: Explore Culture & Food
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>

  );
}