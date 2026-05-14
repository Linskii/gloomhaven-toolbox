import { el } from '../dom.js';
import { LIBRARY } from '../defaults.js';
import { t, entityName } from '../i18n/index.js';
import { listSlugs, putBlob, clearAll } from '../image-store.js';

// Allowed image extensions inside the uploaded zip.
const IMG_EXT = new Set(['png', 'webp', 'jpg', 'jpeg', 'gif', 'svg']);

const VALID_SLUGS = new Set(LIBRARY.map((e) => e.id));

export async function openSettingsModal({ onClose } = {}) {
  const overlay = el('div', { class: 'modal-overlay' });
  const dialog = el('div', { class: 'modal modal-settings' });
  overlay.appendChild(dialog);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  function close() {
    document.removeEventListener('keydown', onKey);
    overlay.remove();
    onClose?.();
  }
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);

  dialog.appendChild(
    el('div', { class: 'modal-header' }, [
      el('h3', {}, [t('settings.title')]),
      el('button', { class: 'btn btn-ghost', onClick: close }, [t('common.close')]),
    ])
  );

  const body = el('div', { class: 'settings-body' });
  dialog.appendChild(body);

  body.appendChild(el('p', { class: 'modal-hint' }, [t('settings.hint')]));

  const fileInput = el('input', {
    type: 'file',
    accept: '.zip,application/zip',
    style: { display: 'none' },
  });

  const status = el('div', { class: 'settings-status' });
  const slugList = el('div', { class: 'settings-slugs' });

  async function refreshList() {
    const slugs = await listSlugs();
    slugList.innerHTML = '';
    if (slugs.length === 0) {
      slugList.appendChild(el('p', { class: 'empty' }, [t('settings.none')]));
      return;
    }
    slugList.appendChild(
      el('p', { class: 'settings-count' }, [t('settings.loaded', slugs.length)])
    );
    const ul = el('ul', { class: 'settings-slug-list' });
    for (const slug of slugs.sort()) {
      const entity = LIBRARY.find((e) => e.id === slug);
      ul.appendChild(
        el('li', { class: 'settings-slug-row' }, [
          el('span', { class: 'settings-slug-name' }, [entity ? entityName(entity) : slug]),
          el('span', { class: 'settings-slug-id' }, [slug]),
        ])
      );
    }
    slugList.appendChild(ul);
  }

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    fileInput.value = '';
    await handleZip(file, status);
    await refreshList();
  });

  const actionRow = el('div', { class: 'settings-actions' }, [
    el('button', {
      class: 'btn btn-primary',
      onClick: () => fileInput.click(),
    }, [t('settings.upload')]),
    el('button', {
      class: 'btn btn-ghost',
      onClick: async () => {
        if (!confirm(t('settings.clearConfirm'))) return;
        await clearAll();
        status.textContent = t('settings.cleared');
        await refreshList();
      },
    }, [t('settings.clear')]),
  ]);
  body.appendChild(actionRow);
  body.appendChild(fileInput);
  body.appendChild(status);
  body.appendChild(slugList);

  document.body.appendChild(overlay);
  refreshList();

  return { close };
}

async function handleZip(file, statusEl) {
  statusEl.textContent = t('settings.unpacking');
  let JSZip;
  try {
    JSZip = (await import('jszip')).default;
  } catch (e) {
    statusEl.textContent = `${t('settings.errorPrefix')} jszip`;
    return;
  }

  let zip;
  try {
    zip = await JSZip.loadAsync(file);
  } catch (e) {
    statusEl.textContent = t('settings.errorRead');
    return;
  }

  const imported = [];
  const skipped = [];
  const unknown = [];

  const entries = Object.values(zip.files).filter((f) => !f.dir);

  for (const entry of entries) {
    const baseName = entry.name.split('/').pop(); // drop any folder prefix
    if (!baseName || baseName.startsWith('.') || baseName.startsWith('__MACOSX')) continue;

    const dot = baseName.lastIndexOf('.');
    if (dot < 0) { skipped.push(baseName); continue; }
    const stem = baseName.slice(0, dot).toLowerCase();
    const ext = baseName.slice(dot + 1).toLowerCase();
    if (!IMG_EXT.has(ext)) { skipped.push(baseName); continue; }

    if (!VALID_SLUGS.has(stem)) { unknown.push(baseName); continue; }

    const blob = await entry.async('blob');
    await putBlob(stem, blob);
    imported.push(stem);
  }

  const parts = [];
  parts.push(t('settings.imported', imported.length));
  if (unknown.length) parts.push(t('settings.unknown', unknown.length));
  if (skipped.length) parts.push(t('settings.skipped', skipped.length));
  statusEl.textContent = parts.join(' · ');
}
