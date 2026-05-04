const OpenAI = require("openai");

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

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
    { "name": "Hotel Name", "rating": "5 Stars", "price": "$100/night", "description": "Brief description" }
  ],
  "itinerary": [
    { "day": 1, "plan": "Brief summary of day 1 activities" },
    { "day": 2, "plan": "Brief summary of day 2 activities" }
  ]
}
Keep descriptions brief and concise to reduce processing time!
`;

async function test() {
  const completion = await openai.chat.completions.create({
    model: "google/gemini-2.5-flash",
    max_tokens: 1500,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: FINAL_PROMPT },
      { role: "user", content: "I want to go to Paris." },
      { role: "assistant", content: "Great! How many days?" },
      { role: "user", content: "3 days." },
      { role: "assistant", content: "Who is going?" },
      { role: "user", content: "Family." },
      { role: "assistant", content: "Budget?" },
      { role: "user", content: "Medium." },
      { role: "assistant", content: "Great, I have all the details. I will now generate your trip plan!" }
    ],
  });

  console.log(completion.choices[0].message.content);
}
test();
