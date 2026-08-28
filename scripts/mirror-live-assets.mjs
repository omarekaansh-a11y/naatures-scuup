import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";

const projectRoot = resolve(new URL("..", import.meta.url).pathname);
const sourceRoot = join(projectRoot, "client");
const outputRoot = join(sourceRoot, "public", "site-media");
const filesToScan = [];

async function collectFiles(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await collectFiles(path);
    else if (/\.(tsx?|css|html)$/.test(entry.name) && !path.endsWith("client/src/lib/mango-scroll-frames.ts")) filesToScan.push(path);
  }
}

await collectFiles(sourceRoot);
const references = new Set();
const referencePattern = /\/manus-storage\/([^\"'`\s]+)/g;
for (const file of filesToScan) {
  const text = await readFile(file, "utf8");
  for (const match of text.matchAll(referencePattern)) references.add(match[1]);
}

await mkdir(outputRoot, { recursive: true });
const baseUrl = process.env.MIRROR_BASE_URL || "http://localhost:3000";
for (const assetName of [...references].sort()) {
  const destination = join(outputRoot, basename(assetName));
  const response = await fetch(`${baseUrl}/manus-storage/${assetName}`, { redirect: "follow" });
  if (!response.ok) throw new Error(`Unable to mirror ${assetName}: ${response.status}`);
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
  console.log(`Mirrored ${assetName}`);
}

for (const file of filesToScan) {
  let text = await readFile(file, "utf8");
  for (const assetName of references) {
    text = text.replaceAll(`/manus-storage/${assetName}`, `/site-media/${basename(assetName)}`);
  }
  await writeFile(file, text);
}
console.log(`Mirrored ${references.size} live assets into client/public/site-media`);
