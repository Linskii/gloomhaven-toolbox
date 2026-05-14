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

// Cache of first-frame snapshots for animated assets — keyed by source URL.
// Returns a Promise<blobURL> so static views can show the still frame
// of an animated webp without playing the animation everywhere.
const stillFrameCache = new Map();

export function getStillFrame(src) {
  if (stillFrameCache.has(src)) return stillFrameCache.get(src);
  const promise = new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 256;
      canvas.height = img.naturalHeight || 256;
      canvas.getContext('2d').drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) resolve(URL.createObjectURL(blob));
        else reject(new Error('toBlob returned null'));
      }, 'image/webp', 0.9);
    };
    img.onerror = () => reject(new Error('still-frame image load failed'));
    img.src = src;
  });
  stillFrameCache.set(src, promise);
  return promise;
}

export function entityImage(entity, { alt = '', className = '', animated = false } = {}) {
  const altText = alt || entity?.name || '';
  if (!entity?.image) {
    const initial = (entity?.name || '?').trim().charAt(0).toUpperCase() || '?';
    return el('div', { class: `entity-placeholder ${className}` }, [initial]);
  }

  const src = assetUrl(entity.image);
  const img = el('img', { alt: altText, class: className });

  if (entity.animated && !animated) {
    // Show first-frame still. Fall back to animated if extraction fails.
    getStillFrame(src).then((url) => { img.src = url; }).catch(() => { img.src = src; });
  } else {
    img.src = src;
  }
  return img;
}
