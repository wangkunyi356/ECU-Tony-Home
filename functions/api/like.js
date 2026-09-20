export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === 'OPTIONS') return corsResponse();
  if (request.method !== 'POST') return jsonResponse({ error: 'Method Not Allowed' }, 405);

  const kv = env.STATS_KV || env.KV;
  if (!kv) return jsonResponse({ error: 'KV not bound. Bind STATS_KV in EdgeOne console' }, 500);

  const ip = getClientIp(request);
  const likeKey = `like:${ip}`;
  const liked = await kv.get(likeKey);
  if (liked) return jsonResponse({ error: '已点赞' }, 429);

  const data = await getStats(kv);
  data.likes += 1;
  await kv.put('stats:global', JSON.stringify(data));
  await kv.put(likeKey, '1', { expirationTtl: 60 * 60 * 24 * 30 });

  return jsonResponse(data);
}

async function getStats(kv) {
  const raw = await kv.get('stats:global');
  if (!raw) return { views: 0, likes: 0 };
  try {
    const d = JSON.parse(raw);
    return { views: d.views || 0, likes: d.likes || 0 };
  } catch {
    return { views: 0, likes: 0 };
  }
}

function getClientIp(request) {
  const h = request.headers;
  return h.get('x-real-ip') || h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('cf-connecting-ip') || '0.0.0.0';
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
