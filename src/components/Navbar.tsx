import { Shield, Activity, Home, Info } from 'lucide-react';

interface NavbarProps {
  currentPage: 'home' | 'analyze' | 'about';
  onNavigate: (page: 'home' | 'analyze' | 'about') => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card-dark border-b border-cyan-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/30 transition-shadow duration-300">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-cyber-green rounded-full border-2 border-navy-900 animate-pulse-slow" />
            </div>
            <div className="hidden sm:block">
              <div className="text-white font-bold text-lg leading-none tracking-tight">
                PhishGuard
                <span className="text-gradient-cyan"> AI</span>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">Phishing Detection System</div>
            </div>
          </button>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            <NavLink
              icon={<Home className="w-4 h-4" />}
              label="Home"
              active={currentPage === 'home'}
              onClick={() => onNavigate('home')}
            />
            <NavLink
              icon={<Activity className="w-4 h-4" />}
              label="Analyze"
              active={currentPage === 'analyze'}
              onClick={() => onNavigate('analyze')}
            />
            <NavLink
              icon={<Info className="w-4 h-4" />}
              label="About"
              active={currentPage === 'about'}
              onClick={() => onNavigate('about')}
            />
          </div>

          {/* Status indicator */}
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
            <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse-slow" />
            <span className="font-mono">AI Engine Online</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30'
          : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      <span className="hidden sm:block">{label}</span>
    </button>
  );
}
