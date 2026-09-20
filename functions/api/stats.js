export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === 'OPTIONS') return corsResponse();
  if (request.method !== 'GET') return jsonResponse({ error: 'Method Not Allowed' }, 405);

  const kv = env.STATS_KV || env.KV;
  if (!kv) return jsonResponse({ views: 0, likes: 0 });

  const raw = await kv.get('stats:global');
  if (!raw) return jsonResponse({ views: 0, likes: 0 });

  try {
    const data = JSON.parse(raw);
    return jsonResponse({ views: data.views || 0, likes: data.likes || 0 });
  } catch {
    return jsonResponse({ views: 0, likes: 0 });
  }
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'cache-control': 'no-store'
    }
  });
}

function corsResponse() {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, POST, OPTIONS',
      'access-control-allow-headers': 'content-type'
    }
  });
}
