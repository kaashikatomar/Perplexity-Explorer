import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SentenceAnalyzer } from './components/SentenceAnalyzer';
import { TokenPredictions } from './components/TokenPredictions';
import { PerplexityCalculator } from './components/PerplexityCalculator';
import { SimulatedExperiments } from './components/SimulatedExperiments';
import { Quiz } from './components/Quiz';
import { LearnConcepts } from './components/LearnConcepts';
import { Footer } from './components/Footer';

import { 
  SentenceAnalysisResult, 
  ModelState, 
  ModelLoadingProgress 
} from './types';
import { perplexityEngine } from './services/perplexityEngine';

export const App: React.FC = () => {
  const [sentence, setSentence] = useState<string>("I love Python");
  const [firstTokenStrategy, setFirstTokenStrategy] = useState<'bos_conditioned' | 'prefix_context'>('bos_conditioned');
  const [modelState, setModelState] = useState<ModelState>('idle');
  const [loadingProgress, setLoadingProgress] = useState<ModelLoadingProgress | undefined>(undefined);
  const [result, setResult] = useState<SentenceAnalysisResult | null>(null);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0);
  const [hasAnalyzed, setHasAnalyzed] = useState<boolean>(true);

  // Initial load: show verified precomputed result for "I love Python" instantly
  useEffect(() => {
    const initialResult = perplexityEngine.getPrecomputedSentence("I love Python");
    if (initialResult) {
      setResult(initialResult);
    }
  }, []);

  // Trigger downloading the model into browser cache
  const handleTriggerLoadModel = async () => {
    if (modelState === 'ready' || modelState === 'loading') return;
    setModelState('loading');

    try {
      await perplexityEngine.loadModel((p) => {
        setLoadingProgress(p);
      });
      setModelState('ready');
    } catch (err) {
      console.error(err);
      setModelState('error');
    }
  };

  // Run real analysis on current sentence
  const handleAnalyze = async (strategy: 'bos_conditioned' | 'prefix_context' = firstTokenStrategy) => {
    if (!sentence.trim()) return;

    // Check if sentence has a precomputed cache and model is not yet loaded
    const cached = perplexityEngine.getPrecomputedSentence(sentence);
    if (!perplexityEngine.getIsReady() && cached) {
      // Use verified precomputed result immediately while offering to load full model
      setResult(cached);
      setHasAnalyzed(true);
      setSelectedTokenIndex(0);
      return;
    }

    if (!perplexityEngine.getIsReady()) {
      setModelState('loading');
    } else {
      setModelState('analyzing');
    }

    try {
      const res = await perplexityEngine.analyzeSentence(sentence, strategy);
      setResult(res);
      setModelState('ready');
      setHasAnalyzed(true);
      setSelectedTokenIndex(0);
    } catch (err: any) {
      console.error("Inference error:", err);
      // Fallback check
      if (cached) {
        setResult(cached);
        setModelState('ready');
      } else {
        setModelState('error');
        alert("Model inference error: " + (err?.message || "Failed to analyze"));
      }
    }
  };

  // Re-run analysis or strategy adjustment
  const handleStrategyChange = (newStrategy: 'bos_conditioned' | 'prefix_context') => {
    setFirstTokenStrategy(newStrategy);
    if (result) {
      // Re-evaluate with new strategy
      handleAnalyze(newStrategy);
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Sticky Navigation Bar */}
      <Navbar
        modelState={modelState}
        loadingProgress={loadingProgress}
        onTriggerLoadModel={handleTriggerLoadModel}
        hasAnalyzed={hasAnalyzed}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Section 01: Enter Your Sentence */}
        <SentenceAnalyzer
          sentence={sentence}
          onSentenceChange={setSentence}
          onAnalyze={handleAnalyze}
          result={result}
          modelState={modelState}
          loadingProgress={loadingProgress}
          onSelectToken={setSelectedTokenIndex}
          selectedTokenIndex={selectedTokenIndex}
          firstTokenStrategy={firstTokenStrategy}
          onStrategyChange={handleStrategyChange}
        />

        {/* Section 02: Understand Token Predictions */}
        <TokenPredictions
          result={result}
          selectedTokenIndex={selectedTokenIndex}
          onSelectToken={setSelectedTokenIndex}
        />

        {/* Section 03: Perplexity Calculator */}
        <PerplexityCalculator
          result={result}
          firstTokenStrategy={firstTokenStrategy}
        />

        {/* Section 04: Simulated Experiments */}
        <SimulatedExperiments />

        {/* Section 05: Challenge Quiz */}
        <Quiz />

        {/* Section 06: Learn Important Concepts */}
        <LearnConcepts />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
