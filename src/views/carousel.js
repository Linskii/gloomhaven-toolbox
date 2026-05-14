import Swiper from 'swiper';
import { EffectCoverflow, Keyboard, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

import { el, entityImage } from '../dom.js';
import { getState, entityById, setCurrentTurnIndex, endRound, abandonGame, subscribe } from '../state.js';
import { t, entityName } from '../i18n/index.js';
import { languageSwitcher } from './language-switcher.js';
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
  const roundLabel = el('span', { class: 'round-label' }, ['']);
  const turnLabel = el('span', { class: 'turn-label' }, ['']);
  const topBar = el('header', { class: 'top-bar carousel-top-bar' }, [
    el('button', {
      class: 'btn btn-ghost',
      onClick: () => {
        if (confirm(t('common.abandonConfirm'))) {
          abandonGame();
          navigate('splash');
        }
      },
    }, ['✕']),
    el('div', { class: 'top-bar-center' }, [
      el('h2', { class: 'top-bar-title' }, [t('carousel.brand')]),
      el('div', { class: 'top-bar-meta' }, [roundLabel, ' • ', turnLabel]),
    ]),
    el('div', { class: 'top-bar-actions' }, [
      languageSwitcher(),
      el('button', {
        class: 'btn btn-ghost',
        title: t('carousel.editRoundTip'),
        onClick: () => {
          openEditRoundModal({
            onChange: () => rebuildSwiper(),
            onClose: () => rebuildSwiper(),
          });
        },
      }, [t('carousel.editRound')]),
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
      }, [t('carousel.endRound')]),
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
    el('div', { class: 'carousel-hint' }, [t('carousel.hint')])
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
    const name = entityName(entity);
    const figure = el('div', { class: 'card-figure' }, [
      entityImage(entity, { alt: name, className: 'card-image' }),
    ]);
    figure.dataset.entityId = entity.id;
    return el('div', { class: 'swiper-slide carousel-slide' }, [
      el('div', { class: 'card' }, [
        figure,
        el('div', { class: 'card-meta' }, [
          el('div', { class: 'card-position' }, [`${idx + 1} / ${total}`]),
          el('div', { class: 'card-name' }, [name]),
          el('div', { class: 'card-type' }, [t(`type.${entity.type}`)]),
        ]),
      ]),
    ]);
  }

  // For animated entities: only the active slide plays the animation.
  // Others show the first-frame still. Swap by replacing the .card-image element.
  function syncSlideAnimation() {
    if (!swiper) return;
    const slides = wrapper.children;
    for (let i = 0; i < slides.length; i++) {
      const figure = slides[i].querySelector('.card-figure');
      if (!figure) continue;
      const entity = entityById(figure.dataset.entityId);
      if (!entity?.animated) continue;
      const wantAnimated = i === swiper.activeIndex;
      if (figure.dataset.mode === (wantAnimated ? 'animated' : 'still')) continue;
      figure.dataset.mode = wantAnimated ? 'animated' : 'still';
      const old = figure.querySelector('.card-image');
      const fresh = entityImage(entity, {
        alt: entityName(entity),
        className: 'card-image',
        animated: wantAnimated,
      });
      if (old) old.replaceWith(fresh);
      else figure.appendChild(fresh);
    }
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
          syncSlideAnimation();
        },
      },
    });

    updateTurnLabel();
    syncSlideAnimation();
  }

  function updateTurnLabel() {
    const s = getState();
    if (!s.game) return;
    const total = s.game.order.length;
    const idx = Math.min(s.game.currentTurnIndex, total - 1);
    const entity = entityById(s.game.order[idx]);
    turnLabel.textContent = entity
      ? t('carousel.turn', idx + 1, entityName(entity))
      : t('carousel.turn', idx + 1, '');
    roundLabel.textContent = t('carousel.round', s.game.round);
  }

  rebuildSwiper();

  const unsub = subscribe(() => updateTurnLabel());

  return () => {
    unsub();
    if (swiper) { swiper.destroy(true, true); swiper = null; }
  };
}
