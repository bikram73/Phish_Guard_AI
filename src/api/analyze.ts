import { AnalysisResult } from '../types';
import { analyzeOfflineMessage } from '../lib/offlineAnalyzer';

export async function analyzeMessage(message: string): Promise<AnalysisResult> {
  return analyzeOfflineMessage(message);
}
