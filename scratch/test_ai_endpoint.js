async function testPollinations() {
  const prompt = "Answer in 1 line: Who is Gopal Maddheshiya?";
  const messages = [
    { role: "system", content: "You are the AI assistant for Gopal Maddheshiya, a B.Tech CSE student at SRMU with 174+ LeetCode problems in Java." },
    { role: "user", content: prompt }
  ];

  const startTime = Date.now();
  try {
    const res = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages,
        model: "openai",
        seed: 42
      })
    });

    const text = await res.text();
    console.log("Status:", res.status, "Time:", Date.now() - startTime, "ms");
    console.log("Response:", text);
  } catch (err) {
    console.error("Pollinations error:", err);
  }
}

testPollinations();
