import { el, assetUrl } from '../dom.js';
import { getState, entityById, setInitiativeOrder, abandonGame } from '../state.js';

export function renderInitiative(mount, { navigate }) {
  const state = getState();
  if (!state.game) {
    navigate('splash');
    return;
  }

  const order = []; // ordered entity IDs

  const root = el('div', { class: 'page' });
  mount.appendChild(root);

  root.appendChild(
    el('header', { class: 'top-bar' }, [
      el('button', {
        class: 'btn btn-ghost',
        onClick: () => {
          if (confirm('Abandon this game and return to the splash?')) {
            abandonGame();
            navigate('splash');
          }
        },
      }, ['✕ Abandon']),
      el('h2', { class: 'top-bar-title' }, [`Round ${state.game.round} — Initiative`]),
      el('div', { class: 'top-bar-spacer' }),
    ])
  );

  root.appendChild(
    el('p', { class: 'page-subtitle' }, [
      'Tap entities in the order they act this round. Skip anyone resting.',
    ])
  );

  const grid = el('div', { class: 'init-grid' });
  root.appendChild(grid);

  function repaint() {
    while (grid.firstChild) grid.removeChild(grid.firstChild);
    for (const id of state.game.pool) {
      const entity = entityById(id);
      if (!entity) continue;
      const idx = order.indexOf(id);
      const isSelected = idx !== -1;
      const tile = el('button', {
        class: `init-tile ${isSelected ? 'is-tapped' : ''}`,
        type: 'button',
        onClick: () => {
          if (isSelected) order.splice(idx, 1);
          else order.push(id);
          repaint();
          updateStart();
        },
      }, [
        el('div', { class: 'init-thumb' }, [el('img', { src: assetUrl(entity.image), alt: '' })]),
        el('div', { class: 'init-name' }, [entity.name]),
        isSelected ? el('div', { class: 'init-badge' }, [String(idx + 1)]) : null,
      ]);
      grid.appendChild(tile);
    }
  }

  const startBtn = el('button', {
    class: 'btn btn-primary btn-large',
    onClick: () => {
      if (order.length === 0) return;
      setInitiativeOrder(order);
      navigate('carousel');
    },
  }, ['Start Round →']);

  function updateStart() {
    startBtn.disabled = order.length === 0;
    startBtn.classList.toggle('disabled', order.length === 0);
  }

  root.appendChild(
    el('div', { class: 'sticky-footer' }, [
      el('span', { class: 'counter' }, ['Tap in order to set initiative']),
      startBtn,
    ])
  );

  repaint();
  updateStart();
}
