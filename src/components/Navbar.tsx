import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Menu, 
  X, 
  CheckCircle2, 
  Loader2, 
  DownloadCloud, 
  AlertCircle 
} from 'lucide-react';
import { ModelState, ModelLoadingProgress } from '../types';

interface NavbarProps {
  modelState: ModelState;
  loadingProgress?: ModelLoadingProgress;
  onTriggerLoadModel: () => void;
  hasAnalyzed: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  modelState,
  loadingProgress,
  onTriggerLoadModel,
  hasAnalyzed
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Analyze', href: '#analyze-sentence' },
    { name: 'Predictions', href: '#token-predictions' },
    { name: 'Calculator', href: '#perplexity-calculator' },
    { name: 'Experiments', href: '#simulated-experiments' },
    { name: 'Quiz', href: '#challenge-quiz' },
    { name: 'Learn', href: '#learn-concepts' },
  ];

  const renderStatusBadge = () => {
    switch (modelState) {
      case 'ready':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>DistilGPT-2 Ready</span>
          </div>
        );
      case 'loading':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-medium">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
            <span>
              Downloading Model {loadingProgress?.progress ? `(${Math.round(loadingProgress.progress)}%)` : '...'}
            </span>
          </div>
        );
      case 'analyzing':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            <span>Computing Logits...</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Model Error</span>
          </div>
        );
      case 'idle':
      default:
        return (
          <button
            onClick={onTriggerLoadModel}
            title="Click to pre-download the 80MB DistilGPT-2 model into browser cache"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 hover:border-purple-500/40 text-slate-300 hover:text-purple-300 text-xs font-medium transition-all group"
          >
            <DownloadCloud className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-400" />
            <span>Load Model</span>
          </button>
        );
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-purple-900/30 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-cyan-400 group-hover:text-purple-300 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-white text-base sm:text-lg">
                  PERPLEXITY
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-extrabold text-base sm:text-lg">
                  EXPLORER
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider -mt-0.5 uppercase hidden sm:block">
                Inside the Mind of an LLM
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Status Indicator & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            {renderStatusBadge()}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg"
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
