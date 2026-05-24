import { useEffect, useState } from 'react';
import { AnalysisResult } from '../types';

interface ThreatMeterProps {
  result: AnalysisResult;
}

export default function ThreatMeter({ result }: ThreatMeterProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, [result]);

  const score = result.confidenceScore;

  const getColor = () => {
    if (score <= 30) return { bar: 'from-cyber-green to-green-400', text: 'text-cyber-green', border: 'border-cyber-green/30', bg: 'bg-cyber-green/10' };
    if (score <= 70) return { bar: 'from-cyber-orange to-yellow-400', text: 'text-cyber-orange', border: 'border-cyber-orange/30', bg: 'bg-cyber-orange/10' };
    return { bar: 'from-cyber-red to-red-400', text: 'text-cyber-red', border: 'border-cyber-red/30', bg: 'bg-cyber-red/10' };
  };

  const colors = getColor();

  const getIcon = () => {
    if (score <= 30) return '✓';
    if (score <= 70) return '⚠';
    return '✕';
  };

  return (
    <div className={`glass-card rounded-2xl p-5 ${colors.border} border`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center text-sm font-bold ${colors.text}`}>
            {getIcon()}
          </div>
          <div>
            <div className="text-xs text-slate-400 font-mono uppercase tracking-wider">Threat Analysis</div>
            <div className={`text-lg font-bold ${colors.text}`}>{result.prediction}</div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold font-mono ${colors.text}`}>{score}%</div>
          <div className="text-xs text-slate-400">Risk Score</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="h-3 bg-navy-800 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${colors.bar} rounded-full transition-all duration-1000 ease-out`}
            style={{ width: animated ? `${score}%` : '0%' }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-1 font-mono">
          <span>0%</span>
          <span className="text-cyber-green">SAFE</span>
          <span className="text-cyber-orange">SUSPICIOUS</span>
          <span className="text-cyber-red">PHISHING</span>
          <span>100%</span>
        </div>
      </div>

      {/* Threat zones indicator */}
      <div className="flex gap-2 mb-4">
        <div className={`flex-1 h-1.5 rounded-full ${score <= 30 ? 'bg-cyber-green' : 'bg-cyber-green/20'}`} />
        <div className={`flex-1 h-1.5 rounded-full ${score > 30 && score <= 70 ? 'bg-cyber-orange' : 'bg-cyber-orange/20'}`} />
        <div className={`flex-1 h-1.5 rounded-full ${score > 70 ? 'bg-cyber-red' : 'bg-cyber-red/20'}`} />
      </div>

      {/* Categories */}
      {result.categories.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-slate-400 font-mono uppercase tracking-wider mb-2">Detected Patterns</div>
          <div className="flex flex-wrap gap-1.5">
            {result.categories.map((cat) => (
              <span
                key={cat}
                className={`text-xs px-2 py-1 rounded-md font-mono ${colors.bg} ${colors.text} border ${colors.border}`}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Keywords */}
      {result.keywords.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-slate-400 font-mono uppercase tracking-wider mb-2">Flagged Keywords</div>
          <div className="flex flex-wrap gap-1.5">
            {result.keywords.map((kw) => (
              <span
                key={kw}
                className="text-xs px-2 py-1 rounded-md font-mono bg-red-500/10 text-red-400 border border-red-500/20"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Explanation */}
      <div className="p-3 rounded-xl bg-navy-900/50 border border-white/5">
        <div className="text-xs text-slate-400 font-mono uppercase tracking-wider mb-1">AI Analysis</div>
        <p className="text-sm text-slate-300 leading-relaxed">{result.explanation}</p>
      </div>
    </div>
  );
}
