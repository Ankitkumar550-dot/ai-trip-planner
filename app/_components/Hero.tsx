"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { ArrowDown, Globe2, Landmark, Plane, Send } from "lucide-react";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const suggestions = [
  "Create a trip to Bali with friends",
  "Plan a trip in Switzerland",
  "Weekend trip to Goa",
  "Adventure trek in Uttarakhand",
];

function Hero() {
  const {user}=useUser();
  const router= useRouter();

  const onSend=()=>{
    if(!user)
    {
      router.push('/sign-in')
      return;
    }
    router.push('create-new-trip')
  }

  return (
    <section className="relative min-h-screen pt-28 flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 px-4 overflow-hidden">
      
      {/* Background Blur */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-400/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-400/30 rounded-full blur-3xl animate-pulse" />

      <div className="relative max-w-4xl w-full text-center space-y-8 z-10">

        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          Hey, I'm your personal{" "}
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Travel Planner
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Tell me your dream destination and I’ll instantly create your
          personalized trip.
        </p>

        {/* Input */}
        <div className="relative flex justify-center">
          <div className="w-full md:w-3/4 backdrop-blur-xl bg-white/70 dark:bg-neutral-800/60 border border-white/30 shadow-2xl rounded-3xl p-4">
            <Textarea
              placeholder="Create a 5-day trip to Paris from India..."
              className="w-full h-24 bg-transparent focus:outline-none resize-none"
            />
            <div className="flex justify-end">
              <Button size={'icon'} className="mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-full hover:scale-110 transition" onClick={() =>onSend()}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {suggestions.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/70 dark:bg-neutral-800/70 backdrop-blur-md border hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white transition cursor-pointer"
            >
              <Globe2 className="h-5 w-5" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center animate-bounce">
          <p>See how it works</p>
          <ArrowDown className="mt-2" />
        </div>

        <div className="mt-8 rounded-3xl overflow-hidden shadow-2xl">
          <HeroVideoDialog
            className="w-full"
            animationStyle="from-center"
            videoSrc="https://www.example.com/dummy-video"
            thumbnailSrc="https://mma.prnewswire.com/media/2401528/1_MindtripProduct.jpg?p=facebook"
            thumbnailAlt="Travel Planner Demo"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;