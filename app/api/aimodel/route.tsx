import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { aj } from "../arcjet/route";
import { currentUser } from "@clerk/nextjs/server";

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

Response format (STRICT JSON ONLY):
{
  "destination": "Name of the destination",
  "budget": "Budget category",
  "group_size": "Group size",
  "duration": "Trip duration",
  "origin": "Starting location",
  "hotels": [],
  "itinerary": []
}
`;

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    const body = await req.json();
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

    if (decision.isDenied()) {
      return NextResponse.json({
        resp: "No free credit remaining",
        ui: "limit",
      });
    }

    // ✅ Call AI
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