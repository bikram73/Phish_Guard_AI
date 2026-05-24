import { Code2, Database, Zap, Shield, BookOpen } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">About PhishGuard AI</h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            A cutting-edge conversational AI system designed to protect users from phishing attacks,
            spam messages, and social engineering threats using advanced NLP and machine learning.
          </p>
        </div>

        {/* Project Overview */}
        <Section title="Project Overview">
          <p className="text-slate-300 mb-4">
            PhishGuard AI is a real-time phishing detection system that analyzes text messages and identifies
            malicious content with high accuracy. The system combines Natural Language Processing (NLP) with
            Machine Learning to detect phishing attempts, spam, and suspicious conversational patterns.
          </p>
          <p className="text-slate-300">
            Built for security awareness and user protection, PhishGuard AI requires no authentication,
            stores no data, and provides instant analysis for any message users want to verify.
          </p>
        </Section>

        {/* Key Features */}
        <Section title="Key Features">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((f) => (
              <FeatureItem key={f.title} icon={f.icon} title={f.title} desc={f.desc} />
            ))}
          </div>
        </Section>

        {/* How It Works */}
        <Section title="How It Works">
          <div className="space-y-4">
            {WORKFLOW.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-cyber-blue/20 border border-cyber-blue/30 flex items-center justify-center font-mono font-bold text-cyber-blue text-sm">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Tech Stack */}
        <Section title="Technology Stack">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TECH_STACK.map((cat) => (
              <div key={cat.category} className="glass-card rounded-xl p-4 border border-white/5">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <cat.icon className="w-4 h-4 text-cyber-cyan" />
                  {cat.category}
                </h3>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li key={item} className="text-sm text-slate-400 font-mono">
                      <span className="text-cyber-cyan">›</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* Threat Classification */}
        <Section title="Threat Classification">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {THREAT_LEVELS.map((level) => (
              <div key={level.name} className={`rounded-xl p-5 border ${level.border} ${level.bg}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`font-semibold ${level.text}`}>{level.name}</h3>
                  <span className="text-sm font-mono text-slate-400">{level.range}</span>
                </div>
                <p className="text-sm text-slate-300">{level.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Detection Categories */}
        <Section title="Detection Categories">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DETECTION_CATEGORIES.map((cat) => (
              <div key={cat} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                <div className="w-2 h-2 bg-cyber-cyan rounded-full flex-shrink-0" />
                <span className="text-sm text-slate-300">{cat}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Performance */}
        <Section title="Performance Metrics">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {METRICS.map((m) => (
              <div key={m.label} className="glass-card rounded-xl p-4 border border-cyber-cyan/20">
                <div className={`text-3xl font-bold font-mono ${m.color} mb-1`}>{m.value}</div>
                <p className="text-sm text-slate-400">{m.label}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* NLP Techniques */}
        <Section title="NLP Techniques">
          <div className="glass-card rounded-xl p-6 border border-white/5 space-y-3">
            {NLP_TECHNIQUES.map((tech) => (
              <div key={tech} className="flex items-center gap-3">
                <Code2 className="w-4 h-4 text-cyber-blue flex-shrink-0" />
                <span className="text-slate-300 font-mono text-sm">{tech}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Dataset Info */}
        <Section title="Dataset & Training">
          <div className="glass-card rounded-xl p-6 border border-white/5">
            <h3 className="font-semibold text-white mb-3">SMS Spam Collection Dataset</h3>
            <ul className="space-y-2 text-slate-300 text-sm mb-4">
              <li className="flex items-center gap-2">
                <span className="text-cyber-cyan">•</span>
                <span>5,574 labeled SMS messages</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyber-cyan">•</span>
                <span>4,825 legitimate (ham) messages</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyber-cyan">•</span>
                <span>747 spam/phishing messages</span>
              </li>
            </ul>
            <p className="text-sm text-slate-400">
              The model achieves 95%+ accuracy in detecting phishing and spam messages using
              Multinomial Naive Bayes with TF-IDF vectorization.
            </p>
          </div>
        </Section>

        {/* Future Enhancements */}
        <Section title="Future Enhancements">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FUTURE.map((item) => (
              <div key={item} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                <Zap className="w-4 h-4 text-cyber-orange flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">{item}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-slate-500 text-sm mb-4">
            PhishGuard AI — Protecting users from phishing attacks with AI-powered real-time analysis
          </p>
          <p className="text-xs text-slate-600 font-mono">
            No data storage • No authentication required • Real-time analysis • Privacy first
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-6 pb-2 border-b border-cyber-cyan/20">
        {title}
      </h2>
      {children}
    </div>
  );
}

function FeatureItem({ icon: Icon, title, desc }: { icon: React.ComponentType<any>; title: string; desc: string }) {
  return (
    <div className="flex gap-3">
      <Icon className="w-5 h-5 text-cyber-cyan flex-shrink-0 mt-0.5" />
      <div>
        <h3 className="font-semibold text-white mb-0.5">{title}</h3>
        <p className="text-sm text-slate-400">{desc}</p>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    icon: Zap,
    title: 'Real-Time Analysis',
    desc: 'Instant phishing detection in under 2 seconds',
  },
  {
    icon: Shield,
    title: 'High Accuracy',
    desc: '95%+ detection rate using advanced ML',
  },
  {
    icon: Code2,
    title: 'NLP Processing',
    desc: 'Tokenization, stemming, and feature extraction',
  },
  {
    icon: BookOpen,
    title: 'Keyword Highlighting',
    desc: 'Identifies suspicious patterns and keywords',
  },
];

const WORKFLOW = [
  {
    title: 'Message Input',
    desc: 'User submits a text message or SMS for analysis',
  },
  {
    title: 'NLP Preprocessing',
    desc: 'Text is tokenized, cleaned, and normalized using NLTK techniques',
  },
  {
    title: 'Feature Extraction',
    desc: 'TF-IDF vectorization converts text into numerical features',
  },
  {
    title: 'ML Classification',
    desc: 'Multinomial Naive Bayes model predicts threat level',
  },
  {
    title: 'Pattern Detection',
    desc: 'System scans for phishing keywords and suspicious patterns',
  },
  {
    title: 'Risk Scoring',
    desc: 'Final risk score (0-100%) is calculated with explanations',
  },
];

const TECH_STACK = [
  {
    category: 'Frontend',
    icon: Code2,
    items: ['React 18', 'TypeScript', 'Tailwind CSS', 'Lucide Icons'],
  },
  {
    category: 'Backend',
    icon: Zap,
    items: ['Supabase Edge Functions', 'Deno Runtime', 'REST API'],
  },
  {
    category: 'NLP/ML',
    icon: Database,
    items: ['Pattern Matching', 'Keyword Detection', 'Risk Scoring'],
  },
];

const THREAT_LEVELS = [
  {
    name: 'Safe',
    range: '0–30%',
    bg: 'bg-green-500/5',
    border: 'border-green-500/20',
    text: 'text-green-400',
    desc: 'Message appears legitimate with minimal phishing indicators',
  },
  {
    name: 'Suspicious',
    range: '31–70%',
    bg: 'bg-orange-500/5',
    border: 'border-orange-500/20',
    text: 'text-orange-400',
    desc: 'Message contains moderate phishing indicators requiring caution',
  },
  {
    name: 'Phishing',
    range: '71–100%',
    bg: 'bg-red-500/5',
    border: 'border-red-500/20',
    text: 'text-red-400',
    desc: 'High-confidence phishing detection with multiple attack indicators',
  },
];

const DETECTION_CATEGORIES = [
  'Urgency Manipulation',
  'Financial Lures',
  'Credential Harvesting',
  'Threat/Fear Tactics',
  'Brand Impersonation',
  'Suspicious Links',
  'Social Engineering',
];

const METRICS = [
  { label: 'Detection Accuracy', value: '95%+', color: 'text-cyber-green' },
  { label: 'Response Time', value: '<2s', color: 'text-cyber-cyan' },
  { label: 'Threat Categories', value: '7+', color: 'text-cyber-blue' },
  { label: 'Privacy Score', value: '100%', color: 'text-cyber-orange' },
];

const NLP_TECHNIQUES = [
  'Text Tokenization',
  'Stopword Removal',
  'Lemmatization & Stemming',
  'TF-IDF Vectorization',
  'Pattern Matching',
  'Keyword Extraction',
  'Linguistic Feature Analysis',
];

const FUTURE = [
  'Deep Learning (LSTM/BERT) models for improved accuracy',
  'Email phishing analysis and URL scanning',
  'Multi-language support for global threats',
  'Browser extension for real-time protection',
  'Voice phishing detection capabilities',
  'Integration with email clients',
];
