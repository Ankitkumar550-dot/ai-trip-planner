import React from 'react';
import { Globe2, PlaneTakeoff, Landmark, Compass } from 'lucide-react';

export const Suggestions = [
    {
        title: "Create New Trip",
        icon: <Globe2 className="h-5 w-5 text-blue-500" />
    },
    {
        title: "Inspire me where to go",
        icon: <PlaneTakeoff className="h-5 w-5 text-green-500" />
    },
    {
        title: "Discover Hidden gems",
        icon: <Landmark className="h-5 w-5 text-orange-700" />
    },
    {
        title: "Adventure Destination",
        icon: <Compass className="h-5 w-5 text-yellow-500" />
    }
];

function EmptyBoxState({ onSuggestionSelect }) {
    return (
        <div className='mt-10 flex flex-col items-center justify-center px-4'>
            <h2 className='font-bold text-3xl text-center text-white'>
                Start Planning new <span className="text-indigo-400">Trip</span> using AI
            </h2>
            <p className='text-center text-gray-400 mt-4 max-w-2xl text-sm md:text-base'>
                Discover personalized travel itineraries, find the best destinations, and plan your dream vacation effortlessly with the power of AI.
            </p>

            <div className="flex flex-col gap-4 mt-8 w-full max-w-3xl">
                {Suggestions.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => onSuggestionSelect && onSuggestionSelect(item.title)}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-900 border border-white/5 hover:border-blue-500/50 transition cursor-pointer hover:bg-neutral-800"
                    >
                        {item.icon}
                        <span className="font-medium text-white">{item.title}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EmptyBoxState;
