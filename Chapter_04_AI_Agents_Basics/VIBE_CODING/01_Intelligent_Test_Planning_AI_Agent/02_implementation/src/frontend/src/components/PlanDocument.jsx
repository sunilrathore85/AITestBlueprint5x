import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function PlanDocument({ markdown, meta }) {
  const docRef = useRef(null);
  const [copyMsg, setCopyMsg] = useState("");

  async function copyRich() {
    const el = docRef.current;
    if (!el) return;
    const html = `<!DOCTYPE html><html><body>${el.innerHTML}</body></html>`;
    const text = el.innerText;
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([text], { type: "text/plain" }),
        }),
      ]);
      setCopyMsg("Copied — paste into Confluence with Ctrl+V.");
    } catch {
      await navigator.clipboard.writeText(text);
      setCopyMsg("Copied as plain text.");
    }
    setTimeout(() => setCopyMsg(""), 4000);
  }

  async function copyPlain() {
    const text = docRef.current?.innerText || markdown;
    await navigator.clipboard.writeText(text);
    setCopyMsg("Plain text copied.");
    setTimeout(() => setCopyMsg(""), 4000);
  }

  return (
    <div className="plan-wrap">
      <div className="plan-toolbar">
        <span className="meta">{meta}</span>
        <div className="btn-row">
          <button type="button" onClick={copyRich}>
            Copy for Confluence
          </button>
          <button type="button" className="btn-secondary" onClick={copyPlain}>
            Copy plain text
          </button>
        </div>
      </div>
      {copyMsg && <p className="copy-hint">{copyMsg}</p>}
      <article ref={docRef} className="plan-document">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      </article>
    </div>
  );
}