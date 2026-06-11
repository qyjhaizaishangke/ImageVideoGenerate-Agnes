// Regenerate src/paraglide/messages/_index.js and messages.d.ts from project.inlang/messages/*.json
// Usage: bun run scripts/gen_messages.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const enPath = resolve(root, "project.inlang/messages/en.json");
const zhPath = resolve(root, "project.inlang/messages/zh.json");

const en = JSON.parse(readFileSync(enPath, "utf-8").replace(/^\uFEFF/, ""));
const zh = JSON.parse(readFileSync(zhPath, "utf-8").replace(/^\uFEFF/, ""));

const keys = Object.keys(en);

// Verify zh has all keys
const missing = keys.filter((k) => !(k in zh));
if (missing.length > 0) {
  console.error("Missing zh translations for keys:", missing.join(", "));
  process.exit(1);
}

const esc = (s) => JSON.stringify(s).replaceAll("\u2028", "\\u2028").replaceAll("\u2029", "\\u2029");

// --- _index.js ---
const jsLines = [
  "/* eslint-disable */",
  'import { languageTag } from "../runtime.js";',
  "",
];

for (const key of keys) {
  jsLines.push(
    `export function ${key}() { return languageTag() === "zh" ? ${esc(zh[key])} : ${esc(en[key])}; }`
  );
}

jsLines.push("");
jsLines.push("export const m = {");
for (const key of keys) {
  jsLines.push(`  ${key},`);
}
jsLines.push("};");
jsLines.push("");

const jsOut = resolve(root, "src/paraglide/messages/_index.js");
writeFileSync(jsOut, jsLines.join("\n") + "\n", "utf-8");
console.log(`Generated ${jsOut} with ${keys.length} message keys.`);

// --- messages.d.ts ---
const dtsLines = [
  "// TypeScript declarations for the hand-written Paraglide messages.",
  "",
];
for (const key of keys) {
  dtsLines.push(`export function ${key}(): string;`);
}
dtsLines.push("");
dtsLines.push("export declare const m: {");
for (const key of keys) {
  dtsLines.push(`  ${key}(): string;`);
}
dtsLines.push("};");
dtsLines.push("");

const dtsOut = resolve(root, "src/paraglide/messages.d.ts");
writeFileSync(dtsOut, dtsLines.join("\n"), "utf-8");
console.log(`Generated ${dtsOut}.`);