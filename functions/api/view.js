export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === 'OPTIONS') return corsResponse();
  if (request.method !== 'POST') return jsonResponse({ error: 'Method Not Allowed' }, 405);

  const kv = env.STATS_KV || env.KV;
  if (kv) return handleKv(request, kv);

  const supa = getSupabaseEnv(env) || getSupabaseEnv(typeof process !== 'undefined' ? process.env : {}) || getSupabaseEnv(globalThis);
  if (!supa) return jsonResponse({ error: 'Supabase not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in EdgeOne env', debug: Object.keys(env || {}) }, 500);

  const data = await supaIncrement(supa, 'views');
  return jsonResponse(data);
}

async function handleKv(request, kv) {
  const ip = getClientIp(request);
  const dedupKey = `view:dedup:${ip}`;
  if (await kv.get(dedupKey)) {
    const d = await getKvStats(kv);
    return jsonResponse(d);
  }
  const d = await getKvStats(kv);
  d.views += 1;
  await kv.put('stats:global', JSON.stringify(d));
  await kv.put(dedupKey, '1', { expirationTtl: 300 });
  return jsonResponse(d);
}

async function getKvStats(kv) {
  const raw = await kv.get('stats:global');
  if (!raw) return { views: 0, likes: 0 };
  try { const d = JSON.parse(raw); return { views: d.views || 0, likes: d.likes || 0 }; } catch { return { views: 0, likes: 0 }; }
}

async function supaIncrement(supa, field) {
  const curRes = await fetch(`${supa.url}/rest/v1/site_stats?id=eq.1&select=views,likes`, {
    headers: { apikey: supa.key, Authorization: `Bearer ${supa.key}` }
  });
  const rows = curRes.ok ? await curRes.json() : [];
  const cur = rows[0] || { views: 0, likes: 0 };
  const next = { views: cur.views || 0, likes: cur.likes || 0 };
  next[field] += 1;

  await fetch(`${supa.url}/rest/v1/site_stats?id=eq.1`, {
    method: 'PATCH',
    headers: { apikey: supa.key, Authorization: `Bearer ${supa.key}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ [field]: next[field] })
  });
  return next;
}

function getSupabaseEnv(env) {
  if (!env) return null;
  const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_KEY || env.SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_PUBLISHABLE_DEFAULT_KEY || env.SUPABASE_SECRET_KEY || env.sb_publishable_default;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ''), key };
}
function getClientIp(request) {
  const h = request.headers;
  return h.get('x-real-ip') || h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('cf-connecting-ip') || '0.0.0.0';
}
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*', 'cache-control': 'no-store' } });
}
function corsResponse() {
  return new Response(null, { status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET, POST, OPTIONS', 'access-control-allow-headers': 'content-type' } });
}
