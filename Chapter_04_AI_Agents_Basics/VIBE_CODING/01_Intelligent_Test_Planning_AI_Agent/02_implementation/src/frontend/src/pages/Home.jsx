import { useState } from "react";
import PlanDocument from "../components/PlanDocument";

export default function Home() {
  const [issueKey, setIssueKey] = useState("");
  const [plan, setPlan] = useState("");
  const [meta, setMeta] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    setPlan("");
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
      setPlan(data.plan);
      setMeta(`${data.issueKey}: ${data.title}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="layout-main">
      <div className="panel output">
        {loading && <p className="muted">Loading…</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && !plan && <p className="placeholder">Reply with Test Plan.</p>}
        {plan && <PlanDocument markdown={plan} meta={meta} />}
      </div>
      <form className="panel input-row" onSubmit={submit}>
        <input
          placeholder="Prompt (JIRA Ticket)"
          value={issueKey}
          onChange={(e) => setIssueKey(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !issueKey.trim()}>
          Generate
        </button>
      </form>
    </main>
  );
}