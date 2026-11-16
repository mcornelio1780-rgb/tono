// Cloudflare Pages Function · POST /api/license (mismo comportamiento que api/license.js de Vercel)
export async function onRequestPost({ request }) {
  const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
  let b = {}; try { b = await request.json(); } catch (e) {}
  const key = String(b.key || "").trim().slice(0, 200);
  const org = String(b.organization_id || "").trim();
  if (!key || !/^[0-9a-f-]{36}$/i.test(org)) return json({ ok: false, error: "bad_request" }, 400);
  const api = b.sandbox ? "https://sandbox-api.polar.sh" : "https://api.polar.sh";
  try {
    const r = await fetch(api + "/v1/customer-portal/license-keys/validate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, organization_id: org }) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) return json({ ok: false, error: (d && (d.detail && (d.detail[0] && d.detail[0].msg || d.detail))) || "invalid" });
    return json({ ok: true, data: { status: d.status, benefit_id: d.benefit_id, expires_at: d.expires_at, display_key: d.display_key, customer: { email: d.customer && d.customer.email } } });
  } catch (e) { return json({ ok: false, error: "upstream" }, 502); }
}
