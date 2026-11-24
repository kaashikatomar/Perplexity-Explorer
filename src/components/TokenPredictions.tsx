import React from 'react';
import { 
  ArrowRight, 
  HelpCircle, 
  Sparkles, 
  Eye, 
  CheckCircle2, 
  BarChart3, 
  Layers, 
  ChevronRight,
  TrendingUp,
  Brain
} from 'lucide-react';
import { SentenceAnalysisResult, TokenAnalysis } from '../types';

interface TokenPredictionsProps {
  result: SentenceAnalysisResult | null;
  selectedTokenIndex: number;
  onSelectToken: (idx: number) => void;
}

export const TokenPredictions: React.FC<TokenPredictionsProps> = ({
  result,
  selectedTokenIndex,
  onSelectToken,
}) => {
  if (!result || result.tokens.length === 0) {
    return (
      <section id="token-predictions" className="py-16 sm:py-24 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-panel p-12 rounded-2xl max-w-xl mx-auto border border-slate-800">
            <Brain className="w-12 h-12 text-slate-500 mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-bold text-white mb-2">No Sentence Analyzed Yet</h3>
            <p className="text-sm text-slate-400 mb-6">
              Enter and analyze a sentence in Section 01 above to inspect the model's internal step-by-step prediction flow.
            </p>
            <a
              href="#analyze-sentence"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition-all"
            >
              <span>Go to Section 01</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    );
  }

  const selectedToken: TokenAnalysis = result.tokens[selectedTokenIndex] || result.tokens[0];
  const actualTokenRank = selectedToken.rankOfActualToken;
  const isTopRanked = actualTokenRank === 1;

  return (
    <section id="token-predictions" className="py-16 sm:py-24 border-t border-slate-800/80 bg-navy-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-purple-400 font-mono text-sm tracking-wider uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>Section 02</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            02. What happens inside the model?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
            At each position, a causal language model looks strictly at the preceding tokens, calculates a probability distribution across all 50,257 vocabulary words, and then evaluates the word that actually occurred.
          </p>
        </div>

        {/* Token Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-thin">
          <span className="text-xs font-mono uppercase text-slate-400 mr-2 whitespace-nowrap">
            Select Token:
          </span>
          {result.tokens.map((t, idx) => {
            const isSelected = selectedTokenIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectToken(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/25 scale-105'
                    : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span className="opacity-60">#{idx}</span>
                <span>"{t.text}"</span>
                <span className="text-[10px] opacity-75 font-normal">
                  ({(t.probability * 100).toFixed(1)}%)
                </span>
              </button>
            );
          })}
        </div>

        {/* 3-Stage Pipeline Visualization: Previous Context -> Prediction Distribution -> Actual Token */}
        <div className="glass-panel-glow p-6 sm:p-8 rounded-2xl mb-8 border border-purple-500/20 relative">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Causal Prediction Pipeline for Token #{selectedToken.index} ("{selectedToken.text}")</span>
            </div>
            <span className="text-purple-300 font-mono text-[11px]">
              DistilGPT-2 Autoregressive Causal Attention
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
            {/* Step 1: Preceding Context (4 cols) */}
            <div className="lg:col-span-4 p-5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>1. Preceding Context</span>
                </span>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                  {selectedToken.contextTokens.length} tokens
                </span>
              </div>
              
              <div className="min-h-[85px] flex flex-wrap gap-1.5 items-center p-3 rounded-lg bg-navy-950/80 border border-slate-800/80 font-mono text-xs">
                {selectedToken.contextTokens.map((ctxToken, i) => (
                  <span
                    key={i}
                    className={`px-2 py-1 rounded border ${
                      ctxToken === '[BOS]'
                        ? 'bg-purple-950/50 border-purple-500/40 text-purple-300'
                        : 'bg-slate-800/80 border-slate-700 text-slate-200'
                    }`}
                  >
                    {ctxToken}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-2.5">
                The neural network processes these tokens to formulate its next prediction.
              </p>
            </div>

            {/* Arrow Divider */}
            <div className="hidden lg:flex lg:col-span-1 justify-center">
              <ChevronRight className="w-8 h-8 text-purple-400 animate-pulse" />
            </div>

            {/* Step 2: Prediction Distribution (3 cols) */}
            <div className="lg:col-span-3 p-5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span>2. Top Prediction</span>
                </span>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                  Rank #1
                </span>
              </div>

              <div className="min-h-[85px] flex flex-col justify-center p-3 rounded-lg bg-navy-950/80 border border-slate-800/80">
                <div className="text-xs text-slate-400 mb-1">Most expected next word:</div>
                <div className="font-mono text-lg font-bold text-cyan-300 flex items-center justify-between">
                  <span>"{selectedToken.topPredictions[0]?.tokenText}"</span>
                  <span className="text-sm font-semibold text-cyan-400">
                    {(selectedToken.topPredictions[0]?.probability * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2.5">
                Softmax output over 50,257 possible next tokens in vocabulary.
              </p>
            </div>

            {/* Arrow Divider */}
            <div className="hidden lg:flex lg:col-span-1 justify-center">
              <ChevronRight className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>

            {/* Step 3: Actual Token (2 cols) */}
            <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>3. Actual Token</span>
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  isTopRanked ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                }`}>
                  Rank #{actualTokenRank}
                </span>
              </div>

              <div className="min-h-[85px] flex flex-col justify-center p-3 rounded-lg bg-navy-950/80 border border-slate-800/80">
                <div className="font-mono text-lg font-extrabold text-white">
                  "{selectedToken.text}"
                </div>
                <div className="text-xs font-mono text-emerald-400 mt-1">
                  P = {(selectedToken.probability * 100).toFixed(2)}%
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2.5">
                1/P = <strong>{selectedToken.inverseProbability.toFixed(1)}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Top 5 Predictions Chart & Simple Explanation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Top 5 Predicted Tokens Bar Chart (7 cols) */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                <span>Top 5 Candidate Tokens Predicted by DistilGPT-2</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">Softmax %</span>
            </div>

            <div className="space-y-4">
              {selectedToken.topPredictions.map((pred, i) => {
                const isMatch = pred.tokenId === selectedToken.tokenId;
                const probPct = pred.probability * 100;

                return (
                  <div
                    key={pred.tokenId}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isMatch
                        ? 'bg-purple-950/40 border-purple-500/60 shadow-lg shadow-purple-900/20'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-mono text-[10px] text-slate-400 font-bold">
                          #{i + 1}
                        </span>
                        <span className="font-mono font-bold text-sm text-white">
                          "{pred.tokenText}"
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          (ID: {pred.tokenId})
                        </span>
                        {isMatch && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Actual Word Written!</span>
                          </span>
                        )}
                      </div>
                      <span className="font-mono font-bold text-cyan-300 text-sm">
                        {probPct.toFixed(2)}%
                      </span>
                    </div>

                    {/* Animated horizontal bar */}
                    <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden relative">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isMatch
                            ? 'bg-gradient-to-r from-purple-500 to-cyan-400'
                            : 'bg-slate-600'
                        }`}
                        style={{ width: `${Math.max(2, probPct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* If actual token was NOT in top 5, display where it ranked */}
            {actualTokenRank > 5 && (
              <div className="mt-5 p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs">
                <div className="flex items-center justify-between text-amber-300 font-semibold mb-1">
                  <span>Actual Token: "{selectedToken.text}"</span>
                  <span className="font-mono">Rank #{actualTokenRank} of 50,257</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  The model did not expect "{selectedToken.text}" as one of its top 5 candidates. 
                  It assigned it a probability of <strong>{(selectedToken.probability * 100).toFixed(4)}%</strong>. 
                  Because this probability is small, its inverse is high ({selectedToken.inverseProbability.toFixed(1)}), which increases perplexity.
                </p>
              </div>
            )}
          </div>

          {/* Simple Language Explanation Card (5 cols) */}
          <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold mb-3">
                <Sparkles className="w-4 h-4" />
                <span>Beginner-Friendly Explanation</span>
              </div>

              <h4 className="text-xl font-bold text-white mb-4">
                Why did the AI assign {(selectedToken.probability * 100).toFixed(2)}% to "{selectedToken.text}"?
              </h4>

              <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                <p>
                  <strong>Context Memory:</strong> Before predicting "{selectedToken.text}", the model read:{' '}
                  <span className="text-purple-300 font-mono text-xs">
                    {selectedToken.contextTokens.join(' ')}
                  </span>
                  .
                </p>

                {isTopRanked ? (
                  <p className="text-emerald-300 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                    🎯 <strong>Top Choice!</strong> The model accurately anticipated "{selectedToken.text}" as its #1 most likely token. This yields a very small inverse penalty (1 / P ≈ {selectedToken.inverseProbability.toFixed(2)}), keeping perplexity low.
                  </p>
                ) : actualTokenRank <= 5 ? (
                  <p className="text-cyan-300 bg-cyan-500/10 p-3 rounded-xl border border-cyan-500/20">
                    💡 <strong>Strong Contender!</strong> Although "{selectedToken.topPredictions[0]?.tokenText}" was the model's #1 pick, "{selectedToken.text}" was in its top 5 candidates (Rank #{actualTokenRank}).
                  </p>
                ) : (
                  <p className="text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800">
                    🔍 <strong>Surprise to the Model:</strong> Language has thousands of possible continuations. While perfectly natural to humans, the model considered words like "{selectedToken.topPredictions[0]?.tokenText}" more statistically common in its pre-training data.
                  </p>
                )}

                <p className="text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <strong>Key Takeaway:</strong> A language model never thinks ahead to the end of a sentence. It works strictly step-by-step, generating probabilities one single token at a time.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <a
                href="#perplexity-calculator"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-all"
              >
                <span>See How These Numbers Multiply Into Perplexity</span>
                <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
