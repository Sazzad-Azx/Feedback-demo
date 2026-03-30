export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { headline, fullText, existingTopics } = req.body || {};
  if (!headline && !fullText) {
    return res.status(400).json({ error: "Missing 'headline' or 'fullText'" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENAI_API_KEY not configured" });
  }

  // ─── 6-month optimization ─────────────────────────────────────
  // existingTopics is expected as an array of { topic, date } objects
  // where date is the most recent feedback date for that topic.
  // We only send topics from the last 6 months to reduce token usage.
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const cutoff = sixMonthsAgo.toISOString().slice(0, 10);

  let recentTopics = [];
  if (Array.isArray(existingTopics) && existingTopics.length > 0) {
    // Support both formats: array of strings (legacy) or array of {topic, date}
    recentTopics = existingTopics
      .filter(t => {
        if (typeof t === "string") return true; // legacy format — include all
        return t.date >= cutoff; // only include topics with activity in last 6 months
      })
      .map(t => (typeof t === "string" ? t : t.topic));

    // Deduplicate
    recentTopics = [...new Set(recentTopics)];
  }

  const topicList = recentTopics.length > 0
    ? recentTopics.map((t, i) => `${i + 1}. "${t}"`).join("\n")
    : "(none yet)";

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
        max_tokens: 100,
        messages: [
          {
            role: "system",
            content: `You are a feedback grouping assistant for a fintech/prop trading company. Your job is to determine if a new piece of feedback matches an existing common topic, or if it's entirely new.

IMPORTANT: Only process genuine feedback or suggestions — where the customer is explicitly giving their opinion, recommendation, or request for improvement directed at us. If the text is just a problem report or support request (e.g., "my coupon code isn't working", "I can't log in"), return {"common_topic": null, "is_feedback": false}.

Here are the existing topics (from the last 6 months only):
${topicList}

Rules:
- If the new feedback is about the SAME core issue as an existing topic (even if worded differently), return that exact existing topic string.
- If it's a genuinely new issue not covered by any existing topic, create a short label (3-8 words) that captures the core problem or suggestion.
- Return a JSON object with: "common_topic" (the topic string or null) and "is_feedback" (true/false).
- No markdown, no extra text, only valid JSON.`,
          },
          {
            role: "user",
            content: `Headline: ${headline}\n\nFull text: ${fullText}`,
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
    const result = JSON.parse(content);

    return res.status(200).json({
      common_topic: result.common_topic || null,
      is_feedback: result.is_feedback ?? true,
      topics_compared: recentTopics.length,
      tokens_used: data.usage?.total_tokens || 0,
    });
  } catch (err) {
    return res.status(500).json({ error: "Grouping failed", details: err.message });
  }
}
