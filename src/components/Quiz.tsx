import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  HelpCircle,
  Trophy,
  Flame,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUIZ_QUESTIONS } from '../data/quizData';

export const Quiz: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];
  const totalQuestions = QUIZ_QUESTIONS.length;

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(index);
    setIsAnswerSubmitted(true);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      setScore(s => s + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);

      // Trigger mini confetti on correct answer
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.8 },
        colors: ['#A855F7', '#06B6D4', '#10B981']
      });
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < totalQuestions) {
      setCurrentIdx(i => i + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
      // Big confetti celebration
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#A855F7', '#6366F1', '#06B6D4', '#10B981', '#F59E0B']
      });
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setStreak(0);
    setQuizFinished(false);
  };

  return (
    <section id="challenge-quiz" className="py-16 sm:py-24 border-t border-slate-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-sm tracking-wider uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Section 05</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            05. Can you predict like an AI?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Test your understanding of token probabilities, causal context, and perplexity mathematics with instant feedback.
          </p>
        </div>

        {/* Quiz Container */}
        <div className="glass-panel-glow p-6 sm:p-10 rounded-2xl relative overflow-hidden">
          {!quizFinished ? (
            <>
              {/* Top Status & Progress Bar */}
              <div className="flex items-center justify-between text-xs font-mono mb-4 text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="text-purple-300 font-semibold">
                    Question {currentIdx + 1} of {totalQuestions}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400">
                    {currentQ.conceptBadge}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Streak: {streak}</span>
                  </div>
                  <div className="text-cyan-400 font-bold">
                    Score: {score} / {currentIdx + (isAnswerSubmitted ? 1 : 0)}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-800 mb-8 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-6 leading-snug">
                {currentQ.question}
              </h3>

              {/* Multiple Choice Options */}
              <div className="space-y-3 mb-8">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrectOption = idx === currentQ.correctIndex;

                  let cardStyle = "bg-slate-900/80 hover:bg-slate-800/80 border-slate-700/60 text-slate-200";

                  if (isAnswerSubmitted) {
                    if (isCorrectOption) {
                      cardStyle = "bg-emerald-950/40 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-900/30";
                    } else if (isSelected) {
                      cardStyle = "bg-rose-950/40 border-rose-500 text-rose-200 shadow-md shadow-rose-900/30";
                    } else {
                      cardStyle = "bg-slate-900/40 border-slate-800/60 text-slate-500 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAnswerSubmitted}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-4 rounded-xl border text-left font-sans text-sm sm:text-base font-medium transition-all flex items-center justify-between gap-4 cursor-pointer ${cardStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {isAnswerSubmitted && isCorrectOption && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      {isAnswerSubmitted && isSelected && !isCorrectOption && (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Instant Feedback & Explanation */}
              {isAnswerSubmitted && (
                <div className="p-4 sm:p-5 rounded-xl bg-slate-900/90 border border-slate-800 mb-6 animate-fadeIn">
                  <div className="flex items-center gap-2 font-bold text-sm mb-2">
                    {selectedAnswer === currentQ.correctIndex ? (
                      <span className="text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Correct! Well done!</span>
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4" />
                        <span>Not quite right</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </div>
              )}

              {/* Next Question Button */}
              {isAnswerSubmitted && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 cursor-pointer transition-all"
                  >
                    <span>{currentIdx + 1 < totalQuestions ? 'Next Question' : 'View Final Score'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Quiz Completed View */
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 p-1 mx-auto mb-6 shadow-xl shadow-purple-900/40">
                <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-cyan-300" />
                </div>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                Challenge Complete!
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                You scored <strong className="text-cyan-300">{score}</strong> out of <strong className="text-white">{totalQuestions}</strong>
              </p>

              {/* Performance Summary Badge */}
              <div className="inline-block p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 text-xs text-slate-200 mb-8 max-w-md">
                {score === totalQuestions ? (
                  <span className="text-emerald-300 font-semibold">
                    🌟 Perfect Score! You've mastered language model perplexity and token probabilities!
                  </span>
                ) : score >= totalQuestions * 0.7 ? (
                  <span className="text-cyan-300 font-semibold">
                    👏 Great job! You have a solid grasp of how AI models calculate uncertainty.
                  </span>
                ) : (
                  <span className="text-purple-300 font-semibold">
                    💡 Good effort! Review Section 03 & 06 to reinforce the math and concepts.
                  </span>
                )}
              </div>

              {/* Replay Quiz Button */}
              <div>
                <button
                  type="button"
                  onClick={handleRestartQuiz}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Replay Quiz</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
