'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const buzz = p => navigator.vibrate && navigator.vibrate(p);

/* ---------- Personalización ( ?para=Nombre ) ---------- */
const nombre = (new URLSearchParams(location.search).get('para') || '').trim().slice(0, 40);
if (nombre) { $('#para').textContent = 'Para ' + nombre; $('#tributo').textContent = 'Tributo: ' + nombre; }
if (CONFIG.hora) $('#hora').textContent = CONFIG.hora;
if (CONFIG.cine) $('#cine').textContent = CONFIG.cine;

/* ---------- Equipo de expedición ---------- */
const crew = [
  ['kitty',   'Hello Kitty', 'Líder de la expedición', 'map',            '#ff3b5c'],
  ['melody',  'My Melody',   'Sanadora del grupo',     'healing',        '#ff7eb3'],
  ['kuromi',  'Kuromi',      'Estratega rebelde',      'psychology_alt', '#b06cff'],
  ['badtz',   'Badtz-Maru',  'Cazador gruñón',         'target',         '#6ea8ff'],
  ['choco',   'Chococat',    'Explorador curioso',     'explore',        '#d9a94a'],
  ['cinna',   'Cinnamoroll', 'Vigía de las nubes',     'visibility',     '#7fd0ff'],
  ['keroppi', 'Keroppi',     'Experto en pantanos',    'water',          '#7ddc6e'],
];
const track = $('#track'), dots = $('#dots');
track.innerHTML = crew.map(([f, n, r, i, c]) =>
  `<article class="card glass" style="--ac:${c}"><img class="fig" src="assets/${f}.webp" alt="${n}" width="420" height="596" loading="lazy" decoding="async"><h3>${n}</h3><p>${r}</p><span class="chip"><span class="ms">${i}</span>Aliado</span></article>`).join('');
dots.innerHTML = crew.map(() => '<i></i>').join('');
const step = () => track.firstElementChild.offsetWidth + 14;
const paint = () => $$('i', dots).forEach((d, i) => d.classList.toggle('on', i === Math.round(track.scrollLeft / step())));
track.addEventListener('scroll', () => requestAnimationFrame(paint), { passive: true }); paint();
$$('[data-s]').forEach(b => b.onclick = () => track.scrollBy({ left: b.dataset.s * step(), behavior: 'smooth' }));
track.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') track.scrollBy({ left: (e.key === 'ArrowRight' ? 1 : -1) * step(), behavior: 'smooth' }); });

/* ---------- Ondas Material en botones ---------- */
document.addEventListener('pointerdown', e => {
  const b = e.target.closest('.btn'); if (!b) return;
  const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2, s = document.createElement('span');
  s.className = 'ripple'; s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
  b.appendChild(s); setTimeout(() => s.remove(), 650);
});

/* ---------- Revelar secciones, botón flotante, video solo si es visible ---------- */
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))), { threshold: .12 });
$$('.rv').forEach(el => io.observe(el));
new IntersectionObserver(([e]) => $('#fab').classList.toggle('hide', e.isIntersecting), { threshold: .3 }).observe($('#rsvp'));
const vid = $('#hero-video');
new IntersectionObserver(([e]) => e.isIntersecting ? vid.play().catch(() => {}) : vid.pause(), { threshold: .25 }).observe(vid);

/* ---------- Sonido sintético: fanfarria (sí) / cañón (no) ---------- */
let ac;
function tone(f, t, d, type = 'triangle', g = .25, f2) {
  ac = ac || new (window.AudioContext || window.webkitAudioContext)();
  if (ac.state === 'suspended') ac.resume();
  const o = ac.createOscillator(), v = ac.createGain(), s = ac.currentTime + t;
  o.type = type; o.frequency.setValueAtTime(f, s); if (f2) o.frequency.exponentialRampToValueAtTime(f2, s + d);
  v.gain.setValueAtTime(g, s); v.gain.exponentialRampToValueAtTime(.001, s + d);
  o.connect(v).connect(ac.destination); o.start(s); o.stop(s + d);
}

/* ---------- Confeti: moños, tiras doradas y puntos rosa ---------- */
function confetti() {
  if (reduceMotion) return;
  const c = $('#confetti'), x = c.getContext('2d'), dpr = Math.min(devicePixelRatio || 1, 2);
  c.width = innerWidth * dpr; c.height = innerHeight * dpr; x.scale(dpr, dpr);
  const cols = ['#f0c24b', '#ffd96b', '#e4002b', '#ff9ec4', '#fff'], N = innerWidth < 640 ? 90 : 150;
  const ps = Array.from({ length: N }, () => ({ x: innerWidth / 2, y: innerHeight * .6, vx: (Math.random() - .5) * 16, vy: -Math.random() * 18 - 6,
    a: Math.random() * 6, va: (Math.random() - .5) * .4, s: 6 + Math.random() * 9, c: cols[Math.random() * cols.length | 0], k: Math.random() * 3 | 0 }));
  let n = 0;
  (function f() {
    x.clearRect(0, 0, innerWidth, innerHeight);
    ps.forEach(p => {
      p.vy += .35; p.x += p.vx; p.y += p.vy; p.a += p.va; p.vx *= .99;
      x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.c;
      if (p.k === 0) x.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      else if (p.k === 1) { x.beginPath(); x.arc(0, 0, p.s / 3, 0, 7); x.fill(); }
      else { x.fillStyle = '#e4002b'; x.beginPath(); x.ellipse(-p.s / 2, 0, p.s / 2, p.s / 3, 0, 0, 7); x.ellipse(p.s / 2, 0, p.s / 2, p.s / 3, 0, 0, 7); x.fill(); x.fillStyle = '#ffd96b'; x.beginPath(); x.arc(0, 0, p.s / 4, 0, 7); x.fill(); }
      x.restore();
    });
    if (++n < 260) requestAnimationFrame(f); else x.clearRect(0, 0, innerWidth, innerHeight);
  })();
}

/* ---------- Envío al celular (push con ntfy.sh) ---------- */
async function enviar(si) {
  const quien = nombre || 'Tu invitad@';
  const body = { topic: CONFIG.topic, priority: 4, tags: si ? ['tada', 'kissing_heart'] : ['broken_heart'],
    title: si ? '¡DIJO QUE SÍ! 🎬' : 'Dijo que no 💔',
    message: `${quien} respondió ${si ? 'SÍ' : 'NO'} a Amanecer en la cosecha (22 nov). ${new Date().toLocaleString('es-CO')}` };
  try { return (await fetch('https://ntfy.sh/', { method: 'POST', body: JSON.stringify(body) })).ok; } catch { return false; }
}
const OK = '<span class="chip"><span class="ms">check_circle</span>Respuesta enviada a mi celular</span>';
const SENDING = '<span class="chip"><span class="ms">sync</span>Enviando respuesta…</span>';

/* ---------- Diálogos de respuesta ---------- */
const bYes = $('#bYes'), bNo = $('#bNo');
let lastFocus;
function abrir(ov) { lastFocus = document.activeElement; ov.hidden = false; requestAnimationFrame(() => ov.classList.add('on')); document.body.style.overflow = 'hidden'; $('[data-close]', ov).focus({ preventScroll: true }); }
function cerrar() {
  $$('.ov.on').forEach(o => o.classList.remove('on')); document.body.style.overflow = '';
  bYes.disabled = bNo.disabled = false; lastFocus && lastFocus.focus({ preventScroll: true });
}
$$('[data-close]').forEach(b => b.onclick = cerrar);
addEventListener('keydown', e => e.key === 'Escape' && cerrar());

function agenda() {
  const d = CONFIG.fecha, n = new Date(+d.slice(0, 4), +d.slice(4, 6) - 1, +d.slice(6) + 1), e = n.getFullYear() + String(n.getMonth() + 1).padStart(2, '0') + String(n.getDate()).padStart(2, '0');
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT', `UID:cosecha-${d}@invitacion`, `DTSTAMP:${d}T000000Z`, `DTSTART;VALUE=DATE:${d}`, `DTEND;VALUE=DATE:${e}`,
    'SUMMARY:Amanecer en la cosecha 🎬', `LOCATION:${CONFIG.cine}`, 'DESCRIPTION:Cine con Hello Kitty y la pandilla', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  $('#ics').href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
}

$('#parade').innerHTML = crew.map(([f], i) => `<img src="assets/${f}.webp" alt="" style="--i:${i}" width="420" height="596">`).join('');

async function responder(si) {
  const ov = $(si ? '#yes' : '#no'), st = $('[data-st]', ov);
  bYes.disabled = bNo.disabled = true;
  abrir(ov); st.innerHTML = SENDING;
  if (si) {
    agenda(); buzz([40, 60, 40, 60, 140]); confetti(); setTimeout(confetti, 900);
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * .16, .5));
  } else {
    buzz(250); $('#flash').classList.add('go'); $('.panel', ov).classList.add('shake');
    tone(140, 0, 1.2, 'sine', .6, 28); setTimeout(() => $('#flash').classList.remove('go'), 1000);
    if (!$('.drop', ov)) for (let i = 0; i < (innerWidth < 640 ? 30 : 50); i++) {
      const d = document.createElement('i'); d.className = 'drop';
      d.style.cssText = `left:${Math.random() * 100}%;animation-duration:${.7 + Math.random() * .8}s;animation-delay:${-Math.random() * 2}s`; ov.prepend(d);
    }
  }
  const intentar = async () => {
    st.innerHTML = SENDING;
    if (await enviar(si)) { st.innerHTML = OK; return; }
    const wa = CONFIG.phone ? `<a class="btn outlined" target="_blank" rel="noopener" href="https://wa.me/${CONFIG.phone}?text=${encodeURIComponent(`${nombre || 'Hola'}: ${si ? '¡SÍ voy a ver Amanecer en la cosecha! 🎬' : 'Hoy no puedo 💔'}`)}">WhatsApp</a>` : '';
    st.innerHTML = `<span class="chip"><span class="ms">wifi_off</span>No pude enviarla</span><button class="btn tonal" id="retry">Reintentar</button>${wa}`;
    $('#retry').onclick = intentar;
  };
  intentar();
}
bYes.onclick = () => responder(true);
bNo.onclick = () => responder(false);
