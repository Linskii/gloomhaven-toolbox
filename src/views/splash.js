import { el } from '../dom.js';
import { getState, abandonGame } from '../state.js';
import { t } from '../i18n/index.js';
import { languageSwitcher } from './language-switcher.js';
import { openSettingsModal } from './settings.js';

export function renderSplash(mount, { navigate }) {
  const state = getState();
  const hasGame = !!state.game;

  const root = el('div', { class: 'splash-screen' }, [
    el('div', { class: 'splash-glow' }),
    el('div', { class: 'splash-top' }, [languageSwitcher()]),
    el('div', { class: 'splash-content' }, [
      el('h1', { class: 'splash-title' }, ['Gloomhaven']),
      el('p', { class: 'splash-subtitle' }, [t('splash.subtitle')]),
      el('div', { class: 'splash-divider' }),
      el('div', { class: 'splash-actions' }, [
        hasGame
          ? el('button', {
              class: 'btn btn-primary btn-large',
              onClick: () => {
                navigate(state.game.phase === 'carousel' ? 'carousel' : 'initiative');
              },
            }, [t('splash.resumeRound', state.game.round)])
          : null,
        el('button', {
          class: hasGame ? 'btn btn-secondary btn-large' : 'btn btn-primary btn-large',
          onClick: () => {
            if (hasGame) {
              const ok = confirm(t('splash.abandonConfirm'));
              if (!ok) return;
              abandonGame();
            }
            navigate('setup');
          },
        }, [t('splash.startNew')]),
      ]),
      el('div', { class: 'splash-foot' }, [
        el('button', {
          class: 'btn-link',
          type: 'button',
          onClick: () => openSettingsModal({ onClose: () => navigate('splash') }),
        }, [t('splash.manageFigures')]),
      ]),
    ]),
  ]);

  mount.appendChild(root);
}
