import { AnalysisResult, ThreatLevel, Prediction } from '../types';

type SpamModel = {
  version: number;
  priors: {
    spam: number;
    ham: number;
  };
  vocabSize: number;
  tokenCounts: {
    spam: Record<string, number>;
    ham: Record<string, number>;
  };
  totalTokens: {
    spam: number;
    ham: number;
  };
};

type PatternGroup = {
  keywords: string[];
  weight: number;
};

const DEFAULT_PATTERNS: Record<string, PatternGroup> = {
  urgency: {
    keywords: ['urgent', 'immediately', 'act now', 'limited time', 'expires', 'deadline', 'hurry', 'asap', 'quick', 'fast', 'now'],
    weight: 0.15,
  },
  financial: {
    keywords: ['won', 'winner', 'prize', 'cash', 'money', 'reward', 'free', 'bonus', 'jackpot', 'lottery', 'million', 'thousand', 'dollar', '$', '£', '€', 'bitcoin', 'crypto', 'investment', 'profit', 'income', 'earn'],
    weight: 0.2,
  },
  credentialHarvesting: {
    keywords: ['password', 'username', 'login', 'verify', 'confirm', 'account', 'suspended', 'blocked', 'locked', 'security', 'update your', 'validate', 'click here', 'click link', 'sign in', 'log in'],
    weight: 0.2,
  },
  threats: {
    keywords: ['suspended', 'terminated', 'closed', 'deleted', 'banned', 'illegal', 'legal action', 'lawsuit', 'arrest', 'police', 'fbi', 'irs', 'tax', 'debt', 'overdue'],
    weight: 0.18,
  },
  impersonation: {
    keywords: ['bank', 'paypal', 'amazon', 'microsoft', 'apple', 'google', 'netflix', 'government', 'official', 'authorized', 'certified', 'verified'],
    weight: 0.12,
  },
  links: {
    keywords: ['http://', 'https://', 'www.', '.com/', 'bit.ly', 'tinyurl', 'click', 'link', 'url', 'website', 'site'],
    weight: 0.1,
  },
  personal: {
    keywords: ['dear customer', 'dear user', 'dear friend', 'congratulations', 'selected', 'chosen', 'lucky', 'special offer', 'exclusive'],
    weight: 0.05,
  },
};

const HAM_INDICATORS = {
  casual: ['hey', 'hi', 'hello', 'how are', "what's up", 'thanks', 'thank you', 'ok', 'okay', 'sure', 'sounds good', 'see you', 'bye', 'later', 'tomorrow', 'yesterday', 'today'],
  personal: ['mom', 'dad', 'brother', 'sister', 'friend', 'colleague', 'meeting', 'lunch', 'dinner', 'coffee', 'weekend', 'holiday'],
  neutral: ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'have', 'has', 'will', 'would', 'could', 'should', 'can', 'may', 'might'],
};

let cachedModel: SpamModel | null = null;

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s$£€@.]/g, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .filter((token) => token.length > 1 || token === 'a' || token === 'i');
}

function preprocessText(text: string): string {
  return text.toLowerCase().replace(/[^\w\s$£€@.]/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractKeywords(text: string): string[] {
  const found: string[] = [];
  const lower = text.toLowerCase();

  for (const category of Object.values(DEFAULT_PATTERNS)) {
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
    urgency: 'Urgency Manipulation',
    financial: 'Financial Lure',
    credentialHarvesting: 'Credential Harvesting',
    threats: 'Threat/Fear Tactic',
    impersonation: 'Brand Impersonation',
    links: 'Suspicious Links',
    personal: 'Social Engineering',
  };

  for (const [key, category] of Object.entries(DEFAULT_PATTERNS)) {
    const matchCount = category.keywords.filter((keyword) => lower.includes(keyword)).length;
    if (matchCount >= 1) {
      detected.push(categoryNames[key]);
    }
  }

  return detected;
}

function calculateHeuristicScore(text: string): number {
  const lower = preprocessText(text);
  let score = 0;
  let hamScore = 0;

  for (const category of Object.values(DEFAULT_PATTERNS)) {
    const matches = category.keywords.filter((keyword) => lower.includes(keyword)).length;
    if (matches > 0) {
      score += (category.weight * Math.min(matches, 3)) / 3;
    }
  }

  for (const indicators of Object.values(HAM_INDICATORS)) {
    const hamMatches = indicators.filter((keyword) => lower.includes(keyword)).length;
    hamScore += hamMatches * 0.05;
  }

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
    return 'This message appears to be legitimate. No significant phishing indicators were detected. The content seems consistent with normal communication patterns.';
  }

  if (score <= 70) {
    const cats = categories.length > 0 ? categories.slice(0, 2).join(' and ') : 'general suspicious patterns';
    return `This message shows moderate risk indicators. Detected: ${cats}. Exercise caution before clicking any links or providing personal information.`;
  }

  const kws = keywords.slice(0, 3).join('", "');
  return `High-risk phishing message detected! Found dangerous patterns including "${kws}". This message uses common social engineering tactics to deceive you. Do NOT click any links or provide personal information.`;
}

function buildRecommendation(score: number, categories: string[]): string {
  if (score <= 30) {
    return 'This message is likely safe. Continue with normal caution when interacting with any links or attachments.';
  }

  if (score <= 70) {
    return "Proceed with caution. Verify the sender's identity through official channels before taking any action. Do not click suspicious links.";
  }

  const recs: string[] = [];
  if (categories.includes('Credential Harvesting')) recs.push('Never enter passwords or login credentials through this message');
  if (categories.includes('Financial Lure')) recs.push('Do not send money or provide banking details');
  if (categories.includes('Suspicious Links')) recs.push('Do not click any links in this message');
  recs.push('Report this message as phishing/spam to your service provider');
  recs.push('Block the sender immediately');
  return `${recs.join('. ')}.`;
}

async function loadLocalModel(): Promise<SpamModel | null> {
  if (cachedModel) return cachedModel;

  try {
    const response = await fetch('/spam-model.json', { cache: 'no-store' });
    if (!response.ok) return null;
    const model = (await response.json()) as SpamModel;
    cachedModel = model;
    return model;
  } catch {
    return null;
  }
}

function scoreWithModel(message: string, model: SpamModel): { score: number; probability: number } {
  const tokens = tokenize(message);
  const vocab = Math.max(model.vocabSize, 1);

  let spamLog = Math.log(Math.max(model.priors.spam, 1e-9));
  let hamLog = Math.log(Math.max(model.priors.ham, 1e-9));

  const spamDenominator = model.totalTokens.spam + vocab;
  const hamDenominator = model.totalTokens.ham + vocab;

  for (const token of tokens) {
    const spamCount = model.tokenCounts.spam[token] ?? 0;
    const hamCount = model.tokenCounts.ham[token] ?? 0;

    spamLog += Math.log((spamCount + 1) / spamDenominator);
    hamLog += Math.log((hamCount + 1) / hamDenominator);
  }

  const maxLog = Math.max(spamLog, hamLog);
  const spamExp = Math.exp(spamLog - maxLog);
  const hamExp = Math.exp(hamLog - maxLog);
  const spamProbability = spamExp / (spamExp + hamExp);
  const score = Math.min(Math.max(Math.round(spamProbability * 100), 0), 99);

  return { score, probability: spamProbability };
}

function buildThreatLevel(score: number): ThreatLevel {
  if (score <= 30) return 'LOW';
  if (score <= 70) return 'MEDIUM';
  return 'HIGH';
}

function buildPrediction(score: number): Prediction {
  if (score <= 30) return 'Safe';
  if (score <= 70) return 'Suspicious';
  return 'Phishing';
}

export async function analyzeOfflineMessage(message: string): Promise<AnalysisResult> {
  const sanitizedMessage = message.slice(0, 2000);
  const model = await loadLocalModel();

  const fallbackScore = calculateHeuristicScore(sanitizedMessage);
  const modelScore = model ? scoreWithModel(sanitizedMessage, model).score : fallbackScore;
  const combinedScore = model ? Math.round((modelScore * 0.7) + (fallbackScore * 0.3)) : fallbackScore;

  const keywords = extractKeywords(sanitizedMessage);
  const categories = detectCategories(sanitizedMessage);
  const prediction = buildPrediction(combinedScore);
  const threatLevel = buildThreatLevel(combinedScore);

  return {
    prediction,
    confidence: `${combinedScore}%`,
    confidenceScore: combinedScore,
    threatLevel,
    keywords,
    categories,
    explanation: buildExplanation(combinedScore, categories, keywords),
    recommendation: buildRecommendation(combinedScore, categories),
  };
}
