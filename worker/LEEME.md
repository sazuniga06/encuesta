# Aviso por Telegram (sin exponer tu token ni tu chat)

Todo se configura con un solo comando, desde la carpeta del proyecto:

    bash worker/configurar.sh

Te pide: (1) crear un bot con @BotFather y pegar su token, (2) escribirle un mensaje al bot,
(3) iniciar sesión en Cloudflare (gratis). El script crea el Worker, guarda los secretos allí,
conecta `js/config.js` y te manda un mensaje de prueba a Telegram.
