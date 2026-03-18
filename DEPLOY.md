# Развёртывание Telegram Mini App

## Краткая инструкция

### 1. Создайте бота
- Откройте [@BotFather](https://t.me/BotFather)
- `/newbot` → имя → username
- Сохраните токен

### 2. Разверните приложение (выберите один способ)

---

## Вариант A: Vercel (рекомендуется, бесплатно)

1. Зайдите на [vercel.com](https://vercel.com) и войдите через GitHub
2. **Add New** → **Project**
3. Импортируйте репозиторий **botref** (pifagortradebtc/botref)
4. **Environment Variables** → добавьте:
   - `BYBIT_API_KEY` = ваш ключ
   - `BYBIT_API_SECRET` = ваш секрет
5. **Deploy**
6. Скопируйте URL: `https://botref-xxx.vercel.app`

---

## Вариант B: Render (бесплатно, без карты)

1. Зайдите на [render.com](https://render.com) и войдите через GitHub
2. **New** → **Web Service**
3. Подключите репозиторий **botref**
4. Render подхватит `render.yaml` автоматически
5. **Environment** → добавьте `BYBIT_API_KEY` и `BYBIT_API_SECRET`
6. **Create Web Service**
7. Скопируйте URL: `https://bybit-referral-checker.onrender.com`

---

## Вариант C: Netlify (если есть кредиты)

1. Зарегистрируйтесь на [app.netlify.com](https://app.netlify.com)
2. **Add new site** → **Import an existing project**
3. Подключите репозиторий **botref**
4. **Site settings** → **Environment variables** → `BYBIT_API_KEY`, `BYBIT_API_SECRET`
5. Deploy → URL: `https://ваш-сайт.netlify.app`

---

## Вариант D: Vercel (через CLI)

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

## Вариант E: Railway

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

## Вариант F: Render (CLI)

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
