import { el } from '../dom.js';
import { getLanguage, getLanguages, setLanguage } from '../i18n/index.js';

export function languageSwitcher() {
  const langs = getLanguages();
  const wrap = el('div', { class: 'lang-switcher' });
  const cur = getLanguage();

  for (const lang of langs) {
    wrap.appendChild(
      el('button', {
        type: 'button',
        class: `lang-btn ${lang.code === cur ? 'is-active' : ''}`,
        title: lang.label,
        onClick: () => setLanguage(lang.code),
      }, [lang.code.toUpperCase()])
    );
  }

  return wrap;
}
