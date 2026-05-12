import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import axios from "axios";
import HotelCardItem from "../components/custom/HotelCardItem";
import PlaceCardItem from "../components/custom/PlaceCardItem";

export default function TripDetails() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrip();
  }, [tripId]);

  const fetchTrip = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/trips/${tripId}`);
      setTrip(response.data);
    } catch (error) {
      console.error("Error fetching trip:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-10 rounded-[2rem] shadow-xl border border-gray-100 max-w-md mx-4">
          <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-500 mb-8">We couldn't fetch your trip details. This might be due to a temporary database connection issue.</p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => {
                setLoading(true);
                fetchTrip();
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"
            >
              Try Again
            </button>
            <button 
              onClick={() => window.location.href = '/my-trips'}
              className="text-indigo-600 font-semibold hover:underline"
            >
              Back to My Trips
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-20 pt-20 text-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 flex items-center justify-center rounded-b-[3rem] mx-2 shadow-2xl">
        <div className="absolute inset-0 bg-black/40 rounded-b-[3rem]" />
        <div className="relative z-10 text-center text-white px-4 mt-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-2xl tracking-tight">
            {trip.destination || "Your Dream Trip"}
          </h1>
          <div className="inline-block bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
            <p className="text-sm md:text-base font-medium flex items-center gap-2">
              ✨ Planned by AI Trip Assistant
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto -mt-16 relative z-20 px-4 md:px-0">
        <div className="bg-neutral-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-12 border border-white/10 hover:shadow-indigo-500/10 transition duration-500">
          <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6 text-left">
            <div className="bg-indigo-500/20 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Your Comprehensive Itinerary
            </h2>
          </div>

          {(() => {
            try {
              const plan = JSON.parse(trip.tripDetail);
              return (
                <div className="space-y-12 text-left">
                  {/* Overview Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-neutral-800 p-4 rounded-2xl border border-white/5">
                      <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider mb-1">Origin</p>
                      <p className="font-semibold text-white">{plan.origin || "N/A"}</p>
                    </div>
                    <div className="bg-neutral-800 p-4 rounded-2xl border border-white/5">
                      <p className="text-xs text-pink-400 font-bold uppercase tracking-wider mb-1">Duration</p>
                      <p className="font-semibold text-white">{plan.duration || "N/A"}</p>
                    </div>
                    <div className="bg-neutral-800 p-4 rounded-2xl border border-white/5">
                      <p className="text-xs text-orange-400 font-bold uppercase tracking-wider mb-1">Budget</p>
                      <p className="font-semibold text-white">{plan.budget || "N/A"}</p>
                    </div>
                    <div className="bg-neutral-800 p-4 rounded-2xl border border-white/5">
                      <p className="text-xs text-green-400 font-bold uppercase tracking-wider mb-1">Group Size</p>
                      <p className="font-semibold text-white">{plan.group_size || "N/A"}</p>
                    </div>
                  </div>

                  {/* Hotels Section */}
                  {(() => {
                      let rawHotels = plan?.hotels || plan?.hotel_options || plan?.hotel_recommendations || plan?.hotelRecommendations;
                      let hotelsArray = [];
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
                            {hotelsArray.map((hotel, idx) => (
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
                        {plan.itinerary.map((dayPlan, idx) => (
                          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-neutral-900 bg-indigo-600 text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                              {dayPlan.day}
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-neutral-800/50 p-5 rounded-2xl shadow-sm border border-white/5 group-hover:shadow-indigo-500/10 transition">
                              <h4 className="font-bold text-lg text-indigo-400 mb-2">Day {dayPlan.day}</h4>
                              <p className="text-gray-300 leading-relaxed text-sm mb-4">{dayPlan.day_plan}</p>
                              {dayPlan.activities && Array.isArray(dayPlan.activities) && (
                                <div className="grid grid-cols-1 gap-4">
                                  {dayPlan.activities.map((activity, actIdx) => (
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
              return (
                <div className="text-gray-700 whitespace-pre-wrap font-medium leading-relaxed text-sm md:text-base text-left">
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
