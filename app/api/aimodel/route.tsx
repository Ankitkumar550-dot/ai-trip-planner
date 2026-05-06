import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { aj } from "../arcjet/route";
import { auth, currentUser } from "@clerk/nextjs/server";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY!,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "AI Trip Planner",
  },
});

const PROMPT = `
You are an AI Trip Planner Agent. Your goal is to help users plan a trip step by step.

You must ask the user for the following information one by one in this exact order:
1. Starting location (origin/source)
2. Destination city or country
3. Group size (solo, couple, family, friends)
4. Budget (Low, Medium, High)
5. Trip duration (number of days)

CRITICAL INSTRUCTIONS:
- Review the chat history carefully. Identify which questions have already been answered.
- Acknowledge the user's last answer, then ask the NEXT question in the list.
- If the user provides a location, accept it and move to the next step.
- Ask ONLY one question at a time. Do NOT ask for multiple things at once.
- Once you have gathered ALL 5 pieces of information, you MUST return "finalUi" for the ui field and say you are generating the trip.

CRITICAL UI MAPPING RULE:
You MUST return the exact "ui" string corresponding to the question you are currently asking:
- source
- destination
- group_size
- budget
- duration
- finalUi

Response format (STRICT JSON ONLY):
{
  "resp": "your message to user",
  "ui": "insert ui string here"
}
`;

const FINAL_PROMPT = `
You are an AI travel agent. Based on the conversation history, generate a comprehensive JSON trip plan.

Response format (STRICT JSON ONLY):
{
  "destination": "Name of the destination",
  "budget": "Budget category",
  "group_size": "Group size",
  "duration": "Trip duration",
  "origin": "Starting location",
  "hotels": [
    {
      "hotel_name": "Name of the hotel",
      "hotel_address": "Full address of the hotel",
      "price_per_night": "Price per night",
      "hotel_image_url": "Image URL of the hotel",
      "geo_coordinates": {
        "latitude": "Latitude as number",
        "longitude": "Longitude as number"
      },
      "rating": "Rating as number",
      "description": "Short description of the hotel"
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "day_plan": "Description of what to do on this day",
      "best_time_to_visit_day": "Morning/Afternoon/Evening",
      "activities": [
        {
          "place_name": "Name of the place",
          "place_details": "Details about the place",
          "place_image_url": "Image URL of the place",
          "geo_coordinates": {
             "latitude": "Latitude as number",
             "longitude": "Longitude as number"
          },
          "place_address": "Address of the place",
          "ticket_pricing": "Price of the ticket",
          "time_travel_each_location": "Time to travel",
          "best_time_to_visit": "Best time to visit"
        }
      ]
    }
  ]
}
`;

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    const body = await req.json();
    const { has } = await auth();
    const hasPremiumAccess = has({ plan: 'Monthly' })
    console.log("hasPremiumAccess", hasPremiumAccess);
    const { messages, isFinal } = body;

    // ✅ Validate input
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { success: false, message: "Invalid messages format" },
        { status: 400 }
      );
    }

    // Clean messages to ensure standard format
    const cleanMessages = messages.map((m: any) => {
      // If the assistant's past message is plain text, let's wrap it in JSON so the AI maintains consistent context
      let contentStr = m.content;
      if (m.role === 'assistant') {
        contentStr = JSON.stringify({
          resp: m.content,
          ui: m.ui || "unknown"
        });
      }
      return {
        role: m.role,
        content: contentStr
      };
    });

    // ✅ Arcjet Protection FIXED
    const decision = await aj.protect(req, {
      userId: user?.primaryEmailAddress?.emailAddress || "anonymous",
      requested: isFinal ? 5 : 1,
    });

    // if (decision.isDenied() && !hasPremiumAccess) {
    //   return NextResponse.json({
    //     resp: "No free credit remaining",
    //     ui: "limit",
    //   });
    // }

    // ✅ Call AI
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      max_tokens: 8000,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: isFinal ? FINAL_PROMPT : PROMPT,
        },
        ...cleanMessages,
      ],
    });

    const rawMessage =
      completion.choices?.[0]?.message?.content || "";

    console.log("🤖 AI Raw Response:", rawMessage);

    // ✅ Clean JSON
    let cleanedMessage = rawMessage
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleanedMessage);
    } catch {
      parsed = null;
    }

    let uiValue = parsed?.ui || "unknown";

    // ✅ Smart fallback
    if (
      uiValue.toLowerCase().includes("finalui") ||
      (uiValue === "unknown" &&
        (rawMessage.toLowerCase().includes("generate") ||
          rawMessage.toLowerCase().includes("all the details")))
    ) {
      uiValue = "finalUi";
    }

    // ✅ Final response
    if (isFinal) {
      if (!parsed) {
        return NextResponse.json({
          destination: "Generated Trip",
          itinerary: [],
          tripPlan: rawMessage,
        });
      }
      return NextResponse.json(parsed);
    }

    return NextResponse.json({
      success: true,
      resp: parsed?.resp || rawMessage || "No response from AI",
      ui: uiValue,
    });

  } catch (error: any) {
    console.error("❌ API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}