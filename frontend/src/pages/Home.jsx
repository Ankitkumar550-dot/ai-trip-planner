import React from "react";
import Hero from "../components/Hero";
import { PopularCityList } from "../components/PopularCityList";

function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Background Pattern specifically for Home Page */}
      <div className="relative z-10 pt-20">
        <Hero />
        <PopularCityList />
      </div>
    </div>
  );
}

export default Home;
