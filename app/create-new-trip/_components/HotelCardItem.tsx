'use client'
import React, { useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Wallet, Star, MapPin, ExternalLink, CalendarCheck } from 'lucide-react';
import { Hotel } from './ChatBox';

type Props = {
    hotel: Hotel
}

// Exactly as provided by user
const HOTEL_IMAGES = [
    "https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://www.rodaonline.com/wp-content/uploads/Roda-Projects-HotelDeParis-08.jpg",
    "https://tse4.mm.bing.net/th/id/OIP.Wt0hZqjxg5qfVgnfrpC7tgHaE8?rs=1&pid=ImgDetMain",
    "https://tse4.mm.bing.net/th/id/OIP.BGADXLRMTuUC1LIzWQ5SUgHaEK?rs=1&pid=ImgDetMain"
];

export default function HotelCardItem({ hotel }: Props) {
    const displayImage = useMemo(() => {
        // If AI provides an image, use it, otherwise rotate through the user's provided list
        if (hotel?.hotel_image_url && hotel.hotel_image_url.startsWith('http') && !hotel.hotel_image_url.includes('example.com')) {
            return hotel.hotel_image_url;
        }
        const nameKey = hotel?.hotel_name || "";
        const index = Math.abs(nameKey.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % HOTEL_IMAGES.length;
        return HOTEL_IMAGES[index];
    }, [hotel?.hotel_name, hotel?.hotel_image_url]);

    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel?.hotel_name + "," + hotel?.hotel_address)}`;
    const bookingUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotel?.hotel_name)}`;

    return (
        <div className='bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col h-full group'>
            <div className="relative h-[170px] w-full mb-3 overflow-hidden rounded-xl bg-gray-100">
                <img 
                    src={displayImage} 
                    alt={hotel?.hotel_name}
                    className='object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500'
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                        // Fallback to a different image if one fails
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80";
                    }}
                />
                <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg text-yellow-600 flex items-center gap-1 shadow-sm border border-yellow-100 z-10">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    <span className="text-[10px] font-bold">{hotel?.rating || "4.5"}</span>
                </div>
            </div>

            <div className="px-1 flex-grow">
                <h2 className='font-bold text-gray-800 text-base line-clamp-1 mb-1 group-hover:text-indigo-600 transition-colors'>{hotel?.hotel_name}</h2>
                <div className='flex items-start gap-1.5 mb-4'>
                    <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                    <h2 className='text-gray-500 text-[11px] line-clamp-2 leading-tight'>{hotel.hotel_address}</h2>
                </div>

                <div className='flex justify-between items-center mb-4 bg-gray-50 p-2.5 rounded-xl border border-gray-100'>
                    <div className="flex flex-col">
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Per Night</span>
                        <p className='flex items-center gap-1 text-green-600 text-sm font-bold'>
                            <Wallet className="w-3 h-3" /> 
                            {hotel?.price_per_night || hotel?.price || "₹4,500"}
                        </p>
                    </div>
                    <div className="h-8 w-px bg-gray-200"></div>
                    <div className="flex flex-col items-end">
                         <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider text-right">Rating</span>
                         <div className="flex items-center gap-0.5">
                             {[...Array(5)].map((_, i) => (
                                 <Star key={i} className={`w-2.5 h-2.5 ${i < Math.floor(hotel?.rating || 4) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                             ))}
                         </div>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-2 gap-2 mt-auto'>
                <Link href={mapUrl} target='_blank' className="block">
                    <Button variant='outline' className='w-full text-[10px] h-9 flex items-center justify-center gap-1.5 border-indigo-100 hover:bg-indigo-50 text-indigo-600 font-bold uppercase transition-colors'>
                        <ExternalLink size={12} />
                        View Location
                    </Button>
                </Link>
                <Link href={`/book-now?hotel=${encodeURIComponent(hotel?.hotel_name)}`} className="block">
                    <Button className='w-full text-[10px] h-9 flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold uppercase shadow-md active:scale-95 transition-all'>
                        <CalendarCheck size={12} />
                        Book Now
                    </Button>
                </Link>
            </div>
        </div>
    );
}