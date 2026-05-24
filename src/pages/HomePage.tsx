import { Shield, Zap, Eye, Brain, ChevronRight, Lock, Activity, Globe } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: 'home' | 'analyze' | 'about') => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-radial-glow pointer-events-none" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-8">
            <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse-slow" />
            <span>AI-Powered Phishing Detection · Real-Time Analysis</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            Detect Phishing
            <br />
            <span className="text-gradient-cyan">Before It Strikes</span>
          </h1>

          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            PhishGuard AI uses advanced NLP and machine learning to analyze messages in real time,
            identifying phishing attempts, spam, and social engineering attacks instantly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => onNavigate('analyze')}
              className="btn-primary flex items-center gap-2 text-base"
            >
              <Shield className="w-5 h-5" />
              Start Analysis
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-slate-300 hover:border-white/20 hover:text-white transition-all duration-200 text-base"
            >
              <Eye className="w-5 h-5" />
              Learn More
            </button>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-8 mt-16">
            {[
              { value: '95%+', label: 'Detection Accuracy' },
              { value: '<2s', label: 'Response Time' },
              { value: 'Real-Time', label: 'Analysis Engine' },
              { value: 'NLP+ML', label: 'AI Technology' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold font-mono text-gradient-cyan">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">How It Works</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Real-Time Threat Analysis</h2>
            <p className="text-slate-400 mt-3 max-w-xl mx-auto">Three-step intelligent pipeline to detect phishing attempts instantly</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: <Brain className="w-6 h-6" />,
                title: 'NLP Processing',
                desc: 'Text is tokenized, cleaned, and analyzed using natural language processing techniques to extract linguistic features.',
                color: 'cyan',
              },
              {
                step: '02',
                icon: <Activity className="w-6 h-6" />,
                title: 'Pattern Detection',
                desc: 'Machine learning models scan for phishing indicators: urgency cues, financial lures, credential harvesting patterns, and impersonation tactics.',
                color: 'blue',
              },
              {
                step: '03',
                icon: <Shield className="w-6 h-6" />,
                title: 'Threat Classification',
                desc: 'A risk score (0–100%) is computed and classified into Safe, Suspicious, or Phishing with actionable recommendations.',
                color: 'green',
              },
            ].map((item) => (
              <StepCard key={item.step} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-navy-800/20 pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">Features</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Enterprise-Grade Protection</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card rounded-3xl p-10 neon-border-cyan relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <Lock className="w-12 h-12 text-cyber-cyan mx-auto mb-5" />
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Protect Yourself?</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Paste any suspicious message and get instant AI-powered analysis. No account required.
            </p>
            <button
              onClick={() => onNavigate('analyze')}
              className="btn-primary inline-flex items-center gap-2 text-base"
            >
              <Shield className="w-5 h-5" />
              Analyze a Message Now
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function StepCard({ step, icon, title, desc, color }: {
  step: string; icon: React.ReactNode; title: string; desc: string; color: string;
}) {
  const colorMap: Record<string, string> = {
    cyan: 'from-cyan-500 to-blue-500 border-cyan-500/20 bg-cyan-500/5',
    blue: 'from-blue-500 to-blue-600 border-blue-500/20 bg-blue-500/5',
    green: 'from-green-500 to-cyan-500 border-green-500/20 bg-green-500/5',
  };
  const [gradient, border, bg] = colorMap[color].split(' ');

  return (
    <div className={`glass-card rounded-2xl p-6 border ${border} ${bg} relative group hover:scale-[1.02] transition-transform duration-300`}>
      <div className="absolute top-4 right-4 text-4xl font-bold font-mono text-white/5">{step}</div>
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }: {
  icon: React.ReactNode; title: string; desc: string; color: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-white/5 hover:border-white/10 group hover:scale-[1.02] transition-all duration-300">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-white mb-1.5">{title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

const FEATURES = [
  {
    icon: <Zap className="w-5 h-5 text-cyber-cyan" />,
    title: 'Real-Time Detection',
    desc: 'Analyze messages in under 2 seconds using our optimized NLP pipeline deployed on edge infrastructure.',
    color: 'bg-cyan-500/10',
  },
  {
    icon: <Brain className="w-5 h-5 text-cyber-blue" />,
    title: 'NLP + ML Engine',
    desc: 'Combines tokenization, TF-IDF vectorization, and multi-pattern matching for accurate classification.',
    color: 'bg-blue-500/10',
  },
  {
    icon: <Eye className="w-5 h-5 text-cyber-green" />,
    title: 'Keyword Highlighting',
    desc: 'Identifies and highlights the specific keywords and phrases that triggered the phishing classification.',
    color: 'bg-green-500/10',
  },
  {
    icon: <Activity className="w-5 h-5 text-cyber-orange" />,
    title: 'Threat Score Visualization',
    desc: 'Visual risk meter showing threat confidence percentage with color-coded threat level indicators.',
    color: 'bg-orange-500/10',
  },
  {
    icon: <Shield className="w-5 h-5 text-cyber-red" />,
    title: 'Multi-Category Detection',
    desc: 'Detects 7+ attack categories including financial lures, credential harvesting, and brand impersonation.',
    color: 'bg-red-500/10',
  },
  {
    icon: <Globe className="w-5 h-5 text-slate-400" />,
    title: 'No Data Storage',
    desc: 'All analysis happens in real time. No messages are stored or logged, ensuring your privacy.',
    color: 'bg-slate-500/10',
  },
];
