const translations = {};

const STORAGE_KEY = 'gymos_prefs';

function getPrefs() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch { return {}; }
}

export function getLang() {
  return getPrefs().lang || 'en';
}

export function setLang(lang) {
  const prefs = getPrefs();
  prefs.lang = lang;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

export function t(key) {
  const keys = key.split('.');
  let val = translations;
  for (const k of keys) {
    val = val?.[k];
  }
  return val || key;
}
