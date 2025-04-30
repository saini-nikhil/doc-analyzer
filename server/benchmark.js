// benchmark.js
// Utility to benchmark the performance of the AI response caching system

const axios = require('axios');
const { aiResponseCache, generateCacheKey } = require('./cache');
const dotenv = require('dotenv');
dotenv.config();

// Configuration
const BENCHMARK_ITERATIONS = 100;
const TEST_PROMPTS = [
  "Summarize the following text in 3 sentences: The quick brown fox jumps over the lazy dog.",
  "Extract key entities from this text: Apple Inc. is headquartered in Cupertino, California.",
  "Translate this to French: Hello world, how are you today?",
  "What is the sentiment of this text: I really enjoyed the movie, it was fantastic!",
  "Generate 3 keywords for this text: Artificial intelligence is transforming industries worldwide."
];

// Mock AI call function (for testing without actual API calls)
async function mockAICall(prompt) {
  // Simulate network latency (100-300ms)
  const latency = 100 + Math.random() * 200;
  await new Promise(resolve => setTimeout(resolve, latency));
  
  // Return a deterministic response based on the prompt
  return `Response for: ${prompt.substring(0, 20)}...`;
}

// Real AI call function (using the actual API)
async function realAICall(prompt) {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    throw new Error('Gemini API key not configured');
  }

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
    {
      contents: [{ parts: [{ text: prompt }] }],
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (response.data.candidates && 
      response.data.candidates.length > 0 && 
      response.data.candidates[0].content && 
      response.data.candidates[0].content.parts && 
      response.data.candidates[0].content.parts.length > 0) {
    return response.data.candidates[0].content.parts[0].text;
  } else {
    throw new Error('Unexpected response format from Gemini API');
  }
}

// Function to run with caching
async function withCache(prompt, useRealAPI = false) {
  const cacheKey = generateCacheKey(prompt);
  const cachedResult = await aiResponseCache.get(cacheKey);
  
  if (cachedResult) {
    return { result: cachedResult, cached: true };
  }
  
  const result = useRealAPI ? await realAICall(prompt) : await mockAICall(prompt);
  await aiResponseCache.put(cacheKey, result);
  return { result, cached: false };
}

// Function to run without caching
async function withoutCache(prompt, useRealAPI = false) {
  const result = useRealAPI ? await realAICall(prompt) : await mockAICall(prompt);
  return { result, cached: false };
}

// Benchmark function
async function runBenchmark(useRealAPI = false) {
  console.log(`\n=== BENCHMARK RESULTS (${useRealAPI ? 'Real API' : 'Mock API'}) ===\n`);
  
  // Clear cache before starting
  await aiResponseCache.clear();
  
  // Metrics storage
  const metrics = {
    withCache: {
      totalTime: 0,
      latencies: [],
    },
    withoutCache: {
      totalTime: 0,
      latencies: [],
    }
  };
  
  // 1. Test without cache
  console.log("Testing without cache...");
  const startWithoutCache = Date.now();
  
  for (let i = 0; i < BENCHMARK_ITERATIONS; i++) {
    const prompt = TEST_PROMPTS[i % TEST_PROMPTS.length];
    const startRequest = Date.now();
    await withoutCache(prompt, useRealAPI);
    const requestTime = Date.now() - startRequest;
    metrics.withoutCache.latencies.push(requestTime);
  }
  
  metrics.withoutCache.totalTime = Date.now() - startWithoutCache;
  
  // 2. Test with cache (cold start + warm cache)
  console.log("Testing with cache...");
  const startWithCache = Date.now();
  
  for (let i = 0; i < BENCHMARK_ITERATIONS; i++) {
    const prompt = TEST_PROMPTS[i % TEST_PROMPTS.length];
    const startRequest = Date.now();
    await withCache(prompt, useRealAPI);
    const requestTime = Date.now() - startRequest;
    metrics.withCache.latencies.push(requestTime);
  }
  
  metrics.withCache.totalTime = Date.now() - startWithCache;
  
  // Calculate statistics
  const calculateStats = (latencies) => {
    latencies.sort((a, b) => a - b);
    const p50 = latencies[Math.floor(latencies.length * 0.5)];
    const p95 = latencies[Math.floor(latencies.length * 0.95)];
    const avg = latencies.reduce((sum, val) => sum + val, 0) / latencies.length;
    return { p50, p95, avg };
  };
  
  const withoutCacheStats = calculateStats(metrics.withoutCache.latencies);
  const withCacheStats = calculateStats(metrics.withCache.latencies);
  
  // Print results
  console.log("\n--- Performance Comparison ---");
  console.log(`Total requests: ${BENCHMARK_ITERATIONS}`);
  
  console.log("\nWithout Cache:");
  console.log(`  Total time: ${metrics.withoutCache.totalTime}ms`);
  console.log(`  Throughput: ${(BENCHMARK_ITERATIONS / (metrics.withoutCache.totalTime / 1000)).toFixed(2)} req/sec`);
  console.log(`  Avg latency: ${withoutCacheStats.avg.toFixed(2)}ms`);
  console.log(`  p50 latency: ${withoutCacheStats.p50}ms`);
  console.log(`  p95 latency: ${withoutCacheStats.p95}ms`);
  
  console.log("\nWith Cache (includes cold start + warm cache):");
  console.log(`  Total time: ${metrics.withCache.totalTime}ms`);
  console.log(`  Throughput: ${(BENCHMARK_ITERATIONS / (metrics.withCache.totalTime / 1000)).toFixed(2)} req/sec`);
  console.log(`  Avg latency: ${withCacheStats.avg.toFixed(2)}ms`);
  console.log(`  p50 latency: ${withCacheStats.p50}ms`);
  console.log(`  p95 latency: ${withCacheStats.p95}ms`);
  
  // Performance improvement
  const timeImprovement = ((metrics.withoutCache.totalTime - metrics.withCache.totalTime) / metrics.withoutCache.totalTime * 100).toFixed(2);
  const throughputImprovement = ((BENCHMARK_ITERATIONS / (metrics.withCache.totalTime / 1000)) / (BENCHMARK_ITERATIONS / (metrics.withoutCache.totalTime / 1000)) * 100 - 100).toFixed(2);
  
  console.log("\n--- Performance Improvement ---");
  console.log(`Time reduction: ${timeImprovement}%`);
  console.log(`Throughput increase: ${throughputImprovement}%`);
  
  // Cache statistics
  console.log("\n--- Cache Statistics ---");
  console.log(aiResponseCache.getStats());
}

// Run the benchmark if this file is executed directly
if (require.main === module) {
  // Default to mock API to avoid costs
  const useRealAPI = process.argv.includes('--real-api');
  runBenchmark(useRealAPI)
    .then(() => {
      console.log("\nBenchmark completed successfully.");
    })
    .catch(error => {
      console.error("Benchmark failed:", error);
    });
}

module.exports = {
  runBenchmark,
  withCache,
  withoutCache
};
