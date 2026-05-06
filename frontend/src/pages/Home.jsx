import React from "react";
import Hero from "../components/Hero";
import { PopularCityList } from "../components/PopularCityList";

function Home() {
  return (
    <div className="pt-20">
      <Hero />
      <PopularCityList />
    </div>
  );
}

export default Home;
