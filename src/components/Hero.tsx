import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  HelpCircle, 
  Sparkles, 
  Layers, 
  Percent, 
  Sliders, 
  Cpu, 
  Zap, 
  Activity 
} from 'lucide-react';

export const Hero: React.FC = () => {
  // Animated tokens showcase
  const demoTokens = [
    { text: "The", prob: "0.95%", rank: "#5", bg: "from-blue-500/20 to-indigo-500/10", border: "border-blue-500/30", color: "text-blue-400" },
    { text: "capital", prob: "0.02%", rank: "#643", bg: "from-amber-500/20 to-orange-500/10", border: "border-amber-500/30", color: "text-amber-400" },
    { text: "of", prob: "15.20%", rank: "#2", bg: "from-emerald-500/20 to-teal-500/10", border: "border-emerald-500/30", color: "text-emerald-400" },
    { text: "France", prob: "0.29%", rank: "#42", bg: "from-purple-500/20 to-pink-500/10", border: "border-purple-500/30", color: "text-purple-400" },
    { text: "is", prob: "7.44%", rank: "#2", bg: "from-cyan-500/20 to-blue-500/10", border: "border-cyan-500/30", color: "text-cyan-400" },
    { text: "Paris", prob: "0.01%", rank: "#1067", bg: "from-rose-500/20 to-red-500/10", border: "border-rose-500/30", color: "text-rose-400" },
  ];

  const [activeTokenIdx, setActiveTokenIdx] = useState(2);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTokenIdx((prev) => (prev + 1) % demoTokens.length);
    }, 2400);
    return () => clearInterval(timer);
  }, [demoTokens.length]);

  return (
    <section id="hero" className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden bg-grid-pattern">
      {/* Background ambient glow spots */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-medium mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Interactive Educational AI Laboratory</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
            <span className="block">PERPLEXITY</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">
              EXPLORER
            </span>
          </h1>

          <p className="text-xl sm:text-2xl font-semibold text-slate-200 mb-4">
            Step inside the mind of an AI language model.
          </p>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover how AI predicts words, assigns probabilities, and measures uncertainty. 
            Experiment with real sentences and see the mathematics behind perplexity.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href="#analyze-sentence"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold text-base shadow-lg shadow-purple-600/25 hover:shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Start Exploring</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#perplexity-calculator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl glass-panel hover:bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 text-slate-200 hover:text-white font-medium text-base transition-all"
            >
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <span>How It Works</span>
            </a>
          </div>

          {/* Interactive Token Decomposition Visualization */}
          <div className="max-w-3xl mx-auto glass-panel-glow p-6 sm:p-8 rounded-2xl relative mb-16">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Sentence Tokenization & Probability Flow
                </span>
              </div>
              <span className="text-[11px] font-mono text-purple-400 px-2.5 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20">
                Live Interactive Preview
              </span>
            </div>

            {/* Token Stream Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 py-4">
              {demoTokens.map((t, idx) => {
                const isActive = activeTokenIdx === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveTokenIdx(idx)}
                    className={`relative cursor-pointer transition-all duration-300 group ${
                      isActive ? 'scale-110 z-10' : 'hover:scale-105'
                    }`}
                  >
                    {/* Floating probability badge */}
                    <div
                      className={`absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-all duration-300 ${
                        isActive
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-500/50 scale-100 opacity-100'
                          : 'bg-slate-800/90 text-slate-300 scale-90 opacity-70 group-hover:opacity-100'
                      }`}
                    >
                      P = {t.prob}
                    </div>

                    {/* Token Card */}
                    <div
                      className={`px-3.5 py-2 rounded-xl border bg-gradient-to-b ${t.bg} ${t.border} backdrop-blur-md flex flex-col items-center ${
                        isActive ? 'ring-2 ring-purple-400 shadow-lg shadow-purple-500/20' : ''
                      }`}
                    >
                      <span className="font-mono text-xs text-slate-400 font-medium">#{idx}</span>
                      <span className="font-sans font-bold text-white text-sm sm:text-base tracking-wide">
                        {t.text}
                      </span>
                    </div>

                    {/* Rank indicator */}
                    <div className="text-center mt-1 text-[10px] font-mono text-slate-400">
                      Rank {t.rank}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Micro Explanation below visualization */}
            <div className="mt-6 pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
              <span className="font-mono text-slate-300">
                Current Token: <strong className="text-cyan-300">"{demoTokens[activeTokenIdx].text}"</strong>
              </span>
              <span className="text-purple-300 font-mono">
                Model confidence: {demoTokens[activeTokenIdx].prob} (Rank {demoTokens[activeTokenIdx].rank} in vocabulary)
              </span>
            </div>
          </div>

          {/* Three Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            {/* Card 1 */}
            <div className="glass-panel-interactive p-6 rounded-2xl group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all">
                <Cpu className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                Real Language Model
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Powered by actual DistilGPT-2 inference running directly inside your web browser via ONNX Runtime & Transformers.js. No fake numbers.
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass-panel-interactive p-6 rounded-2xl group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                <Percent className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                Live Token Probabilities
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Inspect the model's authentic softmax logits for every single token. Compare top-predicted alternatives against the actual words written.
              </p>
            </div>

            {/* Card 3 */}
            <div className="glass-panel-interactive p-6 rounded-2xl group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                <Sliders className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                Interactive Experiments
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Become the AI! Manually tweak token probabilities with sliders and instantly see how the mathematical perplexity formula reacts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
