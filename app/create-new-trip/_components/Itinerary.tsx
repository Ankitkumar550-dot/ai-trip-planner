"use client";
import React, { useEffect, useState } from 'react';
import { TripInfo } from './ChatBox';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Wallet, Star, Clock, Ticket, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import HotelCardItem from './HotelCardItem';
import PlaceCardItem from './PlaceCardItem';
import { useTripDetail } from '@/app/provider';
// Adding mock data fallback with the correct TripInfo structure
const TRIP_DATA: any = {
    "destination": "Goa, India",
    "duration": "2 Days",
    "origin": "Mumbai, India",
    "budget": "Low",
    "group_size": "Solo",
    "hotels": [
        {
            "hotel_name": "The Bucket List Hostel, Goa",
            "hotel_address": "House No. 1290/1, Soranto, Anjuna, Goa",
            "price_per_night": "INR 500 - 800",
            "hotel_image_url": "https://example.com/thebucketl",
            "geo_coordinates": {
                "latitude": 15.5898,
                "longitude": 73.7431
            },
            "rating": 4.5,
            "description": "A popular and highly-rated hostel perfect for solo travelers with an amazing vibe."
        },
        {
            "hotel_name": "Taj Exotica Resort & Spa",
            "hotel_address": "Calwaddo, Benaulim, Goa",
            "price_per_night": "INR 8000 - 12000",
            "hotel_image_url": "https://example.com/tajexotica",
            "geo_coordinates": {
                "latitude": 15.2536,
                "longitude": 73.9189
            },
            "rating": 4.8,
            "description": "Luxury beachfront resort offering premium amenities and stunning views."
        },
        {
            "hotel_name": "W Goa",
            "hotel_address": "Vagator Beach, Bardez, Goa",
            "price_per_night": "INR 9000 - 15000",
            "hotel_image_url": "https://example.com/wgoa",
            "geo_coordinates": {
                "latitude": 15.6025,
                "longitude": 73.7335
            },
            "rating": 4.6,
            "description": "Vibrant resort bringing trendy nightlife and luxury to Vagator beach."
        },
        {
            "hotel_name": "Novotel Goa Resort & Spa",
            "hotel_address": "Pinto Waddo, Candolim, Goa",
            "price_per_night": "INR 4000 - 6000",
            "hotel_image_url": "https://example.com/novotel",
            "geo_coordinates": {
                "latitude": 15.5165,
                "longitude": 73.7663
            },
            "rating": 4.4,
            "description": "Family-friendly resort with a large pool and relaxing spa facilities."
        }
    ],
    "itinerary": [
        {
            "day": 1,
            "day_plan": "Explore the vibrant beaches and local culture.",
            "best_time_to_visit_day": "Morning",
            "activities": [
                {
                    "place_name": "Anjuna Beach",
                    "place_details": "Famous for its stunning sunset views and lively beach shacks.",
                    "place_image_url": "https://example.com/anjuna",
                    "geo_coordinates": { "latitude": 15.5898, "longitude": 73.7431 },
                    "place_address": "Anjuna, Goa",
                    "ticket_pricing": "Free",
                    "time_travel_each_location": "2 Hours",
                    "best_time_to_visit": "Late Afternoon"
                },
                {
                    "place_name": "Calangute Beach",
                    "place_details": "Known as the Queen of Beaches, highly popular with water sports.",
                    "place_image_url": "https://example.com/calangute",
                    "geo_coordinates": { "latitude": 15.5494, "longitude": 73.7535 },
                    "place_address": "Calangute, Goa",
                    "ticket_pricing": "Free",
                    "time_travel_each_location": "3 Hours",
                    "best_time_to_visit": "Morning"
                },
                {
                    "place_name": "Baga Beach",
                    "place_details": "Famous for its vibrant nightlife, shacks, and water activities.",
                    "place_image_url": "https://example.com/baga",
                    "geo_coordinates": { "latitude": 15.5553, "longitude": 73.7517 },
                    "place_address": "Baga, Goa",
                    "ticket_pricing": "Free",
                    "time_travel_each_location": "2 Hours",
                    "best_time_to_visit": "Evening"
                },
                {
                    "place_name": "Aguada Fort",
                    "place_details": "A 17th-century Portuguese fort standing on Sinquerim Beach.",
                    "place_image_url": "https://example.com/aguada",
                    "geo_coordinates": { "latitude": 15.4981, "longitude": 73.7663 },
                    "place_address": "Candolim, Goa",
                    "ticket_pricing": "INR 50",
                    "time_travel_each_location": "1.5 Hours",
                    "best_time_to_visit": "Late Afternoon"
                }
            ]
        },
        {
            "day": 2,
            "day_plan": "Discover South Goa's serene beaches and heritage.",
            "best_time_to_visit_day": "Morning",
            "activities": [
                {
                    "place_name": "Palolem Beach",
                    "place_details": "A beautiful crescent-shaped beach lined with palm trees.",
                    "place_image_url": "https://example.com/palolem",
                    "geo_coordinates": { "latitude": 15.0100, "longitude": 74.0232 },
                    "place_address": "Palolem, Canacona, Goa",
                    "ticket_pricing": "Free",
                    "time_travel_each_location": "3 Hours",
                    "best_time_to_visit": "Morning"
                },
                {
                    "place_name": "Colva Beach",
                    "place_details": "Famous for its powdery white sand and coconut palms.",
                    "place_image_url": "https://example.com/colva",
                    "geo_coordinates": { "latitude": 15.2750, "longitude": 73.9167 },
                    "place_address": "Colva, Goa",
                    "ticket_pricing": "Free",
                    "time_travel_each_location": "2 Hours",
                    "best_time_to_visit": "Afternoon"
                },
                {
                    "place_name": "Basilica of Bom Jesus",
                    "place_details": "A UNESCO World Heritage site holding the mortal remains of St. Francis Xavier.",
                    "place_image_url": "https://example.com/basilica",
                    "geo_coordinates": { "latitude": 15.5009, "longitude": 73.9116 },
                    "place_address": "Old Goa Road, Bainguinim, Goa",
                    "ticket_pricing": "Free",
                    "time_travel_each_location": "1.5 Hours",
                    "best_time_to_visit": "Morning"
                },
                {
                    "place_name": "Dona Paula View Point",
                    "place_details": "A popular tourist destination offering a scenic view of the Mormugao harbor.",
                    "place_image_url": "https://example.com/donapaula",
                    "geo_coordinates": { "latitude": 15.4542, "longitude": 73.8058 },
                    "place_address": "Dona Paula, Panaji, Goa",
                    "ticket_pricing": "Free",
                    "time_travel_each_location": "1 Hour",
                    "best_time_to_visit": "Sunset"
                }
            ]
        },
        {
            "day": 3,
            "day_plan": "Adventure sports and exploring spice plantations.",
            "best_time_to_visit_day": "Morning",
            "activities": [
                {
                    "place_name": "Dudhsagar Waterfalls",
                    "place_details": "A stunning four-tiered waterfall located on the Mandovi River.",
                    "place_image_url": "https://example.com/dudhsagar",
                    "geo_coordinates": { "latitude": 15.3144, "longitude": 74.3143 },
                    "place_address": "Sonauli, Goa",
                    "ticket_pricing": "INR 400",
                    "time_travel_each_location": "4 Hours",
                    "best_time_to_visit": "Morning"
                },
                {
                    "place_name": "Sahakari Spice Farm",
                    "place_details": "An organic spice farm offering tours and traditional Goan lunch.",
                    "place_image_url": "https://example.com/spicefarm",
                    "geo_coordinates": { "latitude": 15.3995, "longitude": 74.0041 },
                    "place_address": "Ponda, Goa",
                    "ticket_pricing": "INR 500",
                    "time_travel_each_location": "2 Hours",
                    "best_time_to_visit": "Afternoon"
                },
                {
                    "place_name": "Mangueshi Temple",
                    "place_details": "One of the largest and most frequently visited temples in Goa.",
                    "place_image_url": "https://example.com/mangueshi",
                    "geo_coordinates": { "latitude": 15.4475, "longitude": 73.9680 },
                    "place_address": "Mangeshi Village, Ponda, Goa",
                    "ticket_pricing": "Free",
                    "time_travel_each_location": "1 Hour",
                    "best_time_to_visit": "Evening"
                },
                {
                    "place_name": "Mandovi River Cruise",
                    "place_details": "Enjoy a relaxing evening cruise with music and cultural performances.",
                    "place_image_url": "https://example.com/cruise",
                    "geo_coordinates": { "latitude": 15.5015, "longitude": 73.8340 },
                    "place_address": "Panaji, Goa",
                    "ticket_pricing": "INR 500",
                    "time_travel_each_location": "2 Hours",
                    "best_time_to_visit": "Night"
                }
            ]
        }
    ]
};

export default function Itinerary({ tripPlan }: { tripPlan?: string }) {

    const [parsedTrip, setParsedTrip] = useState<TripInfo | null>(null);
    const tripContext = useTripDetail();
    const tripDetailInfo = tripContext?.tripDetailInfo;

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

    // Use parsedTrip or context if available (no mock data!)
    const tripData = parsedTrip || tripDetailInfo;

    // 1. Recommended Hotels
    let rawHotels = tripData?.hotels || tripData?.hotel_options || tripData?.hotel_recommendations || tripData?.hotelRecommendations;
    let hotelsArray: any[] = [];
    if (Array.isArray(rawHotels)) {
        hotelsArray = rawHotels;
    } else if (typeof rawHotels === 'object' && rawHotels !== null) {
        // If it's an object of objects, or it has a nested array
        if (rawHotels.hotels && Array.isArray(rawHotels.hotels)) {
            hotelsArray = rawHotels.hotels;
        } else {
            hotelsArray = Object.values(rawHotels);
        }
    } else if (rawHotels) {
        hotelsArray = [rawHotels];
    }

    // 2. Daily Itinerary
    const itineraryArray = Array.isArray(tripData?.itinerary)
        ? tripData.itinerary
        : (typeof tripData?.itinerary === 'object' && tripData?.itinerary !== null)
            ? Object.values(tripData.itinerary)
            : [];

    return (
        <div className="relative w-full h-[85vh] overflow-y-auto scrollbar-hide pb-10">
            {tripData && Object.keys(tripData).length > 0 ? (
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 md:p-8 border border-white/50">
                    <div className="flex items-center gap-3 mb-6 border-b pb-4">
                        <div className="bg-indigo-100 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                            Your Comprehensive Itinerary
                        </h2>
                    </div>

                    <div className="space-y-8">
                        {/* Overview Grid */}
                        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                                <p className="text-xs text-indigo-500 font-bold uppercase tracking-wider mb-1">Origin</p>
                                <p className="font-semibold text-gray-800 text-sm md:text-base">{tripData.origin || "N/A"}</p>
                            </div>
                            <div className="bg-pink-50 p-4 rounded-2xl border border-pink-100">
                                <p className="text-xs text-pink-500 font-bold uppercase tracking-wider mb-1">Duration</p>
                                <p className="font-semibold text-gray-800 text-sm md:text-base">{tripData.duration || "N/A"}</p>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                                <p className="text-xs text-orange-500 font-bold uppercase tracking-wider mb-1">Budget</p>
                                <p className="font-semibold text-gray-800 text-sm md:text-base">{tripData.budget || "N/A"}</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                                <p className="text-xs text-green-500 font-bold uppercase tracking-wider mb-1">Group Size</p>
                                <p className="font-semibold text-gray-800 text-sm md:text-base">{tripData.group_size || "N/A"}</p>
                            </div>
                        </div>

                        {/* Hotels Section */}
                        {hotelsArray && hotelsArray.length > 0 && (
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
                        )}

                        {/* Itinerary Section */}
                        {itineraryArray && itineraryArray.length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    🗺️ Daily Itinerary
                                </h3>
                                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                                    {itineraryArray.map((dayPlan: any, idx: number) => (
                                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-500 text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                                {dayPlan.day || idx + 1}
                                            </div>
                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-2xl shadow-sm border border-gray-100 group-hover:shadow-md transition">
                                                <h4 className="font-bold text-lg text-indigo-600 mb-2">Day {dayPlan.day || idx + 1}</h4>
                                                {dayPlan.best_time_to_visit_day && (
                                                    <p className="font-semibold text-sm text-gray-800 mb-1">Best Time: {dayPlan.best_time_to_visit_day}</p>
                                                )}
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
