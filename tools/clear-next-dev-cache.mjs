import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

// Development writes manifests while routes compile. It must never share a
// directory with `next build`, which writes production manifests concurrently.
const devCache = resolve(process.cwd(), ".next-dev");

if (existsSync(devCache)) {
  rmSync(devCache, { recursive: true, force: true });
}
