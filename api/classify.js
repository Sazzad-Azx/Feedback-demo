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
        model: "gpt-4.1",
        temperature: 0,
        max_tokens: 150,
        messages: [
          {
            role: "system",
            content: `You are a customer feedback classifier for a fintech/prop trading company.

CRITICAL RULE — Only classify something as feedback or suggestion if the customer is EXPLICITLY giving their opinion, recommendation, or request for improvement directed at us. Examples:
- "I suggest adding dark mode" → valid suggestion
- "Your payout process is too slow, please improve it" → valid feedback
- "It would be great if you added MT5" → valid suggestion
- "I really appreciate how fast support responded" → valid feedback (positive)

Do NOT classify as feedback or suggestion if the customer is simply reporting a problem or asking for help:
- "My coupon code isn't working" → support issue, NOT feedback
- "I can't log in after resetting my password" → problem report, NOT feedback
- "My balance is showing the wrong amount" → bug report, NOT feedback

Return a JSON object with exactly these fields:
- "is_feedback": true if this is genuine feedback or suggestion directed at us, false if it's just a problem report or support request
- "type": one of "feedback", "suggestion", or "none" — use "none" if is_feedback is false
- "sentiment": one of "Positive", "Negative", or "Neutral"
- "confidence": a number 0-100 representing confidence
- "reason": a one-sentence explanation of your classification
- "priority": one of "High", "Medium", or "Low" based on these rules:
  - "High": bugs, broken features, money/payout issues, security concerns, account access problems, data loss, compliance violations
  - "Medium": feature requests, documentation issues, process improvements, UX complaints, non-critical suggestions
  - "Low": positive feedback, compliments, minor cosmetic requests, general praise

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
      is_feedback: result.is_feedback ?? true,
      type: result.type || "none",
      sentiment: result.sentiment,
      confidence: result.confidence,
      reason: result.reason,
      priority: result.priority || "Medium",
      tokens_used: data.usage?.total_tokens || 0,
    });
  } catch (err) {
    return res.status(500).json({ error: "Classification failed", details: err.message });
  }
}
