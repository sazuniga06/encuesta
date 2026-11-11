#!/usr/bin/env bash
# Deja listo el aviso por Telegram: crea el Worker en Cloudflare, guarda tus secretos y conecta la página.
# Tu token y tu chat NO se escriben en ningún archivo del proyecto.
set -euo pipefail
cd "$(dirname "$0")"
command -v node >/dev/null || { echo "Instala Node.js primero: https://nodejs.org"; exit 1; }
api() { curl -s "https://api.telegram.org/bot$TOKEN/$1"; }
json() { node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{const j=JSON.parse(s);console.log($1)}catch{console.log('')}})"; }

echo "━━ 1/4  Crea tu bot en Telegram"
echo "   Abre @BotFather → /newbot → elige un nombre y un usuario que termine en 'bot'. Copia el token que te da."
read -rsp "   Pega el token (no se muestra): " TOKEN; echo
TOKEN=${TOKEN//[[:space:]]/}   # quita espacios o saltos de línea que se cuelan al pegar
[ -n "$TOKEN" ] || { echo "   No recibí ningún token. Pégalo con clic derecho o Ctrl+Shift+V y pulsa Enter."; exit 1; }
BOT=$(api getMe 2>/dev/null | json "j.ok?j.result.username:''" || true)
[ -n "$BOT" ] || { echo "   Token inválido o sin internet (debe verse como 123456789:AAE…, sin espacios). Revócalo/cópialo de nuevo en @BotFather."; exit 1; }
echo "   ✓ Bot encontrado: @$BOT"

echo "━━ 2/4  Conecta tu chat"
echo "   Abre https://t.me/$BOT , toca INICIAR y escríbele cualquier mensaje. Luego vuelve aquí y pulsa Enter."
read -r
CHAT=$(api getUpdates 2>/dev/null | json "j.result.filter(u=>u.message).pop().message.chat.id" || true)
[ -n "$CHAT" ] || { echo "   No vi ningún mensaje. Escríbele al bot y ejecuta el script otra vez."; exit 1; }

echo "━━ 3/4  Cloudflare (cuenta gratis): se abrirá el navegador para iniciar sesión"
npx --yes wrangler login
URL=$(npx --yes wrangler deploy 2>&1 | tee /dev/stderr | grep -o 'https://[^ ]*workers.dev' | head -1)
[ -n "$URL" ] || { echo "   No pude leer la URL del Worker."; exit 1; }
printf %s "$TOKEN" | npx --yes wrangler secret put TOKEN
printf %s "$CHAT" | npx --yes wrangler secret put CHAT_ID

echo "━━ 4/4  Conectando la página y probando"
sed -i "s|endpoint: '[^']*'|endpoint: '$URL'|" ../js/config.js
ORIGIN=$(grep -o 'https://[^"]*' wrangler.toml | head -1)
curl -s -X POST "$URL" -H "Origin: $ORIGIN" -H 'Content-Type: application/json' -d '{"respuesta":"prueba"}' -w "\n   Respuesta del Worker: %{http_code}\n"
echo "   Revisa Telegram: debe llegarte «✅ Prueba: el aviso de la invitación funciona.»"
read -rp "   ¿Subir el cambio a GitHub ahora? (s/n) " R
if [ "$R" = s ]; then git -C .. add js/config.js && git -C .. commit -m "Conecta aviso por Telegram" && git -C .. push origin main; fi
echo "Listo."
