"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import MyTripCardItem from "./_components/MyTripCardItem";

function MyTripsPage() {
    const { user } = useUser();
    const trips = useQuery(api.tripDetail.getTripsByUser, user?.primaryEmailAddress?.emailAddress ? {
        userEmail: user.primaryEmailAddress.emailAddress
    } : "skip");

    return (
        <div className="max-w-7xl mx-auto px-8 py-24">
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-10">
                My Trips
            </h2>

            {!trips && user && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} className="h-[200px] w-full rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
                    ))}
                </div>
            )}

            {trips && trips.length === 0 && (
                <div className="text-center text-gray-500 py-20">
                    <p className="text-xl mb-4">You have not created any trips yet.</p>
                    <Link href="/create-new-trip" className="text-indigo-600 font-medium hover:underline">
                        <Button>Create your first trip</Button>
                    </Link>
                </div>
            )}

            {trips && trips.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trips.map((trip, index) => (
                        <MyTripCardItem key={trip._id || index} trip={trip} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyTripsPage;
