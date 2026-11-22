# Jira Test Plan Generator

**Production:** https://planningaiagent-umber.vercel.app  

Use **Groq** on Vercel (Ollama is local-only). Redeploy: `node scripts/deploy-vercel.mjs`.

**Custom domain:** `planningaiagent.vercel.app` is tied to a separate **paused** deployment. In [Vercel Domains](https://vercel.com/dashboard), remove it from that project or resume/delete it, then assign it to **planningaiagent** (Settings → Domains).

Redeploy from this folder: `node scripts/deploy-vercel.mjs` (uses repo `.env` `VERCEL_TOKEN`).

## Run

```bash
cd 02_implementation
npm install
npm run install:all
npm start
```

Open **http://localhost:5173**. Backend reads `AITestBlueprint5x/.env` (`JIRA_*`, `Groq_API_KEY`).

## Use

1. **Main** — enter a Jira key (e.g. `QA-123`) → **Generate**.
2. **Settings** — masked Jira/LLM status and connection tests.