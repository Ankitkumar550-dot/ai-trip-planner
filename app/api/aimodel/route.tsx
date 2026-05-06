import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { aj } from "@/lib/arcjet";
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

Ask questions one by one in this order and wait for user response:

1. Starting location (source)
2. Destination city or country
3. Group size (solo, couple, family, friends)
4. Budget (Low, Medium, High)
5. Trip duration (number of days)
6. Trip interests (adventure, sightseeing, cultural, food, nightlife, relaxation)
7. Special requirements or preferences

Rules:
- Ask ONLY one question at a time
- Be friendly and conversational
- Do NOT skip steps

CRITICAL UI MAPPING RULE:
You MUST return the exact "ui" string corresponding to the question you are currently asking:
- source
- destination
- groupSize
- budgetUi
- selectDays
- unknown
- finalUi

Response format (STRICT JSON ONLY):
{
  "resp": "your message to user",
  "ui": "insert ui string here"
}
`;

const FINAL_PROMPT = `
You are an AI travel agent. Based on the conversation history, generate a comprehensive JSON trip plan.
You must generate at least 3 hotel options and a detailed daily itinerary with at least 2 activities per day.

Response format (STRICT JSON ONLY):
{
  "destination": "Name of the destination",
  "budget": "Budget category",
  "group_size": "Group size",
  "duration": "Trip duration",
  "origin": "Starting location",
  "hotels": [
    {
      "hotel_name": "string",
      "hotel_address": "string",
      "price_per_night": "string",
      "hotel_image_url": "string",
      "geo_coordinates": { "latitude": 0, "longitude": 0 },
      "rating": 5,
      "description": "string"
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "day_plan": "string",
      "best_time_to_visit_day": "string",
      "activities": [
        {
          "place_name": "string",
          "place_details": "string",
          "place_image_url": "string",
          "geo_coordinates": { "latitude": 0, "longitude": 0 },
          "place_address": "string",
          "ticket_pricing": "string",
          "time_travel_each_location": "string",
          "best_time_to_visit": "string"
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
    // Clerk's has() expects a permission or role key, not a custom plan key.
    // We wrap it in try-catch to prevent any further Clerk API errors.
    let hasPremiumAccess = false;
    try {
      hasPremiumAccess = has({ permission: 'plan:Monthly' });
    } catch (e) {
      console.warn("Clerk permission check failed:", e);
    }
    console.log("hasPremiumAccess", hasPremiumAccess);
    const { messages, isFinal } = body;

    // ✅ Validate input
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { success: false, message: "Invalid messages format" },
        { status: 400 }
      );
    }

    // ✅ Arcjet Protection FIXED
    const decision = await aj.protect(req, {
      userId: user?.primaryEmailAddress?.emailAddress || "anonymous",
      requested: isFinal ? 5 : 1,
    });

    if (decision.isDenied() && !hasPremiumAccess) {
      return NextResponse.json({
        resp: "No free credit remaining",
        ui: "limit",
      });
    }

    // ✅ Call AI
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash",
      max_tokens: 6000,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: isFinal ? FINAL_PROMPT : PROMPT,
        },
        ...messages,
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