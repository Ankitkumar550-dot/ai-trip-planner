'use client'
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Wallet, Star } from 'lucide-react';

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
                <h2 className='text-gray-500 text-sm'>{hotel.hotel_address}</h2>
                <div className='flex justify-between items-center'>
                    <p className='flex gap-2 text-green-600'> <Wallet className="w-5 h-5" /> {hotel.price_per_night}</p>
                    <p className='text-yellow-500 flex gap-2'><Star className="w-5 h-5" /> {hotel.rating} </p>
                </div>
                <Button variant={'outline'} className='mt-1'>View</Button>
            </div>
        </Link>
    );
}