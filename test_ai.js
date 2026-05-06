const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const apiKey = env.split('\n').find(line => line.startsWith('OPENAI_API_KEY')).split('=')[1].trim();

const OpenAI = require('openai');
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: apiKey,
});
async function main() {
  const completion = await openai.chat.completions.create({
    model: 'google/gemini-2.5-flash',
    max_tokens: 7000,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `You are an AI travel agent. Based on the conversation history, generate a comprehensive JSON trip plan.
Response format (STRICT JSON ONLY):
{
  "destination": "Name of the destination",
  "budget": "Budget category",
  "group_size": "Group size",
  "duration": "Trip duration",
  "origin": "Starting location",
  "hotels": [],
  "itinerary": []
}`
      },
      { role: 'user', content: 'Trip to Tokyo from New York for a couple for 5 days with medium budget.' }
    ],
  });
  console.log(completion.choices[0].message.content);
}
main().catch(console.error);
