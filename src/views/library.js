import { el, assetUrl } from '../dom.js';
import { getState, subscribe, addLibraryEntry, updateLibraryEntry, deleteLibraryEntry } from '../state.js';

const TYPES = [
  { value: 'PC', label: 'Player Character' },
  { value: 'EnemyGroup', label: 'Enemy Group' },
  { value: 'Ally', label: 'Ally' },
];

let availableImages = null;

async function loadImageManifest() {
  if (availableImages) return availableImages;
  try {
    const base = import.meta.env.BASE_URL || '/';
    const url = `${base.replace(/\/$/, '')}/assets/entities/manifest.json`;
    const res = await fetch(url);
    const data = await res.json();
    availableImages = data.images || [];
  } catch {
    availableImages = [];
  }
  return availableImages;
}

export function renderLibrary(mount, { navigate }) {
  let editingId = null;

  const root = el('div', { class: 'page' });
  mount.appendChild(root);

  function rerender() {
    while (root.firstChild) root.removeChild(root.firstChild);
    const state = getState();
    const editing = editingId ? state.library.find((e) => e.id === editingId) : null;

    root.appendChild(
      el('header', { class: 'top-bar' }, [
        el('button', { class: 'btn btn-ghost', onClick: () => navigate('splash') }, ['← Back']),
        el('h2', { class: 'top-bar-title' }, ['Library']),
        el('div', { class: 'top-bar-spacer' }),
      ])
    );

    const grid = el('div', { class: 'library-grid' });

    grid.appendChild(renderForm(editing, () => {
      editingId = null;
      rerender();
    }));

    grid.appendChild(renderList(state.library, (id) => {
      editingId = id;
      rerender();
    }));

    root.appendChild(grid);
  }

  rerender();
  const unsub = subscribe(() => rerender());
  return () => unsub();
}

function renderForm(editing, onDone) {
  const form = el('form', { class: 'panel library-form' });
  form.appendChild(el('h3', { class: 'panel-title' }, [editing ? 'Edit Entity' : 'Add Entity']));

  const nameInput = el('input', {
    class: 'input',
    type: 'text',
    name: 'name',
    placeholder: 'Name (e.g. Brute, Inox Guard, Tinkerer)',
    required: true,
    value: editing?.name || '',
  });

  const typeSelect = el('select', { class: 'input', name: 'type' },
    TYPES.map((t) => {
      const opt = el('option', { value: t.value }, [t.label]);
      if (editing?.type === t.value) opt.setAttribute('selected', '');
      return opt;
    })
  );

  const imageSelect = el('select', { class: 'input', name: 'image' }, [
    el('option', { value: '' }, ['— select image —']),
  ]);

  const preview = el('div', { class: 'image-preview' });
  function updatePreview() {
    while (preview.firstChild) preview.removeChild(preview.firstChild);
    const v = imageSelect.value;
    if (v) preview.appendChild(el('img', { src: assetUrl(v), alt: '' }));
  }
  imageSelect.addEventListener('change', updatePreview);

  loadImageManifest().then((images) => {
    for (const img of images) {
      const opt = el('option', { value: img }, [img]);
      if (editing?.image === img) opt.setAttribute('selected', '');
      imageSelect.appendChild(opt);
    }
    updatePreview();
  });

  form.appendChild(el('label', { class: 'field' }, [el('span', {}, ['Name']), nameInput]));
  form.appendChild(el('label', { class: 'field' }, [el('span', {}, ['Type']), typeSelect]));
  form.appendChild(el('label', { class: 'field' }, [el('span', {}, ['Image']), imageSelect]));
  form.appendChild(preview);

  form.appendChild(el('p', { class: 'hint' }, [
    'Drop image files (PNG / transparent WebP / GIF) into ',
    el('code', {}, ['public/assets/entities/']),
    ' and add their filenames to ',
    el('code', {}, ['manifest.json']),
    '.',
  ]));

  const buttons = el('div', { class: 'form-actions' }, [
    el('button', {
      class: 'btn btn-primary', type: 'submit',
    }, [editing ? 'Save Changes' : 'Add to Library']),
    editing
      ? el('button', { class: 'btn btn-ghost', type: 'button', onClick: () => onDone() }, ['Cancel'])
      : null,
  ]);
  form.appendChild(buttons);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const type = typeSelect.value;
    const image = imageSelect.value;
    if (!name || !image) return;
    if (editing) {
      updateLibraryEntry(editing.id, { name, type, image });
    } else {
      addLibraryEntry({ name, type, image });
      form.reset();
      updatePreview();
    }
    onDone();
  });

  return form;
}

function renderList(library, onEdit) {
  const panel = el('div', { class: 'panel library-list' }, [
    el('h3', { class: 'panel-title' }, ['Entities']),
  ]);
  if (library.length === 0) {
    panel.appendChild(el('p', { class: 'empty' }, ['Your library is empty. Add your first entity →']));
    return panel;
  }
  const list = el('ul', { class: 'entity-list' });
  for (const entity of library) {
    list.appendChild(
      el('li', { class: 'entity-row' }, [
        el('div', { class: 'entity-thumb' }, [el('img', { src: assetUrl(entity.image), alt: '' })]),
        el('div', { class: 'entity-meta' }, [
          el('div', { class: 'entity-name' }, [entity.name]),
          el('div', { class: 'entity-type' }, [labelForType(entity.type)]),
        ]),
        el('div', { class: 'entity-actions' }, [
          el('button', { class: 'btn btn-ghost btn-sm', onClick: () => onEdit(entity.id) }, ['Edit']),
          el('button', {
            class: 'btn btn-ghost btn-sm danger',
            onClick: () => {
              if (confirm(`Delete "${entity.name}"?`)) deleteLibraryEntry(entity.id);
            },
          }, ['Delete']),
        ]),
      ])
    );
  }
  panel.appendChild(list);
  return panel;
}

function labelForType(type) {
  return TYPES.find((t) => t.value === type)?.label || type;
}
