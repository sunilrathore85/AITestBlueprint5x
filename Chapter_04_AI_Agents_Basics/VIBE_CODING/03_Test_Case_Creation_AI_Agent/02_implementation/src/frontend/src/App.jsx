import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Home() {
  const [issueKey, setIssueKey] = useState("");
  const [cases, setCases] = useState("");
  const [meta, setMeta] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (loading) return;
    setError("");
    setCases("");
    setMeta("");
    setLoading(true);
    try {
      const r = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueKey }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Request failed");
      setCases(data.cases);
      setMeta(`${data.issueKey}: ${data.title}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(cases);
    setCopied("Copied");
    setTimeout(() => setCopied(""), 2000);
  }

  return (
    <main>
      <form onSubmit={submit}>
        <div className="card row">
          <label htmlFor="ticket">Jira Ticket ID:</label>
          <input
            id="ticket"
            value={issueKey}
            placeholder="PROJ-104"
            onChange={(e) => setIssueKey(e.target.value)}
            disabled={loading}
          />
        </div>
        <button className="build" type="submit" disabled={loading || !issueKey.trim()}>
          {loading ? "Generating…" : "Generate Test Cases"}
        </button>
      </form>
      <section className="card output">
        {loading && <p className="muted">Retrieving the Jira issue and writing test cases…</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && !cases && <p className="muted">Enter a Jira ticket and generate test cases.</p>}
        {meta && (
          <div className="output-head">
            <p className="meta">Source: live Jira — {meta}</p>
            <button type="button" className="ghost" onClick={copy}>
              {copied || "Copy"}
            </button>
          </div>
        )}
        {cases && (
          <article className="doc">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{cases}</ReactMarkdown>
          </article>
        )}
      </section>
    </main>
  );
}

function Settings() {
  const [settings, setSettings] = useState(null);
  const [provider, setProvider] = useState("groq");
  const [groqModel, setGroqModel] = useState("openai/gpt-oss-120b");
  const [ollamaModel, setOllamaModel] = useState("gemma3:4b");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setProvider(data.llm?.provider || "groq");
        setGroqModel(data.llm?.groqModel || "openai/gpt-oss-120b");
        setOllamaModel(data.llm?.ollamaModel || "gemma3:4b");
      })
      .catch(() => setMsg("Could not load settings"));
  }, []);

  async function save() {
    const r = await fetch("/api/settings/llm", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, groqModel, ollamaModel }),
    });
    const data = await r.json();
    setMsg(r.ok ? `Saved ${data.llm.provider}: ${data.llm.activeModel}` : data.error);
  }

  async function test(kind) {
    setMsg("Testing…");
    const r = await fetch(kind === "jira" ? "/api/test-jira" : "/api/test-llm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, groqModel, ollamaModel }),
    });
    const data = await r.json();
    setMsg(data.message || data.error);
  }

  if (!settings) return <p className="muted">{msg || "Loading settings…"}</p>;
  const models = provider === "groq" ? settings.llm.groqModels : settings.llm.ollamaModels;
  const model = provider === "groq" ? groqModel : ollamaModel;
  const setModel = provider === "groq" ? setGroqModel : setOllamaModel;

  return (
    <main className="settings">
      <section className="card block">
        <h2>Jira connection</h2>
        <label>URL</label>
        <input readOnly value={settings.jira.url} />
        <label>Email</label>
        <input readOnly value={settings.jira.email} />
        <label>Token</label>
        <input readOnly value={settings.jira.tokenConfigured ? "Configured in .env" : "Not set"} />
        <button type="button" onClick={() => test("jira")}>Test connection</button>
      </section>
      <section className="card block">
        <h2>LLM</h2>
        <label className="radio">
          <input type="radio" checked={provider === "groq"} onChange={() => setProvider("groq")} /> Groq
          {settings.llm.groqConfigured ? "" : " (key not set)"}
        </label>
        <label className="radio">
          <input type="radio" checked={provider === "ollama"} onChange={() => setProvider("ollama")} /> Ollama
        </label>
        <label>Model</label>
        {models?.length ? (
          <select value={model} onChange={(e) => setModel(e.target.value)}>
            {models.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        ) : (
          <input value={model} onChange={(e) => setModel(e.target.value)} />
        )}
        <div className="btn-row">
          <button type="button" onClick={save}>Save</button>
          <button type="button" onClick={() => test("llm")}>Test model</button>
        </div>
      </section>
      {msg && <p className="meta">{msg}</p>}
    </main>
  );
}

export default function App() {
  return (
    <div className="shell">
      <header>
        <h1><Link to="/">Test Case Creation AI Agent</Link></h1>
        <nav>
          <Link to="/settings" className="settings-btn">Settings</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}
