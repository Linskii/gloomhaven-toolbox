import { getState, subscribe } from './state.js';
import { onLanguageChange } from './i18n/index.js';
import { renderSplash } from './views/splash.js';
import { renderSetup } from './views/setup.js';
import { renderInitiative } from './views/initiative.js';
import { renderCarousel } from './views/carousel.js';

let currentRoute = 'splash';
let mount = null;
let teardown = null;

const views = {
  splash: renderSplash,
  setup: renderSetup,
  initiative: renderInitiative,
  carousel: renderCarousel,
};

export function navigate(route) {
  currentRoute = route;
  render();
}

export function getRoute() {
  return currentRoute;
}

function render() {
  if (teardown) {
    try { teardown(); } catch {}
    teardown = null;
  }
  while (mount.firstChild) mount.removeChild(mount.firstChild);
  const view = views[currentRoute];
  if (!view) {
    mount.appendChild(document.createTextNode(`Unknown view: ${currentRoute}`));
    return;
  }
  const result = view(mount, { navigate });
  if (typeof result === 'function') teardown = result;
}

export function initRouter(rootEl) {
  mount = rootEl;
  const state = getState();
  if (state.game) {
    currentRoute = state.game.phase === 'carousel' ? 'carousel' : 'initiative';
  } else {
    currentRoute = 'splash';
  }
  render();

  // If state changes externally (e.g. game cleared), nudge route accordingly.
  subscribe((s) => {
    if (!s.game && (currentRoute === 'initiative' || currentRoute === 'carousel')) {
      navigate('splash');
    }
  });

  // Re-render whenever language changes.
  onLanguageChange(() => render());
}
