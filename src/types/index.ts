export interface TopPrediction {
  tokenId: number;
  tokenText: string;
  probability: number;
  rank: number;
}

export interface TokenAnalysis {
  index: number;
  text: string;
  displaySymbol: string;
  tokenId: number;
  probability: number; // P(w_i | context)
  inverseProbability: number; // 1 / P(w_i)
  logProbability: number; // ln(P(w_i))
  log2Probability: number; // log2(P(w_i))
  surpriseBits: number; // -log2(P(w_i))
  topPredictions: TopPrediction[];
  rankOfActualToken: number;
  contextTokens: string[];
  isFirstToken: boolean;
}

export interface SentenceAnalysisResult {
  sentence: string;
  tokens: TokenAnalysis[];
  totalTokens: number;
  evaluatedTokensCount: number;
  perplexity: number;
  crossEntropy: number; // in nats (base e)
  crossEntropyBits: number; // in bits (base 2)
  productOfInverses: number;
  geometricMean: number;
  handlingOfFirstToken: string;
  inferenceTimeMs: number;
}

export type ModelState = 'idle' | 'loading' | 'ready' | 'analyzing' | 'error';

export interface ModelLoadingProgress {
  status: string;
  file?: string;
  progress?: number;
  loaded?: number;
  total?: number;
}

export interface SimulatedToken {
  id: string;
  text: string;
  probability: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptBadge: string;
}

export interface ConceptCardData {
  id: string;
  title: string;
  shortDesc: string;
  category: 'Fundamentals' | 'Probabilities' | 'Evaluation';
  formula?: string;
  explanation: string[];
  keyTakeaway: string;
  interactiveTip?: string;
}
