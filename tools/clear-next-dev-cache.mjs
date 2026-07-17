import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const devCache = resolve(process.cwd(), ".next", "dev");

if (existsSync(devCache)) {
  rmSync(devCache, { recursive: true, force: true });
}
