import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ChatInterface from './components/ChatInterface';
import AnalyticsBar from './components/AnalyticsBar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import { AnalyticsStats } from './types';
import { getJsonCookie, setJsonCookie } from './lib/cookies';
import { getJsonStorage, setJsonStorage } from './lib/storage';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'analyze' | 'about'>('home');
  const [stats, setStats] = useState<AnalyticsStats>({ total: 0, safe: 0, suspicious: 0, phishing: 0 });

  // Load persisted stats from cookie on mount
  useEffect(() => {
    // Prefer localStorage, fall back to cookie
    const stored = getJsonStorage<AnalyticsStats>('phishguard_analytics') || getJsonCookie<AnalyticsStats>('phishguard_analytics');
    if (stored && typeof stored === 'object') {
      setStats((prev) => ({ ...prev, ...stored }));
    }
  }, []);

  // Persist stats whenever they change (localStorage preferred)
  useEffect(() => {
    try {
      setJsonStorage('phishguard_analytics', stats);
    } catch (e) {
      setJsonCookie('phishguard_analytics', stats, 365);
    }
  }, [stats]);

  return (
    <div className="min-h-screen bg-navy-900 text-slate-200">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />

      <main className="pt-16">
        {currentPage === 'home' && (
          <HomePage onNavigate={setCurrentPage} />
        )}

        {currentPage === 'analyze' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AnalyticsBar stats={stats} />
            <ChatInterface onStatsUpdate={setStats} />
          </div>
        )}

        {currentPage === 'about' && (
          <AboutPage />
        )}
      </main>
    </div>
  );
}

export default App;
