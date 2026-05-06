import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import axios from "axios";
import { Loader, Send } from "lucide-react";
import React, { useState, useEffect, useContext, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import GroupSizeUi from "./GroupSizeUi";
import BudgetUi from "./BudgetUi";
import SelectDaysUi from "./SelectDaysUi";
import FinalUi from "./FinalUi";
import EmptyBoxState from "./EmptyBoxState";
import { UserDetailContext } from "../../context/UserDetailContext";
import { TripDetailContext } from "../../context/TripDetailContext";

function ChatBox({ externalInput, onTripPlanGenerate }) {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const [tripId, setTripId] = useState(null);
  
  const { userDetail } = useContext(UserDetailContext) || {};
  const { setTripDetailInfo } = useContext(TripDetailContext) || {};

  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (externalInput) {
      setUserInput(externalInput);
    }
  }, [externalInput]);

  const onSend = async (customInput) => {
    try {
      const inputToSend = customInput || userInput;
      if (!inputToSend?.trim()) return;

      setLoading(true);

      const newMsg = {
        role: "user",
        content: inputToSend ?? ' '
      };

      const updatedMessages = [...messages, newMsg];
      setMessages(updatedMessages);
      setUserInput("");

      const result = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/ai`, {
        messages: updatedMessages,
        isFinal: isFinal,
        userId: user?.id
      });

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
          const finalResult = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/ai`, {
            messages: updatedMessages,
            isFinal: true,
            userId: user?.id
          });

          const planJsonText = JSON.stringify(finalResult.data, null, 2);
          onTripPlanGenerate?.(planJsonText);

          const docId = uuidv4();
          await axios.post(`${import.meta.env.VITE_BACKEND_URL}/trips`, {
            tripId: docId,
            userEmail: user?.primaryEmailAddress?.emailAddress || "",
            tripPlan: planJsonText,
            destination: externalInput || "",
          });

          setTripId(docId);
          setTripDetailInfo(finalResult?.data);

          if (docId) {
            navigate(`/trip-details/${docId}`);
          }
        } catch (e) {
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

      setLoading(false);
    } catch (error) {
      console.error("❌ FRONTEND ERROR:", error);
      let errorMessage = "⚠️ Something went wrong. Please try again.";
      if (error?.response?.status === 429) {
        errorMessage = "🚀 AI is a bit busy right now. Please try again in a moment.";
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

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const RenderGenerativeUi = (ui) => {
    const normalizedUi = ui?.toLowerCase()?.trim() || "";

    if (normalizedUi === "budgetui" || normalizedUi === "budget") {
      return (
        <BudgetUi
          onSelectedOption={(v) => {
            setUserInput(v);
            onSend(v);
          }}
        />
      );
    } else if (normalizedUi === "groupsize" || normalizedUi === "group_size") {
      return (
        <GroupSizeUi
          onSelectedOption={(v) => {
            setUserInput(v);
            onSend(v);
          }}
        />
      );
    } else if (normalizedUi === "selectdays" || normalizedUi === "duration") {
      return (
        <SelectDaysUi
          onSelectedOption={(v) => {
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
              navigate(`/trip-details/${tripId}`);
            }
          }}
        />
      );
    }
    return null;
  }

  return (
    <div className="h-[85vh] flex flex-col bg-secondary border rounded-2xl p-5">
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
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
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
