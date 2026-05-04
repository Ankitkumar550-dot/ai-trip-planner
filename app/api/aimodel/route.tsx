import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY!,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000", // or your domain
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
- If asking for Starting location, use "source"
- If asking for Destination, use "destination"
- If asking for Group size, use "groupSize"
- If asking for Budget, use "budgetUi"
- If asking for Trip duration (number of days), use "selectDays"
- If asking for Interests or Special Requirements, use "unknown"
- When you have ALL details and are ready to generate the trip plan, use "finalUi" and say "Great, I have all the details. I will now generate your trip plan!"

Response format (STRICT JSON ONLY, NO COMMENTS):
{
  "resp": "your message to user",
  "ui": "insert ui string here based on the mapping above"
}
`;

const FINAL_PROMPT = `
You are an AI travel agent. Based on the conversation history, generate a comprehensive JSON trip plan.
Do NOT wrap the JSON in markdown formatting. Ensure it is strict valid JSON.

Response format (STRICT JSON ONLY):
{
  "destination": "Name of the destination",
  "budget": "Budget category",
  "group_size": "Group size",
  "duration": "Trip duration",
  "origin": "Starting location",
  "hotels": [
    { 
      "hotel_name": "Hotel Name", 
      "rating": 5, 
      "price_per_night": "$100/night", 
      "description": "Brief description",
      "hotel_address": "Address",
      "hotel_image_url": "Image URL",
      "geo_coordinates": {"latitude": 0, "longitude": 0}
    }
  ],
  "itinerary": [
    { 
      "day": 1, 
      "day_plan": "Brief summary of day 1 activities",
      "best_time_to_visit_day": "Morning",
      "activities": [
        {
          "place_name": "Place Name",
          "place_details": "Description",
          "place_image_url": "Image URL",
          "geo_coordinates": {"latitude": 0, "longitude": 0},
          "place_address": "Address",
          "ticket_pricing": "Price",
          "time_travel_each_location": "Time",
          "best_time_to_visit": "Time"
        }
      ]
    }
  ]
}
CRITICAL RULES FOR GENERATION:
1. You MUST generate an itinerary that covers the entire "duration" requested by the user. If they ask for 3 days, generate Day 1, Day 2, and Day 3.
2. For EACH day in the itinerary, you MUST generate AT LEAST 4 activities in the "activities" array. Do not generate fewer than 4 activities per day.
3. Keep descriptions brief and concise to reduce processing time!
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, isFinal } = body;

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { success: false, message: "Invalid messages format" },
        { status: 400 }
      );
    }

    // Call AI
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash",
      max_tokens: 8000,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: isFinal ? FINAL_PROMPT : PROMPT,
        },
        ...messages,
      ],
    });

    const rawMessage = completion.choices?.[0]?.message?.content || "";

    console.log("🤖 AI Raw Response:", rawMessage);

    let parsed;
    let cleanedMessage = rawMessage.replace(/```json/gi, "").replace(/```/g, "").trim();

    try {
      parsed = JSON.parse(cleanedMessage);
    } catch {
      parsed = null;
    }

    let uiValue = parsed?.ui || "unknown";

    // Aggressive Fallback: Catch hallucinated strings or missing keys
    if (
      uiValue.toLowerCase().includes("finalui") ||
      (uiValue === "unknown" &&
        (parsed?.resp?.toLowerCase()?.includes("generate") ||
          parsed?.resp?.toLowerCase()?.includes("all the details") ||
          rawMessage?.toLowerCase()?.includes("generate") ||
          rawMessage?.toLowerCase()?.includes("all the details")))
    ) {
      uiValue = "finalUi";
    }

    if (isFinal) {
      if (!parsed) {
        // If the AI failed to generate valid JSON, wrap its raw output in our expected format
        return NextResponse.json({
          destination: "Generated Trip",
          itinerary: [],
          tripPlan: rawMessage // Let the frontend at least display the raw text if parsing completely failed
        });
      }
      return NextResponse.json(parsed);
    }

    return NextResponse.json({
      success: true,
      resp:
        parsed?.resp ||
        rawMessage || // ✅ fallback to raw AI text
        "No response from AI",
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