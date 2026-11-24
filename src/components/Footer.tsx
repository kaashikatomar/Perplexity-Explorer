import React from 'react';
import { Cpu, Heart, Github, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-navy-950 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 p-0.5">
              <div className="w-full h-full bg-navy-950 rounded-[6px] flex items-center justify-center">
                <Cpu className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="font-bold text-white text-sm">
                Perplexity Explorer
              </div>
              <p className="text-[11px] text-slate-400">
                Inside the Mind of a Language Model
              </p>
            </div>
          </div>

          {/* Educational Notes */}
          <div className="text-center md:text-right space-y-1">
            <p>
              Inference powered by <strong>DistilGPT-2</strong> via <span className="text-slate-300">Transformers.js (ONNX Runtime Web)</span>.
            </p>
            <p className="text-slate-400">
              Built for students and AI researchers to explore token probabilities and perplexity mathematics.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <div>
            © {new Date().getFullYear()} Perplexity Explorer. Free and open educational tool.
          </div>
          <div className="flex items-center gap-4">
            <a href="#hero" className="hover:text-purple-400 transition-colors">Back to Top ↑</a>
            <a href="#analyze-sentence" className="hover:text-purple-400 transition-colors">Analyze Sentence</a>
            <a href="#simulated-experiments" className="hover:text-purple-400 transition-colors">Experiments</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
