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
- After collecting all details, generate a complete trip plan

Response format (STRICT JSON ONLY):
{
  "resp": "your message to user",
  "ui": "source | destination | groupSizeUi | budget | tripDuration | interests | final"
}
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { success: false, message: "Invalid messages format" },
        { status: 400 }
      );
    }

    // Call AI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: PROMPT,
        },
        ...messages,
      ],
    });

    const rawMessage = completion.choices?.[0]?.message?.content || "";

    console.log("🤖 AI Raw Response:", rawMessage);

    // Safely parse JSON
   let parsed;

try {
  parsed = JSON.parse(rawMessage);
} catch {
  parsed = null;
}

return NextResponse.json({
  success: true,
  resp:
    parsed?.resp ||
    rawMessage || // ✅ fallback to raw AI text
    "No response from AI",
  ui: parsed?.ui || "unknown",
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