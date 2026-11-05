#!/usr/bin/env node
/**
 * Start a teximos piece from real MODUS material.
 *
 *   npm run draft -- --run latest --slug my-piece --title "..."
 *   npm run draft -- --commit 411714d --slug my-piece --title "..."
 *
 * --run     a MODUS content engine run (apps/web/content/runs/<stamp>.json, or
 *           "latest"). Every prompt is tallied model by model.
 * --commit  a moduspilot commit. Its message and the added comment lines are
 *           pulled out, since that is where the numbers live.
 *
 * Writes two files:
 *   src/content/blog/<slug>.mdx   draft: true, so it is invisible to the build,
 *                                 the index and RSS. Readable under `astro dev`.
 *   drafts/<slug>.facts.md        the extracted facts with their sources. The
 *                                 piece is written against this, and every
 *                                 number in it must trace back to a line here.
 *
 * Nothing is published. `npm run publish -- <slug>` does that, after a read.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { homedir } from "node:os";

const ROOT = new URL("..", import.meta.url).pathname;
const MODUS = process.env.MODUS_REPO ?? join(homedir(), "Projects/moduspilot");

const args = process.argv.slice(2);
const arg = (k) => {
  const i = args.indexOf(`--${k}`);
  return i >= 0 ? args[i + 1] : undefined;
};

const slug = arg("slug");
const title = arg("title") ?? "Untitled";
const topic = arg("topic") ?? "Engineering";
if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error("need --slug in lowercase-kebab-case");
  process.exit(1);
}
const mdx = join(ROOT, "src/content/blog", `${slug}.mdx`);
if (existsSync(mdx)) {
  console.error(`${mdx} already exists, refusing to overwrite`);
  process.exit(1);
}

let facts = `# Facts for ${slug}\n\nEvery number in the piece must trace to a line here.\n\n`;

if (arg("run")) {
  const dir = join(MODUS, "apps/web/content/runs");
  const stamp = arg("run") === "latest"
    ? readdirSync(dir).filter((f) => f.endsWith(".json")).sort().at(-1)
    : `${arg("run").replace(/\.json$/, "")}.json`;
  const run = JSON.parse(readFileSync(join(dir, stamp), "utf8"));
  facts += `Source: moduspilot apps/web/content/runs/${stamp}\nRan at: ${run.ranAt}\n\n`;
  let splits = 0;
  for (const r of run.results) {
    const sides = Object.entries(r.split ?? {});
    if (sides.length > 1) splits++;
    facts += `## ${r.id}${sides.length > 1 ? " (SPLIT)" : " (unanimous)"}\n`;
    if (r.question) facts += `Question: ${r.question}\n`;
    for (const [pick, models] of sides) facts += `- ${pick}: ${models.join(", ")}\n`;
    for (const c of r.columns ?? r.answers ?? []) {
      const t = (c.why ?? c.text ?? "").replace(/\s+/g, " ").trim();
      facts += `  > ${c.modelName}: ${c.pick}. ${t.slice(0, 400)}\n`;
    }
    facts += "\n";
  }
  facts = facts.replace("\n\n", `\n\nSplit on ${splits} of ${run.results.length} prompts.\n\n`);
} else if (arg("commit")) {
  const sha = arg("commit");
  const git = (...a) => execFileSync("git", ["-C", MODUS, ...a], { encoding: "utf8", maxBuffer: 64e6 });
  facts += `Source: moduspilot commit ${sha}\n\n## Message\n\n${git("log", "-1", "--format=%H%n%ad%n%n%B", sha)}\n`;
  const diff = git("show", sha, "--format=", "--unified=0");
  let file = "";
  const out = [];
  for (const line of diff.split("\n")) {
    if (line.startsWith("+++ b/")) file = line.slice(6);
    else if (/^\+\s*(\/\/|\*|\/\*)/.test(line)) out.push(`${file}: ${line.slice(1).trim()}`);
  }
  facts += `## Added comments (where the numbers live)\n\n${out.join("\n")}\n`;
} else {
  console.error("need --run <stamp|latest> or --commit <sha>");
  process.exit(1);
}

mkdirSync(join(ROOT, "drafts"), { recursive: true });
writeFileSync(join(ROOT, "drafts", `${slug}.facts.md`), facts);
writeFileSync(
  mdx,
  `---
title: ${JSON.stringify(title)}
description: "TODO"
date: ${new Date().toISOString().slice(0, 10)}T12:00:00Z
topic: ${JSON.stringify(topic)}
draft: true
---

import Pull from "../../components/Pull.astro";

TODO write against drafts/${slug}.facts.md

*Photograph: TODO credit.*
`,
);
console.log(`draft  src/content/blog/${slug}.mdx (draft: true)`);
console.log(`facts  drafts/${slug}.facts.md`);
console.log(`read   npm run dev, then /blog/${slug}/`);
