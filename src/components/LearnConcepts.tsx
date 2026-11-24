import React, { useState } from 'react';
import { 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Lightbulb, 
  ExternalLink,
  Code2,
  HelpCircle,
  Cpu,
  Layers,
  Percent,
  Calculator,
  Compass
} from 'lucide-react';
import { CONCEPTS_DATA } from '../data/conceptsData';

export const LearnConcepts: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>('perplexity');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Fundamentals', 'Probabilities', 'Evaluation'];

  const filteredConcepts = selectedCategory === 'All'
    ? CONCEPTS_DATA
    : CONCEPTS_DATA.filter(c => c.category === selectedCategory);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  // Helper icons per concept
  const getConceptIcon = (id: string) => {
    switch (id) {
      case 'language-model':
        return <Cpu className="w-5 h-5 text-purple-400" />;
      case 'token':
      case 'tokenization':
        return <Layers className="w-5 h-5 text-cyan-400" />;
      case 'probability':
      case 'conditional-probability':
        return <Percent className="w-5 h-5 text-indigo-400" />;
      case 'perplexity':
      case 'cross-entropy':
        return <Calculator className="w-5 h-5 text-emerald-400" />;
      default:
        return <Compass className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <section id="learn-concepts" className="py-16 sm:py-24 border-t border-slate-800/80 bg-navy-950/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-purple-400 font-mono text-sm tracking-wider uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>Section 06</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            06. Learn the Important Concepts
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
            Clear, beginner-friendly explanations with real analogies to help you master the inner workings of modern language models.
          </p>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Expandable Concept Cards */}
        <div className="space-y-4">
          {filteredConcepts.map((concept) => {
            const isExpanded = expandedId === concept.id;

            return (
              <div
                key={concept.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isExpanded
                    ? 'glass-panel-glow border-purple-500/40 shadow-xl shadow-purple-950/30'
                    : 'glass-panel hover:border-slate-700/80 border-slate-800/80'
                }`}
              >
                {/* Header (Always Clickable) */}
                <button
                  type="button"
                  onClick={() => toggleExpand(concept.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                      {getConceptIcon(concept.id)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-white">
                          {concept.title}
                        </h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800/80 text-slate-400 border border-slate-700/60 hidden sm:inline">
                          {concept.category}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1 line-clamp-1">
                        {concept.shortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-800/60 text-slate-400 shrink-0">
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-purple-400" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {/* Expanded Content Area */}
                {isExpanded && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-8 pt-2 border-t border-slate-800/60 space-y-4 text-sm text-slate-300 leading-relaxed">
                    {/* Formula Callout (if concept has one) */}
                    {concept.formula && (
                      <div className="p-3.5 rounded-xl bg-navy-950/80 border border-slate-800 font-mono text-cyan-300 text-xs sm:text-sm text-center">
                        {concept.formula}
                      </div>
                    )}

                    {/* Paragraph Explanations */}
                    <div className="space-y-3">
                      {concept.explanation.map((para, pIdx) => (
                        <p key={pIdx}>{para}</p>
                      ))}
                    </div>

                    {/* Key Takeaway Banner */}
                    <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200 flex items-start gap-3">
                      <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block mb-0.5">Key Takeaway:</strong>
                        <span>{concept.keyTakeaway}</span>
                      </div>
                    </div>

                    {/* Interactive Tip */}
                    {concept.interactiveTip && (
                      <div className="text-xs text-slate-400 italic flex items-center gap-2 pt-2">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span>Try it yourself: {concept.interactiveTip}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
