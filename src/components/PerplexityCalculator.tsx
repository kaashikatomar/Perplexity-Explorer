import React, { useState } from 'react';
import { 
  Calculator, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  TrendingDown, 
  TrendingUp, 
  Info, 
  Equal, 
  Percent, 
  Code2, 
  Layers,
  Gauge
} from 'lucide-react';
import { SentenceAnalysisResult } from '../types';

interface PerplexityCalculatorProps {
  result: SentenceAnalysisResult | null;
  firstTokenStrategy: 'bos_conditioned' | 'prefix_context';
}

export const PerplexityCalculator: React.FC<PerplexityCalculatorProps> = ({
  result,
  firstTokenStrategy,
}) => {
  const [calculationMode, setCalculationMode] = useState<'product' | 'log'>('product');
  const [activeStep, setActiveStep] = useState<number>(3); // 1 = Inverses, 2 = Product/Sum, 3 = Root/Exp

  // Default fallback data if no sentence analyzed yet
  const defaultTokens = [
    { text: "I", prob: 0.0077, inv: 129.07, log: -4.86, bits: 7.02 },
    { text: "love", prob: 0.0167, inv: 59.73, log: -4.09, bits: 5.90 },
    { text: "Python", prob: 0.000061, inv: 16402.49, log: -9.70, bits: 14.00 },
  ];

  const tokensToUse = result
    ? (firstTokenStrategy === 'prefix_context' ? result.tokens.slice(1) : result.tokens).map(t => ({
        text: t.text,
        prob: t.probability,
        inv: t.inverseProbability,
        log: t.logProbability,
        bits: t.surpriseBits
      }))
    : defaultTokens;

  const N = tokensToUse.length;
  const productOfInverses = tokensToUse.reduce((acc, t) => acc * t.inv, 1);
  const sumOfLogs = tokensToUse.reduce((acc, t) => acc + t.log, 0);
  const avgNegativeLog = -sumOfLogs / N;
  const perplexity = Math.exp(avgNegativeLog);

  // Perplexity scale indicator
  const getPerplexityScale = (ppl: number) => {
    if (ppl < 30) {
      return {
        level: 'Extremely Predictable',
        color: 'text-emerald-400',
        barColor: 'bg-emerald-500',
        pct: 15,
        desc: 'The model predicted these tokens with high confidence and minimal surprise.'
      };
    } else if (ppl < 150) {
      return {
        level: 'Moderately Predictable',
        color: 'text-cyan-400',
        barColor: 'bg-cyan-500',
        pct: 45,
        desc: 'Typical natural text with common grammar and occasional creative choices.'
      };
    } else if (ppl < 600) {
      return {
        level: 'Surprising / Unusual',
        color: 'text-amber-400',
        barColor: 'bg-amber-500',
        pct: 75,
        desc: 'Sequence contains rare words, technical jargon, or unexpected phrasing for GPT-2.'
      };
    } else {
      return {
        level: 'Highly Perplexing',
        color: 'text-rose-400',
        barColor: 'bg-rose-500',
        pct: 95,
        desc: 'Very surprising sequence; model was uncertain across many token choices.'
      };
    }
  };

  const scale = getPerplexityScale(perplexity);

  return (
    <section id="perplexity-calculator" className="py-16 sm:py-24 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-sm tracking-wider uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Section 03</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              03. Let's calculate perplexity
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
              Deconstruct the mathematics of perplexity step by step. Watch how raw token probabilities are inverted and aggregated into the final score.
            </p>
          </div>

          {/* Formula Mode Toggle (Product vs Log) */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => setCalculationMode('product')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                calculationMode === 'product'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Product of Inverses (Classic)
            </button>
            <button
              type="button"
              onClick={() => setCalculationMode('log')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                calculationMode === 'log'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Log Cross-Entropy (Real AI)
            </button>
          </div>
        </div>

        {/* Master Formula Box */}
        <div className="glass-panel-glow p-6 sm:p-8 rounded-2xl mb-8 relative">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-purple-400" />
              <span>Mathematical Definition</span>
            </span>
            <span className="text-xs font-mono text-cyan-400 px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
              {calculationMode === 'product' ? 'Geometric Mean Formulation' : 'Exponentiated Loss Formulation'}
            </span>
          </div>

          {calculationMode === 'product' ? (
            <div className="text-center py-4">
              <div className="inline-block p-4 sm:p-6 rounded-2xl bg-navy-950/90 border border-slate-800 font-mono text-lg sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300">
                Perplexity = ( 1 / P(w₁) × 1 / P(w₂) × ... × 1 / P(w_N) ) ^ (1 / N)
              </div>
              <p className="text-xs text-slate-400 mt-3 font-mono">
                The N-th root of the product of all inverse token probabilities.
              </p>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="inline-block p-4 sm:p-6 rounded-2xl bg-navy-950/90 border border-slate-800 font-mono text-lg sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-200 to-purple-300">
                Perplexity = exp( - 1 / N ∑ ln P(wᵢ) ) = 2 ^ ( Cross-Entropy Loss )
              </div>
              <p className="text-xs text-slate-400 mt-3 font-mono">
                Exponent of the average negative log-likelihood (prevents numerical underflow in floating-point math).
              </p>
            </div>
          )}
        </div>

        {/* Step-by-Step Calculation Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Left Column: Interactive Token Calculation Table (7 cols) */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800">
            <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center justify-between">
              <span>Token-by-Token Calculation Table</span>
              <span className="text-xs font-mono text-slate-400 font-normal">
                {N} Tokens
              </span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Token</th>
                    <th className="py-2.5 px-3">P(wᵢ)</th>
                    <th className="py-2.5 px-3">1 / P(wᵢ)</th>
                    <th className="py-2.5 px-3">-ln P(wᵢ)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {tokensToUse.map((t, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 text-slate-500">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-bold text-white">"{t.text}"</td>
                      <td className="py-2.5 px-3 text-cyan-400">{(t.prob * 100).toFixed(2)}%</td>
                      <td className="py-2.5 px-3 text-purple-300 font-semibold">{t.inv.toFixed(1)}</td>
                      <td className="py-2.5 px-3 text-slate-300">{(-t.log).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Arithmetic Summary */}
            <div className="mt-6 pt-5 border-t border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">1. Individual Inverses Multiplied:</span>
                <span className="text-purple-300 font-bold">
                  {productOfInverses > 1e12 ? productOfInverses.toExponential(2) : productOfInverses.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">2. Power (1 / N) with N = {N}:</span>
                <span className="text-cyan-300 font-bold">
                  ^ (1 / {N}) = ^ {(1 / N).toFixed(4)}
                </span>
              </div>
              <div className="flex items-center justify-between text-base pt-3 border-t border-slate-800 text-white font-bold">
                <span className="text-slate-200">Final Perplexity Score:</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 text-xl font-extrabold">
                  {perplexity.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Intuitive Interpretation & Uncertainty Scale (5 cols) */}
          <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-purple-400 text-sm font-semibold mb-3">
                <Gauge className="w-4 h-4" />
                <span>Intuitive Interpretation</span>
              </div>

              <blockquote className="text-base sm:text-lg font-medium text-slate-200 border-l-2 border-purple-500 pl-4 py-1 mb-6 leading-relaxed">
                "Perplexity tells us how uncertain the model was, on average, when predicting the actual tokens."
              </blockquote>

              {/* Visual Uncertainty Scale Gauge */}
              <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 mb-6">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-slate-400">Uncertainty Scale:</span>
                  <span className={`font-bold ${scale.color}`}>{scale.level}</span>
                </div>

                {/* Progress bar scale */}
                <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden relative mb-2">
                  <div
                    className={`h-full rounded-full ${scale.barColor} transition-all duration-700`}
                    style={{ width: `${scale.pct}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>1.0 (Certain)</span>
                  <span>50 (Moderate)</span>
                  <span>250+ (High)</span>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {scale.desc}
                </p>
              </div>

              {/* Key Concept Cards */}
              <div className="space-y-3 text-xs text-slate-400">
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-slate-300">
                  <strong className="text-emerald-400">Lower Perplexity:</strong> Model found the sequence natural and predictable.
                </div>
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-slate-300">
                  <strong className="text-rose-400">Higher Perplexity:</strong> Model was surprised or faced higher uncertainty.
                </div>
              </div>
            </div>

            {/* Note on Fair Evaluation */}
            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                <strong>Important Note:</strong> Perplexity scores are only meaningful when comparing models evaluated on the exact same dataset and identical tokenization vocabulary.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
