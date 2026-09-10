# Купольная мечеть · Актобе — сайт-презентация

Чистый HTML + CSS + JS, без сборки.

## Запуск
Открыть `index.html` в браузере или папку `site/` в VS Code → Live Server.

## Структура
- `index.html` — все секции, контент правится прямо здесь
- `css/style.css` — токены в `:root`, далее секции по порядку
- `js/main.js` — навигация, scroll-reveal, счётчики, параллакс, табы, лайтбокс
- `assets/img/` — рендеры и кропы (webp + jpg)
- `assets/fonts/` — Inter, Cormorant Garamond (cyrillic + latin, woff2)

## Перед публикацией
1. Вписать реальные контакты в футере (`#contacts`): e-mail, телефон, сайт.
2. Заменить `canonical` и `og:image` на абсолютные URL домена.
3. При наличии финальных рендеров — заменить файлы в `assets/img/`, имена оставить.

## Деплой
Перетащить папку в Netlify Drop, или `git push` в GitHub Pages, или загрузить по FTP.
