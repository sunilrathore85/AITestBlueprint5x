import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function loadLocalEnv() {
  if (process.env.VERCEL) return;
  dotenv.config({ path: path.resolve(__dirname, "../../../../../../.env") });
}