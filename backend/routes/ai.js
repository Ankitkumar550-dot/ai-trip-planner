const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const arcjet = require("@arcjet/node").default;
const { tokenBucket } = require("@arcjet/node");

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5173",
    "X-Title": "AI Trip Planner",
  },
});

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    tokenBucket({
      mode: "LIVE",
      characteristics: ["userId"],
      refillRate: 5,
      interval: 86400,
      capacity: 25,
    }),
  ],
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
  "route_plan": {
    "summary": "Overall travel strategy summary",
    "steps": [
      {
        "type": "Taxi/Train/Flight/Bus",
        "description": "Step description (e.g., Mathura to Delhi)",
        "distance": "Distance estimate",
        "duration": "Time estimate",
        "price_estimate": "Price range",
        "additional_info": "Any useful tips or details"
      }
    ]
  },
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

router.post('/', async (req, res) => {
  const models = [
    "google/gemini-2.0-flash-001",
    "google/gemini-2.0-flash-lite-preview-02-05",
    "google/gemini-flash-1.5-8b",
    "deepseek/deepseek-chat",
    "meta-llama/llama-3.3-70b-instruct",
  ];

  let lastError = null;

  try {
    const { messages, isFinal, userId } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ success: false, message: "Server configuration error: Missing API Key" });
    }

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: "Invalid messages format" });
    }

    const cleanMessages = messages.map((m) => {
      let contentStr = m.content;
      if (m.role === 'assistant' && typeof m.content === 'string' && !m.content.trim().startsWith('{')) {
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

    for (let i = 0; i < models.length; i++) {
      const currentModel = models[i];
      const attempt = i + 1;

      try {
        const completion = await openai.chat.completions.create({
          model: currentModel,
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

        const rawMessage = completion.choices?.[0]?.message?.content || "";
        let cleanedMessage = rawMessage.replace(/```json/gi, "").replace(/```/g, "").trim();

        let parsed;
        try {
          parsed = JSON.parse(cleanedMessage);
        } catch {
          const jsonMatch = cleanedMessage.match(/\{[\s\S]*\}/);
          parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        }

        let uiValue = parsed?.ui || "unknown";

        if (
          (uiValue.toLowerCase().includes("finalui") || uiValue === "unknown") &&
          (rawMessage.toLowerCase().includes("generate") || rawMessage.toLowerCase().includes("all the details") || isFinal)
        ) {
          uiValue = "finalUi";
        }

        if (isFinal) {
          if (!parsed) {
            return res.json({
              destination: "Generated Trip",
              itinerary: [],
              tripPlan: rawMessage,
            });
          }
          return res.json(parsed);
        }

        return res.json({
          success: true,
          resp: parsed?.resp || rawMessage || "No response from AI",
          ui: uiValue,
        });

      } catch (error) {
        lastError = error;
        const status = error?.status;
        if (status === 429 || status === 404 || status >= 500) {
          if (i < models.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            continue;
          }
        } else {
          break;
        }
      }
    }

    throw lastError || new Error("All AI models failed to respond");

  } catch (error) {
    console.error("❌ Final API Error:", error);
    res.status(error?.status || 500).json({
      success: false,
      message: error?.message || "Something went wrong after multiple attempts",
      code: error?.code || "INTERNAL_ERROR"
    });
  }
});

module.exports = router;
