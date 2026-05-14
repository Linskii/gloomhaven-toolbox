import { el } from '../dom.js';

export const REMINDERS = [
  '… decay elements',
  '… reshuffle attack modifier decks if ×2 / null was drawn',
];

export function openEndRoundModal({ round, onConfirm, onCancel }) {
  const overlay = el('div', { class: 'modal-overlay' });
  const dialog = el('div', { class: 'modal modal-end-round' });
  overlay.appendChild(dialog);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close(false);
  });

  function close(confirmed) {
    overlay.remove();
    document.removeEventListener('keydown', onKey);
    if (confirmed) onConfirm?.();
    else onCancel?.();
  }

  const onKey = (e) => {
    if (e.key === 'Escape') close(false);
    if (e.key === 'Enter') close(true);
  };

  dialog.appendChild(
    el('div', { class: 'modal-header' }, [
      el('h3', {}, [`End of Round ${round}`]),
    ])
  );
  dialog.appendChild(
    el('p', { class: 'modal-hint reminder-lead' }, ['Don’t forget to …'])
  );
  dialog.appendChild(
    el('ul', { class: 'reminders-list' },
      REMINDERS.map((line) =>
        el('li', { class: 'reminder-item' }, [
          el('span', { class: 'reminder-dot' }),
          el('span', {}, [line]),
        ])
      )
    )
  );
  dialog.appendChild(
    el('div', { class: 'modal-footer' }, [
      el('button', { class: 'btn btn-ghost', onClick: () => close(false) }, ['Back']),
      el('button', { class: 'btn btn-primary', onClick: () => close(true) }, ['Begin Next Round →']),
    ])
  );

  document.body.appendChild(overlay);
  document.addEventListener('keydown', onKey);
}
