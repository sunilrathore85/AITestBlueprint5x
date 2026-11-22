import { execSync, spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const envPath = path.resolve(root, "../../../../.env");

function parseEnv(text) {
  const out = {};
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return out;
}

const fileEnv = parseEnv(fs.readFileSync(envPath, "utf8"));
const vercelToken = fileEnv.VERCEL_TOKEN;
if (!vercelToken) {
  console.error("VERCEL_TOKEN missing in repo .env");
  process.exit(1);
}

const childEnv = { ...process.env, VERCEL_TOKEN: vercelToken };

function run(cmd, args = []) {
  const r = spawnSync(cmd, args, { cwd: root, stdio: "inherit", env: childEnv, shell: true });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

function setEnv(name, value, target) {
  if (!value) return;
  const r = spawnSync(
    "npx",
    ["vercel", "env", "add", name, target, "--force"],
    { cwd: root, input: value, stdio: ["pipe", "inherit", "inherit"], env: childEnv, shell: true }
  );
  if (r.status !== 0) console.warn(`env ${name} ${target}:`, r.status);
}

const appEnv = [
  ["JIRA_API_TOKEN", fileEnv.JIRA_API_TOKEN],
  ["JIRA_API_URL", fileEnv.JIRA_API_URL],
  ["JIRA_API_USERNAME", fileEnv.JIRA_API_USERNAME],
  ["Groq_API_KEY", fileEnv.Groq_API_KEY],
  ["GROQ_API_KEY", fileEnv.Groq_API_KEY || fileEnv.GROQ_API_KEY],
  ["LLM_PROVIDER", "groq"],
  ["GROQ_MODEL", "openai/gpt-oss-20b"],
];

run("npx", ["vercel", "link", "--yes", "--project", "planningaiagent"]);
for (const [k, v] of appEnv) {
  setEnv(k, v, "production");
  setEnv(k, v, "preview");
}
run("npx", ["vercel", "deploy", "--prod", "--yes"]);