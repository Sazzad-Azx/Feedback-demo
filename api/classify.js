export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { text } = req.body || {};
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Missing 'text' field" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENAI_API_KEY not configured" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0,
        max_tokens: 150,
        messages: [
          {
            role: "system",
            content: `You are a customer feedback classifier for a fintech/prop trading company. Analyze the feedback text and return a JSON object with exactly these fields:
- "sentiment": one of "Positive", "Negative", or "Neutral"
- "confidence": a number 0-100 representing confidence
- "reason": a one-sentence explanation of why this sentiment was chosen

Only return valid JSON, no markdown or extra text.`,
          },
          {
            role: "user",
            content: text,
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(502).json({ error: "OpenAI API error", details: err });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    // Parse the JSON response from GPT
    const result = JSON.parse(content);
    return res.status(200).json({
      sentiment: result.sentiment,
      confidence: result.confidence,
      reason: result.reason,
      tokens_used: data.usage?.total_tokens || 0,
    });
  } catch (err) {
    return res.status(500).json({ error: "Classification failed", details: err.message });
  }
}
