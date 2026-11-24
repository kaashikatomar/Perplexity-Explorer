# Perplexity Explorer – Inside the Mind of an AI Language Model

An educational, interactive, and visually stunning web application built to help students and AI practitioners understand how autoregressive language models predict tokens, compute softmax probabilities, and calculate perplexity.

---

## 🌐 Live Website (GitHub Pages)

**Public URL**: [https://kaashikatomar.github.io/Perplexity-Explorer/](https://kaashikatomar.github.io/Perplexity-Explorer/)

- **Hosting**: GitHub Pages (Static hosting on `main` branch root `/`)
- **HTTPS Enforced**: Yes
- **Zero Backend / No API Keys**: Runs 100% client-side in the browser via WebAssembly & WebGPU ONNX Runtime Web.

---

## 🎨 Visual Identity & Theme

- **Cyberpunk AI Laboratory Aesthetic**:
  - Main background: `#05030D` (Deep Midnight Black)
  - Secondary background: `#090817`
  - Card background: `#100D20` with glassmorphic blur (`backdrop-filter: blur(20px)`)
  - Neon Purple: `#852CFF`
  - Bright Purple: `#B44CFF`
  - Electric Blue: `#287BFF`
  - Light Blue: `#55A5FF`
  - Primary text: `#F5F3FF`
  - Secondary text: `#AAA4C5`
- **Dynamic Wave Canvas Landscape**: Layered glowing neon waves of electric blue and bright purple flowing across a starfield canvas.
- **Strict Palette Rule**: No cyan, pink, green, orange, or yellow. Strict harmony of black, neon purple, and electric blue.

---

## 🌟 Key Features & Sections

1. **Section 01: Let's See What the AI Thinks**
   - Live browser-side causal inference using **DistilGPT-2** via Hugging Face Transformers.js (`@huggingface/transformers@3`) and ONNX Runtime Web.
   - Decomposes sentences into actual subword tokens using Byte-Pair Encoding (BPE).
   - Computes authentic softmax probabilities over all 50,257 vocabulary tokens.
   - Evaluates tokens conditioned on preceding context, using token ID `50256` (`<|endoftext|>`) as starting context convention.
   - 3 instant sample buttons: `I love Python`, `Python love I`, and `The capital of France is Paris`.

2. **Section 02: Every Token Has a Probability**
   - Displays sentence as individual token chips and in a responsive table (`# | Token | Token ID | Probability P | 1/P | Visual Likelihood`).
   - Spaces visibly displayed using `␣` (e.g. `␣love`, `␣Python`).
   - Interactive Token Inspector modal detailing preceding context, probability, inverse penalty, and causal explanations.

3. **Section 03: Let's Calculate Perplexity**
   - 3-step arithmetic breakdown:
     - **Step 1**: Multiply inverse probabilities ($(1/P_1) \times (1/P_2) \times \dots$)
     - **Step 2**: Count the tokens ($N = \text{number of tokens}$)
     - **Step 3**: Compute geometric root ($\text{Perplexity} = (\text{Product})^{1/N}$)
   - Master glowing neon-purple result card with live needle uncertainty meter.
   - Equivalent log-based calculation: $\text{Perplexity} = \exp\left(-\frac{1}{N}\sum \ln P\right)$.

4. **Section 04: What's the AI Thinking Next?**
   - Reads logits at the final sentence position.
   - Extracts top 8 candidate next tokens with probabilities, rank badges, and animated bars.
   - Rank #1 highlighted in electric blue and light blue with purple glow.

5. **Section 05: Become the AI. Predict It Yourself! (Simulated Sandbox)**
   - Explicitly labeled **SIMULATED – NOT FROM THE MODEL**.
   - Editable token names and probability sliders/number inputs.
   - Add/delete token rows with live calculation.
   - 4 Presets:
     - **Preset A**: "I love Python" ($0.5, 0.8, 0.2 \implies \approx 2.32$)
     - **Preset B**: "All 1/8" ($8$ tokens @ $0.125 \implies \text{exactly } 8.00$)
     - **Preset C**: "One surprising word" ($0.9, 0.9, 0.9, 0.01 \implies 100$ inverse spikes perplexity)
     - **Preset D**: "All equally likely" ($4$ choices @ $0.25$)

6. **Section 06: See How Uncertainty Changes (Visual Guide)**
   - Comparison cards: $P=1 \implies 1, P=0.5 \implies 2, P=0.25 \implies 4, P=0.125 \implies 8$.
   - Interactive probability slider dynamically updating perplexity $= 1/P$ and branching factor.

7. **Section 07: Can You Think Like an AI? (Quiz)**
   - 8 comprehensive multiple-choice questions with instant feedback (electric blue for correct), score tracking, progress bar, and restart button.

8. **Section 08: Learn the Language of AI**
   - 8 expandable accordion cards covering core AI concepts: Language Model, Token, Tokenization, Probability, Conditional Probability, Perplexity, Cross-Entropy, and Uncertainty.

---

## 🚀 How to Run Locally

Because this project is a standalone single file (`index.html`), you can run it with any static web server:

```bash
# Python 3:
python3 -m http.server 8080

# Or with VS Code Live Server:
# Right-click index.html -> "Open with Live Server"
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 🔄 How to Update the Live Website in the Future

Whenever you edit `index.html`, simply push the changes to GitHub:

```bash
git add index.html README.md
git commit -m "Update Perplexity Explorer"
git push origin main
```

GitHub Pages will automatically build and publish your updates within 1–2 minutes, and your public URL ([https://kaashikatomar.github.io/Perplexity-Explorer/](https://kaashikatomar.github.io/Perplexity-Explorer/)) remains permanent and unchanged!
