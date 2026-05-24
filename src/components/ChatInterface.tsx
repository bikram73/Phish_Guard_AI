import { useState, useRef, useEffect } from 'react';
import { Send, Shield, User, AlertTriangle, CheckCircle, XCircle, Loader2, Trash2 } from 'lucide-react';
import { ChatMessage, AnalysisResult, AnalyticsStats } from '../types';
import { analyzeMessage } from '../api/analyze';
import ThreatMeter from './ThreatMeter';
import { getJsonStorage, setJsonStorage } from '../lib/storage';

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: 'Hello! I am PhishGuard AI, your cybersecurity assistant. Paste any suspicious message, SMS, or email text below and I will analyze it for phishing, spam, and malicious intent in real time.',
  timestamp: new Date(),
};

const EXAMPLE_MESSAGES = [
  "Congratulations! You've won a $1000 Amazon gift card. Click here to claim: http://bit.ly/claim-prize",
  'Hey, are you coming to the meeting tomorrow at 3pm?',
  'URGENT: Your bank account has been suspended. Verify your identity immediately at secure-bank-verify.com',
  'Your Netflix subscription has been cancelled. Update your payment info to continue watching.',
  'Your package is waiting for delivery. Confirm your address now at http://delivery-check.example.com',
  'Hi mom, I will call you after work tonight.',
  'Action required: Your PayPal account has been limited due to suspicious activity.',
  'Reminder: Team lunch is at 12:30 PM in the cafeteria.',
  'You have been selected for a free iPhone. Claim your prize here: http://tinyurl.com/free-phone',
  'Please review the attached report before tomorrow’s meeting.',
  'Verify your Microsoft account immediately to avoid suspension.',
  'Are we still on for coffee this weekend?',
  'Exclusive offer just for you! Earn cash fast by signing up today.',
  'Can you send me the notes from class?',
  'Security alert: Your Apple ID was used to sign in from a new device.',
  'Dinner is ready, please come home when you can.',
  'Update your billing details to keep your Amazon Prime membership active.',
  'Thanks for your help earlier today.',
  'Final warning: IRS tax debt overdue, pay immediately to avoid legal action.',
  'Let’s meet tomorrow morning to discuss the project.',
];

interface ChatInterfaceProps {
  onStatsUpdate: (stats: AnalyticsStats) => void;
}

export default function ChatInterface({ onStatsUpdate }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [selectedExample, setSelectedExample] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [, setStats] = useState<AnalyticsStats>({ total: 0, safe: 0, suspicious: 0, phishing: 0 });
  const [selectedResult, setSelectedResult] = useState<AnalysisResult | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load persisted history and stats from localStorage on mount
  useEffect(() => {
    try {
      const stored = getJsonStorage<ChatMessage[]>('phishguard_history');
      if (stored && Array.isArray(stored) && stored.length > 0) {
        // convert timestamp strings back to Date
        const parsed: ChatMessage[] = stored.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
        setMessages([WELCOME_MESSAGE, ...parsed]);

        // compute stats from history
        const computed: AnalyticsStats = parsed.reduce(
          (acc, msg) => {
            if (msg.analysis) {
              acc.total += 1;
              if (msg.analysis.prediction === 'Safe') acc.safe += 1;
              else if (msg.analysis.prediction === 'Suspicious') acc.suspicious += 1;
              else if (msg.analysis.prediction === 'Phishing') acc.phishing += 1;
            }
            return acc;
          },
          { total: 0, safe: 0, suspicious: 0, phishing: 0 } as AnalyticsStats
        );

        setStats(computed);
        onStatsUpdate(computed);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const updateStats = (result: AnalysisResult, currentStats: AnalyticsStats): AnalyticsStats => {
    const newStats = {
      total: currentStats.total + 1,
      safe: currentStats.safe + (result.prediction === 'Safe' ? 1 : 0),
      suspicious: currentStats.suspicious + (result.prediction === 'Suspicious' ? 1 : 0),
      phishing: currentStats.phishing + (result.prediction === 'Phishing' ? 1 : 0),
    };
    return newStats;
  };

  const handleSubmit = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isAnalyzing) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsAnalyzing(true);

    try {
      const result = await analyzeMessage(messageText);

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: result.explanation,
        timestamp: new Date(),
        analysis: result,
      };

      setMessages(prev => [...prev, aiMessage]);
      setSelectedResult(result);

      // persist this analysis to localStorage history
      try {
        const existing = getJsonStorage<any[]>('phishguard_history') || [];
        const entry = { ...aiMessage, timestamp: aiMessage.timestamp.toISOString() };
        const next = [entry, ...existing].slice(0, 200);
        setJsonStorage('phishguard_history', next);
      } catch (e) {
        // ignore storage errors
      }

      setStats(prev => {
        const newStats = updateStats(result, prev);
        onStatsUpdate(newStats);
        return newStats;
      });

    } catch {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Analysis failed. Please check your connection and try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setSelectedResult(null);
    setSelectedExample('');
    setStats({ total: 0, safe: 0, suspicious: 0, phishing: 0 });
    onStatsUpdate({ total: 0, safe: 0, suspicious: 0, phishing: 0 });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {/* Chat Column */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Chat header */}
        <div className="glass-card rounded-2xl p-4 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">PhishGuard AI</div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-cyber-green rounded-full animate-pulse-slow" />
                <span className="text-xs text-slate-400 font-mono">Online · NLP Engine Active</span>
              </div>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 glass-card rounded-2xl overflow-y-auto p-4 space-y-4 chat-container" style={{ minHeight: '400px', maxHeight: '500px' }}>
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onViewDetails={() => message.analysis && setSelectedResult(message.analysis)}
            />
          ))}
          {isAnalyzing && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Example messages */}
        <div className="mt-3 glass-card rounded-2xl p-4 border border-white/5">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <div className="text-sm font-semibold text-white">Example messages</div>
              <div className="text-xs text-slate-500 font-mono">Choose a sample and analyze it instantly.</div>
            </div>
            <button
              onClick={() => selectedExample && handleSubmit(selectedExample)}
              disabled={!selectedExample}
              className="px-3 py-2 rounded-lg text-xs font-medium bg-cyber-blue hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white transition-colors"
            >
              Analyze example
            </button>
          </div>
          <select
            value={selectedExample}
            onChange={(e) => setSelectedExample(e.target.value)}
            className="w-full bg-navy-900/80 border border-white/10 rounded-xl px-3 py-3 text-sm text-slate-200 outline-none focus:border-cyan-500/50"
          >
            <option value="">Select one of 20 examples</option>
            {EXAMPLE_MESSAGES.map((example, index) => (
              <option key={index} value={example}>
                {index + 1}. {example}
              </option>
            ))}
          </select>
          {selectedExample && (
            <div className="mt-3 text-xs text-slate-400 leading-relaxed border-l-2 border-cyan-500/40 pl-3">
              Preview: {selectedExample}
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="mt-3">
          <div className="glass-card rounded-2xl p-3 flex items-end gap-3 neon-border-blue">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Paste a suspicious message here for analysis..."
              className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 resize-none outline-none min-h-[48px] max-h-[120px] leading-relaxed"
              rows={2}
              disabled={isAnalyzing}
            />
            <button
              onClick={() => handleSubmit()}
              disabled={!input.trim() || isAnalyzing}
              className="flex-shrink-0 w-10 h-10 rounded-xl bg-cyber-blue hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200"
              style={{ boxShadow: input.trim() && !isAnalyzing ? '0 0 15px rgba(59,130,246,0.4)' : 'none' }}
            >
              {isAnalyzing ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Send className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
          <div className="flex items-center justify-between mt-2 px-1">
            <span className="text-xs text-slate-500 font-mono">Press Enter to analyze · Shift+Enter for new line</span>
            <span className="text-xs text-slate-500 font-mono">{input.length}/2000</span>
          </div>
        </div>
      </div>

      {/* Analysis Panel */}
      <div className="lg:w-80 xl:w-96">
        {selectedResult ? (
          <div className="animate-slide-up">
            <ThreatMeter result={selectedResult} />
            <RecommendationCard result={selectedResult} />
          </div>
        ) : (
          <EmptyAnalysisPanel />
        )}
      </div>
    </div>
  );
}

function MessageBubble({ message, onViewDetails }: { message: ChatMessage; onViewDetails: () => void }) {
  const isUser = message.role === 'user';
  const analysis = message.analysis;

  const getThreatIcon = () => {
    if (!analysis) return null;
    if (analysis.prediction === 'Safe') return <CheckCircle className="w-4 h-4 text-cyber-green" />;
    if (analysis.prediction === 'Suspicious') return <AlertTriangle className="w-4 h-4 text-cyber-orange" />;
    return <XCircle className="w-4 h-4 text-cyber-red" />;
  };

  const getThreatBg = () => {
    if (!analysis) return 'bg-navy-800/60 border-white/5';
    if (analysis.prediction === 'Safe') return 'bg-green-500/5 border-green-500/20';
    if (analysis.prediction === 'Suspicious') return 'bg-orange-500/5 border-orange-500/20';
    return 'bg-red-500/5 border-red-500/20';
  };

  return (
    <div className={`flex gap-3 animate-slide-up ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
        isUser ? 'bg-cyber-blue/20 border border-cyber-blue/30' : 'bg-gradient-to-br from-cyan-500 to-blue-600'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 text-cyber-blue" />
        ) : (
          <Shield className="w-4 h-4 text-white" />
        )}
      </div>

      <div className={`flex-1 max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed border ${
          isUser
            ? 'bg-cyber-blue/15 border-cyber-blue/30 text-slate-200 rounded-tr-sm'
            : `${getThreatBg()} text-slate-200 rounded-tl-sm`
        }`}>
          {message.content}
        </div>

        {analysis && (
          <button
            onClick={onViewDetails}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors duration-200 px-1"
          >
            {getThreatIcon()}
            <span className="font-mono">{analysis.prediction} · {analysis.confidence} risk</span>
            <span className="text-slate-500">· View details</span>
          </button>
        )}

        <div className="text-xs text-slate-600 px-1 font-mono">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
        <Shield className="w-4 h-4 text-white" />
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-navy-800/60 border border-white/5">
        <div className="flex items-center gap-1.5">
          <div className="text-xs text-slate-400 font-mono mr-1">Analyzing</div>
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full typing-dot" />
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full typing-dot" />
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full typing-dot" />
        </div>
      </div>
    </div>
  );
}

function RecommendationCard({ result }: { result: AnalysisResult }) {
  const isPhishing = result.prediction === 'Phishing';
  const isSuspicious = result.prediction === 'Suspicious';

  return (
    <div className={`mt-3 glass-card rounded-2xl p-4 border ${
      isPhishing ? 'border-red-500/30' : isSuspicious ? 'border-orange-500/30' : 'border-green-500/30'
    }`}>
      <div className="text-xs text-slate-400 font-mono uppercase tracking-wider mb-2">Recommendation</div>
      <p className="text-sm text-slate-300 leading-relaxed">{result.recommendation}</p>
    </div>
  );
}

function EmptyAnalysisPanel() {
  return (
    <div className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px] border border-dashed border-white/10">
      <div className="w-16 h-16 rounded-2xl bg-navy-800 flex items-center justify-center mb-4">
        <Shield className="w-8 h-8 text-slate-600" />
      </div>
      <div className="text-slate-400 font-semibold mb-1">No Analysis Yet</div>
      <div className="text-sm text-slate-500">Submit a message to see the threat analysis panel here.</div>
      <div className="mt-4 flex flex-col gap-2 text-xs text-slate-600 font-mono">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-cyber-green rounded-full" />
          <span>0–30% = Safe</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-cyber-orange rounded-full" />
          <span>31–70% = Suspicious</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-cyber-red rounded-full" />
          <span>71–100% = Phishing</span>
        </div>
      </div>
    </div>
  );
}
