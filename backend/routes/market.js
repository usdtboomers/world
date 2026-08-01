// const express = require("express");
// const axios = require("axios");
// const router = express.Router();

// const BINANCE_API = "https://api.binance.com/api/v3";

// const MAX_CHUNK = 20;          
// const SYMBOL_LIMIT = 300;     
// const CACHE_MS = 5_000;        
// const EXCHANGEINFO_CACHE_MS = 60_000; 

// let cachedSymbols = null;
// let cachedAt = 0;
// let pricesCache = null;
// let pricesCacheAt = 0;

// function chunk(arr, size) {
//   const out = [];
//   for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
//   return out;
// }

// function normalizeList(comma) {
//   return String(comma || "")
//     .split(",")
//     .map((s) => s.trim().toUpperCase())
//     .filter(Boolean);
// }

// async function getValidSymbols() {
//   const now = Date.now();
//   if (cachedSymbols && now - cachedAt < EXCHANGEINFO_CACHE_MS) return cachedSymbols;

//   const { data } = await axios.get(`${BINANCE_API}/exchangeInfo`, { timeout: 10000 });
//   const valid = new Set(
//     (data.symbols || [])
//       .filter((s) => s.status === "TRADING")
//       .map((s) => s.symbol.toUpperCase())
//   );

//   cachedSymbols = valid;
//   cachedAt = now;
//   return valid;
// }

// async function fetchWithRetry(configFn, retries = 2, baseDelay = 400) {
//   let attempt = 0;
//   while (true) {
//     try {
//       return await configFn();
//     } catch (err) {
//       attempt++;
//       const status = err?.response?.status;
//       if (status && status >= 400 && status < 500) throw err;
//       if (attempt > retries) throw err;
//       const delay = baseDelay * Math.pow(2, attempt - 1);
//       await new Promise((r) => setTimeout(r, delay));
//     }
//   }
// }

// router.get("/prices", async (req, res) => {
//   try {
//     const requested = normalizeList(req.query.symbols);
//     if (!requested.length) return res.json({ prices: [], invalidSymbols: [] });

//     if (requested.length > SYMBOL_LIMIT) {
//       return res.status(400).json({ message: `Too many symbols (max ${SYMBOL_LIMIT})` });
//     }

//     const now = Date.now();
//     if (pricesCache && now - pricesCacheAt < CACHE_MS) {
//       return res.json(pricesCache);
//     }

//     const validSet = await getValidSymbols();

//     const aliasMap = {
//       SATSUSDT: "1000SATSUSDT",
//     };

//     const mapped = requested.map((s) => aliasMap[s] || s);
//     const validSymbols = Array.from(new Set(mapped.filter((s) => validSet.has(s))));
//     const invalidSymbols = Array.from(new Set(mapped.filter((s) => !validSet.has(s))));

//     const prices = [];

//     if (validSymbols.length) {
//       const groups = chunk(validSymbols, MAX_CHUNK);

//       for (const g of groups) {
//         try {
//           const params = { symbols: JSON.stringify(g) };
//           const resp = await fetchWithRetry(() =>
//             axios.get(`${BINANCE_API}/ticker/price`, { params, timeout: 10000 })
//           );

//           const data = resp.data;
//           if (Array.isArray(data)) {
//             for (const row of data) {
//               if (row?.symbol && row?.price != null) prices.push({ symbol: row.symbol, price: row.price });
//             }
//           } else if (data?.symbol && data?.price != null) {
//             prices.push({ symbol: data.symbol, price: data.price });
//           }
//         } catch (batchErr) {
//           for (const sym of g) {
//             try {
//               const r = await fetchWithRetry(() =>
//                 axios.get(`${BINANCE_API}/ticker/price`, { params: { symbol: sym }, timeout: 8000 })
//               );
//               if (r.data?.symbol && r.data?.price != null) {
//                 prices.push({ symbol: r.data.symbol, price: r.data.price });
//               }
//             } catch (oneErr) {
//               if (!invalidSymbols.includes(sym)) invalidSymbols.push(sym);
//             }
//           }
//         }
//       }
//     }

//     const result = { prices, invalidSymbols };
//     pricesCache = result;
//     pricesCacheAt = Date.now();

//     return res.json(result);
//   } catch (e) {
//     console.error("Market prices error:", e?.message);
//     return res.status(502).json({ error: "Failed to fetch prices" });
//   }
// });

// module.exports = router;















const express = require("express");
const axios = require("axios");
const router = express.Router();

const BINANCE_API = "https://api.binance.com/api/v3";

const MAX_CHUNK = 20;
const SYMBOL_LIMIT = 300;      // 🔥 Ek baar me max kitne symbols fetch honge. 1000 tak chahiye to yahan value badhao (e.g. 1000)
const CACHE_MS = 5_000;
const EXCHANGEINFO_CACHE_MS = 60_000;

let cachedSymbols = null;
let cachedAt = 0;
let pricesCache = null;
let pricesCacheAt = 0;

// 🔥 /symbols endpoint ka apna chhota cache (symbols list rarely changes)
let symbolsListCache = null;
let symbolsListCacheAt = 0;

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function normalizeList(comma) {
  return String(comma || "")
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);
}

async function getValidSymbols() {
  const now = Date.now();
  if (cachedSymbols && now - cachedAt < EXCHANGEINFO_CACHE_MS) return cachedSymbols;

  const { data } = await axios.get(`${BINANCE_API}/exchangeInfo`, { timeout: 10000 });
  const valid = new Set(
    (data.symbols || [])
      .filter((s) => s.status === "TRADING")
      .map((s) => s.symbol.toUpperCase())
  );

  cachedSymbols = valid;
  cachedAt = now;
  return valid;
}

async function fetchWithRetry(configFn, retries = 2, baseDelay = 400) {
  let attempt = 0;
  while (true) {
    try {
      return await configFn();
    } catch (err) {
      attempt++;
      const status = err?.response?.status;
      if (status && status >= 400 && status < 500) throw err;
      if (attempt > retries) throw err;
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

// 🔥 NEW: real, currently-trading USDT pairs ki poori list — koi hardcoding nahi, seedha Binance se validated
router.get("/symbols", async (req, res) => {
  try {
    const now = Date.now();
    if (symbolsListCache && now - symbolsListCacheAt < EXCHANGEINFO_CACHE_MS) {
      return res.json({ symbols: symbolsListCache });
    }

    const validSet = await getValidSymbols();

    let symbols = Array.from(validSet).filter((s) => s.endsWith("USDT"));

    // BTC/USDT hamesha sabse upar, phir ETH, phir baaki alphabetically
    const priority = { BTCUSDT: 0, ETHUSDT: 1 };
    symbols.sort((a, b) => {
      const pa = priority[a] ?? 999;
      const pb = priority[b] ?? 999;
      if (pa !== pb) return pa - pb;
      return a.localeCompare(b);
    });

    // SYMBOL_LIMIT tak cap karo taaki /prices call bhi isi list ke sath sync rahe
    symbols = symbols.slice(0, SYMBOL_LIMIT);

    symbolsListCache = symbols;
    symbolsListCacheAt = now;

    return res.json({ symbols });
  } catch (e) {
    console.error("Market symbols error:", e?.message);
    return res.status(502).json({ error: "Failed to fetch symbols" });
  }
});

router.get("/prices", async (req, res) => {
  try {
    const requested = normalizeList(req.query.symbols);
    if (!requested.length) return res.json({ prices: [], invalidSymbols: [] });

    if (requested.length > SYMBOL_LIMIT) {
      return res.status(400).json({ message: `Too many symbols (max ${SYMBOL_LIMIT})` });
    }

    const now = Date.now();
    if (pricesCache && now - pricesCacheAt < CACHE_MS) {
      return res.json(pricesCache);
    }

    const validSet = await getValidSymbols();

    const aliasMap = {
      SATSUSDT: "1000SATSUSDT",
    };

    const mapped = requested.map((s) => aliasMap[s] || s);
    const validSymbols = Array.from(new Set(mapped.filter((s) => validSet.has(s))));
    const invalidSymbols = Array.from(new Set(mapped.filter((s) => !validSet.has(s))));

    const prices = [];

    if (validSymbols.length) {
      const groups = chunk(validSymbols, MAX_CHUNK);

      for (const g of groups) {
        try {
          const params = { symbols: JSON.stringify(g) };
          const resp = await fetchWithRetry(() =>
            axios.get(`${BINANCE_API}/ticker/price`, { params, timeout: 10000 })
          );

          const data = resp.data;
          if (Array.isArray(data)) {
            for (const row of data) {
              if (row?.symbol && row?.price != null) prices.push({ symbol: row.symbol, price: row.price });
            }
          } else if (data?.symbol && data?.price != null) {
            prices.push({ symbol: data.symbol, price: data.price });
          }
        } catch (batchErr) {
          for (const sym of g) {
            try {
              const r = await fetchWithRetry(() =>
                axios.get(`${BINANCE_API}/ticker/price`, { params: { symbol: sym }, timeout: 8000 })
              );
              if (r.data?.symbol && r.data?.price != null) {
                prices.push({ symbol: r.data.symbol, price: r.data.price });
              }
            } catch (oneErr) {
              if (!invalidSymbols.includes(sym)) invalidSymbols.push(sym);
            }
          }
        }
      }
    }

    const result = { prices, invalidSymbols };
    pricesCache = result;
    pricesCacheAt = Date.now();

    return res.json(result);
  } catch (e) {
    console.error("Market prices error:", e?.message);
    return res.status(502).json({ error: "Failed to fetch prices" });
  }
});

module.exports = router;