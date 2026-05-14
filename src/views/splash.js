import { el } from '../dom.js';
import { getState, abandonGame } from '../state.js';

export function renderSplash(mount, { navigate }) {
  const state = getState();
  const hasGame = !!state.game;

  const root = el('div', { class: 'splash-screen' }, [
    el('div', { class: 'splash-glow' }),
    el('div', { class: 'splash-content' }, [
      el('h1', { class: 'splash-title' }, ['Glenhaven']),
      el('p', { class: 'splash-subtitle' }, ['Initiative Tracker']),
      el('div', { class: 'splash-divider' }),
      el('div', { class: 'splash-actions' }, [
        hasGame
          ? el('button', {
              class: 'btn btn-primary btn-large',
              onClick: () => {
                navigate(state.game.phase === 'carousel' ? 'carousel' : 'initiative');
              },
            }, [`Resume Round ${state.game.round}`])
          : null,
        el('button', {
          class: hasGame ? 'btn btn-secondary btn-large' : 'btn btn-primary btn-large',
          onClick: () => {
            if (hasGame) {
              const ok = confirm('Abandon the current game and start a new one?');
              if (!ok) return;
              abandonGame();
            }
            navigate('setup');
          },
        }, ['Start a New Game']),
      ]),
    ]),
  ]);

  mount.appendChild(root);
}
