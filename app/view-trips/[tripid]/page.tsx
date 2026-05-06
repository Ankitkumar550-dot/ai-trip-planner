"use client";
import Itinerary from '@/app/create-new-trip/_components/Itinerary';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation'
import React from 'react'
import { Loader, Calendar, Wallet, Users } from 'lucide-react';

function ViewTrips() {
    const params = useParams();
    const tripId = params.tripid as string;

    const trip = useQuery(api.tripDetail.getTrip, { tripId });

    if (trip === undefined) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader className="h-10 w-10 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (trip === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-700">Trip not found</h2>
                </div>
            </div>
        );
    }

    let plan: any = null;
    try {
        plan = JSON.parse(trip.tripDetail);
    } catch(e) {}

    return (
        <div className="min-h-screen bg-white pt-24 pb-10">
            <div className="max-w-6xl mx-auto px-4 md:px-8 mt-6">
                <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                    Your Trip Itinerary from <span className="text-orange-600">{plan?.origin || "Origin"}</span> to <span className="text-orange-600">{plan?.destination || trip.destination || "Destination"}</span> is Ready
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 mb-12">
                    <div className="flex items-center gap-2 text-gray-700 font-medium text-sm md:text-base">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        {plan?.duration || "N/A"}
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 font-medium text-sm md:text-base">
                        <Wallet className="w-5 h-5 text-gray-500" />
                        {plan?.budget || "N/A"}
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 font-medium text-sm md:text-base">
                        <Users className="w-5 h-5 text-gray-500" />
                        {plan?.group_size || "N/A"}
                    </div>
                </div>

                <Itinerary tripPlan={trip.tripDetail} />
            </div>
        </div>
    )
}

export default ViewTrips