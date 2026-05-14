import { el } from '../dom.js';
import { t } from '../i18n/index.js';

// The reminder lines are referenced by key so they translate live.
const REMINDER_KEYS = ['end.reminder1', 'end.reminder2'];

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
      el('h3', {}, [t('end.title', round)]),
    ])
  );
  dialog.appendChild(
    el('p', { class: 'modal-hint reminder-lead' }, [t('end.lead')])
  );
  dialog.appendChild(
    el('ul', { class: 'reminders-list' },
      REMINDER_KEYS.map((key) =>
        el('li', { class: 'reminder-item' }, [
          el('span', { class: 'reminder-dot' }),
          el('span', {}, [t(key)]),
        ])
      )
    )
  );
  dialog.appendChild(
    el('div', { class: 'modal-footer' }, [
      el('button', { class: 'btn btn-ghost', onClick: () => close(false) }, [t('end.back')]),
      el('button', { class: 'btn btn-primary', onClick: () => close(true) }, [t('end.next')]),
    ])
  );

  document.body.appendChild(overlay);
  document.addEventListener('keydown', onKey);
}
