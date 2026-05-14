// Per-device storage for character art.
//
// Blobs are keyed by entity id (the slug from defaults.js — e.g. "brute",
// "bandit-archer"). The settings modal accepts a .zip; each `<slug>.<ext>`
// inside lands here. entityImage() in dom.js checks this store first,
// then falls back to the static asset path (the gitignored private/ folder
// during local dev) and finally to a placeholder.

const DB_NAME = 'gloomhaven-images';
const DB_VERSION = 1;
const STORE = 'entity-images';

let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function tx(mode) {
  return openDB().then((db) => db.transaction(STORE, mode).objectStore(STORE));
}

function awaitRequest(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getBlob(slug) {
  const store = await tx('readonly');
  return awaitRequest(store.get(slug));
}

export async function putBlob(slug, blob) {
  const store = await tx('readwrite');
  await awaitRequest(store.put(blob, slug));
  invalidate(slug);
}

export async function deleteBlob(slug) {
  const store = await tx('readwrite');
  await awaitRequest(store.delete(slug));
  invalidate(slug);
}

export async function listSlugs() {
  const store = await tx('readonly');
  return awaitRequest(store.getAllKeys());
}

export async function clearAll() {
  const store = await tx('readwrite');
  await awaitRequest(store.clear());
  invalidate(null);
}

// --- URL cache + change subscriptions ---

const urlCache = new Map(); // slug -> blobURL
const subscribers = new Set();

export async function getUrl(slug) {
  if (urlCache.has(slug)) return urlCache.get(slug);
  const blob = await getBlob(slug);
  if (!blob) return null;
  const url = URL.createObjectURL(blob);
  urlCache.set(slug, url);
  return url;
}

function invalidate(slug) {
  if (slug == null) {
    for (const url of urlCache.values()) URL.revokeObjectURL(url);
    urlCache.clear();
  } else if (urlCache.has(slug)) {
    URL.revokeObjectURL(urlCache.get(slug));
    urlCache.delete(slug);
  }
  for (const fn of subscribers) {
    try { fn(slug); } catch {}
  }
}

export function onChange(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}
