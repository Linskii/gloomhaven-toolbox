import Swiper from 'swiper';
import { EffectCoverflow, Keyboard, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

import { el, entityImage } from '../dom.js';
import { getState, entityById, setCurrentTurnIndex, endRound, abandonGame, subscribe } from '../state.js';
import { openEditRoundModal } from './edit-round.js';
import { openEndRoundModal } from './end-round.js';

export function renderCarousel(mount, { navigate }) {
  const state = getState();
  if (!state.game || state.game.phase !== 'carousel' || state.game.order.length === 0) {
    navigate('initiative');
    return;
  }

  const root = el('div', { class: 'page carousel-page' });
  mount.appendChild(root);

  // Top bar
  const roundLabel = el('span', { class: 'round-label' }, [`Round ${state.game.round}`]);
  const turnLabel = el('span', { class: 'turn-label' }, ['']);
  const topBar = el('header', { class: 'top-bar carousel-top-bar' }, [
    el('button', {
      class: 'btn btn-ghost',
      onClick: () => {
        if (confirm('Abandon this game and return to the splash?')) {
          abandonGame();
          navigate('splash');
        }
      },
    }, ['✕']),
    el('div', { class: 'top-bar-center' }, [
      el('h2', { class: 'top-bar-title' }, ['Glenhaven']),
      el('div', { class: 'top-bar-meta' }, [roundLabel, ' • ', turnLabel]),
    ]),
    el('div', { class: 'top-bar-actions' }, [
      el('button', {
        class: 'btn btn-ghost',
        title: 'Edit round (spawn / remove)',
        onClick: () => {
          openEditRoundModal({
            onChange: () => rebuildSwiper(),
            onClose: () => rebuildSwiper(),
          });
        },
      }, ['Edit Round']),
      el('button', {
        class: 'btn btn-primary',
        onClick: () => {
          openEndRoundModal({
            round: getState().game.round,
            onConfirm: () => {
              endRound();
              navigate('initiative');
            },
          });
        },
      }, ['End Round']),
    ]),
  ]);
  root.appendChild(topBar);

  // Swiper container
  const swiperEl = el('div', { class: 'swiper carousel-swiper' });
  const wrapper = el('div', { class: 'swiper-wrapper' });
  swiperEl.appendChild(wrapper);
  root.appendChild(swiperEl);

  // Navigation hint
  root.appendChild(
    el('div', { class: 'carousel-hint' }, ['Swipe / drag • Use ← → keys'])
  );

  let swiper = null;

  function buildSlides() {
    while (wrapper.firstChild) wrapper.removeChild(wrapper.firstChild);
    const s = getState();
    if (!s.game) return;
    s.game.order.forEach((id, idx) => {
      const entity = entityById(id);
      if (!entity) return;
      wrapper.appendChild(buildSlide(entity, idx, s.game.order.length));
    });
  }

  function buildSlide(entity, idx, total) {
    return el('div', { class: 'swiper-slide carousel-slide' }, [
      el('div', { class: 'card' }, [
        el('div', { class: 'card-figure' }, [
          entityImage(entity, { alt: entity.name, className: 'card-image' }),
        ]),
        el('div', { class: 'card-meta' }, [
          el('div', { class: 'card-position' }, [`${idx + 1} / ${total}`]),
          el('div', { class: 'card-name' }, [entity.name]),
          el('div', { class: 'card-type' }, [typeLabel(entity.type)]),
        ]),
      ]),
    ]);
  }

  function rebuildSwiper() {
    if (swiper) {
      swiper.destroy(true, true);
      swiper = null;
    }
    buildSlides();
    const s = getState();
    if (!s.game || s.game.order.length === 0) {
      navigate('initiative');
      return;
    }
    const initial = Math.min(s.game.currentTurnIndex, s.game.order.length - 1);

    swiper = new Swiper(swiperEl, {
      modules: [EffectCoverflow, Keyboard, Mousewheel],
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      initialSlide: initial,
      keyboard: { enabled: true },
      mousewheel: { forceToAxis: true, sensitivity: 0.6, releaseOnEdges: true },
      coverflowEffect: {
        rotate: 0,
        stretch: -20,
        depth: 360,
        modifier: 1,
        scale: 0.88,
        slideShadows: false,
      },
      on: {
        slideChange: () => {
          if (!swiper) return;
          setCurrentTurnIndex(swiper.activeIndex);
          updateTurnLabel();
        },
      },
    });

    updateTurnLabel();
  }

  function updateTurnLabel() {
    const s = getState();
    if (!s.game) return;
    const total = s.game.order.length;
    const idx = Math.min(s.game.currentTurnIndex, total - 1);
    const entity = entityById(s.game.order[idx]);
    turnLabel.textContent = entity ? `Turn ${idx + 1}: ${entity.name}` : `Turn ${idx + 1}`;
    roundLabel.textContent = `Round ${s.game.round}`;
  }

  rebuildSwiper();

  const unsub = subscribe(() => updateTurnLabel());

  return () => {
    unsub();
    if (swiper) { swiper.destroy(true, true); swiper = null; }
  };
}

function typeLabel(type) {
  if (type === 'PC') return 'Player Character';
  if (type === 'EnemyGroup') return 'Enemy Group';
  if (type === 'Ally') return 'Ally';
  return type;
}
