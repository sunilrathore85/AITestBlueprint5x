# Test Strategy Builder AI Agent

Small React + Express app. Enter a Jira issue ID. The backend reads that issue and asks the configured model to fill `01_plan/Test_Strategy_Template.md`.

## Run

From this folder:

```bash
npm install
npm run install:all
npm start
```

Open http://localhost:5174. API is http://localhost:3002.

## Config

Credentials stay on the server. `src/backend/server.js` loads the repo-root `.env` (six levels up):

- `JIRA_API_URL`
- `JIRA_API_USERNAME`
- `JIRA_API_TOKEN`
- `Groq_API_KEY` or `GROQ_API_KEY`
- `OLLAMA_URL` (optional, default `http://localhost:11434`)

Settings lets you pick Groq or Ollama and a model. The choice is saved in `src/backend/llm-config.json`.

## How generation works

1. Validate the issue key (`PROJ-104`).
2. Fetch the issue from Jira Cloud (`/rest/api/3/issue`).
3. Send the issue text and the template to the selected model at temperature 0.
4. Missing facts stay as `Insufficient information to determine.`
5. Recommendations are labeled `Proposed Approach:`. Assumptions are labeled `Assumption (Requires Confirmation):`.

The result is a strategy. It does not create test cases or write back to Jira.

## Checks

- UI loads at `/` and `/settings`.
- Invalid keys return an error and keep the typed ID.
- Live Jira and model calls need the `.env` values above.
