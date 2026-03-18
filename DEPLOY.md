# Развёртывание

## Render (рекомендуется)

Bybit блокирует IP США и Китая. Render с регионом Frankfurt работает.

1. [dashboard.render.com](https://dashboard.render.com) → **New** → **Blueprint**
2. Подключите репозиторий **botref**
3. **Environment** → `BYBIT_API_KEY`, `BYBIT_API_SECRET`
4. **Apply**

## Подключение к Telegram

1. [@BotFather](https://t.me/BotFather) → `/mybots` → ваш бот → **Bot Settings** → **Menu Button**
2. URL: `https://ваш-сайт.onrender.com`
3. Текст кнопки: `Проверить реферала`
