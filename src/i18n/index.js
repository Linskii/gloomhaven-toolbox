// Tiny i18n layer.
//
// Use:
//   t('splash.startNew')           → string
//   t('init.title', round)         → string (when the entry is a function)
//   entityName(entity)             → translated name with fallback to entity.name
//   setLanguage('de')              → switch + persist + notify subscribers
//   onLanguageChange(fn)           → callback fires on every switch
//
// To add a language: create src/i18n/<code>.js using en.js as template,
// then register it in LANGUAGES below.

import en from './en.js';
import de from './de.js';

const LANGUAGES = { en, de };
const STORAGE_KEY = 'gloomhaven-lang';
const FALLBACK = 'en';

function pickInitial() {
  try {
    // One-time migration from typo'd key.
    if (!localStorage.getItem(STORAGE_KEY)) {
      const legacy = localStorage.getItem('glenhaven-lang');
      if (legacy) localStorage.setItem(STORAGE_KEY, legacy);
    }
    localStorage.removeItem('glenhaven-lang');

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && LANGUAGES[saved]) return saved;
  } catch {}
  const browser = (navigator.language || FALLBACK).slice(0, 2).toLowerCase();
  return LANGUAGES[browser] ? browser : FALLBACK;
}

let current = pickInitial();
const listeners = new Set();

export function getLanguage() {
  return current;
}

export function getLanguages() {
  return Object.values(LANGUAGES).map((l) => l.meta);
}

export function setLanguage(code) {
  if (!LANGUAGES[code] || code === current) return;
  current = code;
  try { localStorage.setItem(STORAGE_KEY, code); } catch {}
  for (const fn of listeners) fn(code);
}

export function onLanguageChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function lookup(key) {
  const cur = LANGUAGES[current].ui[key];
  if (cur != null) return cur;
  return LANGUAGES[FALLBACK].ui[key];
}

export function t(key, ...args) {
  const val = lookup(key);
  if (val == null) return key; // surface missing keys instead of silently blanking
  return typeof val === 'function' ? val(...args) : val;
}

export function entityName(entity) {
  if (!entity) return '';
  const override = LANGUAGES[current].entities?.[entity.id];
  return override || entity.name;
}
