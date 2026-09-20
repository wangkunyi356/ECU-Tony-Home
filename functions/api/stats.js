export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === 'OPTIONS') return corsResponse();
  if (request.method !== 'GET') return jsonResponse({ error: 'Method Not Allowed' }, 405);

  const kv = env.STATS_KV || env.KV;
  if (kv) {
    const raw = await kv.get('stats:global');
    if (raw) {
      try { const d = JSON.parse(raw); return jsonResponse({ views: d.views || 0, likes: d.likes || 0 }); } catch {}
    }
  }

  const supa = getSupabaseEnv(env);
  if (!supa) return jsonResponse({ views: 0, likes: 0 });

  const res = await fetch(`${supa.url}/rest/v1/site_stats?id=eq.1&select=views,likes`, {
    headers: { apikey: supa.key, Authorization: `Bearer ${supa.key}` }
  });
  if (!res.ok) return jsonResponse({ views: 0, likes: 0 });
  const rows = await res.json();
  if (!rows.length) return jsonResponse({ views: 0, likes: 0 });
  return jsonResponse({ views: rows[0].views || 0, likes: rows[0].likes || 0 });
}

function getSupabaseEnv(env) {
  const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ''), key };
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*', 'cache-control': 'no-store' }
  });
}
function corsResponse() {
  return new Response(null, { status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET, POST, OPTIONS', 'access-control-allow-headers': 'content-type' } });
}
