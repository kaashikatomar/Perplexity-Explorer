import React, { useState } from 'react';
import { 
  Sliders, 
  Plus, 
  Trash2, 
  Sparkles, 
  AlertCircle, 
  Calculator, 
  RotateCcw, 
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { SimulatedToken } from '../types';

export const SimulatedExperiments: React.FC = () => {
  const [tokens, setTokens] = useState<SimulatedToken[]>([
    { id: '1', text: 'I', probability: 0.5 },
    { id: '2', text: 'love', probability: 0.8 },
    { id: '3', text: 'Python', probability: 0.2 },
  ]);

  const [activeExperiment, setActiveExperiment] = useState<string>('A');

  // Quick Experiment Presets
  const applyExperiment = (expKey: string) => {
    setActiveExperiment(expKey);
    switch (expKey) {
      case 'A':
        setTokens([
          { id: '1', text: 'I', probability: 0.5 },
          { id: '2', text: 'love', probability: 0.8 },
          { id: '3', text: 'Python', probability: 0.2 },
        ]);
        break;
      case 'B':
        // All 1/8 (0.125)
        setTokens([
          { id: '1', text: 'The', probability: 0.125 },
          { id: '2', text: 'neural', probability: 0.125 },
          { id: '3', text: 'network', probability: 0.125 },
          { id: '4', text: 'learns', probability: 0.125 },
        ]);
        break;
      case 'C':
        // One surprising word (0.9, 0.9, 0.005, 0.85)
        setTokens([
          { id: '1', text: 'The', probability: 0.90 },
          { id: '2', text: 'weather', probability: 0.85 },
          { id: '3', text: 'is', probability: 0.90 },
          { id: '4', text: 'quantum-banana', probability: 0.005 },
        ]);
        break;
      case 'D':
        // All equally likely (4 choices = 0.25 each)
        setTokens([
          { id: '1', text: 'Red', probability: 0.25 },
          { id: '2', text: 'Green', probability: 0.25 },
          { id: '3', text: 'Blue', probability: 0.25 },
          { id: '4', text: 'Yellow', probability: 0.25 },
        ]);
        break;
      default:
        break;
    }
  };

  // Handler functions for dynamic table
  const handleUpdateProbability = (id: string, newProb: number) => {
    const clamped = Math.max(0.001, Math.min(1.0, newProb));
    setTokens(tokens.map(t => t.id === id ? { ...t, probability: clamped } : t));
    setActiveExperiment('custom');
  };

  const handleUpdateText = (id: string, newText: string) => {
    setTokens(tokens.map(t => t.id === id ? { ...t, text: newText } : t));
    setActiveExperiment('custom');
  };

  const handleAddToken = () => {
    const newId = String(Date.now());
    setTokens([...tokens, { id: newId, text: 'token', probability: 0.5 }]);
    setActiveExperiment('custom');
  };

  const handleRemoveToken = (id: string) => {
    if (tokens.length <= 1) return;
    setTokens(tokens.filter(t => t.id !== id));
    setActiveExperiment('custom');
  };

  // Calculate simulated perplexity
  const N = tokens.length;
  const productOfInverses = tokens.reduce((acc, t) => acc * (1 / t.probability), 1);
  const perplexity = Math.pow(productOfInverses, 1 / N);

  return (
    <section id="simulated-experiments" className="py-16 sm:py-24 border-t border-slate-800/80 bg-navy-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Prominent Mandatory SIMULATION Label Banner */}
        <div className="mb-8 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs font-mono text-amber-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <strong className="tracking-wide uppercase">SIMULATED – NOT FROM THE MODEL</strong>
            <span className="hidden md:inline text-amber-200/80">
              — In this sandbox you manually control probabilities to explore mathematical behavior.
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase">
            Interactive Sandbox
          </span>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-purple-400 font-mono text-sm tracking-wider uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>Section 04</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              04. Become the AI. Predict the tokens yourself!
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
              Take the driver's seat. Assign any probability values you want to tokens, watch inverse penalties react, and discover how mathematical edge cases emerge.
            </p>
          </div>
        </div>

        {/* Quick Experiment Preset Buttons */}
        <div className="glass-panel p-5 rounded-2xl mb-8 border border-slate-800">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Choose a Quick Experiment:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              type="button"
              onClick={() => applyExperiment('A')}
              className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                activeExperiment === 'A'
                  ? 'bg-purple-950/60 border-purple-500 shadow-md shadow-purple-900/20'
                  : 'bg-slate-900/70 hover:bg-slate-800/70 border-slate-800'
              }`}
            >
              <div className="text-xs font-bold text-white mb-1">Experiment A: "I love Python"</div>
              <div className="text-[11px] font-mono text-purple-300">P = 0.5, 0.8, 0.2</div>
            </button>

            <button
              type="button"
              onClick={() => applyExperiment('B')}
              className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                activeExperiment === 'B'
                  ? 'bg-purple-950/60 border-purple-500 shadow-md shadow-purple-900/20'
                  : 'bg-slate-900/70 hover:bg-slate-800/70 border-slate-800'
              }`}
            >
              <div className="text-xs font-bold text-white mb-1">Experiment B: "All 1/8"</div>
              <div className="text-[11px] font-mono text-cyan-300">P = 0.125 for every token</div>
            </button>

            <button
              type="button"
              onClick={() => applyExperiment('C')}
              className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                activeExperiment === 'C'
                  ? 'bg-purple-950/60 border-purple-500 shadow-md shadow-purple-900/20'
                  : 'bg-slate-900/70 hover:bg-slate-800/70 border-slate-800'
              }`}
            >
              <div className="text-xs font-bold text-white mb-1">Experiment C: One Surprising Word</div>
              <div className="text-[11px] font-mono text-rose-300">0.9, 0.85, 0.9, 0.005</div>
            </button>

            <button
              type="button"
              onClick={() => applyExperiment('D')}
              className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                activeExperiment === 'D'
                  ? 'bg-purple-950/60 border-purple-500 shadow-md shadow-purple-900/20'
                  : 'bg-slate-900/70 hover:bg-slate-800/70 border-slate-800'
              }`}
            >
              <div className="text-xs font-bold text-white mb-1">Experiment D: All Equally Likely</div>
              <div className="text-[11px] font-mono text-emerald-300">4 tokens @ P = 0.25 (1/4)</div>
            </button>
          </div>
        </div>

        {/* Experiment B Special Educational Callout */}
        {activeExperiment === 'B' && (
          <div className="mb-8 p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 text-xs text-slate-200">
            <div className="flex items-center gap-2 font-bold text-cyan-300 text-sm mb-2">
              <Lightbulb className="w-4 h-4" />
              <span>Why Perplexity Equals Exactly 8.00:</span>
            </div>
            <p className="leading-relaxed mb-2 font-mono text-xs">
              Every token has P = 0.125 = 1/8. Therefore, each inverse probability is 1 / (1/8) = 8.
            </p>
            <div className="p-3 rounded-xl bg-slate-900/80 font-mono text-xs text-cyan-300 mb-2">
              Perplexity = (8 × 8 × 8 × 8)^(1/4) = (8^4)^(1/4) = 8.00!
            </div>
            <p className="text-slate-300 leading-relaxed">
              This proves the fundamental intuition: a perplexity of <strong>8</strong> literally means the model was as uncertain as choosing blindly among <strong>8 equally likely candidate words</strong> at each step!
            </p>
          </div>
        )}

        {/* Experiment C Special Educational Callout */}
        {activeExperiment === 'C' && (
          <div className="mb-8 p-5 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-xs text-slate-200">
            <div className="flex items-center gap-2 font-bold text-rose-300 text-sm mb-2">
              <AlertCircle className="w-4 h-4" />
              <span>How One Surprising Word Explodes Perplexity:</span>
            </div>
            <p className="leading-relaxed font-mono text-xs text-rose-300 mb-2">
              Even though the first three words have 90% confidence, the single low-probability word (P = 0.005) yields an inverse penalty of 1 / 0.005 = <strong>200</strong>!
            </p>
            <p className="text-slate-300 leading-relaxed">
              Because perplexity multiplies inverse penalties together, a single shocking word drastically elevates the entire sentence's perplexity.
            </p>
          </div>
        )}

        {/* Main Interactive Table & Calculation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Dynamic Editable Table (7 cols) */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-400" />
                <span>Token Probability Editor</span>
              </h3>
              <button
                type="button"
                onClick={handleAddToken}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Token</span>
              </button>
            </div>

            <div className="space-y-4">
              {tokens.map((token, index) => {
                const inv = 1 / token.probability;
                return (
                  <div
                    key={token.id}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center justify-between gap-3 mb-3">
                      {/* Token Index & Name Input */}
                      <div className="flex items-center gap-2 flex-1">
                        <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center font-mono text-xs text-slate-400 font-bold">
                          #{index + 1}
                        </span>
                        <input
                          type="text"
                          value={token.text}
                          onChange={(e) => handleUpdateText(token.id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-white font-mono text-sm font-bold w-32 focus:border-purple-500 outline-none"
                        />
                      </div>

                      {/* Numeric Probability Input */}
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="text-slate-400">P =</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0.001"
                          max="1.0"
                          value={token.probability}
                          onChange={(e) => handleUpdateProbability(token.id, parseFloat(e.target.value) || 0.01)}
                          className="w-20 px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-cyan-300 font-bold text-right outline-none focus:border-cyan-400"
                        />
                      </div>

                      {/* Inverse 1/P */}
                      <div className="font-mono text-xs text-purple-300 font-bold min-w-[70px] text-right">
                        1/P = {inv.toFixed(1)}
                      </div>

                      {/* Delete Token */}
                      <button
                        type="button"
                        onClick={() => handleRemoveToken(token.id)}
                        disabled={tokens.length <= 1}
                        className="p-1.5 text-slate-500 hover:text-rose-400 disabled:opacity-30 cursor-pointer"
                        title="Remove token"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Interactive Slider */}
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0.01"
                        max="1.0"
                        step="0.005"
                        value={token.probability}
                        onChange={(e) => handleUpdateProbability(token.id, parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      />
                      <span className="text-[11px] font-mono text-slate-400 w-12 text-right">
                        {(token.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mathematical Step-by-Step Breakdown (5 cols) */}
          <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold mb-4">
                <Calculator className="w-4 h-4" />
                <span>Live Mathematical Computation</span>
              </div>

              {/* Big Perplexity Score Output */}
              <div className="p-5 rounded-2xl glass-panel-glow text-center mb-6">
                <div className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-1">
                  Simulated Perplexity
                </div>
                <div className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">
                  {perplexity.toFixed(2)}
                </div>
                <div className="text-xs font-mono text-purple-300 mt-2">
                  Equivalent to choosing among {perplexity.toFixed(1)} equally likely options
                </div>
              </div>

              {/* Step by step arithmetic */}
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400 mb-1">Step 1: Inverses Product</div>
                  <div className="text-slate-200 truncate">
                    {tokens.map(t => (1 / t.probability).toFixed(1)).join(' × ')}
                  </div>
                  <div className="text-purple-300 font-bold mt-1 text-right">
                    = {productOfInverses > 1e12 ? productOfInverses.toExponential(2) : productOfInverses.toFixed(1)}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400 mb-1">Step 2: N-th Root (N = {N})</div>
                  <div className="text-cyan-300 font-bold">
                    ({productOfInverses > 1e12 ? productOfInverses.toExponential(2) : productOfInverses.toFixed(1)}) ^ (1 / {N})
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400 mb-1">Step 3: Final Result</div>
                  <div className="text-emerald-400 font-extrabold text-sm">
                    Perplexity = {perplexity.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
              💡 <em>Try dragging a single token's slider down to 0.01 to see how fast perplexity surges!</em>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
