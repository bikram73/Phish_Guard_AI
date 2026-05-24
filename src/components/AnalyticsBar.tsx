import { BarChart3, ShieldCheck, AlertTriangle, XOctagon, MessageSquare } from 'lucide-react';
import { AnalyticsStats } from '../types';

interface AnalyticsBarProps {
  stats: AnalyticsStats;
}

export default function AnalyticsBar({ stats }: AnalyticsBarProps) {
  const cards = [
    {
      label: 'Total Analyzed',
      value: stats.total,
      icon: <MessageSquare className="w-5 h-5" />,
      color: 'text-cyber-cyan',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
    },
    {
      label: 'Safe Messages',
      value: stats.safe,
      icon: <ShieldCheck className="w-5 h-5" />,
      color: 'text-cyber-green',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
    },
    {
      label: 'Suspicious',
      value: stats.suspicious,
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'text-cyber-orange',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
    },
    {
      label: 'Phishing Detected',
      value: stats.phishing,
      icon: <XOctagon className="w-5 h-5" />,
      color: 'text-cyber-red',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
    },
  ];

  const detectionRate = stats.total > 0
    ? Math.round(((stats.suspicious + stats.phishing) / stats.total) * 100)
    : 0;

  return (
    <div className="glass-card rounded-2xl p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-4 h-4 text-cyber-cyan" />
        <span className="text-sm font-semibold text-white">Session Analytics</span>
        {stats.total > 0 && (
          <span className="ml-auto text-xs font-mono text-slate-400">
            Threat Rate: <span className={detectionRate > 50 ? 'text-cyber-red' : detectionRate > 20 ? 'text-cyber-orange' : 'text-cyber-green'}>{detectionRate}%</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card) => (
          <div key={card.label} className={`p-3 rounded-xl ${card.bg} border ${card.border} flex flex-col gap-1`}>
            <div className={`${card.color} ${card.bg} w-8 h-8 rounded-lg flex items-center justify-center`}>
              {card.icon}
            </div>
            <div className={`text-2xl font-bold font-mono ${card.color}`}>{card.value}</div>
            <div className="text-xs text-slate-400">{card.label}</div>
          </div>
        ))}
      </div>

      {stats.total > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono">
            <span>Distribution</span>
            <span>{stats.total} messages</span>
          </div>
          <div className="h-2 bg-navy-800 rounded-full overflow-hidden flex">
            {stats.safe > 0 && (
              <div
                className="h-full bg-cyber-green transition-all duration-700"
                style={{ width: `${(stats.safe / stats.total) * 100}%` }}
              />
            )}
            {stats.suspicious > 0 && (
              <div
                className="h-full bg-cyber-orange transition-all duration-700"
                style={{ width: `${(stats.suspicious / stats.total) * 100}%` }}
              />
            )}
            {stats.phishing > 0 && (
              <div
                className="h-full bg-cyber-red transition-all duration-700"
                style={{ width: `${(stats.phishing / stats.total) * 100}%` }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
