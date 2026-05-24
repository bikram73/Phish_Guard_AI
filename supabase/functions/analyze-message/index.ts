import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Phishing/spam keyword categories with weights
const PHISHING_PATTERNS = {
  urgency: {
    keywords: ["urgent", "immediately", "act now", "limited time", "expires", "deadline", "hurry", "asap", "quick", "fast", "now"],
    weight: 0.15
  },
  financial: {
    keywords: ["won", "winner", "prize", "cash", "money", "reward", "free", "bonus", "jackpot", "lottery", "million", "thousand", "dollar", "$", "£", "€", "bitcoin", "crypto", "investment", "profit", "income", "earn"],
    weight: 0.2
  },
  credentialHarvesting: {
    keywords: ["password", "username", "login", "verify", "confirm", "account", "suspended", "blocked", "locked", "security", "update your", "validate", "click here", "click link", "sign in", "log in"],
    weight: 0.2
  },
  threats: {
    keywords: ["suspended", "terminated", "closed", "deleted", "banned", "illegal", "legal action", "lawsuit", "arrest", "police", "fbi", "irs", "tax", "debt", "overdue"],
    weight: 0.18
  },
  impersonation: {
    keywords: ["bank", "paypal", "amazon", "microsoft", "apple", "google", "netflix", "government", "official", "authorized", "certified", "verified"],
    weight: 0.12
  },
  links: {
    keywords: ["http://", "https://", "www.", ".com/", "bit.ly", "tinyurl", "click", "link", "url", "website", "site"],
    weight: 0.1
  },
  personal: {
    keywords: ["dear customer", "dear user", "dear friend", "congratulations", "selected", "chosen", "lucky", "special offer", "exclusive"],
    weight: 0.05
  }
};

const HAM_INDICATORS = {
  casual: ["hey", "hi", "hello", "how are", "what's up", "thanks", "thank you", "ok", "okay", "sure", "sounds good", "see you", "bye", "later", "tomorrow", "yesterday", "today"],
  personal: ["mom", "dad", "brother", "sister", "friend", "colleague", "meeting", "lunch", "dinner", "coffee", "weekend", "holiday"],
  neutral: ["the", "a", "an", "is", "are", "was", "were", "have", "has", "will", "would", "could", "should", "can", "may", "might"]
};

interface AnalysisResult {
  prediction: string;
  confidence: string;
  confidenceScore: number;
  threatLevel: string;
  keywords: string[];
  categories: string[];
  explanation: string;
  recommendation: string;
}

function preprocessText(text: string): string {
  return text.toLowerCase().replace(/[^\w\s$£€@.]/g, " ").replace(/\s+/g, " ").trim();
}

function extractKeywords(text: string): string[] {
  const found: string[] = [];
  const lower = text.toLowerCase();

  for (const category of Object.values(PHISHING_PATTERNS)) {
    for (const keyword of category.keywords) {
      if (lower.includes(keyword) && !found.includes(keyword)) {
        found.push(keyword);
      }
    }
  }

  return found.slice(0, 8);
}

function detectCategories(text: string): string[] {
  const lower = text.toLowerCase();
  const detected: string[] = [];

  const categoryNames: Record<string, string> = {
    urgency: "Urgency Manipulation",
    financial: "Financial Lure",
    credentialHarvesting: "Credential Harvesting",
    threats: "Threat/Fear Tactic",
    impersonation: "Brand Impersonation",
    links: "Suspicious Links",
    personal: "Social Engineering"
  };

  for (const [key, category] of Object.entries(PHISHING_PATTERNS)) {
    const matchCount = category.keywords.filter(k => lower.includes(k)).length;
    if (matchCount >= 1) {
      detected.push(categoryNames[key]);
    }
  }

  return detected;
}

function calculateScore(text: string): number {
  const lower = preprocessText(text);
  let score = 0;
  let hamScore = 0;

  // Calculate phishing score
  for (const category of Object.values(PHISHING_PATTERNS)) {
    const matches = category.keywords.filter(k => lower.includes(k)).length;
    if (matches > 0) {
      score += category.weight * Math.min(matches, 3) / 3;
    }
  }

  // Check ham indicators to reduce score
  for (const indicators of Object.values(HAM_INDICATORS)) {
    const hamMatches = indicators.filter(k => lower.includes(k)).length;
    hamScore += hamMatches * 0.05;
  }

  // Additional heuristics
  const exclamations = (text.match(/!/g) || []).length;
  if (exclamations > 2) score += 0.1;

  const allCaps = (text.match(/\b[A-Z]{3,}\b/g) || []).length;
  if (allCaps > 1) score += 0.08;

  const hasUrl = /https?:\/\/|www\./i.test(text);
  if (hasUrl) score += 0.1;

  const hasPhone = /\d{10,}|\(\d{3}\)\s*\d{3}[-.\s]\d{4}/g.test(text);
  if (hasPhone) score += 0.05;

  const wordCount = text.split(/\s+/).length;
  if (wordCount < 5) score *= 0.7;

  score = Math.max(0, score - Math.min(hamScore * 0.3, 0.3));

  return Math.min(Math.round(score * 100), 99);
}

function buildExplanation(score: number, categories: string[], keywords: string[]): string {
  if (score <= 30) {
    return "This message appears to be legitimate. No significant phishing indicators were detected. The content seems consistent with normal communication patterns.";
  } else if (score <= 70) {
    const cats = categories.length > 0 ? categories.slice(0, 2).join(" and ") : "general suspicious patterns";
    return `This message shows moderate risk indicators. Detected: ${cats}. Exercise caution before clicking any links or providing personal information.`;
  } else {
    const kws = keywords.slice(0, 3).join('", "');
    return `High-risk phishing message detected! Found dangerous patterns including "${kws}". This message uses common social engineering tactics to deceive you. Do NOT click any links or provide personal information.`;
  }
}

function buildRecommendation(score: number, categories: string[]): string {
  if (score <= 30) {
    return "This message is likely safe. Continue with normal caution when interacting with any links or attachments.";
  } else if (score <= 70) {
    return "Proceed with caution. Verify the sender's identity through official channels before taking any action. Do not click suspicious links.";
  } else {
    const recs = [];
    if (categories.includes("Credential Harvesting")) recs.push("Never enter passwords or login credentials through this message");
    if (categories.includes("Financial Lure")) recs.push("Do not send money or provide banking details");
    if (categories.includes("Suspicious Links")) recs.push("Do not click any links in this message");
    recs.push("Report this message as phishing/spam to your service provider");
    recs.push("Block the sender immediately");
    return recs.join(". ") + ".";
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const sanitizedMessage = message.slice(0, 2000);
    const score = calculateScore(sanitizedMessage);
    const keywords = extractKeywords(sanitizedMessage);
    const categories = detectCategories(sanitizedMessage);

    let prediction: string;
    let threatLevel: string;

    if (score <= 30) {
      prediction = "Safe";
      threatLevel = "LOW";
    } else if (score <= 70) {
      prediction = "Suspicious";
      threatLevel = "MEDIUM";
    } else {
      prediction = "Phishing";
      threatLevel = "HIGH";
    }

    const result: AnalysisResult = {
      prediction,
      confidence: `${score}%`,
      confidenceScore: score,
      threatLevel,
      keywords,
      categories,
      explanation: buildExplanation(score, categories, keywords),
      recommendation: buildRecommendation(score, categories)
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
