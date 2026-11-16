// Vercel Serverless Function · POST /api/license
// Reenvía la validación de la clave de licencia a Polar (evita bloqueos CORS del navegador).
// No necesita variables de entorno: el organization_id es público por diseño.
module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") { res.statusCode = 405; return res.end(JSON.stringify({ ok: false, error: "method" })); }
  let b = req.body;
  if (typeof b === "string") { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  b = b || {};
  const key = String(b.key || "").trim().slice(0, 200);
  const org = String(b.organization_id || "").trim();
  if (!key || !/^[0-9a-f-]{36}$/i.test(org)) { res.statusCode = 400; return res.end(JSON.stringify({ ok: false, error: "bad_request" })); }
  const api = b.sandbox ? "https://sandbox-api.polar.sh" : "https://api.polar.sh";
  try {
    const r = await fetch(api + "/v1/customer-portal/license-keys/validate", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, organization_id: org })
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) return res.end(JSON.stringify({ ok: false, error: (d && (d.detail && (d.detail[0] && d.detail[0].msg || d.detail))) || "invalid" }));
    return res.end(JSON.stringify({ ok: true, data: { status: d.status, benefit_id: d.benefit_id, expires_at: d.expires_at, display_key: d.display_key, customer: { email: d.customer && d.customer.email } } }));
  } catch (e) { res.statusCode = 502; return res.end(JSON.stringify({ ok: false, error: "upstream" })); }
};
