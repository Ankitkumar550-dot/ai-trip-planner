'use client'
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Wallet, Star, MapPin } from 'lucide-react';

import { Hotel } from './ChatBox';

type Props = {
    hotel: Hotel
}
export default function HotelCardItem({ hotel }: Props) {


    return (
        <Link href={'https://www.google.com/maps/search/?api=1&query=' + hotel?.hotel_name + "," + hotel?.hotel_address} target='_blank'>
            <div className='flex flex-col gap-1 hover:scale-[1.02] transition-all cursor-pointer'>
                <img src={'https://static.vecteezy.com/system/resources/previews/044/637/644/large_2x/modern-hotel-facade-illuminated-at-dusk-with-warm-lighting-landscaping-and-clear-skies-suitable-for-business-travel-and-tourism-concepts-photo.jpg'} alt='place-image'
                    className='rounded-xl shadow object-cover mb-2 w-full h-[150px]'
                />
                <h2 className='font-semibold text-lg line-clamp-1'>{hotel?.hotel_name}</h2>
                <div className='flex items-start gap-1.5 mt-1'>
                    <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <h2 className='text-gray-500 text-sm line-clamp-2'>{hotel.hotel_address}</h2>
                </div>
                <div className='flex justify-between items-center mt-2'>
                    <p className='flex items-center gap-2 text-green-600 text-sm font-medium'> <Wallet className="w-4 h-4" /> {hotel?.price_per_night || hotel?.price || "N/A"}</p>
                    <p className='text-yellow-500 flex items-center gap-1.5 text-sm font-medium'><Star className="w-4 h-4 fill-yellow-500" /> {hotel?.rating || "N/A"} </p>
                </div>
                <Button variant={'outline'} className='mt-1'>View</Button>
            </div>
        </Link>
    );
}