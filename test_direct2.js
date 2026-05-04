const OpenAI = require("openai");

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
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

async function test() {
  const completion = await openai.chat.completions.create({
    model: "google/gemini-2.5-flash",
    max_tokens: 1500,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: PROMPT,
      },
      { role: "user", content: "I want to travel" }
    ],
  });

  console.log(completion.choices[0].message.content);
}
test();
