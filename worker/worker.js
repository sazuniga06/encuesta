// Cloudflare Worker: recibe { respuesta: 'si' | 'no', nombre } desde la página y lo reenvía a tu WhatsApp con CallMeBot.
// Tu número y tu apikey viven como secretos del Worker (PHONE, APIKEY): nunca aparecen en el sitio ni en GitHub.
export default {
  async fetch(req, env) {
    const cors = { 'Access-Control-Allow-Origin': env.ORIGIN, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    // solo acepta peticiones que vengan de tu página
    if (req.method !== 'POST' || req.headers.get('Origin') !== env.ORIGIN) return new Response('no', { status: 403, headers: cors });
    const { respuesta, nombre } = await req.json().catch(() => ({}));
    if (respuesta !== 'si' && respuesta !== 'no') return new Response('bad', { status: 400, headers: cors });
    const quien = String(nombre || '').replace(/[^\p{L}\p{N} .'-]/gu, '').slice(0, 40) || 'Tu invitada';
    const text = respuesta === 'si'
      ? `🎬💖 ¡${quien} dijo que SÍ! Amanecer en la cosecha, domingo 22 de noviembre.`
      : `💔 ${quien} dijo que NO a Amanecer en la cosecha.`;
    const r = await fetch('https://api.callmebot.com/whatsapp.php?' + new URLSearchParams({ phone: env.PHONE, text, apikey: env.APIKEY }));
    return new Response(r.ok ? 'ok' : 'fail', { status: r.ok ? 200 : 502, headers: cors });
  },
};
