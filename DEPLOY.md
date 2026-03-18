# Развёртывание Telegram Mini App

## Краткая инструкция

### 1. Создайте бота
- Откройте [@BotFather](https://t.me/BotFather)
- `/newbot` → имя → username
- Сохраните токен

### 2. Разверните приложение (выберите один способ)

---

## Вариант A: Netlify

1. Зарегистрируйтесь на [app.netlify.com](https://app.netlify.com)
2. **Add new site** → **Import an existing project** (или перетащите папку в Netlify Drop)
3. Если через Git: подключите репозиторий
4. Настройки сборки:
   - **Build command:** оставьте пустым или `echo "No build"`
   - **Publish directory:** `public`
   - **Functions directory:** `netlify/functions` (уже в netlify.toml)
5. **Site settings** → **Environment variables** → добавить:
   - `BYBIT_API_KEY`
   - `BYBIT_API_SECRET`
6. Deploy → скопируйте URL: `https://ваш-сайт.netlify.app`

---

## Вариант B: Vercel

1. Зарегистрируйтесь на [vercel.com](https://vercel.com)
2. Установите Vercel CLI: `npm i -g vercel`
3. В папке проекта:
   ```bash
   cd bybit-referral-checker
   vercel
   ```
4. Следуйте подсказкам (логин, проект, настройки)
5. Добавьте переменные окружения:
   - Зайдите в проект на vercel.com → Settings → Environment Variables
   - Добавьте `BYBIT_API_KEY` и `BYBIT_API_SECRET`
6. Сделайте redeploy (Deployments → ⋮ → Redeploy)
7. Скопируйте URL: `https://ваш-проект.vercel.app`

---

## Вариант C: Railway

1. Зарегистрируйтесь на [railway.app](https://railway.app)
2. New Project → Deploy from GitHub (или Deploy from folder)
3. Если из папки: установите [Railway CLI](https://docs.railway.app/develop/cli)
4. В папке проекта:
   ```bash
   railway login
   railway init
   railway up
   ```
5. В панели Railway: Variables → добавить `BYBIT_API_KEY`, `BYBIT_API_SECRET`
6. Settings → Generate Domain → скопируйте URL

---

## Вариант D: Render

1. Зарегистрируйтесь на [render.com](https://render.com)
2. New → Web Service
3. Подключите репозиторий или загрузите код
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Environment → Add: `BYBIT_API_KEY`, `BYBIT_API_SECRET`
7. Deploy → скопируйте URL

---

### 3. Подключите Mini App к боту

1. [@BotFather](https://t.me/BotFather) → `/mybots`
2. Выберите бота → **Bot Settings** → **Menu Button**
3. **Configure menu button** → введите URL приложения (например `https://ваш-проект.vercel.app`)
4. Введите текст кнопки: `Проверить реферала`

### 4. Готово

Откройте бота в Telegram → нажмите кнопку меню → откроется Mini App.
