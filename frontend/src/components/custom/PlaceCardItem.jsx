import React from 'react';
import { Button } from "../ui/button";
import { Ticket, Clock, MapPin } from 'lucide-react';

export default function PlaceCardItem({ activity }) {
    return (
        <a href={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(activity?.place_name)} target='_blank' rel="noopener noreferrer">
            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-4 hover:shadow-indigo-500/10 transition-shadow cursor-pointer h-full flex flex-col text-left">
                <img
                    src={activity?.place_image_url && !activity.place_image_url.includes("example.com") ? activity.place_image_url : "https://static.vecteezy.com/system/resources/previews/044/637/644/large_2x/modern-hotel-facade-illuminated-at-dusk-with-warm-lighting-landscaping-and-clear-skies-suitable-for-business-travel-and-tourism-concepts-photo.jpg"}
                    alt={activity?.place_name}
                    className="w-full h-[130px] object-cover rounded-xl mb-3 opacity-80"
                />
                <h5 className="font-bold text-white text-base leading-tight">{activity?.place_name}</h5>
                <p className="text-sm text-gray-400 mt-1.5 mb-3 line-clamp-2 leading-relaxed">{activity?.place_details}</p>

                <div className="mt-auto space-y-3">
                    <div className="space-y-2">
                        <div className="flex items-start gap-2 text-sm">
                            <Ticket className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                            <span className="text-gray-300 font-medium leading-tight">{activity?.ticket_pricing || activity?.ticket_price || activity?.price || "Free"}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                            <Clock className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                            <span className="text-gray-300 font-medium leading-tight">{activity?.time_travel_each_location || activity?.time_to_travel || activity?.duration || activity?.best_time_to_visit || "N/A"}</span>
                        </div>
                        {activity?.place_address && (
                            <div className="flex items-start gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                                <span className="text-gray-300 font-medium leading-tight line-clamp-1">{activity.place_address}</span>
                            </div>
                        )}
                    </div>
                    <Button variant={'outline'} className='w-full'>View Location</Button>
                </div>
            </div>
        </a>
    );
}
