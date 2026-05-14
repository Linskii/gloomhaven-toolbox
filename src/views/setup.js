import { el, entityImage } from '../dom.js';
import { getState, startNewGame } from '../state.js';
import { t, entityName } from '../i18n/index.js';
import { getCustomName, setCustomName } from '../custom-names.js';
import { languageSwitcher } from './language-switcher.js';

export function renderSetup(mount, { navigate }) {
  const state = getState();
  const selected = new Set();
  const filters = { pc: '', enemy: '' };

  const root = el('div', { class: 'page' });
  mount.appendChild(root);

  root.appendChild(
    el('header', { class: 'top-bar' }, [
      el('button', { class: 'btn btn-ghost', onClick: () => navigate('splash') }, [t('common.back')]),
      el('h2', { class: 'top-bar-title' }, [t('setup.title')]),
      el('div', { class: 'top-bar-actions' }, [languageSwitcher()]),
    ])
  );

  const grid = el('div', { class: 'setup-grid' });
  root.appendChild(grid);

  const pcColumn = renderColumn(t('setup.colPCs'), 'PC');
  const enemyColumn = renderColumn(t('setup.colEnemies'), ['EnemyGroup', 'Ally']);
  grid.appendChild(pcColumn);
  grid.appendChild(enemyColumn);

  const footerCounter = el('span', { class: 'counter' }, [t('common.selected', selected.size)]);
  const footer = el('div', { class: 'sticky-footer' }, [
    footerCounter,
    el('button', {
      class: 'btn btn-primary btn-large',
      onClick: () => {
        if (selected.size === 0) return;
        startNewGame([...selected]);
        navigate('initiative');
      },
    }, [t('setup.start')]),
  ]);
  root.appendChild(footer);

  function updateFooter() {
    footerCounter.textContent = t('common.selected', selected.size);
  }

  function renderColumn(title, typeFilter) {
    const filterKey = typeFilter === 'PC' ? 'pc' : 'enemy';
    const types = Array.isArray(typeFilter) ? typeFilter : [typeFilter];

    const search = el('input', {
      class: 'input',
      type: 'search',
      placeholder: t('common.filter'),
      oninput: (e) => {
        filters[filterKey] = e.target.value.toLowerCase();
        repaintList();
      },
    });

    const list = el('div', { class: 'pick-list' });

    function repaintList() {
      while (list.firstChild) list.removeChild(list.firstChild);
      const items = state.library
        .filter((e) => types.includes(e.type))
        .map((e) => ({ entity: e, label: entityName(e) }))
        .filter((x) => x.label.toLowerCase().includes(filters[filterKey]));
      if (items.length === 0) {
        list.appendChild(el('p', { class: 'empty' }, [t('common.none')]));
        return;
      }
      for (const { entity, label } of items) {
        const isSel = selected.has(entity.id);
        const nameEl = el('div', { class: 'pick-name' }, [label]);
        const tile = el('button', {
          class: `pick-tile ${isSel ? 'is-selected' : ''}`,
          type: 'button',
          onClick: () => {
            if (selected.has(entity.id)) selected.delete(entity.id);
            else selected.add(entity.id);
            repaintList();
            updateFooter();
          },
        }, [
          el('div', { class: 'pick-thumb' }, [entityImage(entity, { alt: label })]),
          nameEl,
          isSel ? el('div', { class: 'pick-check' }, ['✓']) : null,
        ]);

        // Inline rename input for PCs once selected.
        if (entity.type === 'PC' && isSel) {
          const classLabel = entityName(entity, { custom: false });
          const input = el('input', {
            class: 'pick-name-input',
            type: 'text',
            placeholder: classLabel,
            value: getCustomName(entity.id),
            maxLength: 24,
            'aria-label': t('setup.renamePlaceholder', classLabel),
            onInput: (e) => {
              setCustomName(entity.id, e.target.value);
              nameEl.textContent = entityName(entity);
            },
            onClick: (e) => e.stopPropagation(),
            onKeydown: (e) => {
              if (e.key === 'Enter') e.target.blur();
              e.stopPropagation();
            },
          });
          list.appendChild(el('div', { class: 'pick-tile-wrap' }, [tile, input]));
        } else {
          list.appendChild(tile);
        }
      }
    }

    repaintList();

    return el('div', { class: 'panel' }, [
      el('h3', { class: 'panel-title' }, [title]),
      search,
      list,
    ]);
  }
}
