# Скрипт для первого push на GitHub
# Запуск: правый клик -> "Выполнить с PowerShell" или: .\push-to-github.ps1

Set-Location $PSScriptRoot

# Проверка Git config
$email = git config --global user.email 2>$null
$name = git config --global user.name 2>$null

if (-not $email -or -not $name) {
    Write-Host "Настройте Git (замените на свои данные):" -ForegroundColor Yellow
    Write-Host '  git config --global user.email "ваш@email.com"'
    Write-Host '  git config --global user.name "Ваше Имя"'
    Write-Host ""
    exit 1
}

# Добавить и закоммитить
git add .
$status = git status --short
if ($status -match "\.env") {
    Write-Host "ОШИБКА: .env в списке! Удалите его: git reset .env" -ForegroundColor Red
    exit 1
}
git commit -m "Initial commit: Bybit Referral Checker Telegram Mini App" 2>$null
if ($LASTEXITCODE -ne 0 -and $LASTEXITCODE -ne 1) { exit $LASTEXITCODE }

# Remote и push
git remote remove origin 2>$null
git remote add origin https://github.com/pifagortradebtc/botref.git
git branch -M main
git push -u origin main

Write-Host ""
Write-Host "Готово! Репозиторий: https://github.com/pifagortradebtc/botref" -ForegroundColor Green
