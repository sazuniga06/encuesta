// Cloudflare Worker: recibe { respuesta: 'si' | 'no', nombre } desde la página y lo reenvía a tu Telegram.
// El token del bot y tu chat viven como secretos del Worker (TOKEN, CHAT_ID): nunca aparecen en el sitio ni en GitHub.
export default {
  async fetch(req, env) {
    const cors = { 'Access-Control-Allow-Origin': env.ORIGIN, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    // solo acepta peticiones que vengan de tu página
    if (req.method !== 'POST' || req.headers.get('Origin') !== env.ORIGIN) return new Response('no', { status: 403, headers: cors });
    const { respuesta, nombre } = await req.json().catch(() => ({}));
    if (!['si', 'no', 'prueba'].includes(respuesta)) return new Response('bad', { status: 400, headers: cors });
    const quien = String(nombre || '').replace(/[^\p{L}\p{N} .'-]/gu, '').slice(0, 40) || 'Tu invitada';
    const text = {
      si: `🎬💖 ¡${quien} dijo que SÍ!\nAmanecer en la cosecha · domingo 22 de noviembre`,
      no: `💔 ${quien} dijo que NO a Amanecer en la cosecha.`,
      prueba: '✅ Prueba: el aviso de la invitación funciona.',
    }[respuesta];
    const r = await fetch(`https://api.telegram.org/bot${env.TOKEN}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: env.CHAT_ID, text }),
    });
    return new Response(r.ok ? 'ok' : 'fail', { status: r.ok ? 200 : 502, headers: cors });
  },
};
