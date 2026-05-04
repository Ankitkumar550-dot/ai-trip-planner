async function test() {
  const res = await fetch('http://localhost:3000/api/aimodel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'I want to travel to Paris for 3 days with my family. My budget is medium.' }],
      isFinal: true
    })
  });
  console.log(await res.text());
}
test();
