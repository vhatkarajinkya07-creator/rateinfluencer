import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "../data");

export async function readJSON(filename) {
  const raw = await readFile(join(DATA_DIR, filename), "utf-8");
  return JSON.parse(raw);
}

export async function writeJSON(filename, data) {
  await writeFile(join(DATA_DIR, filename), JSON.stringify(data, null, 2), "utf-8");
}
