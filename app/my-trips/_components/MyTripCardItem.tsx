import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { MapPin, Calendar, Wallet, Users } from 'lucide-react';

type Props = {
    trip: any;
}

export default function MyTripCardItem({ trip }: Props) {
    const [photoUrl, setPhotoUrl] = useState<string>('');

    let parsedData: any = null;
    try {
        parsedData = typeof trip?.tripDetail === 'string' ? JSON.parse(trip?.tripDetail) : trip?.tripDetail;
    } catch (e) {
        console.error('Error parsing trip data', e);
    }

    const dest = trip?.destination || parsedData?.trip_details?.destination || parsedData?.destination || "Unknown Destination";
    const origin = parsedData?.origin || parsedData?.trip_details?.origin || "Unknown Origin";
    const duration = parsedData?.duration || parsedData?.trip_details?.duration || "N/A";
    const budget = parsedData?.budget || parsedData?.trip_details?.budget || "N/A";
    const groupSize = parsedData?.group_size || parsedData?.trip_details?.group_size || "N/A";

    useEffect(() => {
        if (trip) {
            GetGooglePlaceDetail();
        }
    }, [trip]);

    const GetGooglePlaceDetail = async () => {
        try {
            const result = await axios.post('/api/google-place-detail', {
                placeName: dest
            });

            if (result?.data?.photoUrl) {
                setPhotoUrl(result.data.photoUrl);
            }
        } catch (e) {
            console.error("Failed to fetch image details:", e);
        }
    }

    return (
        <Link href={`/trip-details/${trip?.tripId}`}>
            <div className="flex flex-col gap-3 hover:scale-[1.02] transition-all cursor-pointer bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md h-full">
                <img
                    src={photoUrl || 'https://static.vecteezy.com/system/resources/previews/044/637/644/large_2x/modern-hotel-facade-illuminated-at-dusk-with-warm-lighting-landscaping-and-clear-skies-suitable-for-business-travel-and-tourism-concepts-photo.jpg'}
                    alt={dest}
                    className="rounded-xl shadow-sm object-cover w-full h-[200px]"
                />
                
                <div className="flex flex-col flex-grow">
                    <h2 className="font-bold text-xl line-clamp-1 text-gray-800">
                        {dest}
                    </h2>
                    
                    <div className="flex items-center gap-1.5 text-sm text-gray-600 mt-2 mb-3">
                        <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                        <span className="line-clamp-1">{origin} &rarr; {dest}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-auto">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-indigo-50/50 border border-indigo-50 p-2 rounded-lg">
                            <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                            <span className="truncate">{duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-green-50/50 border border-green-50 p-2 rounded-lg">
                            <Wallet className="w-4 h-4 text-green-500 shrink-0" />
                            <span className="truncate">{budget}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-orange-50/50 border border-orange-50 p-2 rounded-lg col-span-2">
                            <Users className="w-4 h-4 text-orange-500 shrink-0" />
                            <span className="truncate">{groupSize}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
