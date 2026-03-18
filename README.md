# Bybit Referral Checker — Telegram Mini App

Telegram Mini App для проверки, является ли пользователь с указанным WID (User ID) вашим рефералом на бирже Bybit.

## Возможности

- Ввод WID пользователя Bybit
- Проверка через Bybit Affiliate API
- Ответ: да/нет + данные реферала (дата регистрации, объём торгов)
- Адаптивный интерфейс для Telegram

## Быстрый старт

### 1. Клонирование и установка

```bash
git clone https://github.com/pifagortradebtc/botref.git
cd botref
npm install
```

### 2. Настройка API ключей

```bash
cp .env.example .env
```

Отредактируйте `.env` и добавьте:
- `BYBIT_API_KEY` — API ключ с разрешением **Affiliate**
- `BYBIT_API_SECRET` — секрет ключа

Получить ключ: [Bybit API Management](https://www.bybit.com/app/user/api-management) → только разрешение «Affiliate».

### 3. Локальный запуск

```bash
npm start
```

Сервер: `http://localhost:3000`

## Деплой на Netlify

1. Загрузите репозиторий на GitHub
2. [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
3. Подключите репозиторий
4. **Site configuration** → **Environment variables** → добавьте:
   - `BYBIT_API_KEY`
   - `BYBIT_API_SECRET`
5. Deploy

Подробнее: [DEPLOY.md](DEPLOY.md)

## Подключение к Telegram

1. Создайте бота: [@BotFather](https://t.me/BotFather) → `/newbot`
2. **Bot Settings** → **Menu Button** → **Configure menu button**
3. URL: `https://ваш-сайт.netlify.app`
4. Текст кнопки: `Проверить реферала`

## Безопасность

- API ключи **никогда** не попадают в браузер
- `.env` в `.gitignore` — не загружается в GitHub
- На Netlify ключи задаются в Environment variables

## Требования

- Node.js 16+
- Bybit API ключ с разрешением Affiliate
- Telegram Bot

## Лицензия

MIT
