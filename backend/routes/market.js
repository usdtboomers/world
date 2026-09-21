// // // const express = require("express");
// // // const axios = require("axios");
// // // const router = express.Router();

// // // const BINANCE_API = "https://api.binance.com/api/v3";

// // // const MAX_CHUNK = 20;          
// // // const SYMBOL_LIMIT = 300;     
// // // const CACHE_MS = 5_000;        
// // // const EXCHANGEINFO_CACHE_MS = 60_000; 

// // // let cachedSymbols = null;
// // // let cachedAt = 0;
// // // let pricesCache = null;
// // // let pricesCacheAt = 0;

// // // function chunk(arr, size) {
// // //   const out = [];
// // //   for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
// // //   return out;
// // // }

// // // function normalizeList(comma) {
// // //   return String(comma || "")
// // //     .split(",")
// // //     .map((s) => s.trim().toUpperCase())
// // //     .filter(Boolean);
// // // }

// // // async function getValidSymbols() {
// // //   const now = Date.now();
// // //   if (cachedSymbols && now - cachedAt < EXCHANGEINFO_CACHE_MS) return cachedSymbols;

// // //   const { data } = await axios.get(`${BINANCE_API}/exchangeInfo`, { timeout: 10000 });
// // //   const valid = new Set(
// // //     (data.symbols || [])
// // //       .filter((s) => s.status === "TRADING")
// // //       .map((s) => s.symbol.toUpperCase())
// // //   );

// // //   cachedSymbols = valid;
// // //   cachedAt = now;
// // //   return valid;
// // // }

// // // async function fetchWithRetry(configFn, retries = 2, baseDelay = 400) {
// // //   let attempt = 0;
// // //   while (true) {
// // //     try {
// // //       return await configFn();
// // //     } catch (err) {
// // //       attempt++;
// // //       const status = err?.response?.status;
// // //       if (status && status >= 400 && status < 500) throw err;
// // //       if (attempt > retries) throw err;
// // //       const delay = baseDelay * Math.pow(2, attempt - 1);
// // //       await new Promise((r) => setTimeout(r, delay));
// // //     }
// // //   }
// // // }

// // // router.get("/prices", async (req, res) => {
// // //   try {
// // //     const requested = normalizeList(req.query.symbols);
// // //     if (!requested.length) return res.json({ prices: [], invalidSymbols: [] });

// // //     if (requested.length > SYMBOL_LIMIT) {
// // //       return res.status(400).json({ message: `Too many symbols (max ${SYMBOL_LIMIT})` });
// // //     }

// // //     const now = Date.now();
// // //     if (pricesCache && now - pricesCacheAt < CACHE_MS) {
// // //       return res.json(pricesCache);
// // //     }

// // //     const validSet = await getValidSymbols();

// // //     const aliasMap = {
// // //       SATSUSDT: "1000SATSUSDT",
// // //     };

// // //     const mapped = requested.map((s) => aliasMap[s] || s);
// // //     const validSymbols = Array.from(new Set(mapped.filter((s) => validSet.has(s))));
// // //     const invalidSymbols = Array.from(new Set(mapped.filter((s) => !validSet.has(s))));

// // //     const prices = [];

// // //     if (validSymbols.length) {
// // //       const groups = chunk(validSymbols, MAX_CHUNK);

// // //       for (const g of groups) {
// // //         try {
// // //           const params = { symbols: JSON.stringify(g) };
// // //           const resp = await fetchWithRetry(() =>
// // //             axios.get(`${BINANCE_API}/ticker/price`, { params, timeout: 10000 })
// // //           );

// // //           const data = resp.data;
// // //           if (Array.isArray(data)) {
// // //             for (const row of data) {
// // //               if (row?.symbol && row?.price != null) prices.push({ symbol: row.symbol, price: row.price });
// // //             }
// // //           } else if (data?.symbol && data?.price != null) {
// // //             prices.push({ symbol: data.symbol, price: data.price });
// // //           }
// // //         } catch (batchErr) {
// // //           for (const sym of g) {
// // //             try {
// // //               const r = await fetchWithRetry(() =>
// // //                 axios.get(`${BINANCE_API}/ticker/price`, { params: { symbol: sym }, timeout: 8000 })
// // //               );
// // //               if (r.data?.symbol && r.data?.price != null) {
// // //                 prices.push({ symbol: r.data.symbol, price: r.data.price });
// // //               }
// // //             } catch (oneErr) {
// // //               if (!invalidSymbols.includes(sym)) invalidSymbols.push(sym);
// // //             }
// // //           }
// // //         }
// // //       }
// // //     }

// // //     const result = { prices, invalidSymbols };
// // //     pricesCache = result;
// // //     pricesCacheAt = Date.now();

// // //     return res.json(result);
// // //   } catch (e) {
// // //     console.error("Market prices error:", e?.message);
// // //     return res.status(502).json({ error: "Failed to fetch prices" });
// // //   }
// // // });

// // // module.exports = router;















// // // const express = require("express");
// // // const axios = require("axios");
// // // const router = express.Router();

// // // const BINANCE_API = "https://api.binance.com/api/v3";

// // // const MAX_CHUNK = 20;
// // // const SYMBOL_LIMIT = 300;      // 🔥 Ek baar me max kitne symbols fetch honge. 1000 tak chahiye to yahan value badhao (e.g. 1000)
// // // const CACHE_MS = 5_000;
// // // const EXCHANGEINFO_CACHE_MS = 60_000;

// // // let cachedSymbols = null;
// // // let cachedAt = 0;
// // // let pricesCache = null;
// // // let pricesCacheAt = 0;

// // // // 🔥 /symbols endpoint ka apna chhota cache (symbols list rarely changes)
// // // let symbolsListCache = null;
// // // let symbolsListCacheAt = 0;

// // // function chunk(arr, size) {
// // //   const out = [];
// // //   for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
// // //   return out;
// // // }

// // // function normalizeList(comma) {
// // //   return String(comma || "")
// // //     .split(",")
// // //     .map((s) => s.trim().toUpperCase())
// // //     .filter(Boolean);
// // // }

// // // async function getValidSymbols() {
// // //   const now = Date.now();
// // //   if (cachedSymbols && now - cachedAt < EXCHANGEINFO_CACHE_MS) return cachedSymbols;

// // //   const { data } = await axios.get(`${BINANCE_API}/exchangeInfo`, { timeout: 10000 });
// // //   const valid = new Set(
// // //     (data.symbols || [])
// // //       .filter((s) => s.status === "TRADING")
// // //       .map((s) => s.symbol.toUpperCase())
// // //   );

// // //   cachedSymbols = valid;
// // //   cachedAt = now;
// // //   return valid;
// // // }

// // // async function fetchWithRetry(configFn, retries = 2, baseDelay = 400) {
// // //   let attempt = 0;
// // //   while (true) {
// // //     try {
// // //       return await configFn();
// // //     } catch (err) {
// // //       attempt++;
// // //       const status = err?.response?.status;
// // //       if (status && status >= 400 && status < 500) throw err;
// // //       if (attempt > retries) throw err;
// // //       const delay = baseDelay * Math.pow(2, attempt - 1);
// // //       await new Promise((r) => setTimeout(r, delay));
// // //     }
// // //   }
// // // }

// // // // 🔥 NEW: real, currently-trading USDT pairs ki poori list — koi hardcoding nahi, seedha Binance se validated
// // // router.get("/symbols", async (req, res) => {
// // //   try {
// // //     const now = Date.now();
// // //     if (symbolsListCache && now - symbolsListCacheAt < EXCHANGEINFO_CACHE_MS) {
// // //       return res.json({ symbols: symbolsListCache });
// // //     }

// // //     const validSet = await getValidSymbols();

// // //     let symbols = Array.from(validSet).filter((s) => s.endsWith("USDT"));

// // //     // BTC/USDT hamesha sabse upar, phir ETH, phir baaki alphabetically
// // //     const priority = { BTCUSDT: 0, ETHUSDT: 1 };
// // //     symbols.sort((a, b) => {
// // //       const pa = priority[a] ?? 999;
// // //       const pb = priority[b] ?? 999;
// // //       if (pa !== pb) return pa - pb;
// // //       return a.localeCompare(b);
// // //     });

// // //     // SYMBOL_LIMIT tak cap karo taaki /prices call bhi isi list ke sath sync rahe
// // //     symbols = symbols.slice(0, SYMBOL_LIMIT);

// // //     symbolsListCache = symbols;
// // //     symbolsListCacheAt = now;

// // //     return res.json({ symbols });
// // //   } catch (e) {
// // //     console.error("Market symbols error:", e?.message);
// // //     return res.status(502).json({ error: "Failed to fetch symbols" });
// // //   }
// // // });

// // // router.get("/prices", async (req, res) => {
// // //   try {
// // //     const requested = normalizeList(req.query.symbols);
// // //     if (!requested.length) return res.json({ prices: [], invalidSymbols: [] });

// // //     if (requested.length > SYMBOL_LIMIT) {
// // //       return res.status(400).json({ message: `Too many symbols (max ${SYMBOL_LIMIT})` });
// // //     }

// // //     const now = Date.now();
// // //     if (pricesCache && now - pricesCacheAt < CACHE_MS) {
// // //       return res.json(pricesCache);
// // //     }

// // //     const validSet = await getValidSymbols();

// // //     const aliasMap = {
// // //       SATSUSDT: "1000SATSUSDT",
// // //     };

// // //     const mapped = requested.map((s) => aliasMap[s] || s);
// // //     const validSymbols = Array.from(new Set(mapped.filter((s) => validSet.has(s))));
// // //     const invalidSymbols = Array.from(new Set(mapped.filter((s) => !validSet.has(s))));

// // //     const prices = [];

// // //     if (validSymbols.length) {
// // //       const groups = chunk(validSymbols, MAX_CHUNK);

// // //       for (const g of groups) {
// // //         try {
// // //           const params = { symbols: JSON.stringify(g) };
// // //           const resp = await fetchWithRetry(() =>
// // //             axios.get(`${BINANCE_API}/ticker/price`, { params, timeout: 10000 })
// // //           );

// // //           const data = resp.data;
// // //           if (Array.isArray(data)) {
// // //             for (const row of data) {
// // //               if (row?.symbol && row?.price != null) prices.push({ symbol: row.symbol, price: row.price });
// // //             }
// // //           } else if (data?.symbol && data?.price != null) {
// // //             prices.push({ symbol: data.symbol, price: data.price });
// // //           }
// // //         } catch (batchErr) {
// // //           for (const sym of g) {
// // //             try {
// // //               const r = await fetchWithRetry(() =>
// // //                 axios.get(`${BINANCE_API}/ticker/price`, { params: { symbol: sym }, timeout: 8000 })
// // //               );
// // //               if (r.data?.symbol && r.data?.price != null) {
// // //                 prices.push({ symbol: r.data.symbol, price: r.data.price });
// // //               }
// // //             } catch (oneErr) {
// // //               if (!invalidSymbols.includes(sym)) invalidSymbols.push(sym);
// // //             }
// // //           }
// // //         }
// // //       }
// // //     }

// // //     const result = { prices, invalidSymbols };
// // //     pricesCache = result;
// // //     pricesCacheAt = Date.now();

// // //     return res.json(result);
// // //   } catch (e) {
// // //     console.error("Market prices error:", e?.message);
// // //     return res.status(502).json({ error: "Failed to fetch prices" });
// // //   }
// // // });

// // // module.exports = router;

// // //  const express = require("express");
// // // const axios = require("axios");
// // // const router = express.Router();

// // // const BINANCE_API = "https://api.binance.com/api/v3";

// // // const MAX_CHUNK = 20;
// // // const SYMBOL_LIMIT = 300;      // 🔥 Ek baar me max kitne symbols fetch honge. 1000 tak chahiye to yahan value badhao (e.g. 1000)
// // // const CACHE_MS = 5_000;
// // // const EXCHANGEINFO_CACHE_MS = 60_000;

// // // let cachedSymbols = null;
// // // let cachedAt = 0;
// // // let pricesCache = null;
// // // let pricesCacheAt = 0;

// // // // 🔥 /symbols endpoint ka apna chhota cache (symbols list rarely changes)
// // // let symbolsListCache = null;
// // // let symbolsListCacheAt = 0;

// // // // ==========================================
// // // // 🔥 CUSTOM TOKEN LOGIC (ONLY DATE BASED - 1 JULY 2026)
// // // // ==========================================
// // // const CUSTOM_TOKEN_SYMBOL = "CUSTOMUSDT"; 
// // // // Anchor date is exactly 1 July 2026 (Midnight UTC)
// // // const ANCHOR_DATE = new Date("2026-07-01T00:00:00Z").getTime(); 

// // // function getCustomTokenPrice() {
// // //   const now = Date.now();
// // //   let timeElapsedMs = now - ANCHOR_DATE;
  
// // //   if (timeElapsedMs < 0) timeElapsedMs = 0; 

// // //   const intervals = Math.floor(timeElapsedMs / 120000);
  
// // //   // Sirf time ke hisaab se price calculate hogi, koi extra base price nahi
// // //   let simulatedPrice = (intervals * 0.00025);
  
// // //   const fluctuation = Math.sin(now / 300000) * 0.002; 
// // //   simulatedPrice += fluctuation;

// // //   if (simulatedPrice < 0) simulatedPrice = 0; 

// // //   return parseFloat(simulatedPrice.toFixed(4));
// // // }
// // // // ==========================================

// // // function chunk(arr, size) {
// // //   const out = [];
// // //   for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
// // //   return out;
// // // }

// // // function normalizeList(comma) {
// // //   return String(comma || "")
// // //     .split(",")
// // //     .map((s) => s.trim().toUpperCase())
// // //     .filter(Boolean);
// // // }

// // // async function getValidSymbols() {
// // //   const now = Date.now();
// // //   if (cachedSymbols && now - cachedAt < EXCHANGEINFO_CACHE_MS) return cachedSymbols;

// // //   const { data } = await axios.get(`${BINANCE_API}/exchangeInfo`, { timeout: 10000 });
// // //   const valid = new Set(
// // //     (data.symbols || [])
// // //       .filter((s) => s.status === "TRADING")
// // //       .map((s) => s.symbol.toUpperCase())
// // //   );

// // //   cachedSymbols = valid;
// // //   cachedAt = now;
// // //   return valid;
// // // }

// // // async function fetchWithRetry(configFn, retries = 2, baseDelay = 400) {
// // //   let attempt = 0;
// // //   while (true) {
// // //     try {
// // //       return await configFn();
// // //     } catch (err) {
// // //       attempt++;
// // //       const status = err?.response?.status;
// // //       if (status && status >= 400 && status < 500) throw err;
// // //       if (attempt > retries) throw err;
// // //       const delay = baseDelay * Math.pow(2, attempt - 1);
// // //       await new Promise((r) => setTimeout(r, delay));
// // //     }
// // //   }
// // // }

// // // // 🔥 NEW: real, currently-trading USDT pairs ki poori list — koi hardcoding nahi, seedha Binance se validated
// // // router.get("/symbols", async (req, res) => {
// // //   try {
// // //     const now = Date.now();
// // //     if (symbolsListCache && now - symbolsListCacheAt < EXCHANGEINFO_CACHE_MS) {
// // //       return res.json({ symbols: symbolsListCache });
// // //     }

// // //     const validSet = await getValidSymbols();

// // //     let symbols = Array.from(validSet).filter((s) => s.endsWith("USDT"));

// // //     // BTC/USDT hamesha sabse upar, phir ETH, phir baaki alphabetically
// // //     const priority = { BTCUSDT: 0, ETHUSDT: 1 };
// // //     symbols.sort((a, b) => {
// // //       const pa = priority[a] ?? 999;
// // //       const pb = priority[b] ?? 999;
// // //       if (pa !== pb) return pa - pb;
// // //       return a.localeCompare(b);
// // //     });

// // //     // SYMBOL_LIMIT tak cap karo taaki /prices call bhi isi list ke sath sync rahe
// // //     symbols = symbols.slice(0, SYMBOL_LIMIT);

// // //     // 🔥 CUSTOM TOKEN KO SABSE UPAR ADD KARNA
// // //     if (!symbols.includes(CUSTOM_TOKEN_SYMBOL)) {
// // //       symbols.unshift(CUSTOM_TOKEN_SYMBOL);
// // //     }

// // //     symbolsListCache = symbols;
// // //     symbolsListCacheAt = now;

// // //     return res.json({ symbols });
// // //   } catch (e) {
// // //     console.error("Market symbols error:", e?.message);
// // //     return res.status(502).json({ error: "Failed to fetch symbols" });
// // //   }
// // // });

// // // router.get("/prices", async (req, res) => {
// // //   try {
// // //     const requested = normalizeList(req.query.symbols);
// // //     if (!requested.length) return res.json({ prices: [], invalidSymbols: [] });

// // //     if (requested.length > SYMBOL_LIMIT) {
// // //       return res.status(400).json({ message: `Too many symbols (max ${SYMBOL_LIMIT})` });
// // //     }

// // //     const now = Date.now();
// // //     if (pricesCache && now - pricesCacheAt < CACHE_MS) {
// // //       return res.json(pricesCache);
// // //     }

// // //     const validSet = await getValidSymbols();

// // //     const aliasMap = {
// // //       SATSUSDT: "1000SATSUSDT",
// // //     };

// // //     const prices = [];
// // //     let binanceRequested = [];

// // //     // 🔥 CUSTOM TOKEN KO BINANCE SE ALAG KARNA
// // //     for (let sym of requested) {
// // //       let mappedSym = aliasMap[sym] || sym;
// // //       if (mappedSym === CUSTOM_TOKEN_SYMBOL) {
// // //         prices.push({ symbol: CUSTOM_TOKEN_SYMBOL, price: getCustomTokenPrice() });
// // //       } else {
// // //         binanceRequested.push(mappedSym);
// // //       }
// // //     }

// // //     const validSymbols = Array.from(new Set(binanceRequested.filter((s) => validSet.has(s))));
// // //     const invalidSymbols = Array.from(new Set(binanceRequested.filter((s) => !validSet.has(s))));

// // //     if (validSymbols.length) {
// // //       const groups = chunk(validSymbols, MAX_CHUNK);

// // //       for (const g of groups) {
// // //         try {
// // //           const params = { symbols: JSON.stringify(g) };
// // //           const resp = await fetchWithRetry(() =>
// // //             axios.get(`${BINANCE_API}/ticker/price`, { params, timeout: 10000 })
// // //           );

// // //           const data = resp.data;
// // //           if (Array.isArray(data)) {
// // //             for (const row of data) {
// // //               if (row?.symbol && row?.price != null) prices.push({ symbol: row.symbol, price: row.price });
// // //             }
// // //           } else if (data?.symbol && data?.price != null) {
// // //             prices.push({ symbol: data.symbol, price: data.price });
// // //           }
// // //         } catch (batchErr) {
// // //           for (const sym of g) {
// // //             try {
// // //               const r = await fetchWithRetry(() =>
// // //                 axios.get(`${BINANCE_API}/ticker/price`, { params: { symbol: sym }, timeout: 8000 })
// // //               );
// // //               if (r.data?.symbol && r.data?.price != null) {
// // //                 prices.push({ symbol: r.data.symbol, price: r.data.price });
// // //               }
// // //             } catch (oneErr) {
// // //               if (!invalidSymbols.includes(sym)) invalidSymbols.push(sym);
// // //             }
// // //           }
// // //         }
// // //       }
// // //     }

// // //     const result = { prices, invalidSymbols };
// // //     pricesCache = result;
// // //     pricesCacheAt = Date.now();

// // //     return res.json(result);
// // //   } catch (e) {
// // //     console.error("Market prices error:", e?.message);
// // //     return res.status(502).json({ error: "Failed to fetch prices" });
// // //   }
// // // });

// // // module.exports = router;



// // const express = require("express");
// // const axios = require("axios");
// // const router = express.Router();

// // const BINANCE_API = "https://api.binance.com/api/v3";

// // const MAX_CHUNK = 50;          // 🔥 Fast loading ke liye chunk size 50 kar diya hai
// // const SYMBOL_LIMIT = 500;      // 🔥 Aur zyada coins dikhane ke liye limit 500 kar di hai
// // const CACHE_MS = 5_000;
// // const EXCHANGEINFO_CACHE_MS = 60_000;

// // let cachedSymbols = null;
// // let cachedAt = 0;
// // let pricesCache = null;
// // let pricesCacheAt = 0;

// // let symbolsListCache = null;
// // let symbolsListCacheAt = 0;

// // // ==========================================
// // // 🔥 CUSTOM TOKEN LOGIC (ONLY DATE BASED - 1 JULY 2026)
// // // ==========================================
// // const CUSTOM_TOKEN_SYMBOL = "DODGEUSDT"; 
// // // Anchor date is exactly 1 July 2026 (Midnight UTC)
// // const ANCHOR_DATE = new Date("2026-07-01T00:00:00Z").getTime(); 

// // function getCustomTokenPrice() {
// //   const now = Date.now();
// //   let timeElapsedMs = now - ANCHOR_DATE;
  
// //   if (timeElapsedMs < 0) timeElapsedMs = 0; 

// //   const intervals = Math.floor(timeElapsedMs / 120000);
  
// //   let simulatedPrice = (intervals * 0.00025);
// //   const fluctuation = Math.sin(now / 300000) * 0.002; 
// //   simulatedPrice += fluctuation;

// //   if (simulatedPrice < 0) simulatedPrice = 0; 

// //   return parseFloat(simulatedPrice.toFixed(4));
// // }
// // // ==========================================

// // function chunk(arr, size) {
// //   const out = [];
// //   for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
// //   return out;
// // }

// // function normalizeList(comma) {
// //   return String(comma || "")
// //     .split(",")
// //     .map((s) => s.trim().toUpperCase())
// //     .filter(Boolean);
// // }

// // async function getValidSymbols() {
// //   const now = Date.now();
// //   if (cachedSymbols && now - cachedAt < EXCHANGEINFO_CACHE_MS) return cachedSymbols;

// //   const { data } = await axios.get(`${BINANCE_API}/exchangeInfo`, { timeout: 10000 });
// //   const valid = new Set(
// //     (data.symbols || [])
// //       .filter((s) => s.status === "TRADING")
// //       .map((s) => s.symbol.toUpperCase())
// //   );

// //   cachedSymbols = valid;
// //   cachedAt = now;
// //   return valid;
// // }

// // async function fetchWithRetry(configFn, retries = 2, baseDelay = 400) {
// //   let attempt = 0;
// //   while (true) {
// //     try {
// //       return await configFn();
// //     } catch (err) {
// //       attempt++;
// //       const status = err?.response?.status;
// //       if (status && status >= 400 && status < 500) throw err;
// //       if (attempt > retries) throw err;
// //       const delay = baseDelay * Math.pow(2, attempt - 1);
// //       await new Promise((r) => setTimeout(r, delay));
// //     }
// //   }
// // }

// // // 🔥 UPGRADED: $0.50 ke upar wale coins aur random shuffing!
// // router.get("/symbols", async (req, res) => {
// //   try {
// //     const now = Date.now();
// //     if (symbolsListCache && now - symbolsListCacheAt < EXCHANGEINFO_CACHE_MS) {
// //       return res.json({ symbols: symbolsListCache });
// //     }

// //     const validSet = await getValidSymbols();

// //     // 1. Binance se ek saath saare prices utha lo taaki price filter lagaya ja sake
// //     const allPricesResp = await fetchWithRetry(() => 
// //       axios.get(`${BINANCE_API}/ticker/price`, { timeout: 10000 })
// //     );
    
// //     let tickerPrices = allPricesResp.data;

// //     // 2. Sirf USDT pairs jo TRADING me hain, aur jinki price $0.50 se UP hai wahi filter karo
// //     let symbols = tickerPrices
// //       .filter((p) => p.symbol.endsWith("USDT") && validSet.has(p.symbol) && parseFloat(p.price) >= 0.50)
// //       .map((p) => p.symbol);

// //     // 3. BTC aur ETH ko alag nikal lo, kyunki inhe hamesha top par rakhna hai
// //     const topCoins = ["BTCUSDT", "ETHUSDT"];
// //     symbols = symbols.filter((s) => !topCoins.includes(s));

// //     // 4. Baaki sab coins ko random mix (shuffle) kar do taaki 'A' se shuru hone wale coins bar-bar na dikhein
// //     symbols = symbols.sort(() => 0.5 - Math.random());

// //     // 5. BTC aur ETH ko wapas sabse upar laga do
// //     symbols = [...topCoins.filter(c => validSet.has(c)), ...symbols];

// //     // 6. Ab 500 ki limit laga do 
// //     symbols = symbols.slice(0, SYMBOL_LIMIT);

// //     // 🔥 7. CUSTOM TOKEN KO SABSE UPAR ADD KARNA (Position #1)
// //     if (!symbols.includes(CUSTOM_TOKEN_SYMBOL)) {
// //       symbols.unshift(CUSTOM_TOKEN_SYMBOL);
// //     }

// //     symbolsListCache = symbols;
// //     symbolsListCacheAt = now;

// //     return res.json({ symbols });
// //   } catch (e) {
// //     console.error("Market symbols error:", e?.message);
// //     return res.status(502).json({ error: "Failed to fetch symbols" });
// //   }
// // });

// // router.get("/prices", async (req, res) => {
// //   try {
// //     const requested = normalizeList(req.query.symbols);
// //     if (!requested.length) return res.json({ prices: [], invalidSymbols: [] });

// //     if (requested.length > (SYMBOL_LIMIT + 50)) {
// //       return res.status(400).json({ message: `Too many symbols requested` });
// //     }

// //     const now = Date.now();
// //     if (pricesCache && now - pricesCacheAt < CACHE_MS) {
// //       return res.json(pricesCache);
// //     }

// //     const validSet = await getValidSymbols();

// //     const aliasMap = {
// //       SATSUSDT: "1000SATSUSDT",
// //     };

// //     const prices = [];
// //     let binanceRequested = [];

// //     for (let sym of requested) {
// //       let mappedSym = aliasMap[sym] || sym;
// //       if (mappedSym === CUSTOM_TOKEN_SYMBOL) {
// //         prices.push({ symbol: CUSTOM_TOKEN_SYMBOL, price: getCustomTokenPrice() });
// //       } else {
// //         binanceRequested.push(mappedSym);
// //       }
// //     }

// //     const validSymbols = Array.from(new Set(binanceRequested.filter((s) => validSet.has(s))));
// //     const invalidSymbols = Array.from(new Set(binanceRequested.filter((s) => !validSet.has(s))));

// //     if (validSymbols.length) {
// //       const groups = chunk(validSymbols, MAX_CHUNK);

// //       for (const g of groups) {
// //         try {
// //           const params = { symbols: JSON.stringify(g) };
// //           const resp = await fetchWithRetry(() =>
// //             axios.get(`${BINANCE_API}/ticker/price`, { params, timeout: 10000 })
// //           );

// //           const data = resp.data;
// //           if (Array.isArray(data)) {
// //             for (const row of data) {
// //               if (row?.symbol && row?.price != null) prices.push({ symbol: row.symbol, price: row.price });
// //             }
// //           } else if (data?.symbol && data?.price != null) {
// //             prices.push({ symbol: data.symbol, price: data.price });
// //           }
// //         } catch (batchErr) {
// //           for (const sym of g) {
// //             try {
// //               const r = await fetchWithRetry(() =>
// //                 axios.get(`${BINANCE_API}/ticker/price`, { params: { symbol: sym }, timeout: 8000 })
// //               );
// //               if (r.data?.symbol && r.data?.price != null) {
// //                 prices.push({ symbol: r.data.symbol, price: r.data.price });
// //               }
// //             } catch (oneErr) {
// //               if (!invalidSymbols.includes(sym)) invalidSymbols.push(sym);
// //             }
// //           }
// //         }
// //       }
// //     }

// //     const result = { prices, invalidSymbols };
// //     pricesCache = result;
// //     pricesCacheAt = Date.now();

// //     return res.json(result);
// //   } catch (e) {
// //     console.error("Market prices error:", e?.message);
// //     return res.status(502).json({ error: "Failed to fetch prices" });
// //   }
// // });

// // module.exports = router;


// const express = require("express");
// const axios = require("axios");
// const router = express.Router();

// // 🔥 AI Trade Model Import (Naya add kiya)
// const AiTrade = require("../models/AiTrade");

// const BINANCE_API = "https://api.binance.com/api/v3";

// const MAX_CHUNK = 50;          // 🔥 Fast loading ke liye chunk size 50 kar diya hai
// const SYMBOL_LIMIT = 500;      // 🔥 Aur zyada coins dikhane ke liye limit 500 kar di hai
// const CACHE_MS = 5_000;
// const EXCHANGEINFO_CACHE_MS = 60_000;

// let cachedSymbols = null;
// let cachedAt = 0;
// let pricesCache = null;
// let pricesCacheAt = 0;

// let symbolsListCache = null;
// let symbolsListCacheAt = 0;

// // ==========================================
// // 🔥 CUSTOM TOKEN LOGIC (ONLY DATE BASED - 1 JULY 2026)
// // ==========================================
// const CUSTOM_TOKEN_SYMBOL = "DODGEUSDT"; 
// // Anchor date is exactly 1 July 2026 (Midnight UTC)
// const ANCHOR_DATE = new Date("2026-07-01T00:00:00Z").getTime(); 

// function getCustomTokenPrice() {
//   const now = Date.now();
//   let timeElapsedMs = now - ANCHOR_DATE;
  
//   if (timeElapsedMs < 0) timeElapsedMs = 0; 

//   const intervals = Math.floor(timeElapsedMs / 120000);
  
//   let simulatedPrice = (intervals * 0.00025);
//   const fluctuation = Math.sin(now / 300000) * 0.002; 
//   simulatedPrice += fluctuation;

//   if (simulatedPrice < 0) simulatedPrice = 0; 

//   return parseFloat(simulatedPrice.toFixed(4));
// }
// // ==========================================

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

// // 🔥 UPGRADED: $0.50 ke upar wale coins aur random shuffing!
// router.get("/symbols", async (req, res) => {
//   try {
//     const now = Date.now();
//     if (symbolsListCache && now - symbolsListCacheAt < EXCHANGEINFO_CACHE_MS) {
//       return res.json({ symbols: symbolsListCache });
//     }

//     const validSet = await getValidSymbols();

//     // 1. Binance se ek saath saare prices utha lo taaki price filter lagaya ja sake
//     const allPricesResp = await fetchWithRetry(() => 
//       axios.get(`${BINANCE_API}/ticker/price`, { timeout: 10000 })
//     );
    
//     let tickerPrices = allPricesResp.data;

//     // 2. Sirf USDT pairs jo TRADING me hain, aur jinki price $0.50 se UP hai wahi filter karo
//     let symbols = tickerPrices
//       .filter((p) => p.symbol.endsWith("USDT") && validSet.has(p.symbol) && parseFloat(p.price) >= 0.50)
//       .map((p) => p.symbol);

//     // 3. BTC aur ETH ko alag nikal lo, kyunki inhe hamesha top par rakhna hai
// // Top coins ki list jo hamesha fix rahengi (Shuffle nahi hongi)
// const topCoins = [
//   "BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT", "ADAUSDT", 
//   "DOGEUSDT", "TRXUSDT", "LINKUSDT", "DOTUSDT", "MATICUSDT", "LTCUSDT", 
//   "SHIBUSDT", "AVAXUSDT", "UNIUSDT", "ATOMUSDT", "XMRUSDT", "NEARUSDT", 
//   "FILUSDT", "VETUSDT", "ICPUSDT", "GRTUSDT", "APEUSDT", "ALGOUSDT", 
//   "SANDUSDT", "MANAUSDT", "THETAUSDT", "AXSUSDT", "XTZUSDT", "EOSUSDT", 
//   "AAVEUSDT", "EGLDUSDT", "FLOWUSDT", "QNTUSDT", "CHZUSDT", "GALAUSDT", 
//   "NEOUSDT", "CRVUSDT", "ENJUSDT", "DASHUSDT", "ZECUSDT", "MKRUSDT", 
//   "BATUSDT", "ZILUSDT", "RUNEUSDT", "KSMUSDT", "CAKEUSDT", "FTMUSDT", 
//   "ARUSDT", "COMPUSDT", "LRCUSDT", "YFIUSDT", "1INCHUSDT", "SNXUSDT", 
//   "HOTUSDT", "IOTXUSDT", "RVNUSDT", "AUDIOUSDT", "KAVAUSDT", "SUSHIUSDT", 
//   "ANKRUSDT", "ROSEUSDT", "CELOUSDT", "OCEANUSDT", "LPTUSDT", "GTCUSDT", 
//   "DYDXUSDT", "ENSUSDT", "LDOUSDT", "OPUSDT", "APTUSDT", "ARBUSDT", 
//   "INJUSDT", "FETUSDT", "RNDRUSDT", "STXUSDT", "AGIXUSDT", "PEPEUSDT", 
//   "SUIUSDT", "SEIUSDT", "TIAUSDT", "ORDIUSDT", "WLDUSDT", "PYTHUSDT", 
//   "JUPUSDT", "BONKUSDT", "FLOKIUSDT", "BOMEUSDT", "WIFUSDT", "STRKUSDT"
// ];
//     symbols = symbols.filter((s) => !topCoins.includes(s));

//     // 4. Baaki sab coins ko random mix (shuffle) kar do taaki 'A' se shuru hone wale coins bar-bar na dikhein
//     symbols = symbols.sort(() => 0.5 - Math.random());

//     // 5. BTC aur ETH ko wapas sabse upar laga do
//     symbols = [...topCoins.filter(c => validSet.has(c)), ...symbols];

//     // 6. Ab 500 ki limit laga do 
//     symbols = symbols.slice(0, SYMBOL_LIMIT);

//     // 🔥 7. CUSTOM TOKEN KO SABSE UPAR ADD KARNA (Position #1)
//     if (!symbols.includes(CUSTOM_TOKEN_SYMBOL)) {
//       symbols.unshift(CUSTOM_TOKEN_SYMBOL);
//     }

//     symbolsListCache = symbols;
//     symbolsListCacheAt = now;

//     return res.json({ symbols });
//   } catch (e) {
//     console.error("Market symbols error:", e?.message);
//     return res.status(502).json({ error: "Failed to fetch symbols" });
//   }
// });

// router.get("/prices", async (req, res) => {
//   try {
//     const requested = normalizeList(req.query.symbols);
//     if (!requested.length) return res.json({ prices: [], invalidSymbols: [] });

//     if (requested.length > (SYMBOL_LIMIT + 50)) {
//       return res.status(400).json({ message: `Too many symbols requested` });
//     }

//     const now = Date.now();
//     if (pricesCache && now - pricesCacheAt < CACHE_MS) {
//       return res.json(pricesCache);
//     }

//     const validSet = await getValidSymbols();

//     const aliasMap = {
//       SATSUSDT: "1000SATSUSDT",
//     };

//     const prices = [];
//     let binanceRequested = [];

//     for (let sym of requested) {
//       let mappedSym = aliasMap[sym] || sym;
//       if (mappedSym === CUSTOM_TOKEN_SYMBOL) {
//         prices.push({ symbol: CUSTOM_TOKEN_SYMBOL, price: getCustomTokenPrice() });
//       } else {
//         binanceRequested.push(mappedSym);
//       }
//     }

//     const validSymbols = Array.from(new Set(binanceRequested.filter((s) => validSet.has(s))));
//     const invalidSymbols = Array.from(new Set(binanceRequested.filter((s) => !validSet.has(s))));

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

// // ==========================================
// // 🔥 NAYA API: Frontend ko fixed entry prices dene ke liye
// // ==========================================
// router.post("/ai-trades", async (req, res) => {
//   try {
//     const { prices } = req.body; // Frontend se aayi current live prices ki list
    
//     let savedTrades = [];
    
//     for (let item of prices) {
//       // Check karo ki yeh coin pehle se DB me hai ya nahi
//       let trade = await AiTrade.findOne({ symbol: item.symbol });
      
//       if (!trade) {
//         // Agar nahi hai, toh pehli baar save kar lo (Yeh fix ho jayega)
//         const h = item.symbol.length + Math.floor(Math.random() * 10);
//         const side = h % 2 === 0 ? "Long" : "Short";
//         const leverages = [5, 10, 15, 20];
//         const lev = leverages[h % leverages.length];
        
//         trade = await AiTrade.create({
//           symbol: item.symbol,
//           pair: item.symbol.replace("USDT", "") + "/USDT",
//           side: side,
//           leverage: lev,
//           entryPrice: item.price // PEHLI BAAR WALI PRICE SAVE HO GAYI
//         });
//       }
//       savedTrades.push(trade);
//     }
    
//     res.json({ success: true, trades: savedTrades });
//   } catch (error) {
//     console.error("AI Trade DB Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// module.exports = router;


const express = require("express");
const axios = require("axios");
const router = express.Router();

// 🔥 AI Trade Model Import
const AiTrade = require("../models/AiTrade");

const BINANCE_API = "https://api.binance.com/api/v3";

const MAX_CHUNK = 50;          
const SYMBOL_LIMIT = 500;      
const CACHE_MS = 10_000;       // 🔥 Thoda bada diya taaki baar baar hit na ho (10 sec)
const EXCHANGEINFO_CACHE_MS = 300_000; // 🔥 5 minutes kar diya for exchange info

let cachedSymbols = null;
let cachedAt = 0;
let pricesCache = null;
let pricesCacheAt = 0;

let symbolsListCache = null;
let symbolsListCacheAt = 0;

// ==========================================
// 🔥 CUSTOM TOKEN LOGIC (ONLY DATE BASED - 1 JULY 2026)
// ==========================================
const CUSTOM_TOKEN_SYMBOL = "DODGEUSDT"; 
const ANCHOR_DATE = new Date("2026-07-01T00:00:00Z").getTime(); 

function getCustomTokenPrice() {
  const now = Date.now();
  let timeElapsedMs = now - ANCHOR_DATE;
  if (timeElapsedMs < 0) timeElapsedMs = 0; 
  const intervals = Math.floor(timeElapsedMs / 120000);
  let simulatedPrice = (intervals * 0.00025);
  const fluctuation = Math.sin(now / 300000) * 0.002; 
  simulatedPrice += fluctuation;
  if (simulatedPrice < 0) simulatedPrice = 0; 
  return parseFloat(simulatedPrice.toFixed(4));
}
// ==========================================

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function normalizeList(comma) {
  return String(comma || "").split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
}

async function getValidSymbols() {
  const now = Date.now();
  if (cachedSymbols && now - cachedAt < EXCHANGEINFO_CACHE_MS) return cachedSymbols;

  try {
      // 🔥 Timeout kam kar diya taaki jaldi fail ho aur server hang na ho
      const { data } = await axios.get(`${BINANCE_API}/exchangeInfo`, { timeout: 4000 });
      const valid = new Set(
        (data.symbols || [])
          .filter((s) => s.status === "TRADING")
          .map((s) => s.symbol.toUpperCase())
      );
      cachedSymbols = valid;
      cachedAt = now;
      return valid;
  } catch (err) {
      // 🔥 FIX: Agar API fail ho, toh purana cache de do, error mat feko!
      if (cachedSymbols) {
          console.log("Serving cached ExchangeInfo due to API failure");
          return cachedSymbols;
      }
      throw err;
  }
}

async function fetchWithRetry(configFn, retries = 1, baseDelay = 300) {
  // 🔥 Retries aur delay kam kar diye taaki login hang na ho
  let attempt = 0;
  while (true) {
    try {
      return await configFn();
    } catch (err) {
      attempt++;
      if (attempt > retries) throw err;
      await new Promise((r) => setTimeout(r, baseDelay));
    }
  }
}

// 🔥 UPGRADED: $0.50 ke upar wale coins aur random shuffing!
router.get("/symbols", async (req, res) => {
  try {
    const now = Date.now();
    if (symbolsListCache && now - symbolsListCacheAt < EXCHANGEINFO_CACHE_MS) {
      return res.json({ symbols: symbolsListCache });
    }

    const validSet = await getValidSymbols();

    let tickerPrices;
    try {
        const allPricesResp = await fetchWithRetry(() => 
          axios.get(`${BINANCE_API}/ticker/price`, { timeout: 4000 })
        );
        tickerPrices = allPricesResp.data;
    } catch (apiError) {
        // 🔥 FIX: Server block hone se bachane ke liye turant purana cache do
        if (symbolsListCache) {
            console.log("Serving old symbolsListCache due to Binance error");
            return res.json({ symbols: symbolsListCache });
        }
        return res.status(502).json({ error: "Failed to fetch symbols from market" });
    }

    let symbols = tickerPrices
      .filter((p) => p.symbol.endsWith("USDT") && validSet.has(p.symbol) && parseFloat(p.price) >= 0.50)
      .map((p) => p.symbol);

    const topCoins = [
      "BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT", "ADAUSDT", 
      "DOGEUSDT", "TRXUSDT", "LINKUSDT", "DOTUSDT", "MATICUSDT", "LTCUSDT", 
      "SHIBUSDT", "AVAXUSDT", "UNIUSDT", "ATOMUSDT", "XMRUSDT", "NEARUSDT", 
      "FILUSDT", "VETUSDT", "ICPUSDT", "GRTUSDT", "APEUSDT", "ALGOUSDT", 
      "SANDUSDT", "MANAUSDT", "THETAUSDT", "AXSUSDT", "XTZUSDT", "EOSUSDT", 
      "AAVEUSDT", "EGLDUSDT", "FLOWUSDT", "QNTUSDT", "CHZUSDT", "GALAUSDT", 
      "NEOUSDT", "CRVUSDT", "ENJUSDT", "DASHUSDT", "ZECUSDT", "MKRUSDT", 
      "BATUSDT", "ZILUSDT", "RUNEUSDT", "KSMUSDT", "CAKEUSDT", "FTMUSDT", 
      "ARUSDT", "COMPUSDT", "LRCUSDT", "YFIUSDT", "1INCHUSDT", "SNXUSDT", 
      "HOTUSDT", "IOTXUSDT", "RVNUSDT", "AUDIOUSDT", "KAVAUSDT", "SUSHIUSDT", 
      "ANKRUSDT", "ROSEUSDT", "CELOUSDT", "OCEANUSDT", "LPTUSDT", "GTCUSDT", 
      "DYDXUSDT", "ENSUSDT", "LDOUSDT", "OPUSDT", "APTUSDT", "ARBUSDT", 
      "INJUSDT", "FETUSDT", "RNDRUSDT", "STXUSDT", "AGIXUSDT", "PEPEUSDT", 
      "SUIUSDT", "SEIUSDT", "TIAUSDT", "ORDIUSDT", "WLDUSDT", "PYTHUSDT", 
      "JUPUSDT", "BONKUSDT", "FLOKIUSDT", "BOMEUSDT", "WIFUSDT", "STRKUSDT"
    ];
    
    symbols = symbols.filter((s) => !topCoins.includes(s));
    symbols = symbols.sort(() => 0.5 - Math.random());
    symbols = [...topCoins.filter(c => validSet.has(c)), ...symbols];
    symbols = symbols.slice(0, SYMBOL_LIMIT);

    if (!symbols.includes(CUSTOM_TOKEN_SYMBOL)) {
      symbols.unshift(CUSTOM_TOKEN_SYMBOL);
    }

    symbolsListCache = symbols;
    symbolsListCacheAt = now;

    return res.json({ symbols });
  } catch (e) {
    console.error("Market symbols error:", e?.message);
    // 🔥 Fallback in case of absolute failure
    if (symbolsListCache) return res.json({ symbols: symbolsListCache });
    return res.status(502).json({ error: "Failed to fetch symbols" });
  }
});

router.get("/prices", async (req, res) => {
  try {
    const requested = normalizeList(req.query.symbols);
    if (!requested.length) return res.json({ prices: [], invalidSymbols: [] });

    if (requested.length > (SYMBOL_LIMIT + 50)) {
      return res.status(400).json({ message: `Too many symbols requested` });
    }

    const now = Date.now();
    if (pricesCache && now - pricesCacheAt < CACHE_MS) {
      return res.json(pricesCache);
    }

    const validSet = await getValidSymbols();

    const aliasMap = {
      SATSUSDT: "1000SATSUSDT",
    };

    const prices = [];
    let binanceRequested = [];

    for (let sym of requested) {
      let mappedSym = aliasMap[sym] || sym;
      if (mappedSym === CUSTOM_TOKEN_SYMBOL) {
        prices.push({ symbol: CUSTOM_TOKEN_SYMBOL, price: getCustomTokenPrice() });
      } else {
        binanceRequested.push(mappedSym);
      }
    }

    const validSymbols = Array.from(new Set(binanceRequested.filter((s) => validSet.has(s))));
    const invalidSymbols = Array.from(new Set(binanceRequested.filter((s) => !validSet.has(s))));

    if (validSymbols.length) {
      // 🔥 Fast Fetching: Agar validSymbols bahut zyada hain toh sabka ek sath manga lo
      if (validSymbols.length > 50) {
          const allPricesResp = await fetchWithRetry(() => 
              axios.get(`${BINANCE_API}/ticker/price`, { timeout: 5000 })
          );
          const dataMap = new Map();
          allPricesResp.data.forEach(p => dataMap.set(p.symbol, p.price));
          
          for (let sym of validSymbols) {
              if (dataMap.has(sym)) {
                  prices.push({ symbol: sym, price: dataMap.get(sym) });
              } else {
                  invalidSymbols.push(sym);
              }
          }
      } else {
          // Kam symbols hain toh chunks me manga lo
          const groups = chunk(validSymbols, MAX_CHUNK);
          for (const g of groups) {
            try {
              const params = { symbols: JSON.stringify(g) };
              const resp = await fetchWithRetry(() =>
                axios.get(`${BINANCE_API}/ticker/price`, { params, timeout: 4000 })
              );

              const data = resp.data;
              if (Array.isArray(data)) {
                for (const row of data) {
                  if (row?.symbol && row?.price != null) prices.push({ symbol: row.symbol, price: row.price });
                }
              }
            } catch (batchErr) {
              // Ignore batch error and push to invalid if it fails completely
              invalidSymbols.push(...g);
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
    // 🔥 FIX: Server block na ho isliye API down hone par purani cached price do
    if (pricesCache) {
        console.log("Serving stale pricesCache due to API error");
        return res.json(pricesCache);
    }
    return res.status(502).json({ error: "Failed to fetch prices" });
  }
});

// ==========================================
// 🔥 NAYA API: Frontend ko fixed entry prices dene ke liye
// ==========================================
router.post("/ai-trades", async (req, res) => {
  try {
    const { prices } = req.body; 
    
    let savedTrades = [];
    
    for (let item of prices) {
      let trade = await AiTrade.findOne({ symbol: item.symbol });
      
      if (!trade) {
        const h = item.symbol.length + Math.floor(Math.random() * 10);
        const side = h % 2 === 0 ? "Long" : "Short";
        const leverages = [5, 10, 15, 20];
        const lev = leverages[h % leverages.length];
        
        trade = await AiTrade.create({
          symbol: item.symbol,
          pair: item.symbol.replace("USDT", "") + "/USDT",
          side: side,
          leverage: lev,
          entryPrice: item.price
        });
      }
      savedTrades.push(trade);
    }
    
    res.json({ success: true, trades: savedTrades });
  } catch (error) {
    console.error("AI Trade DB Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;