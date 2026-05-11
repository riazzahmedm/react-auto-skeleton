import { readFileSync } from "node:fs";
import { performance } from "node:perf_hooks";
import { JSDOM } from "jsdom";

const html = readFileSync(new URL("../examples/react-demo/index.html", import.meta.url), "utf8");
const dom = new JSDOM(html);

global.window = dom.window;
global.document = dom.window.document;
global.Node = dom.window.Node;
global.NodeFilter = dom.window.NodeFilter;
global.HTMLElement = dom.window.HTMLElement;

const { scanBones } = await import("../packages/core/dist/scanner.js");

const root = document.createElement("div");
root.style.width = "1200px";
root.style.height = "2000px";

for (let i = 0; i < 1200; i++) {
  const row = document.createElement("div");
  row.textContent = `Row ${i}`;
  row.style.padding = "8px";
  row.style.marginBottom = "4px";
  row.style.borderRadius = "8px";
  root.appendChild(row);
}

document.body.appendChild(root);

const warmup = 3;
const runs = 20;

for (let i = 0; i < warmup; i++) {
  scanBones(root, { minSize: 8 });
}

const timings = [];
for (let i = 0; i < runs; i++) {
  const t0 = performance.now();
  scanBones(root, { minSize: 8 });
  const t1 = performance.now();
  timings.push(t1 - t0);
}

const avg = timings.reduce((a, b) => a + b, 0) / timings.length;
const p95 = [...timings].sort((a, b) => a - b)[Math.floor(timings.length * 0.95) - 1] ?? timings[timings.length - 1];

console.log("scanBones benchmark");
console.log(`runs=${runs}`);
console.log(`avg_ms=${avg.toFixed(2)}`);
console.log(`p95_ms=${p95.toFixed(2)}`);

const budgetMs = 80;
if (avg > budgetMs) {
  console.error(`Performance budget failed: avg ${avg.toFixed(2)}ms > ${budgetMs}ms`);
  process.exit(1);
}
