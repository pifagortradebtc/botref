# Первый push на GitHub

## Вариант 1: Скрипт (PowerShell)

1. Настройте Git один раз:
   ```bash
   git config --global user.email "ваш@email.com"
   git config --global user.name "Ваше Имя"
   ```
2. Запустите `push-to-github.ps1`

## Вариант 2: Вручную

```bash
cd bybit-referral-checker

git config --global user.email "ваш@email.com"
git config --global user.name "Ваше Имя"

git add .
git commit -m "Initial commit: Bybit Referral Checker Telegram Mini App"
git remote add origin https://github.com/pifagortradebtc/botref.git
git branch -M main
git push -u origin main
```

**Создайте репозиторий** `botref` на GitHub перед push (пустой, без README).

**Проверка:** Файл `.env` не попадёт в push — он в `.gitignore`.
