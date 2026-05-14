// Per-device custom names for entities (currently PCs).
// Persisted in localStorage so the last-used name for each class
// sticks across games on this device.

const STORAGE_KEY = 'gloomhaven-custom-names';

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

let map = load();
const listeners = new Set();

export function getCustomName(id) {
  return map[id] || '';
}

export function setCustomName(id, name) {
  const clean = (name || '').trim();
  if (clean) map[id] = clean;
  else delete map[id];
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(map)); } catch {}
  for (const fn of listeners) { try { fn(id, clean); } catch {} }
}

export function onCustomNameChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
