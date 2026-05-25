import { readFile } from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { generateDataset } from "./data/generateDataset.js";
import { calculateMetrics } from "./engine/metrics.js";
import { scoreClaims } from "./engine/scoreClaims.js";
import type { Claim } from "./engine/types.js";
import { writeClaims, writeScoreReports } from "./output/writeReports.js";

const CLAIMS_PATH = path.resolve("generated", "claims.json");

async function generate(): Promise<void> {
  const claims = generateDataset();
  await writeClaims(claims);
  console.log(`Generated ${claims.length} claims at ${CLAIMS_PATH}`);
}

async function score(): Promise<void> {
  const rawClaims = await readFile(CLAIMS_PATH, "utf8");
  const claims = JSON.parse(rawClaims) as Claim[];
  const started = performance.now();
  const scoredClaims = scoreClaims(claims);
  const processingTimeMs = Math.round(performance.now() - started);
  const metrics = calculateMetrics(scoredClaims, processingTimeMs);
  await writeScoreReports(scoredClaims, metrics);
  console.log(`Scored ${scoredClaims.length} claims in ${processingTimeMs} ms`);
  console.log(`Precision ${(metrics.precision * 100).toFixed(2)}%, recall ${(metrics.recall * 100).toFixed(2)}%, FPR ${(metrics.false_positive_rate * 100).toFixed(2)}%`);
}

async function main(): Promise<void> {
  const command = process.argv[2] ?? "all";
  if (command === "generate") {
    await generate();
    return;
  }
  if (command === "score") {
    await score();
    return;
  }
  if (command === "all") {
    await generate();
    await score();
    return;
  }

  console.error(`Unknown command "${command}". Expected generate, score, or all.`);
  process.exitCode = 1;
}

await main();
