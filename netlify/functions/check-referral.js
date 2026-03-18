const crypto = require('crypto');
const https = require('https');
const http = require('http');

const BYBIT_API_KEY = (process.env.BYBIT_API_KEY || '').trim();
const BYBIT_API_SECRET = (process.env.BYBIT_API_SECRET || '').trim();
const BYBIT_BASE_URL = process.env.BYBIT_BASE_URL || 'https://api.bybit.com';

function createBybitSignature(queryString, timestamp) {
  const recvWindow = '5000';
  const signPayload = timestamp + BYBIT_API_KEY + recvWindow + queryString;
  return crypto
    .createHmac('sha256', BYBIT_API_SECRET)
    .update(signPayload)
    .digest('hex');
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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { success: false, error: 'Method not allowed' });
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return jsonResponse(400, { success: false, error: 'Invalid JSON' });
  }

  const wid = body.wid;
  if (!wid || typeof wid !== 'string') {
    return jsonResponse(400, {
      success: false,
      error: 'Укажите WID (номер пользователя Bybit)',
    });
  }

  const trimmedWid = String(wid).trim();
  if (!trimmedWid) {
    return jsonResponse(400, {
      success: false,
      error: 'WID не может быть пустым',
    });
  }

  if (!BYBIT_API_KEY || !BYBIT_API_SECRET) {
    return jsonResponse(500, {
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
        return jsonResponse(400, {
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

    return jsonResponse(200, {
      success: true,
      isReferral: found,
      userInfo: found ? userInfo : null,
      message: found
        ? 'Да, это ваш реферал!'
        : 'Нет, этот пользователь не является вашим рефералом.',
    });
  } catch (err) {
    console.error('Bybit API error:', err.message);
    return jsonResponse(500, {
      success: false,
      error: err.message || 'Ошибка при проверке. Попробуйте позже.',
    });
  }
};
