

async function test() {
  console.log("Testing isFinal: false");
  let res = await fetch("http://localhost:3001/api/aimodel", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        { role: "system", content: "..." },
        { role: "user", content: "Delhi" },
        { role: "assistant", content: "Great! Where to?", ui: "destination" },
        { role: "user", content: "Mumbai" },
        { role: "assistant", content: "How many days?", ui: "selectDays" },
        { role: "user", content: "5 days" },
        { role: "assistant", content: "Who are you traveling with?", ui: "groupSize" },
        { role: "user", content: "friends" },
        { role: "assistant", content: "Budget?", ui: "budgetUi" },
        { role: "user", content: "High" },
        { role: "assistant", content: "Interests?", ui: "unknown" },
        { role: "user", content: "food" },
        { role: "assistant", content: "Special requirements?", ui: "unknown" },
        { role: "user", content: "no" }
      ],
      isFinal: false
    })
  });
  let data = await res.json();
  console.log("Result 1:", data);

  if (data.ui === "finalUi" || data.ui === "finalui") {
    console.log("Testing isFinal: true");
    res = await fetch("http://localhost:3001/api/aimodel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "user", content: "Delhi" },
          { role: "user", content: "Mumbai" },
          { role: "user", content: "5 days" },
          { role: "user", content: "friends" },
          { role: "user", content: "High" },
          { role: "user", content: "food" },
          { role: "user", content: "no" }
        ],
        isFinal: true
      })
    });
    const finalData = await res.text();
    console.log("Final Result:", finalData);
  }
}

test();
