// Single source of truth for backend communication.
// Point at a different backend by setting VITE_API_URL in .env.local
// (or the host's env, e.g. on Vercel/Netlify).
const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "http://localhost:5000";

async function request(path, { method = "GET", body, signal } = {}) {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    // Non-JSON response — leave payload null
  }

  if (!res.ok) {
    const msg = payload?.error || `Request failed (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }
  return payload;
}

export const api = {
  health: () => request("/api/health"),

  analyzeScore: ({ name, score, answers }) =>
    request("/api/analyze-score", {
      method: "POST",
      body: { name, score, answers },
    }),

  roadmap: (score) => request(`/api/roadmap?score=${encodeURIComponent(score)}`),

  assessment: (id) => request(`/api/assessments/${id}`),

  userAssessments: (name) =>
    request(`/api/users/${encodeURIComponent(name)}/assessments`),
};

export { API_URL };
