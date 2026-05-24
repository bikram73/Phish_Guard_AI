export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type Prediction = 'Safe' | 'Suspicious' | 'Phishing';

export interface AnalysisResult {
  prediction: Prediction;
  confidence: string;
  confidenceScore: number;
  threatLevel: ThreatLevel;
  keywords: string[];
  categories: string[];
  explanation: string;
  recommendation: string;
}

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  analysis?: AnalysisResult;
}

export interface AnalyticsStats {
  total: number;
  safe: number;
  suspicious: number;
  phishing: number;
}
