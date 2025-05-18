import { mkdir, rm, readdir, copyFile } from "fs/promises";
import { existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, "template");
const DEST = join(__dirname, "dist", "template");
const RUNTIME = join(__dirname, "dist", "tadpole-rt.js");
const BLOCK_RUNTIME = join(__dirname, "dist", "block-rt.js");
const ESBUILD_WASM = join(
  __dirname,
  "node_modules",
  "esbuild-wasm",
  "esbuild.wasm"
);

if (existsSync(DEST)) await rm(DEST, { recursive: true });
await mkdir(DEST, { recursive: true });

const copyDir = async (src, dest) => {
  for (const entry of await readdir(src, { withFileTypes: true })) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    entry.isDirectory()
      ? (await mkdir(destPath, { recursive: true })) &&
        (await copyDir(srcPath, destPath))
      : await copyFile(srcPath, destPath);
  }
};

await copyDir(SRC, DEST);
await copyFile(RUNTIME, join(DEST, "tadpole-rt.js"));
await copyFile(BLOCK_RUNTIME, join(DEST, "block-rt.js"));
await copyFile(ESBUILD_WASM, join(DEST, "esbuild.wasm"));

console.log("✨ Template created (dist/template/)");
