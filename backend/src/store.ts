import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { emptyStore, type StoreData } from "./domain.js";

const storePath = resolve(process.cwd(), "data", "autocore.store.json");

export async function readStore(): Promise<StoreData> {
  try {
    const raw = await readFile(storePath, "utf8");
    return { ...emptyStore(), ...JSON.parse(raw) } as StoreData;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "ENOENT") {
      throw error;
    }

    const initial = emptyStore();
    await writeStore(initial);
    return initial;
  }
}

export async function writeStore(data: StoreData) {
  await mkdir(dirname(storePath), { recursive: true });
  await writeFile(storePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export async function updateStore<T>(
  updater: (data: StoreData) => T | Promise<T>,
) {
  const data = await readStore();
  const result = await updater(data);
  await writeStore(data);
  return result;
}
