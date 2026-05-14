import { LIBRARY } from './defaults.js';

const STORAGE_KEY = 'gloomhaven-game-v2';

// One-time migration from typo'd key, then cleanup of older keys.
try {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const legacy = localStorage.getItem('glenhaven-game-v2');
    if (legacy) localStorage.setItem(STORAGE_KEY, legacy);
  }
  localStorage.removeItem('glenhaven-game-v2');
  localStorage.removeItem('glenhaven-state-v1');
  localStorage.removeItem('glenhaven-seeded-v1');
} catch {}

function loadGame() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveGame(game) {
  if (game == null) localStorage.removeItem(STORAGE_KEY);
  else localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
}

const listeners = new Set();
let state = {
  library: LIBRARY,
  game: loadGame(),
};

function emit() {
  for (const fn of listeners) fn(state);
}

export function getState() {
  return state;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function update(mutator) {
  mutator(state);
  saveGame(state.game);
  emit();
}

// ---------- Game ----------

export function startNewGame(poolIds) {
  update((s) => {
    s.game = {
      round: 1,
      pool: [...poolIds],
      order: [],
      currentTurnIndex: 0,
      phase: 'initiative', // 'initiative' | 'carousel'
    };
  });
}

export function abandonGame() {
  update((s) => {
    s.game = null;
  });
}

export function setInitiativeOrder(orderedIds) {
  update((s) => {
    if (!s.game) return;
    s.game.order = [...orderedIds];
    s.game.currentTurnIndex = 0;
    s.game.phase = 'carousel';
  });
}

export function setCurrentTurnIndex(idx) {
  update((s) => {
    if (!s.game) return;
    s.game.currentTurnIndex = idx;
  });
}

export function endRound() {
  update((s) => {
    if (!s.game) return;
    s.game.round += 1;
    s.game.order = [];
    s.game.currentTurnIndex = 0;
    s.game.phase = 'initiative';
  });
}

export function insertIntoOrder(entityId, position) {
  update((s) => {
    if (!s.game) return;
    const next = [...s.game.order];
    const clamped = Math.max(0, Math.min(position, next.length));
    next.splice(clamped, 0, entityId);
    s.game.order = next;
    if (clamped <= s.game.currentTurnIndex) {
      s.game.currentTurnIndex += 1;
    }
  });
}

export function removeFromOrder(entityId) {
  update((s) => {
    if (!s.game) return;
    const idx = s.game.order.indexOf(entityId);
    if (idx === -1) return;
    s.game.order.splice(idx, 1);
    if (idx < s.game.currentTurnIndex) {
      s.game.currentTurnIndex = Math.max(0, s.game.currentTurnIndex - 1);
    } else if (idx === s.game.currentTurnIndex) {
      s.game.currentTurnIndex = Math.min(s.game.currentTurnIndex, Math.max(0, s.game.order.length - 1));
    }
  });
}

// ---------- Helpers ----------

export function entityById(id) {
  return state.library.find((e) => e.id === id) || null;
}
