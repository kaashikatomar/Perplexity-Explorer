import { ConceptCardData } from '../types';

export const CONCEPTS_DATA: ConceptCardData[] = [
  {
    id: 'language-model',
    title: 'What is a Language Model?',
    shortDesc: 'A statistical engine that assigns probabilities to sequences of words.',
    category: 'Fundamentals',
    explanation: [
      "At its core, a language model is a probabilistic machine. Given a history of past words, it doesn't 'think' like a human—instead, it calculates a massive probability distribution over every possible word in its vocabulary to determine what word comes next.",
      "Modern models like GPT-2, GPT-4, and Claude are trained on trillions of words from the web and literature to learn syntax, facts, code patterns, and reasoning templates by repeatedly guessing the next token."
    ],
    keyTakeaway: "A language model turns raw text into a sequence of probabilistic next-token predictions.",
    interactiveTip: "Try typing common sayings vs unusual sentences in Section 01 to see how probability reflects familiarity."
  },
  {
    id: 'token',
    title: 'What is a Token?',
    shortDesc: 'The discrete Lego bricks of text processed by language models.',
    category: 'Fundamentals',
    explanation: [
      "Language models do not read raw letters or full sentences directly. Instead, text is chopped up into small numerical chunks called 'tokens'.",
      "A token can be a full common word (like 'love'), a subword syllable (like 'fascin' and 'ating'), punctuation, or even a single byte. For English, 1 token is roughly equivalent to 4 characters or ~0.75 words."
    ],
    keyTakeaway: "Computers only understand numbers; tokenizers map text fragments to integer IDs in the model's vocabulary.",
    interactiveTip: "Notice in Section 01 how 'fascinating' is split into multiple sub-tokens: 'fascin' + 'ating'."
  },
  {
    id: 'tokenization',
    title: 'What is Tokenization?',
    shortDesc: 'The algorithm that decomposes raw strings into subword vocabulary units.',
    category: 'Fundamentals',
    explanation: [
      "Tokenization algorithms (such as Byte-Pair Encoding / BPE used in GPT-2 and modern LLMs) balance vocabulary size with sequence length.",
      "If a dictionary used only full words, it would need millions of words and fail on typos or new slang. If it used only single letters, sequences would be too long. Subword tokenization merges frequent character pairs into reusable building blocks (~50,000 in GPT-2)."
    ],
    keyTakeaway: "Byte-Pair Encoding (BPE) handles rare words gracefully by breaking them into familiar syllables.",
    interactiveTip: "Notice the leading space symbol (Ġ) indicating whitespace before a token."
  },
  {
    id: 'probability',
    title: 'What is Probability in AI?',
    shortDesc: 'A number between 0 and 1 expressing how confident the model is.',
    category: 'Probabilities',
    formula: "P(x) \\in [0, 1] \\quad \\text{where} \\sum_{v \\in V} P(v) = 1.0",
    explanation: [
      "In a language model's output layer, the network produces raw unnormalized scores called 'logits'.",
      "The model then passes these logits through the Softmax mathematical function, which squashes the numbers so they all lie strictly between 0 and 1 and sum up to exactly 1.0 (or 100%). Each candidate token in the 50,257-word dictionary gets a probability score."
    ],
    keyTakeaway: "Probabilities represent the model's subjective belief over the entire vocabulary at that exact moment.",
    interactiveTip: "See Section 02 to inspect the top 5 predicted tokens and their percentage share of the softmax sum."
  },
  {
    id: 'conditional-probability',
    title: 'What is Conditional Probability?',
    shortDesc: 'The likelihood of a token given the context of all tokens before it.',
    category: 'Probabilities',
    formula: "P(w_t \\mid w_1, w_2, \\dots, w_{t-1})",
    explanation: [
      "In isolation, the word 'Paris' might have a small general probability. But conditioned on the phrase 'The capital of France is', the conditional probability of 'Paris' skyrockets close to 90%!",
      "Causal language models are autoregressive: each step predicts the next token strictly conditioned on all previous tokens in the window."
    ],
    keyTakeaway: "Context is king: the exact same word will have dramatically different probabilities depending on what came before it.",
    interactiveTip: "In Section 02, click different tokens to see how preceding context reshapes the predictions."
  },
  {
    id: 'perplexity',
    title: 'What is Perplexity?',
    shortDesc: 'The primary metric for measuring how surprised a model is by real text.',
    category: 'Evaluation',
    formula: "\\text{PPL} = \\left( \\prod_{i=1}^N \\frac{1}{P(w_i \\mid \\text{context})} \\right)^{\\frac{1}{N}}",
    explanation: [
      "Perplexity is the geometric mean of the inverse probabilities of the actual words that occurred.",
      "If a model assigns high probability to the real words (e.g. 0.9), the inverse is low (1 / 0.9 = 1.11), leading to low perplexity.",
      "If the model is baffled by the text and assigned 0.01, the inverse is 100, driving perplexity through the roof. A lower perplexity means the model found the text predictable and natural."
    ],
    keyTakeaway: "Perplexity measures the average uncertainty or surprise of the model per token.",
    interactiveTip: "Use Section 03 to trace the step-by-step arithmetic from inverse probabilities to the geometric root."
  },
  {
    id: 'cross-entropy',
    title: 'What is Cross-Entropy Loss?',
    shortDesc: 'The log-loss metric used to train language models.',
    category: 'Evaluation',
    formula: "\\mathcal{L}_{\\text{CE}} = -\\frac{1}{N} \\sum_{i=1}^N \\ln P(w_i) \\implies \\text{PPL} = \\exp(\\mathcal{L}_{\\text{CE}})",
    explanation: [
      "Cross-entropy measures the average negative log-likelihood per token. During training, backpropagation minimizes this cross-entropy loss.",
      "Remarkably, Perplexity is mathematically identical to exponentiating Cross-Entropy! While loss is measured in 'nats' (base e) or 'bits' (base 2), exponentiating it gives Perplexity in intuitive units: number of choices."
    ],
    keyTakeaway: "PPL = exp(Cross-Entropy). Minimizing loss during AI training directly drives down perplexity.",
    interactiveTip: "Toggle between Product and Log formats in Section 03 to see both sides of the same mathematical coin."
  },
  {
    id: 'uncertainty-branching',
    title: 'Perplexity & The "Branching Factor"',
    shortDesc: 'Why perplexity equals the number of equally confusing choices.',
    category: 'Evaluation',
    explanation: [
      "Imagine you are reading a mystery book. If at each word you are equally unsure between 10 possible words, your perplexity is exactly 10.",
      "If you are reading completely random gibberish from a 50,000-word dictionary, your perplexity would be 50,000! Therefore, perplexity is often referred to as the 'effective branching factor'—the size of the weighted multiple-choice menu the model was facing."
    ],
    keyTakeaway: "A perplexity of K means the model was as uncertain as choosing uniformly among K equally probable options.",
    interactiveTip: "In Section 04, test Experiment B ('All 1/8') to see firsthand why equal probabilities yield exact branching numbers!"
  }
];
