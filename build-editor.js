import { mkdir, rm, readdir, copyFile } from "fs/promises";
import { existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, "editor", "public");
const DEST = join(__dirname, "dist", "editor");
const BLOCKLY_MEDIA = join(__dirname, "node_modules", "blockly", "media");
const SCRIPT = join(__dirname, "dist", "editor-script.js");

if (existsSync(DEST)) await rm(DEST, { recursive: true });
await mkdir(DEST, { recursive: true });
await mkdir(join(DEST, "media"), { recursive: true });

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
await copyDir(BLOCKLY_MEDIA, join(DEST, "media"));
await copyFile(SCRIPT, join(DEST, "editor-script.js"));

console.log("✨ Editor built (dist/editor/)");
