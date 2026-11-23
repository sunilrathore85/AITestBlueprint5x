function adfToText(node) {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (node.type === "text") return node.text || "";
  if (node.type === "hardBreak") return "\n";
  const kids = Array.isArray(node.content) ? node.content.map(adfToText).join("") : "";
  if (["paragraph", "heading", "listItem"].includes(node.type)) return kids + "\n";
  return kids;
}

export async function fetchIssue({ url, email, token }, issueKey) {
  const res = await fetch(`${url}/rest/api/3/issue/${issueKey}`, {
    headers: {
      Authorization: "Basic " + Buffer.from(`${email}:${token}`).toString("base64"),
      Accept: "application/json",
    },
  });
  if (res.status === 404) throw Object.assign(new Error("Issue not found"), { status: 404 });
  if (res.status === 401 || res.status === 403) {
    throw Object.assign(new Error("Jira authentication or permission error"), { status: 403 });
  }
  if (!res.ok) throw Object.assign(new Error(`Jira error ${res.status}`), { status: 502 });
  const data = await res.json();
  const f = data.fields || {};
  const description =
    typeof f.description === "string" ? f.description : adfToText(f.description);
  return {
    key: data.key,
    summary: f.summary || issueKey,
    description: description || "",
    type: f.issuetype?.name || "",
    status: f.status?.name || "",
    priority: f.priority?.name || "",
    labels: (f.labels || []).join(", "),
  };
}
