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
You must generate at least 3 hotel options and a detailed daily itinerary with at least 2 activities per day.

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
    const models = [
      "google/gemini-2.0-flash-001",
      "google/gemini-2.0-flash-lite-preview-02-05",
      "google/gemini-flash-1.5-8b",
      "deepseek/deepseek-chat",
      "meta-llama/llama-3.3-70b-instruct",
    ];

  let lastError: any = null;

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

    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ MISSING OPENAI_API_KEY");
      return NextResponse.json({ success: false, message: "Server configuration error: Missing API Key" }, { status: 500 });
    }

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
        console.log(`✅ AI Response Received (${currentModel}):`, rawMessage);

        // ✅ Robust JSON Cleaning
        let cleanedMessage = rawMessage
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .trim();

        let parsed;
        try {
          parsed = JSON.parse(cleanedMessage);
        } catch {
          // If JSON.parse fails, try to extract JSON with regex
          const jsonMatch = cleanedMessage.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              parsed = JSON.parse(jsonMatch[0]);
            } catch {
              parsed = null;
            }
          } else {
            parsed = null;
          }
        }

        let uiValue = parsed?.ui || "unknown";

        // ✅ Smart fallback for UI
        if (
          (uiValue.toLowerCase().includes("finalui") || uiValue === "unknown") &&
          (rawMessage.toLowerCase().includes("generate") || rawMessage.toLowerCase().includes("all the details") || isFinal)
        ) {
          uiValue = "finalUi";
        }

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
        lastError = error;
        const status = error?.status || error?.response?.status;
        console.warn(`⚠️ Attempt ${attempt} failed with status ${status}:`, error?.message);

        // If it's a 429, 404 or 5xx, try the next model after a short delay
        if (status === 429 || status === 404 || status >= 500) {
          if (i < models.length - 1) {
            console.log(`🔄 Retrying with next model in 1s...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Incremental delay
            continue;
          }
        } else {
          // For other errors (400, 401, etc.), don't retry as they are likely permanent
          break;
        }
      }
    }

    // If we get here, all models failed
    throw lastError || new Error("All AI models failed to respond");

  } catch (error: any) {
    console.error("❌ Final API Error:", error);
    const status = error?.status || 500;
    
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Something went wrong after multiple attempts",
        code: error?.code || "INTERNAL_ERROR"
      },
      { status: status }
    );
  }
}
