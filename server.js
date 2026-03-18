/**
 * Backend для проверки рефералов Bybit
 * API ключ хранится на сервере — никогда не передаётся в клиент
 */
require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const https = require('https');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;

// ВАЖНО: Создайте файл .env и добавьте:
// BYBIT_API_KEY=ваш_api_key
// BYBIT_API_SECRET=ваш_api_secret
const BYBIT_API_KEY = process.env.BYBIT_API_KEY || '';
const BYBIT_API_SECRET = process.env.BYBIT_API_SECRET || '';
const BYBIT_BASE_URL = process.env.BYBIT_BASE_URL || 'https://api.bybit.com';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function createBybitSignature(queryString, timestamp) {
  const recvWindow = '5000';
  const signPayload = timestamp + BYBIT_API_KEY + recvWindow + queryString;
  const signature = crypto
    .createHmac('sha256', BYBIT_API_SECRET)
    .update(signPayload)
    .digest('hex');
  return signature;
}

function bybitRequest(queryParams = {}) {
  return new Promise((resolve, reject) => {
    const queryString = new URLSearchParams(queryParams).toString();
    const timestamp = Date.now().toString();
    const signature = createBybitSignature(queryString, timestamp);

    const url = new URL('/v5/affiliate/aff-user-list', BYBIT_BASE_URL);
    url.search = queryString;

    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'X-BAPI-API-KEY': BYBIT_API_KEY,
        'X-BAPI-TIMESTAMP': timestamp,
        'X-BAPI-RECV-WINDOW': '5000',
        'X-BAPI-SIGN': signature,
      },
    };

    const client = url.protocol === 'https:' ? https : http;
    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error('Invalid response from Bybit'));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

app.post('/api/check-referral', async (req, res) => {
  const { wid } = req.body || {};

  if (!wid || typeof wid !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Укажите WID (номер пользователя Bybit)',
    });
  }

  const trimmedWid = String(wid).trim();
  if (!trimmedWid) {
    return res.status(400).json({
      success: false,
      error: 'WID не может быть пустым',
    });
  }

  if (!BYBIT_API_KEY || !BYBIT_API_SECRET) {
    return res.status(500).json({
      success: false,
      error: 'Сервер не настроен: отсутствуют BYBIT_API_KEY или BYBIT_API_SECRET',
    });
  }

  try {
    let cursor = '';
    let found = false;
    let userInfo = null;

    do {
      const params = { size: '100' };
      if (cursor) params.cursor = cursor;

      const result = await bybitRequest(params);

      if (result.retCode !== 0) {
        return res.status(400).json({
          success: false,
          error: result.retMsg || 'Ошибка API Bybit',
        });
      }

      const list = result.result?.list || [];
      const match = list.find((u) => String(u.userId) === trimmedWid);

      if (match) {
        found = true;
        userInfo = {
          userId: match.userId,
          registerTime: match.registerTime,
          source: match.source,
          isKyc: match.isKyc,
          tradeVol30Day: match.tradeVol30Day,
          tradeVol365Day: match.tradeVol365Day,
        };
        break;
      }

      cursor = result.result?.nextPageCursor || '';
    } while (cursor);

    res.json({
      success: true,
      isReferral: found,
      userInfo: found ? userInfo : null,
      message: found
        ? 'Да, это ваш реферал!'
        : 'Нет, этот пользователь не является вашим рефералом.',
    });
  } catch (err) {
    console.error('Bybit API error:', err.message);
    res.status(500).json({
      success: false,
      error: err.message || 'Ошибка при проверке. Попробуйте позже.',
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    configured: !!(BYBIT_API_KEY && BYBIT_API_SECRET),
  });
});

// Для Vercel: экспорт app (не запускаем listen)
module.exports = app;

// Для локального запуска / Railway / Render
if (require.main === module && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    if (!BYBIT_API_KEY || !BYBIT_API_SECRET) {
      console.warn('ВНИМАНИЕ: BYBIT_API_KEY и BYBIT_API_SECRET не заданы. Создайте .env файл.');
    }
  });
}
