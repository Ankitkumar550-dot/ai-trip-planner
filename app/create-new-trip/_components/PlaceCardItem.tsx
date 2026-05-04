import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Ticket, Clock } from 'lucide-react';

export default function PlaceCardItem({ activity }: { activity: any }) {
    return (
        <Link href={'https://www.google.com/maps/search/?api=1&query=' + activity?.place_name} target='_blank'>
            <div className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                <img
                    src={activity?.place_image_url && !activity.place_image_url.includes("example.com") ? activity.place_image_url : "https://static.vecteezy.com/system/resources/previews/044/637/644/large_2x/modern-hotel-facade-illuminated-at-dusk-with-warm-lighting-landscaping-and-clear-skies-suitable-for-business-travel-and-tourism-concepts-photo.jpg"}
                    alt={activity?.place_name}
                    className="w-full h-[130px] object-cover rounded-xl mb-3"
                />
                <h5 className="font-bold text-gray-800 text-base leading-tight">{activity?.place_name}</h5>
                <p className="text-sm text-gray-500 mt-1.5 mb-3 line-clamp-2 leading-relaxed">{activity?.place_details}</p>

                <div className="mt-auto space-y-3">
                    <div className="space-y-2">
                        <div className="flex items-start gap-2 text-sm">
                            <Ticket className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                            <span className="text-gray-600 font-medium leading-tight">{activity?.ticket_pricing}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                            <Clock className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                            <span className="text-gray-600 font-medium leading-tight">{activity?.best_time_to_visit || activity?.time_travel_each_location}</span>
                        </div>
                    </div>
                    <Button variant={'outline'} className='w-full'>View Location</Button>
                </div>
            </div>
        </Link>
    );
}
