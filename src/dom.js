// Tiny DOM helpers — no framework.

export function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (key === 'class') node.className = value;
    else if (key === 'style' && typeof value === 'object') Object.assign(node.style, value);
    else if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === 'dataset' && typeof value === 'object') {
      for (const [dk, dv] of Object.entries(value)) node.dataset[dk] = dv;
    } else if (key === 'html') {
      node.innerHTML = value;
    } else if (value === false || value == null) {
      // skip
    } else if (value === true) {
      node.setAttribute(key, '');
    } else {
      node.setAttribute(key, value);
    }
  }
  appendChildren(node, children);
  return node;
}

function appendChildren(node, children) {
  const list = Array.isArray(children) ? children : [children];
  for (const child of list) {
    if (child == null || child === false) continue;
    if (Array.isArray(child)) appendChildren(node, child);
    else if (typeof child === 'string' || typeof child === 'number') {
      node.appendChild(document.createTextNode(String(child)));
    } else {
      node.appendChild(child);
    }
  }
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

export function assetUrl(path) {
  // Vite serves /public at root with base prefix applied automatically.
  const base = import.meta.env.BASE_URL || '/';
  return `${base.replace(/\/$/, '')}/assets/entities/${path}`;
}

import { getUrl as getStoredImageUrl } from './image-store.js';

function placeholder(name, className) {
  const initial = (name || '?').trim().charAt(0).toUpperCase() || '?';
  return el('div', { class: `entity-placeholder ${className}` }, [initial]);
}

export function entityImage(entity, { alt = '', className = '' } = {}) {
  const altText = alt || entity?.name || '';

  if (!entity) return placeholder('?', className);

  const img = el('img', { alt: altText, class: className });
  const staticFallback = entity.image ? assetUrl(entity.image) : null;

  // Falls back to a placeholder div if the <img> can't load anything.
  img.onerror = () => {
    img.replaceWith(placeholder(entity.name, className));
  };

  // Resolve preferred source: IndexedDB (per-device upload) → static asset.
  getStoredImageUrl(entity.id).then((url) => {
    if (url) {
      img.src = url;
    } else if (staticFallback) {
      img.src = staticFallback;
    } else {
      img.replaceWith(placeholder(entity.name, className));
    }
  }).catch(() => {
    if (staticFallback) img.src = staticFallback;
    else img.replaceWith(placeholder(entity.name, className));
  });

  return img;
}
