import { el, assetUrl } from '../dom.js';
import { getState, entityById, insertIntoOrder, removeFromOrder } from '../state.js';

export function openEditRoundModal({ onChange, onClose }) {
  let selectedPoolId = null;

  const overlay = el('div', { class: 'modal-overlay' });
  const dialog = el('div', { class: 'modal modal-edit-round' });
  overlay.appendChild(dialog);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  const header = el('div', { class: 'modal-header' }, [
    el('h3', {}, ['Edit Round']),
    el('button', { class: 'btn btn-ghost', onClick: () => close() }, ['Close']),
  ]);
  dialog.appendChild(header);

  dialog.appendChild(
    el('p', { class: 'modal-hint' }, [
      'Select a candidate on the right, then choose an insert slot on the left. Use ✕ to remove an entity from the round.',
    ])
  );

  const body = el('div', { class: 'edit-round-body' });
  dialog.appendChild(body);

  function repaint() {
    while (body.firstChild) body.removeChild(body.firstChild);
    const state = getState();
    if (!state.game) {
      close();
      return;
    }
    body.appendChild(renderOrderColumn(state, () => selectedPoolId, (id) => {
      // Insert clicked: insert selectedPoolId at position id (gap index)
      if (selectedPoolId == null) return;
      insertIntoOrder(selectedPoolId, id);
      selectedPoolId = null;
      onChange?.();
      repaint();
    }, () => {
      onChange?.();
      repaint();
    }));
    body.appendChild(renderCandidatesColumn(state, selectedPoolId, (id) => {
      selectedPoolId = (selectedPoolId === id) ? null : id;
      repaint();
    }));
  }

  function close() {
    overlay.remove();
    onClose?.();
  }

  document.body.appendChild(overlay);
  repaint();

  // Esc to close
  const onKey = (e) => {
    if (e.key === 'Escape') close();
  };
  document.addEventListener('keydown', onKey, { once: true });

  return { close };
}

function renderOrderColumn(state, getSelected, onInsertAt, afterRemove) {
  const col = el('div', { class: 'edit-col edit-col-order' }, [
    el('h4', { class: 'edit-col-title' }, ['Current Order']),
  ]);

  const list = el('ol', { class: 'edit-order-list' });
  const order = state.game.order;
  const canInsert = getSelected() != null;

  list.appendChild(insertGap(0, canInsert, onInsertAt));

  order.forEach((id, idx) => {
    const entity = entityById(id);
    if (!entity) return;
    const isCurrent = idx === state.game.currentTurnIndex;
    list.appendChild(
      el('li', { class: `edit-order-row ${isCurrent ? 'is-current' : ''}` }, [
        el('div', { class: 'edit-order-index' }, [String(idx + 1)]),
        el('div', { class: 'edit-order-thumb' }, [el('img', { src: assetUrl(entity.image), alt: '' })]),
        el('div', { class: 'edit-order-name' }, [
          entity.name,
          isCurrent ? el('span', { class: 'now-tag' }, [' • now']) : null,
        ]),
        el('button', {
          class: 'btn btn-ghost btn-sm danger',
          title: 'Remove from round',
          onClick: () => {
            removeFromOrder(id);
            afterRemove?.();
          },
        }, ['✕']),
      ])
    );
    list.appendChild(insertGap(idx + 1, canInsert, onInsertAt));
  });

  if (order.length === 0) {
    list.appendChild(el('p', { class: 'empty' }, ['(no entities in this round)']));
  }

  col.appendChild(list);
  return col;
}

function insertGap(index, canInsert, onClick) {
  return el('li', { class: 'edit-gap-row' }, [
    el('button', {
      class: `edit-gap-btn ${canInsert ? 'is-armed' : ''}`,
      disabled: !canInsert,
      onClick: () => onClick(index),
    }, [
      el('span', { class: 'gap-line' }),
      el('span', { class: 'gap-label' }, [canInsert ? `Insert here` : '＋']),
      el('span', { class: 'gap-line' }),
    ]),
  ]);
}

function renderCandidatesColumn(state, selectedId, onSelect) {
  const col = el('div', { class: 'edit-col edit-col-candidates' }, [
    el('h4', { class: 'edit-col-title' }, ['Pool — Not in Round']),
  ]);

  const inOrder = new Set(state.game.order);
  const candidates = state.game.pool
    .filter((id) => !inOrder.has(id))
    .map((id) => entityById(id))
    .filter(Boolean);

  if (candidates.length === 0) {
    col.appendChild(el('p', { class: 'empty' }, ['Every entity in the scenario pool is already in the round.']));
    return col;
  }

  const list = el('ul', { class: 'candidate-list' });
  for (const entity of candidates) {
    const isSel = entity.id === selectedId;
    list.appendChild(
      el('li', { class: 'candidate-row' }, [
        el('button', {
          class: `candidate-btn ${isSel ? 'is-selected' : ''}`,
          type: 'button',
          onClick: () => onSelect(entity.id),
        }, [
          el('div', { class: 'candidate-thumb' }, [el('img', { src: assetUrl(entity.image), alt: '' })]),
          el('div', { class: 'candidate-name' }, [entity.name]),
          isSel ? el('div', { class: 'candidate-check' }, ['Selected']) : null,
        ]),
      ])
    );
  }
  col.appendChild(list);
  return col;
}
