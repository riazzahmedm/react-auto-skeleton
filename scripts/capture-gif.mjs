import { chromium } from "playwright";
import { execSync } from "child_process";
import { mkdirSync, rmSync, existsSync } from "fs";
import { join } from "path";

const URL = "http://localhost:5173";
const FRAMES_DIR = "/tmp/as-frames";
const OUT_GIF = "demo.gif";
const W = 900;
const H = 520;

if (existsSync(FRAMES_DIR)) rmSync(FRAMES_DIR, { recursive: true });
mkdirSync(FRAMES_DIR);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: W, height: H });
await page.goto(URL, { waitUntil: "networkidle" });

// Scroll past hero so Profile Header + Metrics are in view
await page.evaluate(() => window.scrollTo({ top: 780, behavior: "instant" }));

// Wait for IntersectionObserver to fire and skeleton to start
await page.waitForTimeout(600);

let frame = 0;
const snap = async () => {
  await page.screenshot({ path: join(FRAMES_DIR, `f${String(frame).padStart(4,"0")}.png`) });
  frame++;
};

// Capture ~7 seconds at 12fps = 84 frames (covers skeleton + reveal + loop)
for (let i = 0; i < 84; i++) {
  await snap();
  await page.waitForTimeout(83);
}

await browser.close();

// Build palette + GIF with ffmpeg
execSync(
  `ffmpeg -y -framerate 12 -i ${FRAMES_DIR}/f%04d.png \
   -vf "fps=12,scale=${W}:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer" \
   ${OUT_GIF}`,
  { stdio: "inherit" }
);

rmSync(FRAMES_DIR, { recursive: true });
console.log(`\nSaved: ${OUT_GIF}`);
