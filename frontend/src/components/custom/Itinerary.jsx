import React, { useEffect, useState, useContext } from 'react';
import { Wallet, Star, Clock, Ticket, ArrowLeft } from 'lucide-react';
import HotelCardItem from './HotelCardItem';
import PlaceCardItem from './PlaceCardItem';
import { TripDetailContext } from "../../context/TripDetailContext";

export default function Itinerary({ tripPlan }) {
    const [parsedTrip, setParsedTrip] = useState(null);
    const { tripDetailInfo } = useContext(TripDetailContext) || {};

    useEffect(() => {
        if (tripPlan) {
            try {
                const parsed = JSON.parse(tripPlan);
                setParsedTrip(parsed);
            } catch (e) {
                console.error("Error parsing trip plan", e);
            }
        }
    }, [tripPlan]);

    const tripData = parsedTrip || tripDetailInfo;

    let rawHotels = tripData?.hotels || tripData?.hotel_options || tripData?.hotel_recommendations || tripData?.hotelRecommendations;
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

    const itineraryArray = Array.isArray(tripData?.itinerary)
        ? tripData.itinerary
        : (typeof tripData?.itinerary === 'object' && tripData?.itinerary !== null)
            ? Object.values(tripData.itinerary)
            : [];

    return (
        <div id="itinerary-section" className="relative w-full h-[85vh] overflow-y-auto scrollbar-hide pb-10">
            {tripData && Object.keys(tripData).length > 0 ? (
                <div className="bg-neutral-950/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 md:p-8 border border-white/10 text-left">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                        <div className="bg-indigo-500/10 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white">
                            Your Comprehensive Itinerary
                        </h2>
                    </div>

                    <div className="space-y-8">
                        {/* Overview Grid */}
                        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                            <div className="bg-neutral-800 p-4 rounded-2xl border border-white/5">
                                <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider mb-1">Origin</p>
                                <p className="font-semibold text-white text-sm md:text-base">{tripData.origin || "N/A"}</p>
                            </div>
                            <div className="bg-neutral-800 p-4 rounded-2xl border border-white/5">
                                <p className="text-xs text-pink-400 font-bold uppercase tracking-wider mb-1">Duration</p>
                                <p className="font-semibold text-white text-sm md:text-base">{tripData.duration || "N/A"}</p>
                            </div>
                            <div className="bg-neutral-800 p-4 rounded-2xl border border-white/5">
                                <p className="text-xs text-orange-400 font-bold uppercase tracking-wider mb-1">Budget</p>
                                <p className="font-semibold text-white text-sm md:text-base">{tripData.budget || "N/A"}</p>
                            </div>
                            <div className="bg-neutral-800 p-4 rounded-2xl border border-white/5">
                                <p className="text-xs text-green-400 font-bold uppercase tracking-wider mb-1">Group Size</p>
                                <p className="font-semibold text-white text-sm md:text-base">{tripData.group_size || "N/A"}</p>
                            </div>
                        </div>

                        {/* Route Plan / Logistics Section */}
                        {tripData.route_plan && (
                            <div className="bg-neutral-900 p-6 rounded-3xl border border-white/5 shadow-sm">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    🚀 Best Route & Logistics
                                </h3>
                                <p className="text-sm text-gray-400 mb-6 italic">"{tripData.route_plan.summary}"</p>

                                <div className="space-y-4">
                                    {tripData.route_plan.steps.map((step, idx) => (
                                        <div key={idx} className="flex gap-4 group">
                                            <div className="flex flex-col items-center">
                                                <div className="w-10 h-10 rounded-full bg-neutral-800 shadow-md flex items-center justify-center border-2 border-white/10 group-hover:border-indigo-400 transition">
                                                    {step.type.toLowerCase().includes('flight') || step.type.toLowerCase().includes('plane') ? '✈️' :
                                                        step.type.toLowerCase().includes('train') ? '🚆' :
                                                            step.type.toLowerCase().includes('taxi') || step.type.toLowerCase().includes('car') ? '🚖' : '🚶'}
                                                </div>
                                                {idx !== tripData.route_plan.steps.length - 1 && (
                                                    <div className="w-0.5 h-full bg-blue-200 mt-1 min-h-[20px]"></div>
                                                )}
                                            </div>
                                            <div className="pb-6">
                                                <h4 className="font-bold text-white flex items-center gap-2">
                                                    {step.description}
                                                    <span className="text-[10px] bg-neutral-800 px-2 py-0.5 rounded-full border border-white/10 text-indigo-400 uppercase font-bold">
                                                        {step.type}
                                                    </span>
                                                </h4>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                                    <p className="text-xs text-gray-300 font-medium flex items-center gap-1">
                                                        <Clock size={12} /> {step.duration}
                                                    </p>
                                                    <p className="text-xs text-gray-300 font-medium flex items-center gap-1">
                                                        <Wallet size={12} /> {step.price_estimate}
                                                    </p>
                                                    {step.distance && (
                                                        <p className="text-xs text-gray-300 font-medium">📍 {step.distance}</p>
                                                    )}
                                                </div>
                                                {step.additional_info && (
                                                    <p className="text-[11px] text-gray-400 mt-2 line-clamp-1 italic">{step.additional_info}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Hotels Section */}
                        {hotelsArray && hotelsArray.length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    🏨 Recommended Hotels
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {hotelsArray.map((hotel, idx) => (
                                        <HotelCardItem key={idx} hotel={hotel} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Itinerary Section */}
                        {itineraryArray && itineraryArray.length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    🗺️ Daily Itinerary
                                </h3>
                                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                                    {itineraryArray.map((dayPlan, idx) => (
                                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-neutral-900 bg-indigo-600 text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                                {dayPlan.day || idx + 1}
                                            </div>
                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-neutral-900 p-5 rounded-2xl shadow-sm border border-white/5 group-hover:shadow-indigo-500/10 transition">
                                                <h4 className="font-bold text-lg text-indigo-400 mb-2">Day {dayPlan.day || idx + 1}</h4>
                                                {dayPlan.best_time_to_visit_day && (
                                                    <p className="font-semibold text-sm text-white mb-1">Best Time: {dayPlan.best_time_to_visit_day}</p>
                                                )}
                                                <p className="text-gray-400 leading-relaxed text-sm mb-4">{dayPlan.day_plan}</p>
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
                </div>
            ) : (
                <div className="w-full h-full relative">
                    <img
                        src="https://wallpapers.com/images/hd/adventure-background-s0t6dibysfddsgfi.jpg"
                        alt="travel"
                        className="w-full h-full object-cover rounded-3xl"
                    />

                    <h2 className="absolute bottom-20 left-20 flex gap-2 items-center text-white">
                        <ArrowLeft />
                        Getting to know you to build perfect trip
                    </h2>
                </div>
            )}
        </div>
    );
}
