# Aviso por WhatsApp (sin exponer tu número)

1. **Activar CallMeBot** (una vez): guarda en tus contactos el número del bot que aparece en
   https://www.callmebot.com/blog/free-api-whatsapp-messages/ y envíale por WhatsApp:
   `I allow callmebot to send me messages`. Te responde con tu `APIKEY`.
   (Si el bot está lleno, vuelve a intentar en unos días.)
2. **Cloudflare** (cuenta gratis), desde esta carpeta `worker/`:
   ```
   npx wrangler login
   npx wrangler secret put PHONE     # escribe tu número con +57...
   npx wrangler secret put APIKEY    # el apikey que te dio el bot
   npx wrangler deploy
   ```
   El deploy imprime una URL `https://encuesta-whatsapp.<tu-usuario>.workers.dev`.
3. Pega esa URL en `js/config.js` → `endpoint` y sube los cambios.
