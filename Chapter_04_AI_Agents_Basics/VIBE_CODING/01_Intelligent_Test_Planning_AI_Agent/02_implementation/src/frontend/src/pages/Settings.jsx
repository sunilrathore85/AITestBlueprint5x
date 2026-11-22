import { useEffect, useState } from "react";

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [provider, setProvider] = useState("groq");
  const [groqModel, setGroqModel] = useState("openai/gpt-oss-20b");
  const [ollamaModel, setOllamaModel] = useState("gemma3:4b");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        if (data.llm) {
          setProvider(data.llm.provider || "groq");
          setGroqModel(data.llm.groqModel || data.llm.groqModels?.[0] || "openai/gpt-oss-20b");
          setOllamaModel(data.llm.ollamaModel || data.llm.ollamaModels?.[0] || "gemma3:4b");
        }
      })
      .catch(() => setSettings(null));
  }, []);

  async function saveLlm() {
    setMsg("Saving…");
    const r = await fetch("/api/settings/llm", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, groqModel, ollamaModel }),
    });
    const data = await r.json();
    setMsg(r.ok ? `Default: ${data.llm.provider} — ${data.llm.activeModel}` : data.error);
  }

  async function testJira() {
    setMsg("Testing Jira…");
    const r = await fetch("/api/test-jira", { method: "POST" });
    const data = await r.json();
    setMsg(data.ok ? data.message : data.error);
  }

  async function testLlm() {
    setMsg(`Testing ${provider}…`);
    const r = await fetch("/api/test-llm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, groqModel, ollamaModel }),
    });
    const data = await r.json();
    setMsg(data.ok ? data.message : data.error);
  }

  if (!settings) return <p className="muted">Loading settings…</p>;

  return (
    <main className="layout-settings">
      <section className="panel block">
        <h2>JIRA Connection</h2>
        <label>URL</label>
        <input readOnly value={settings.jira.url} />
        <label>Email</label>
        <input readOnly value={settings.jira.email} />
        <label>Token</label>
        <input readOnly value={settings.jira.tokenConfigured ? "Configured in .env" : "Not set"} />
        <button type="button" onClick={testJira}>
          Test Connection
        </button>
      </section>
      <section className="panel block">
        <h2>LLM Configuration</h2>
        <p className="muted">One provider active at a time (default: Groq).</p>
        <fieldset className="provider-pick">
          <label className="radio">
            <input
              type="radio"
              name="provider"
              value="groq"
              checked={provider === "groq"}
              onChange={() => setProvider("groq")}
            />
            Groq.com
            {settings.llm.groqConfigured ? "" : " (key not set)"}
          </label>
          <label className="radio">
            <input
              type="radio"
              name="provider"
              value="ollama"
              checked={provider === "ollama"}
              onChange={() => setProvider("ollama")}
            />
            Ollama — {settings.llm.ollamaUrl}
          </label>
        </fieldset>
        {provider === "groq" ? (
          <>
            <label>Groq model</label>
            <select value={groqModel} onChange={(e) => setGroqModel(e.target.value)}>
              {(settings.llm.groqModels?.length ? settings.llm.groqModels : [groqModel]).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </>
        ) : (
          <>
            <label>Ollama model</label>
            {settings.llm.ollamaModels?.length ? (
              <select value={ollamaModel} onChange={(e) => setOllamaModel(e.target.value)}>
                {settings.llm.ollamaModels.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={ollamaModel}
                onChange={(e) => setOllamaModel(e.target.value)}
                placeholder="e.g. gemma3:4b"
              />
            )}
          </>
        )}
        <div className="btn-row">
          <button type="button" onClick={saveLlm}>
            Save default
          </button>
          <button type="button" onClick={testLlm}>
            Test {provider === "groq" ? "Groq" : "Ollama"}
          </button>
        </div>
      </section>
      {msg && <p className="meta">{msg}</p>}
    </main>
  );
}