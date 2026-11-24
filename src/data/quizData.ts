import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What happens to perplexity when a language model's token probabilities increase?",
    options: [
      "Perplexity decreases (approaching 1 for perfect certainty)",
      "Perplexity increases",
      "Perplexity stays the same",
      "Perplexity becomes negative"
    ],
    correctIndex: 0,
    explanation: "Perplexity is the geometric mean of the inverse probabilities (1/P). As P increases toward 1.0, 1/P drops toward 1.0, meaning perplexity decreases. Lower perplexity signifies higher certainty!",
    conceptBadge: "Inverse Probabilities"
  },
  {
    id: 2,
    question: "If every token in a sentence is assigned a probability of exactly 0.25, what is the perplexity?",
    options: [
      "0.25",
      "4.0",
      "16.0",
      "It depends on the number of tokens"
    ],
    correctIndex: 1,
    explanation: "Because 1 / 0.25 = 4, the calculation is (4 × 4 × ... × 4)^(1/N) = (4^N)^(1/N) = 4. The number of tokens cancels out, giving exactly 4! This means the model is as uncertain as randomly guessing among 4 equally likely choices.",
    conceptBadge: "Geometric Mean"
  },
  {
    id: 3,
    question: "What happens if a language model assigns a near-zero probability (e.g., 0.0001) to just ONE token?",
    options: [
      "The total perplexity changes very little because other tokens compensate",
      "Perplexity explodes dramatically higher because 1/P becomes 10,000",
      "The perplexity drops to zero",
      "The model ignores that token automatically"
    ],
    correctIndex: 1,
    explanation: "Because perplexity multiplies inverse probabilities (or sums log loss), a single low-probability token produces a gigantic inverse value (1 / 0.0001 = 10,000) or massive log penalty, heavily punishing the overall score.",
    conceptBadge: "Sensitivity to Outliers"
  },
  {
    id: 4,
    question: "Does a lower perplexity score always guarantee the model is 'better' at talking to humans?",
    options: [
      "Yes, the lower the perplexity, the more human-like and creative the text is guaranteed to be",
      "Only when comparing models on the exact same test dataset and tokenization vocabulary",
      "No, high perplexity is always preferable in AI",
      "Yes, perplexity is an absolute benchmark independent of tokenization"
    ],
    correctIndex: 1,
    explanation: "Perplexity is strongly dependent on the tokenizer and test set. For example, character-level models have much lower perplexities than word-level models purely because their vocabulary is smaller. Comparing perplexity is only valid across identical evaluation datasets and tokenizers.",
    conceptBadge: "Fair Evaluation"
  },
  {
    id: 5,
    question: "What is the intuitive interpretation of a Perplexity value of 50?",
    options: [
      "The model got 50% of the words wrong",
      "The model predicts words 50 times faster than a human",
      "The model was, on average, as uncertain as rolling a fair 50-sided die at each token",
      "The sentence has a 50% probability of being grammatically valid"
    ],
    correctIndex: 2,
    explanation: "Perplexity can be understood as the 'effective branching factor'. A perplexity of 50 means that on average at each step, the model's uncertainty is equivalent to picking uniformly from 50 equally probable candidate tokens.",
    conceptBadge: "Branching Factor"
  },
  {
    id: 6,
    question: "Why do real-world language models compute cross-entropy loss with logarithms instead of multiplying raw inverse probabilities?",
    options: [
      "Logarithms are required by GPUs because they cannot multiply floats",
      "Multiplying many probabilities < 1 causes floating-point numerical underflow (rounding to 0)",
      "Logarithms make the model outputs legally copyright-free",
      "It is an arbitrary tradition with no numerical benefit"
    ],
    correctIndex: 1,
    explanation: "Multiplying dozens of probabilities (e.g. 0.05 × 0.12 × 0.01...) quickly produces numbers smaller than 10^-50, which crash standard floating-point numbers to zero (underflow). Adding log probabilities: exp(-1/N * sum(ln P)) is numerically stable!",
    conceptBadge: "Numerical Stability"
  },
  {
    id: 7,
    question: "In a causal language model like GPT-2, how is the probability of token 'w3' computed?",
    options: [
      "Conditioned on both the past tokens (w1, w2) and the future tokens (w4, w5)",
      "Conditioned only on the immediately preceding context: P(w3 | w1, w2)",
      "Independent of any context: P(w3)",
      "By averaging all words in the dictionary"
    ],
    correctIndex: 1,
    explanation: "Causal language models are autoregressive: they only look backward. Token w3 is predicted strictly conditioned on preceding tokens w1 and w2: P(w3 | w1, w2). Future tokens are masked out.",
    conceptBadge: "Causal Attention"
  }
];
