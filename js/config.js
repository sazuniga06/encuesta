/* Datos que puedes editar sin tocar el resto del código */
const CONFIG = {
  nombre: 'Valentina',               // nombre de la invitada (el enlace con ?para=Otro lo reemplaza)
  endpoint: 'https://encuesta-whatsapp.encuestakitty.workers.dev',                      // URL del Worker de WhatsApp (ver worker/LEEME.md); vacío = solo ntfy
  topic: 'kitty-cosecha-41ab0cbc99', // tema de ntfy: suscríbete a este nombre en la app ntfy de tu celular
  hora:  '',                         // ej. '4:30 p. m.'  (vacío = "Top secret 🤫")
  cine:  '',                         // ej. 'Cine Colombia Unicentro'
  fecha: '20261122',                 // AAAAMMDD, para el botón "Agendar"
};
