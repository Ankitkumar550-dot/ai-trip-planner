"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Loader, Send } from "lucide-react";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import GroupSizeUi from "./GroupSizeUi";
import BudgetUi from "./BudgetUi";
import SelectDaysUi from "./SelectDaysUi";
import FinalUi from "./FinalUi";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import EmptyBoxState from "./EmptyBoxState";
import { useTripDetail, useUserDetail } from "@/app/provider";

interface Message {
  role: string;
  content: string;
  ui?: string;
}

export interface TripInfo {
  destination: string;
  budget: string;
  group_size: string;
  duration: string;
  origin: string;
  route_plan?: {
    summary: string;
    steps: {
      type: string;
      description: string;
      distance: string;
      duration: string;
      price_estimate: string;
      additional_info?: string;
    }[];
  };
  hotels?: Hotel[];
  hotel_options?: Hotel[];
  hotel_recommendations?: Hotel[];
  hotelRecommendations?: Hotel[];
  itinerary: Itinerary[];
}

export type Hotel = {
  hotel_name: string;
  hotel_address: string;
  price_per_night: string;
  price?: string; // Fallback for some models
  hotel_image_url: string;
  geo_coordinates: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  description: string;
};

export type Activity = {
  place_name: string;
  place_details: string;
  place_image_url: string;
  geo_coordinates: {
    latitude: number;
    longitude: number;
  };
  place_address: string;
  ticket_pricing: string;
  time_travel_each_location: string;
  best_time_to_visit: string;

};

export type Itinerary = {
  day: number;
  day_plan: string;
  best_time_to_visit_day: string;
  activities: Activity[];

};
function ChatBox({ externalInput, onTripPlanGenerate }: { externalInput?: string; onTripPlanGenerate?: (plan: string) => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const saveTripDetails = useMutation(api.tripDetail.CreateTripDeatils);
  const [isFinal, setIsFinal] = useState(false);
  const [tripDetail, setTripDetail] = useState<TripInfo>();
  const [tripId, setTripId] = useState<string | null>(null);
  const { userDetail, setUserDetail } = useUserDetail();
  //@ts-ignore
  const { tripDetailInfo, setTripDetailInfo } = useTripDetail();

  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (externalInput) {
      setUserInput(externalInput);
    }
  }, [externalInput]);

  const onSend = async (customInput?: string) => {
    try {
      const inputToSend = customInput || userInput;
      if (!inputToSend?.trim()) return;

      setLoading(true);

      const newMsg: Message = {
        role: "user",
        content: inputToSend ?? ' '
      };

      const updatedMessages = [...messages, newMsg];

      setMessages(updatedMessages);
      setUserInput("");

      const result = await axios.post("/api/aimodel", {
        messages: updatedMessages,
        isFinal: isFinal
      });
      console.log("Trip", result.data);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result?.data?.resp || "",
          ui: result?.data?.ui,
        },
      ]);

      const responseUi = (result?.data?.ui || "").toLowerCase().trim();

      if (responseUi === "final" || responseUi === "finalui") {
        try {
          console.log("TRIGGERING SECOND API CALL FOR FINAL JSON");
          // Trigger the second API call to get the full JSON trip plan
          const finalResult = await axios.post("/api/aimodel", {
            messages: updatedMessages,
            isFinal: true
          });

          console.log("FINAL JSON RECEIVED:", finalResult.data);

          if (Object.keys(finalResult.data).length === 0) {
            console.warn("AI returned empty JSON for the final trip plan!");
          }

          const planJsonText = JSON.stringify(finalResult.data, null, 2);
          onTripPlanGenerate?.(planJsonText);

          const docId = uuidv4();
          await saveTripDetails({
            tripId: docId,
            userEmail: user?.primaryEmailAddress?.emailAddress || "",
            tripPlan: planJsonText,
            destination: externalInput || "",
          });
          setTripId(docId);
          console.log("TRIP SAVED SUCCESSFULLY WITH ID:", docId);
          setTripDetailInfo(finalResult?.data?.trip_plan || finalResult?.data);

          // Automatically navigate to the beautiful trip details page!
          if (docId) {
            router.push(`/trip-details/${docId}`);
          }
        } catch (e: any) {
          console.error("Failed to generate or save final trip plan", e);
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `Error saving trip: ${e.message || String(e)}`,
            },
          ]);
        }
      }

      console.log(result.data);
      setLoading(false);
    } catch (error: any) {
      console.error("❌ FRONTEND ERROR:", error);
      
      let errorMessage = "⚠️ Something went wrong. Please try again.";
      
      if (error?.response?.status === 429) {
        errorMessage = "🚀 AI is a bit busy right now (High Traffic). I'm trying to switch to a backup model, please try sending your message again in a moment.";
      } else if (error?.response?.data?.message) {
        errorMessage = `⚠️ ${error.response.data.message}`;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage,
        },
      ]);

      setLoading(false);
    }
  };

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const RenderGenerativeUi = (ui: string) => {
    const normalizedUi = ui?.toLowerCase()?.trim() || "";

    if (normalizedUi === "budgetui" || normalizedUi === "budget") {
      return (
        <BudgetUi
          onSelectedOption={(v: string) => {
            setUserInput(v);
            onSend(v);
          }}
        />
      );
    } else if (normalizedUi === "groupsize" || normalizedUi === "group_size") {
      return (
        <GroupSizeUi
          onSelectedOption={(v: string) => {
            setUserInput(v);
            onSend(v);
          }}
        />
      );
    } else if (normalizedUi === "selectdays" || normalizedUi === "duration") {
      return (
        <SelectDaysUi
          onSelectedOption={(v: string) => {
            setUserInput(v);
            onSend(v);
          }}
        />
      );
    } else if (normalizedUi === "finalui" || normalizedUi === "final") {
      return (
        <FinalUi
          loading={!tripId}
          viewTrip={() => {
            if (tripId) {
              router.push(`/trip-details/${tripId}`);
            }

          }}

        />
      );
    }

    return null;
  }

  return (
    <div className="h-[85vh] flex flex-col bg-secondary border rounded-2xl p-5">
      {/* Chat Messages */}
      <section className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <EmptyBoxState onSuggestionSelect={(suggestion) => {
            setUserInput(suggestion);
            onSend(suggestion);
          }} />
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`max-w-lg px-4 py-2 rounded-lg ${msg.role === "user"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-black"
                  }`}
              >
                {msg.content}
                {RenderGenerativeUi(msg.ui ?? "")}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </section>

      {/* Input Box */}
      <section>
        <div className="relative flex justify-center">
          <div className="w-full md:w-3/4 backdrop-blur-xl bg-white/70 dark:bg-neutral-800/60 border border-white/30 shadow-2xl rounded-3xl p-4">
            <Textarea
              placeholder="Start Typing Here...."
              className="w-full h-24 bg-transparent focus:outline-none resize-none"
              onChange={(e) => setUserInput(e.target.value)}
              value={userInput}
            />

            <div className="flex justify-end">
              <Button
                size="icon"
                className="mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-full hover:scale-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => onSend()}
                disabled={loading}
              >
                {loading ? <Loader className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ChatBox;