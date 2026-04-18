"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Loader, Send } from "lucide-react";
import React, { useState } from "react";
import GroupSizeUi from "./GroupSizeUi";
import BudgetUi from "./BudgetUi";
import SelectDaysUi from "./SelectDaysUi";
import FinalUi from "./FinalUi";

type Message = {
  role: string;
  content: string;
  ui?: string;
}; 

function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onSend = async () => {
    if (!userInput.trim()) return;

    setLoading(true);

    const newMsg: Message = {
      role: "user",
      content: userInput,
    };

    const updatedMessages = [...messages, newMsg];

    setMessages(updatedMessages);
    setUserInput("");

    try {
      const result = await axios.post("/api/aimodel", {
        messages: updatedMessages,
      });

      setMessages((prev: Message[]) => [
        ...prev,
        {
          role: "assistant",
          content: result?.data?.resp || "No response", // ✅ FIXED comma
          ui: result?.data?.ui
        }
      ]);

      console.log(result.data);
      setLoading(false);
    } catch (error: any) {
      console.error("❌ FRONTEND ERROR:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Something went wrong. Please try again.",
        },
      ]);

      setLoading(false);
    }
  };

  const RenderGenerativeUi = (ui: string) => {
  if (ui === "budgetUi") {
    return (
      <BudgetUi
        onSelectedOption={(v: string) => {
          setUserInput(v);
          onSend();
        }}
      />
    );
  } else if (ui === "groupSize") {
    return (
      <GroupSizeUi
        onSelectedOption={(v: string) => {
          setUserInput(v);
          onSend();
        }}
      />
    );
  } else if (ui === "selectDays") {
    return (
      <SelectDaysUi
        onSelectedOption={(v: string) => {
          setUserInput(v);
          onSend();
        }}
      />
    );
  } else if (ui === "finalUi") {
    return (
      <FinalUi
        loading={true}
        viewTrip={() => {
          console.log("View Trip Clicked");
        }}
      />
    );
  }

  return null;
};

  return (
    <div className="h-[85vh] flex flex-col">
      {/* Chat Messages */}
      <section className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-lg px-4 py-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-black"
              }`}
            >
              {msg.content}
              {RenderGenerativeUi(msg.ui ?? "")}
            </div>
          </div>
        ))}
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
                className="mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-full hover:scale-110 transition"
                onClick={onSend}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ChatBox;