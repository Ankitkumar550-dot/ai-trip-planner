import React from "react";
import { Carousel, Card } from "./ui/apple-cards-carousel";

export function PopularCityList() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white">
          🌍 Explore Popular Destinations
        </h2>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl">
          Discover breathtaking cities around the world and plan your next
          unforgettable journey.
        </p>
      </div>

      <div className="mt-12">
        <Carousel items={cards} />
      </div>
    </div>
  );
}

const TravelContent = ({ description }) => {
  return (
    <div className="bg-white dark:bg-neutral-800 p-8 md:p-12 rounded-3xl shadow-xl">
      <p className="text-neutral-700 dark:text-neutral-300 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto text-center">
        {description}
      </p>
    </div>
  );
};

const data = [
  {
    category: "Paris, France",
    title: "Romantic Escape to the City of Lights",
    src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2070&auto=format&fit=crop",
    content: (
      <TravelContent description="Experience the magic of the Eiffel Tower, charming cafés, and beautiful Seine river cruises in Paris." />
    ),
  },
  {
    category: "Dubai, UAE",
    title: "Luxury & Desert Adventures",
    src: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=2070&auto=format&fit=crop",
    content: (
      <TravelContent description="Explore iconic skyscrapers, desert safaris, and world-class shopping in the glamorous city of Dubai." />
    ),
  },
  {
    category: "New York, USA",
    title: "The City That Never Sleeps",
    src: "https://images.unsplash.com/photo-1496588152823-86ff7695b7c5?q=80&w=2070&auto=format&fit=crop",
    content: (
      <TravelContent description="Visit Times Square, Central Park, and the Statue of Liberty in the vibrant heart of America." />
    ),
  },
  {
    category: "Tokyo, Japan",
    title: "Tradition Meets Technology",
    src: "https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=2070&auto=format&fit=crop",
    content: (
      <TravelContent description="Discover ancient temples, neon-lit streets, and delicious sushi in the futuristic city of Tokyo." />
    ),
  },
  {
    category: "Rome, Italy",
    title: "Walk Through Ancient History",
    src: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=2070&auto=format&fit=crop",
    content: (
      <TravelContent description="Explore the Colosseum, Vatican City, and stunning Roman architecture filled with history." />
    ),
  },
  {
    category: "Bali, Indonesia",
    title: "Tropical Paradise Awaits",
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2070&auto=format&fit=crop",
    content: (
      <TravelContent description="Relax on pristine beaches, visit lush rice terraces, and enjoy peaceful island vibes in Bali." />
    ),
  },
];
