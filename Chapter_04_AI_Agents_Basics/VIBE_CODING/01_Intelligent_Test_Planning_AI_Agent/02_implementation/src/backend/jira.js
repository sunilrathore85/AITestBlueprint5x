function authHeader(email, token) {
  return "Basic " + Buffer.from(`${email}:${token}`).toString("base64");
}

function adfToText(node) {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (node.type === "text") return node.text || "";
  if (Array.isArray(node.content)) return node.content.map(adfToText).join("");
  return "";
}

export async function fetchIssue({ url, email, token }, issueKey) {
  const res = await fetch(`${url}/rest/api/3/issue/${issueKey}`, {
    headers: {
      Authorization: authHeader(email, token),
      Accept: "application/json",
    },
  });
  if (res.status === 404) {
    const err = new Error("Issue not found");
    err.status = 404;
    throw err;
  }
  if (res.status === 401 || res.status === 403) {
    const err = new Error("Jira authentication or permission error");
    err.status = 403;
    throw err;
  }
  if (!res.ok) {
    const err = new Error(`Jira error ${res.status}`);
    err.status = 502;
    throw err;
  }
  const data = await res.json();
  const f = data.fields || {};
  const desc =
    typeof f.description === "string"
      ? f.description
      : adfToText(f.description) || "Insufficient information to determine.";
  return {
    key: data.key,
    summary: f.summary || issueKey,
    description: desc,
    type: f.issuetype?.name || "",
    status: f.status?.name || "",
    priority: f.priority?.name || "",
  };
}