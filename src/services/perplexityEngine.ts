import { 
  SentenceAnalysisResult, 
  TokenAnalysis, 
  TopPrediction, 
  ModelLoadingProgress 
} from '../types';
import precomputedJson from '../data/precomputedSentences.json';

// Type definitions for transformers.js dynamic instance
type TransformersModule = typeof import('@huggingface/transformers');

class PerplexityEngine {
  private tokenizer: any = null;
  private model: any = null;
  private transformers: TransformersModule | null = null;
  private isLoading = false;
  private isLoaded = false;
  private modelId = 'Xenova/distilgpt2';
  private precomputedCache: Record<string, SentenceAnalysisResult> = precomputedJson as any;

  public async loadModel(onProgress?: (p: ModelLoadingProgress) => void): Promise<boolean> {
    if (this.isLoaded) return true;
    if (this.isLoading) return false;

    this.isLoading = true;
    try {
      if (onProgress) {
        onProgress({ status: 'init', file: 'Initializing AI Engine...', progress: 5 });
      }

      // Dynamic import of transformers.js
      const t = await import('@huggingface/transformers');
      this.transformers = t;
      
      // Configure environment for browser
      t.env.allowLocalModels = false;
      if (t.env.backends?.onnx) {
        // use wasm or webgpu if available
      }

      if (onProgress) {
        onProgress({ status: 'downloading', file: 'Tokenizer vocab & config', progress: 15 });
      }

      this.tokenizer = await t.AutoTokenizer.from_pretrained(this.modelId, {
        progress_callback: (p: any) => {
          if (p.status === 'progress' && onProgress) {
            onProgress({
              status: 'downloading_tokenizer',
              file: p.file || 'Tokenizer files',
              progress: Math.min(25, 15 + ((p.progress || 0) * 0.10))
            });
          }
        }
      });

      if (onProgress) {
        onProgress({ status: 'downloading_model', file: 'DistilGPT-2 weights (ONNX Q8)', progress: 25 });
      }

      this.model = await t.AutoModelForCausalLM.from_pretrained(this.modelId, {
        dtype: 'q8',
        progress_callback: (p: any) => {
          if (p.status === 'progress' && onProgress) {
            const currentPct = 25 + ((p.progress || 0) * 0.70);
            onProgress({
              status: 'downloading_model',
              file: p.file || 'model_quantized.onnx',
              progress: Math.min(95, currentPct),
              loaded: p.loaded,
              total: p.total
            });
          }
        }
      });

      if (onProgress) {
        onProgress({ status: 'ready', file: 'DistilGPT-2 Model Ready', progress: 100 });
      }

      this.isLoaded = true;
      this.isLoading = false;
      return true;
    } catch (err) {
      console.error('Failed to load in-browser DistilGPT-2 model:', err);
      this.isLoading = false;
      throw err;
    }
  }

  public getIsReady(): boolean {
    return this.isLoaded;
  }

  public getIsLoading(): boolean {
    return this.isLoading;
  }

  private softmax(logits: Float32Array): Float32Array {
    let max = -Infinity;
    for (let i = 0; i < logits.length; i++) {
      if (logits[i] > max) max = logits[i];
    }
    let sum = 0;
    const exps = new Float32Array(logits.length);
    for (let i = 0; i < logits.length; i++) {
      const e = Math.exp(logits[i] - max);
      exps[i] = e;
      sum += e;
    }
    for (let i = 0; i < logits.length; i++) {
      exps[i] /= sum;
    }
    return exps;
  }

  private getTopK(probs: Float32Array, k = 5): Array<{ id: number; prob: number }> {
    const indexed: Array<{ id: number; prob: number }> = [];
    for (let i = 0; i < probs.length; i++) {
      indexed.push({ id: i, prob: probs[i] });
    }
    indexed.sort((a, b) => b.prob - a.prob);
    return indexed.slice(0, k);
  }

  public async analyzeSentence(
    sentence: string, 
    firstTokenStrategy: 'bos_conditioned' | 'prefix_context' = 'bos_conditioned'
  ): Promise<SentenceAnalysisResult> {
    const trimmed = sentence.trim();
    if (!trimmed) {
      throw new Error("Please enter a non-empty sentence.");
    }

    // Check if precomputed result exists for instant lookup while model is downloading
    if (!this.isLoaded && this.precomputedCache[trimmed]) {
      return this.adjustForStrategy(this.precomputedCache[trimmed], firstTokenStrategy);
    }

    // If model is not loaded yet, initiate loading
    if (!this.isLoaded) {
      await this.loadModel();
    }

    const startTime = performance.now();
    const t = this.transformers!;
    const tokenizer = this.tokenizer;
    const model = this.model;

    // Tokenize raw sentence
    const encoded = await tokenizer(trimmed);
    const rawIds = Array.from(encoded.input_ids.data).map((x: any) => Number(x));
    if (rawIds.length === 0) {
      throw new Error("No tokens could be extracted from input.");
    }

    // Prepend BOS token (50256) so causal model predicts token 0 given [BOS]
    const bosId = 50256;
    const inputWithBos = [bosId, ...rawIds];

    const tensorInput = new t.Tensor(
      'int64', 
      BigInt64Array.from(inputWithBos.map(x => BigInt(x))), 
      [1, inputWithBos.length]
    );
    const tensorMask = new t.Tensor(
      'int64', 
      BigInt64Array.from(inputWithBos.map(() => 1n)), 
      [1, inputWithBos.length]
    );

    // Run actual model forward pass
    const out = await model({ input_ids: tensorInput, attention_mask: tensorMask });
    const logitsData: Float32Array = out.logits.data;
    const vocabSize = 50257;

    const tokenDetails: TokenAnalysis[] = [];
    let sumLogProbs = 0;
    let sumBits = 0;

    for (let i = 0; i < rawIds.length; i++) {
      const targetId = rawIds[i];
      const targetTokenStr = tokenizer.decode([targetId]);

      // Position i in inputWithBos predicts rawIds[i]
      const rowOffset = i * vocabSize;
      const rowSlice = logitsData.subarray(rowOffset, rowOffset + vocabSize);
      const probs = this.softmax(rowSlice);
      const actualProb = Math.max(1e-12, probs[targetId]);

      const top5Raw = this.getTopK(probs, 5);
      const top5: TopPrediction[] = top5Raw.map((item, r) => ({
        tokenId: item.id,
        tokenText: tokenizer.decode([item.id]),
        probability: item.prob,
        rank: r + 1
      }));

      // Find exact rank of actual token
      let actualRank = 1;
      for (let j = 0; j < probs.length; j++) {
        if (probs[j] > actualProb) actualRank++;
      }

      const logP = Math.log(actualProb);
      const bits = -Math.log2(actualProb);

      const contextTokens = [
        '[BOS]',
        ...rawIds.slice(0, i).map(id => tokenizer.decode([id]))
      ];

      tokenDetails.push({
        index: i,
        text: targetTokenStr,
        displaySymbol: targetTokenStr.replace(/^ /, ' '),
        tokenId: targetId,
        probability: actualProb,
        inverseProbability: 1 / actualProb,
        logProbability: logP,
        log2Probability: Math.log2(actualProb),
        surpriseBits: bits,
        topPredictions: top5,
        rankOfActualToken: actualRank,
        contextTokens,
        isFirstToken: i === 0
      });
    }

    const elapsed = Math.round(performance.now() - startTime);

    const baseResult: SentenceAnalysisResult = {
      sentence: trimmed,
      tokens: tokenDetails,
      totalTokens: rawIds.length,
      evaluatedTokensCount: rawIds.length,
      perplexity: 0,
      crossEntropy: 0,
      crossEntropyBits: 0,
      productOfInverses: 1,
      geometricMean: 0,
      handlingOfFirstToken: "Conditioned on Beginning-of-Sequence [BOS] context",
      inferenceTimeMs: elapsed
    };

    return this.adjustForStrategy(baseResult, firstTokenStrategy);
  }

  private adjustForStrategy(
    base: SentenceAnalysisResult, 
    strategy: 'bos_conditioned' | 'prefix_context'
  ): SentenceAnalysisResult {
    const tokens = base.tokens;
    const evaluatedTokens = strategy === 'prefix_context' ? tokens.slice(1) : tokens;
    
    if (evaluatedTokens.length === 0) {
      return base;
    }

    const n = evaluatedTokens.length;
    let sumLogProbs = 0;
    let sumBits = 0;
    let productInverses = 1;

    for (const t of evaluatedTokens) {
      sumLogProbs += t.logProbability;
      sumBits += t.surpriseBits;
      productInverses *= t.inverseProbability;
    }

    const crossEntropy = -sumLogProbs / n;
    const crossEntropyBits = sumBits / n;
    const perplexity = Math.exp(crossEntropy);

    return {
      ...base,
      evaluatedTokensCount: n,
      crossEntropy,
      crossEntropyBits,
      perplexity,
      productOfInverses: productInverses,
      geometricMean: perplexity,
      handlingOfFirstToken: strategy === 'prefix_context'
        ? "First token used purely as prefix context; evaluation begins from token 2"
        : "Conditioned on Beginning-of-Sequence [BOS] context"
    };
  }

  public getPrecomputedSentence(sentence: string): SentenceAnalysisResult | null {
    return this.precomputedCache[sentence.trim()] || null;
  }
}

export const perplexityEngine = new PerplexityEngine();
