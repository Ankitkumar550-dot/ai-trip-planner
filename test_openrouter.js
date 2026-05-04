

async function test() {
  const apiKey = process.env.OPENAI_API_KEY;
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      max_tokens: 1500,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: 'Say hello in JSON { "message": "hello" }' }]
    })
  });
  const data = await res.json();
  console.log(data.choices?.[0]?.message);
}
test();
