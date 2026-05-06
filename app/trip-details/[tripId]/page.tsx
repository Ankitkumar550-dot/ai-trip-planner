"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Loader } from "lucide-react";
import HotelCardItem from "@/app/create-new-trip/_components/HotelCardItem";
import PlaceCardItem from "@/app/create-new-trip/_components/PlaceCardItem";

export default function TripDetailsPage() {
  const params = useParams();
  const tripId = params.tripId as string;

  const trip = useQuery(api.tripDetail.getTrip, { tripId });

  if (trip === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (trip === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">Trip not found</h2>
          <p className="text-gray-500 mt-2">The trip you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-20">
      {/* Hero Section */}
      <div className="relative h-[40vh] bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center rounded-b-[3rem] mx-2 shadow-lg">
        <div className="absolute inset-0 bg-black/20 rounded-b-[3rem]" />
        <div className="relative z-10 text-center text-white px-4 mt-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg tracking-tight">
            {trip.destination || "Your Dream Trip"}
          </h1>
          <div className="inline-block bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/30">
            <p className="text-sm md:text-base font-medium opacity-100 drop-shadow flex items-center gap-2">
              ✨ Planned by AI Trip Assistant
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto -mt-16 relative z-20 px-4 md:px-0">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-12 border border-white/50 hover:shadow-3xl transition duration-500">
          <div className="flex items-center gap-3 mb-8 border-b pb-6">
            <div className="bg-indigo-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Your Comprehensive Itinerary
            </h2>
          </div>

          {(() => {
            console.log("Trip Detail Raw:", trip.tripDetail);
            try {
              const plan = JSON.parse(trip.tripDetail);
              return (
                <div className="space-y-12">
                  {/* Overview Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                      <p className="text-xs text-indigo-500 font-bold uppercase tracking-wider mb-1">Origin</p>
                      <p className="font-semibold text-gray-800">{plan.origin || "N/A"}</p>
                    </div>
                    <div className="bg-pink-50 p-4 rounded-2xl border border-pink-100">
                      <p className="text-xs text-pink-500 font-bold uppercase tracking-wider mb-1">Duration</p>
                      <p className="font-semibold text-gray-800">{plan.duration || "N/A"}</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                      <p className="text-xs text-orange-500 font-bold uppercase tracking-wider mb-1">Budget</p>
                      <p className="font-semibold text-gray-800">{plan.budget || "N/A"}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                      <p className="text-xs text-green-500 font-bold uppercase tracking-wider mb-1">Group Size</p>
                      <p className="font-semibold text-gray-800">{plan.group_size || "N/A"}</p>
                    </div>
                  </div>

                  {/* Hotels Section */}
                  {(() => {
                      let rawHotels = plan?.hotels || plan?.hotel_options || plan?.hotel_recommendations || plan?.hotelRecommendations;
                      let hotelsArray: any[] = [];
                      if (Array.isArray(rawHotels)) {
                          hotelsArray = rawHotels;
                      } else if (typeof rawHotels === 'object' && rawHotels !== null) {
                          if (rawHotels.hotels && Array.isArray(rawHotels.hotels)) {
                              hotelsArray = rawHotels.hotels;
                          } else {
                              hotelsArray = Object.values(rawHotels);
                          }
                      } else if (rawHotels) {
                          hotelsArray = [rawHotels];
                      }

                      if (!hotelsArray || hotelsArray.length === 0) return null;

                      return (
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            🏨 Recommended Hotels
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {hotelsArray.map((hotel: any, idx: number) => (
                              <HotelCardItem key={idx} hotel={hotel} />
                            ))}
                          </div>
                        </div>
                      );
                  })()}

                  {/* Itinerary Section */}
                  {plan.itinerary && plan.itinerary.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        🗺️ Daily Itinerary
                      </h3>
                      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                        {plan.itinerary.map((dayPlan: any, idx: number) => (
                          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-500 text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                              {dayPlan.day}
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-2xl shadow-sm border border-gray-100 group-hover:shadow-md transition">
                              <h4 className="font-bold text-lg text-indigo-600 mb-2">Day {dayPlan.day}</h4>
                              <p className="text-gray-600 leading-relaxed text-sm mb-4">{dayPlan.day_plan}</p>
                              {dayPlan.activities && Array.isArray(dayPlan.activities) && (
                                <div className="grid grid-cols-1 gap-4">
                                  {dayPlan.activities.map((activity: any, actIdx: number) => (
                                    <PlaceCardItem key={actIdx} activity={activity} />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            } catch (e) {
              // Fallback if parsing fails (should only happen for older text-based trips)
              return (
                <div className="text-gray-700 whitespace-pre-wrap font-medium leading-relaxed text-sm md:text-base">
                  {trip.tripDetail}
                </div>
              );
            }
          })()}
        </div>
      </div>
    </div>
  );
}
