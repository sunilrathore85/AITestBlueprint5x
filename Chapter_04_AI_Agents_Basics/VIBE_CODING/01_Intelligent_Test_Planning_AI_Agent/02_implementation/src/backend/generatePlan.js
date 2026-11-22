import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { activeModel, getLlmConfig } from "./llmConfig.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_PATHS = [
  path.join(__dirname, "TestPlan_Template.md"),
  path.resolve(__dirname, "../../../01_plan/TestPlan_Template.md"),
];

function loadTemplate() {
  for (const p of TEMPLATE_PATHS) {
    if (fs.existsSync(p)) return fs.readFileSync(p, "utf8");
  }
  throw new Error("Test plan template not found");
}

function buildPrompt(template, issue) {
  return `You are a QA architect. Using ONLY the Jira issue below, fill the test plan template.
Use exact section names and order from the template.
Where information is missing use exactly: Insufficient information to determine.
Label proposed tests as proposals, not confirmed requirements.
Mark status DRAFT.

Jira issue ${issue.key}: ${issue.summary}
Type: ${issue.type}
Status: ${issue.status}
Priority: ${issue.priority}
Description:
${issue.description}

TEMPLATE:
${template}

Output clean Markdown only (headings, bullet lists, tables). Do not wrap in code fences.
Use professional wiki-ready formatting suitable for Confluence paste.
Replace <JIRA-KEY> and <title> in the title line.`;
}

async function callGroq(prompt, model) {
  const key = process.env.Groq_API_KEY || process.env.GROQ_API_KEY;
  if (!key) {
    const err = new Error("Groq API key missing in .env");
    err.status = 500;
    throw err;
  }
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    let detail = body;
    try {
      detail = JSON.parse(body).error?.message || detail;
    } catch {
      /* keep raw */
    }
    const err = new Error(`Groq generation failed: ${detail}`);
    err.status = 502;
    throw err;
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content;
}

async function callOllama(prompt, model) {
  const base = (process.env.OLLAMA_URL || "http://localhost:11434").replace(/\/$/, "");
  const res = await fetch(`${base}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [{ role: "user", content: prompt }],
      options: { temperature: 0.2 },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    let detail = body;
    try {
      const j = JSON.parse(body);
      detail = j.error || j.message || detail;
    } catch {
      /* keep raw */
    }
    const err = new Error(`Ollama generation failed: ${detail}`);
    err.status = 502;
    throw err;
  }
  const data = await res.json();
  return data.message?.content;
}

export async function generateTestPlan(issue) {
  const template = loadTemplate();
  const cfg = getLlmConfig();
  const model = activeModel(cfg);
  const prompt = buildPrompt(template, issue);

  let text;
  if (cfg.provider === "ollama" && process.env.VERCEL) {
    const err = new Error("Ollama is not available on Vercel. Switch default LLM to Groq in Settings.");
    err.status = 400;
    throw err;
  }
  if (cfg.provider === "ollama") {
    text = await callOllama(prompt, model);
  } else {
    text = await callGroq(prompt, model);
  }
  return text || fillOffline(template, issue);
}

function fillOffline(template, issue) {
  return template
    .replace("<JIRA-KEY>", issue.key)
    .replace("<title>", issue.summary)
    .replace(
      "- **In scope:**",
      `- **In scope:**\n- ${issue.summary} (from Jira ${issue.key})`
    )
    .replace(
      '- **Objective:** what "tested" means for this ticket.',
      `- **Objective:** Verify requirements described in Jira ${issue.key}.`
    );
}