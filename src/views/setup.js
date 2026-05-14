import { el, assetUrl } from '../dom.js';
import { getState, startNewGame } from '../state.js';

export function renderSetup(mount, { navigate }) {
  const state = getState();
  const selected = new Set();
  const filters = { pc: '', enemy: '' };

  const root = el('div', { class: 'page' });
  mount.appendChild(root);

  root.appendChild(
    el('header', { class: 'top-bar' }, [
      el('button', { class: 'btn btn-ghost', onClick: () => navigate('splash') }, ['← Back']),
      el('h2', { class: 'top-bar-title' }, ['Choose Your Scenario']),
      el('div', { class: 'top-bar-spacer' }),
    ])
  );

  if (state.library.length === 0) {
    root.appendChild(
      el('div', { class: 'panel' }, [
        el('p', { class: 'empty' }, [
          'Your library is empty. ',
          el('button', { class: 'btn-link', onClick: () => navigate('library') }, ['Add some entities first']),
          '.',
        ]),
      ])
    );
    return;
  }

  const grid = el('div', { class: 'setup-grid' });
  root.appendChild(grid);

  const pcColumn = renderColumn('Player Characters', 'PC');
  const enemyColumn = renderColumn('Enemies & Allies', ['EnemyGroup', 'Ally']);
  grid.appendChild(pcColumn);
  grid.appendChild(enemyColumn);

  const footer = el('div', { class: 'sticky-footer' }, [
    el('span', { class: 'counter' }, [counterText()]),
    el('button', {
      class: 'btn btn-primary btn-large',
      onClick: () => {
        if (selected.size === 0) return;
        startNewGame([...selected]);
        navigate('initiative');
      },
    }, ['Start Game →']),
  ]);
  root.appendChild(footer);

  function counterText() {
    return `${selected.size} selected`;
  }

  function updateFooter() {
    footer.querySelector('.counter').textContent = counterText();
  }

  function renderColumn(title, typeFilter) {
    const filterKey = typeFilter === 'PC' ? 'pc' : 'enemy';
    const types = Array.isArray(typeFilter) ? typeFilter : [typeFilter];

    const search = el('input', {
      class: 'input',
      type: 'search',
      placeholder: 'Filter…',
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
        .filter((e) => e.name.toLowerCase().includes(filters[filterKey]));
      if (items.length === 0) {
        list.appendChild(el('p', { class: 'empty' }, ['(none)']));
        return;
      }
      for (const entity of items) {
        const isSel = selected.has(entity.id);
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
          el('div', { class: 'pick-thumb' }, [el('img', { src: assetUrl(entity.image), alt: '' })]),
          el('div', { class: 'pick-name' }, [entity.name]),
          isSel ? el('div', { class: 'pick-check' }, ['✓']) : null,
        ]);
        list.appendChild(tile);
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
