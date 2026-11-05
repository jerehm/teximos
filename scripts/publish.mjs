#!/usr/bin/env node
/**
 * Publish a draft that has been read and approved.
 *
 *   npm run publish -- <slug> [<slug> ...]
 *   npm run publish -- <slug> --no-deploy     everything except wrangler
 *
 * Refuses while the piece still says TODO. Flips draft: true to false, builds
 * (check-copy runs inside), cuts the OG cards from a local preview through
 * headless Chrome, builds again so the cards ship, deploys, then polls the live
 * URL until it serves. The edge keeps serving the PREVIOUS build for 20 to 40
 * seconds after a deploy and a cache-busting query does not defeat it, so this
 * waits instead of redeploying.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { execSync, spawn } from "node:child_process";

const ROOT = new URL("..", import.meta.url).pathname;
const args = process.argv.slice(2);
const deploy = !args.includes("--no-deploy");
const slugs = args.filter((a) => !a.startsWith("--"));
if (!slugs.length) {
  console.error("usage: npm run publish -- <slug> [<slug> ...] [--no-deploy]");
  process.exit(1);
}

const run = (cmd) => execSync(cmd, { cwd: ROOT, stdio: "inherit" });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

for (const slug of slugs) {
  const file = join(ROOT, "src/content/blog", `${slug}.mdx`);
  if (!existsSync(file)) throw new Error(`no such piece: ${slug}`);
  const src = readFileSync(file, "utf8");
  if (/\bTODO\b/.test(src)) throw new Error(`${slug} still says TODO, not publishing`);
  writeFileSync(file, src.replace(/^draft: true$/m, "draft: false"));
  console.log(`flipped ${slug} to draft: false`);
}

run("npm run build");

// OG cards need a served site and a Chrome with a debugging port.
const preview = spawn("npx", ["astro", "preview", "--port", "4321"], { cwd: ROOT, stdio: "ignore" });
const chrome = spawn(
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ["--headless=new", "--remote-debugging-port=9222", "--user-data-dir=/tmp/teximos-og-chrome"],
  { stdio: "ignore" },
);
try {
  for (let i = 0; i < 40; i++) {
    try {
      await fetch("http://localhost:4321/");
      await fetch("http://localhost:9222/json/version");
      break;
    } catch {
      await wait(500);
    }
  }
  run("node scripts/og.mjs");
} finally {
  preview.kill();
  chrome.kill();
}
run("npm run build");

if (!deploy) {
  console.log("built, not deployed (--no-deploy)");
  process.exit(0);
}
run("npx wrangler deploy");

for (const slug of slugs) {
  const url = `https://teximos.com/blog/${slug}/`;
  let ok = false;
  for (let i = 0; i < 30 && !ok; i++) {
    const res = await fetch(url, { redirect: "follow" }).catch(() => null);
    ok = res?.status === 200;
    if (!ok) await wait(5000);
  }
  console.log(`${ok ? "LIVE" : "NOT LIVE after 150s"}  ${url}`);
  if (!ok) process.exitCode = 1;
}
