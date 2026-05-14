const STORAGE_KEY = 'glenhaven-state-v1';

const DEFAULT_STATE = {
  library: [],
  game: null,
};

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw);
    return {
      library: Array.isArray(parsed.library) ? parsed.library : [],
      game: parsed.game ?? null,
    };
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

function saveToStorage(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const listeners = new Set();
let state = loadFromStorage();

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

export function update(mutator) {
  mutator(state);
  saveToStorage(state);
  emit();
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

// ---------- Library ----------

export function addLibraryEntry({ name, type, image }) {
  update((s) => {
    s.library.push({ id: uid(), name, type, image });
  });
}

export function updateLibraryEntry(id, patch) {
  update((s) => {
    const entry = s.library.find((e) => e.id === id);
    if (entry) Object.assign(entry, patch);
  });
}

export function deleteLibraryEntry(id) {
  update((s) => {
    s.library = s.library.filter((e) => e.id !== id);
    if (s.game) {
      s.game.pool = s.game.pool.filter((eid) => eid !== id);
      s.game.order = s.game.order.filter((eid) => eid !== id);
    }
  });
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
