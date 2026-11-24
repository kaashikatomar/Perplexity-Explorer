import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Loader2, 
  DownloadCloud, 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  Layers, 
  HelpCircle,
  Clock,
  Zap,
  ArrowRight
} from 'lucide-react';
import { 
  SentenceAnalysisResult, 
  ModelState, 
  ModelLoadingProgress,
  TokenAnalysis 
} from '../types';

interface SentenceAnalyzerProps {
  sentence: string;
  onSentenceChange: (s: string) => void;
  onAnalyze: (strategy?: 'bos_conditioned' | 'prefix_context') => void;
  result: SentenceAnalysisResult | null;
  modelState: ModelState;
  loadingProgress?: ModelLoadingProgress;
  onSelectToken: (tokenIndex: number) => void;
  selectedTokenIndex: number;
  firstTokenStrategy: 'bos_conditioned' | 'prefix_context';
  onStrategyChange: (strategy: 'bos_conditioned' | 'prefix_context') => void;
}

export const SentenceAnalyzer: React.FC<SentenceAnalyzerProps> = ({
  sentence,
  onSentenceChange,
  onAnalyze,
  result,
  modelState,
  loadingProgress,
  onSelectToken,
  selectedTokenIndex,
  firstTokenStrategy,
  onStrategyChange
}) => {
  const exampleSentences = [
    "I love Python",
    "The capital of France is Paris",
    "Artificial intelligence is fascinating",
    "I enjoy learning machine learning"
  ];

  const [showFirstTokenInfo, setShowFirstTokenInfo] = useState(false);

  const isAnalyzing = modelState === 'analyzing';
  const isLoading = modelState === 'loading';

  // Helper to color-code probability
  const getProbabilityBadgeStyle = (prob: number) => {
    const pct = prob * 100;
    if (pct >= 20) {
      return {
        barBg: 'bg-emerald-500',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        bg: 'bg-emerald-500/10',
        label: 'High Probability'
      };
    } else if (pct >= 1) {
      return {
        barBg: 'bg-purple-500',
        text: 'text-purple-400',
        border: 'border-purple-500/30',
        bg: 'bg-purple-500/10',
        label: 'Medium Probability'
      };
    } else {
      return {
        barBg: 'bg-rose-500',
        text: 'text-rose-400',
        border: 'border-rose-500/30',
        bg: 'bg-rose-500/10',
        label: 'Surprising / Low'
      };
    }
  };

  return (
    <section id="analyze-sentence" className="py-16 sm:py-24 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-sm tracking-wider uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Section 01</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              01. Let's see what the AI thinks
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
              Type any sentence or pick an example below. We'll run actual in-browser DistilGPT-2 inference to reveal the model's exact token-by-token probabilities.
            </p>
          </div>

          {/* First Token Causal Context Strategy Selector */}
          <div className="relative">
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
              <span className="text-slate-400 pl-2 font-mono text-[11px] hidden md:inline">First Token:</span>
              <button
                type="button"
                onClick={() => onStrategyChange('bos_conditioned')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  firstTokenStrategy === 'bos_conditioned'
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                [BOS] Conditioned
              </button>
              <button
                type="button"
                onClick={() => onStrategyChange('prefix_context')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  firstTokenStrategy === 'prefix_context'
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tokens 2..N Only
              </button>
              <button
                type="button"
                onClick={() => setShowFirstTokenInfo(!showFirstTokenInfo)}
                className="p-1 text-slate-400 hover:text-cyan-400"
                title="Learn why the first token needs special handling"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* First Token Explanatory Popover */}
            {showFirstTokenInfo && (
              <div className="absolute right-0 mt-2 w-80 glass-panel-glow p-4 rounded-xl text-xs text-slate-300 z-30 shadow-2xl border border-purple-500/30">
                <div className="font-semibold text-white mb-1.5 flex items-center gap-1.5 text-purple-300">
                  <Info className="w-4 h-4 text-cyan-400" />
                  <span>Why Causal LMs Need Preceding Context</span>
                </div>
                <p className="mb-2 leading-relaxed">
                  In an autoregressive causal LM like GPT-2, every prediction requires previous tokens:
                  <code className="text-cyan-300 font-mono block mt-1">P(w_i | w_1...w_&#123;i-1&#125;)</code>
                </p>
                <p className="text-slate-400 leading-relaxed mb-2">
                  • <strong>[BOS] Conditioned (Default)</strong>: We prepend the standard Beginning-of-Sequence token <code className="text-purple-300">&lt;|endoftext|&gt;</code> so token 0 is predicted from the start of a sequence.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  • <strong>Tokens 2..N Only</strong>: Token 0 acts as prompt prefix, and perplexity evaluates solely tokens 2..N.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Input Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl mb-8 border border-slate-800">
          <label htmlFor="sentence-input" className="block text-sm font-medium text-slate-300 mb-2">
            Enter your sentence to evaluate:
          </label>
          <div className="relative mb-4">
            <textarea
              id="sentence-input"
              rows={3}
              value={sentence}
              onChange={(e) => onSentenceChange(e.target.value)}
              placeholder="e.g. Artificial intelligence is fascinating"
              className="w-full px-4 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-slate-500 font-sans text-base sm:text-lg resize-none transition-all outline-none"
            />
            <div className="absolute bottom-3 right-3 text-xs font-mono text-slate-500">
              {sentence.length} chars
            </div>
          </div>

          {/* Example Sentence Buttons */}
          <div className="mb-6">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Or click an example sentence:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {exampleSentences.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => {
                    onSentenceChange(ex);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    sentence === ex
                      ? 'bg-purple-600/30 border border-purple-500/60 text-purple-200 shadow-sm shadow-purple-500/20'
                      : 'bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white'
                  }`}
                >
                  "{ex}"
                </button>
              ))}
            </div>
          </div>

          {/* Model Download Progress Bar Banner (if downloading) */}
          {isLoading && (
            <div className="mb-6 p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 animate-pulse">
              <div className="flex items-center justify-between text-xs font-mono text-purple-300 mb-2">
                <span className="flex items-center gap-2">
                  <DownloadCloud className="w-4 h-4 text-cyan-400 animate-bounce" />
                  <span>Downloading DistilGPT-2 ONNX Model (~80MB)...</span>
                </span>
                <span className="font-bold text-cyan-300">
                  {loadingProgress?.progress ? `${Math.round(loadingProgress.progress)}%` : 'Starting...'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-300"
                  style={{ width: `${loadingProgress?.progress || 10}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                * Initial download takes 5-15 seconds depending on connection speed. It will be cached permanently in your browser for instant subsequent runs.
              </p>
            </div>
          )}

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800/60">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Real DistilGPT-2 Softmax Probabilities • Autoregressive Causal Context</span>
            </div>

            <button
              type="button"
              onClick={() => onAnalyze(firstTokenStrategy)}
              disabled={isAnalyzing || !sentence.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base shadow-lg shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Computing Softmax Logits...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Analyze My Sentence</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Display */}
        {result && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Metric 1: Perplexity */}
              <div className="glass-panel-glow p-5 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Overall Perplexity
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    PPL
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">
                  {result.perplexity.toFixed(2)}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {result.perplexity < 50
                    ? 'Very predictable sequence for GPT-2'
                    : result.perplexity < 250
                    ? 'Moderate uncertainty across tokens'
                    : 'Surprising / unusual sequence for model'}
                </p>
              </div>

              {/* Metric 2: Cross Entropy */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Cross-Entropy Loss
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    H(P)
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white">
                  {result.crossEntropy.toFixed(3)}
                  <span className="text-xs font-mono text-slate-400 ml-1 font-normal">nats</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 font-mono">
                  = {result.crossEntropyBits.toFixed(2)} bits/token (e^{result.crossEntropy.toFixed(2)} = {result.perplexity.toFixed(1)})
                </p>
              </div>

              {/* Metric 3: Total Tokens */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Tokens Evaluated
                  </span>
                  <Layers className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white">
                  {result.evaluatedTokensCount}
                  <span className="text-xs font-mono text-slate-400 ml-1 font-normal">
                    / {result.totalTokens} tokens
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  BPE vocabulary mapping: 50,257 IDs
                </p>
              </div>

              {/* Metric 4: Inference Time */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Inference Runtime
                  </span>
                  <Clock className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">
                  {result.inferenceTimeMs}
                  <span className="text-xs font-mono text-slate-400 ml-1 font-normal">ms</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Client-side ONNX WebAssembly
                </p>
              </div>
            </div>

            {/* Token-by-Token Probability Breakdown Card */}
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-4 mb-6 gap-2">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>Token Probabilities & Uncertainty Breakdown</span>
                    <span className="text-xs font-normal text-slate-400 font-mono">
                      (Click any token to inspect details in Section 02)
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Causal context rule: Token <code className="text-cyan-300">w_i</code> is evaluated given all tokens before it.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-slate-300">&gt;20%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <span className="text-slate-300">1–20%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-slate-300">&lt;1%</span>
                  </div>
                </div>
              </div>

              {/* Token Chips Sequence */}
              <div className="flex flex-wrap gap-2.5 mb-8">
                {result.tokens.map((t, idx) => {
                  const isSelected = selectedTokenIndex === idx;
                  const style = getProbabilityBadgeStyle(t.probability);
                  const isFirstAndPrefix = t.isFirstToken && firstTokenStrategy === 'prefix_context';

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onSelectToken(idx)}
                      className={`relative px-3.5 py-2.5 rounded-xl border transition-all text-left group cursor-pointer ${
                        isSelected
                          ? 'ring-2 ring-cyan-400 bg-slate-800/90 shadow-lg shadow-cyan-500/20'
                          : 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-700/60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 text-[10px] font-mono text-slate-400 mb-1">
                        <span>#{idx}</span>
                        <span className="text-slate-500">ID: {t.tokenId}</span>
                      </div>
                      <div className="font-mono text-base font-bold text-white flex items-center gap-1">
                        {t.text.startsWith(' ') && (
                          <span className="text-purple-400/60 text-xs">_</span>
                        )}
                        <span>{t.text.trim() || '␣'}</span>
                      </div>
                      <div className={`text-xs font-mono font-semibold mt-1.5 ${style.text}`}>
                        {isFirstAndPrefix ? (
                          <span className="text-slate-500 font-normal">Context Prefix</span>
                        ) : (
                          `${(t.probability * 100).toFixed(2)}%`
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Detailed Horizontal Probability Bars */}
              <div className="space-y-4">
                <div className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2">
                  Horizontal Probability Distribution & Inverse Penalty:
                </div>

                {result.tokens.map((t, idx) => {
                  const style = getProbabilityBadgeStyle(t.probability);
                  const isSelected = selectedTokenIndex === idx;
                  const probPct = t.probability * 100;
                  const isFirstAndPrefix = t.isFirstToken && firstTokenStrategy === 'prefix_context';

                  return (
                    <div
                      key={idx}
                      onClick={() => onSelectToken(idx)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-800/90 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                          : 'bg-slate-900/50 hover:bg-slate-800/50 border-slate-800'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        {/* Left: Token info */}
                        <div className="flex items-center gap-2.5">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-mono text-slate-400">
                            #{idx}
                          </span>
                          <span className="font-mono text-sm font-bold text-white bg-slate-800/80 px-2.5 py-0.5 rounded-lg border border-slate-700">
                            "{t.text}"
                          </span>
                          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                            (ID: {t.tokenId})
                          </span>
                          <span className="text-xs text-slate-400">
                            Rank <strong className="text-slate-200">#{t.rankOfActualToken}</strong> in vocabulary
                          </span>
                        </div>

                        {/* Right: Probability & Inverse stats */}
                        <div className="flex items-center gap-4 text-xs font-mono">
                          {isFirstAndPrefix ? (
                            <span className="text-slate-500 italic">Excluded from perplexity calculation</span>
                          ) : (
                            <>
                              <div>
                                <span className="text-slate-400">P = </span>
                                <strong className={style.text}>{(t.probability * 100).toFixed(2)}%</strong>
                              </div>
                              <div className="text-slate-400">
                                <span>1/P = </span>
                                <strong className="text-slate-200">{t.inverseProbability.toFixed(1)}</strong>
                              </div>
                              <div className="text-slate-400 hidden md:block">
                                <span>Surprise: </span>
                                <strong className="text-indigo-300">{t.surpriseBits.toFixed(1)} bits</strong>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Bar Visualization */}
                      {!isFirstAndPrefix && (
                        <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden relative">
                          <div
                            className={`h-full rounded-full ${style.barBg} transition-all duration-500`}
                            style={{ width: `${Math.min(100, Math.max(1, probPct))}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom quick navigation hint */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Currently selected: Token #{selectedTokenIndex} <strong className="text-cyan-300">"{result.tokens[selectedTokenIndex]?.text}"</strong>
                </span>
                <a
                  href="#token-predictions"
                  className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  <span>Explore prediction details in Section 02</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
