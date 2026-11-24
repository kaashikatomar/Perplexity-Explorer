# Perplexity Explorer – Inside the Mind of a Language Model

An educational, interactive, and visually stunning web application built to help students and AI practitioners understand how autoregressive language models predict tokens, compute softmax probabilities, and calculate perplexity.

---

## 🌟 Key Features

1. **Section 01: Let's See What the AI Thinks**
   - Live browser-side causal inference using **DistilGPT-2** via Hugging Face Transformers.js and ONNX Runtime Web.
   - Decomposes sentences into actual subword tokens using Byte-Pair Encoding (BPE).
   - Computes authentic softmax probabilities over all 50,257 vocabulary tokens.
   - Displays horizontal probability bars, token ranks, and overall perplexity.
   - Includes full toggle and explanation for causal context handling (conditioned on `[BOS]` vs. prefix context).

2. **Section 02: What Happens Inside the Model?**
   - Interactive 3-stage causal pipeline visualization: `Preceding Context → Top Prediction Distribution → Actual Token`.
   - Inspect individual tokens to view the top 5 predicted candidates with their probabilities.
   - Compares the model's highest expectation against the actual token that occurred.

3. **Section 03: Let's Calculate Perplexity**
   - Step-by-step arithmetic calculator demonstrating both:
     - **Product of Inverses (Classic)**: $\text{PPL} = \left(\prod_{i=1}^N \frac{1}{P(w_i)}\right)^{1/N}$
     - **Log Cross-Entropy (Real AI)**: $\text{PPL} = \exp\left(-\frac{1}{N}\sum_{i=1}^N \ln P(w_i)\right) = 2^{\mathcal{L}_{\text{bits}}}$
   - Token-by-token calculation table with inverses ($1/P$) and surprise bits ($-\log_2 P$).
   - Dynamic uncertainty scale explaining the effective branching factor.

4. **Section 04: Become the AI. Predict the Tokens Yourself! (Simulated Sandbox)**
   - Explicitly labeled **SIMULATED – NOT FROM THE MODEL**.
   - Add, delete, and edit tokens and modify probabilities with live sliders.
   - Preset experiments:
     - **Experiment A**: "I love Python" ($0.5, 0.8, 0.2$)
     - **Experiment B**: "All 1/8" ($0.125$ each) with full mathematical proof why perplexity is exactly $8.00$.
     - **Experiment C**: "One surprising word" ($0.9, 0.85, 0.9, 0.005$) showing how a single low-probability token explodes perplexity.
     - **Experiment D**: "All equally likely" ($4$ choices @ $0.25$ each).

5. **Section 05: Can You Predict Like an AI? (Challenge Quiz)**
   - 7 comprehensive multiple-choice questions testing intuition, mathematics, and causal LM behavior.
   - Instant feedback, streak counter, score tracking, detailed explanations, and celebratory confetti upon completion.

6. **Section 06: Learn the Important Concepts**
   - Expandable educational cards explaining:
     - What is a Language Model?
     - What is a Token?
     - What is Tokenization?
     - What is Probability?
     - What is Conditional Probability?
     - What is Perplexity?
     - What is Cross-Entropy Loss?
     - Perplexity & The Branching Factor

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
```bash
git clone https://github.com/your-username/perplexity-explorer.git
cd perplexity-explorer
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Preview
```bash
npm run build
npm run preview
```
Open [http://localhost:4173](http://localhost:4173) in your browser.

---

## 🛠 Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom glassmorphism and AI laboratory glowing gradients
- **Icons**: Lucide React
- **Inference**: `@huggingface/transformers` (v3) + ONNX Runtime Web
- **Model**: DistilGPT-2 (Quantized 8-bit ONNX, cached locally in browser cache)
- **Effects**: Canvas Confetti

---

## 📐 Mathematical Notes

### Autoregressive Causal Context
In GPT-2, tokens are generated left-to-right:
$$P(w_1, w_2, \dots, w_N) = \prod_{i=1}^N P(w_i \mid w_1, \dots, w_{i-1})$$

### Prepending BOS
To evaluate the first token $w_1$ within a causal model, the Beginning-of-Sequence token `<|endoftext|>` (`ID: 50256`) is prepended, giving the first token a valid causal context. Alternatively, users can toggle the "Tokens 2..N Only" strategy to treat $w_1$ as prompt prefix.
