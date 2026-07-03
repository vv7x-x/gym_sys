import { signOut } from './auth.js';

const STORAGE_KEY = 'gymos_prefs';

function getPrefs() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch { return {}; }
}

function savePrefs(prefs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

export function getTheme() {
  return getPrefs().theme || 'dark';
}

export function setTheme(theme) {
  const prefs = getPrefs();
  prefs.theme = theme;
  savePrefs(prefs);
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeIcons();
}

export function toggleTheme() {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

function updateThemeIcons() {
  const theme = getTheme();
  document.querySelectorAll('.theme-toggle-icon').forEach(el => {
    el.className = `bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon'} theme-toggle-icon`;
  });
}

export function initTheme() {
  const theme = getTheme();
  document.documentElement.setAttribute('data-theme', theme);
}

export function initMobileToggle() {
  const toggle = document.getElementById('mobileToggle');
  const sidebar = document.getElementById('sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      let overlay = document.querySelector('.sidebar-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.onclick = () => sidebar.classList.remove('open');
        document.body.appendChild(overlay);
      }
      overlay.classList.toggle('open');
    });
  }
}

export function initLogout() {
  const btn = document.getElementById('logoutBtn');
  if (btn) {
    btn.addEventListener('click', async () => {
      try {
        await signOut();
        window.location.href = 'login.html';
      } catch (e) {
        window.location.href = 'login.html';
      }
    });
  }
}

export function initThemeToggle() {
  const btns = document.querySelectorAll('.theme-toggle-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });
  updateThemeIcons();
}

export function renderSidebar(activePage) {
  const nav = document.getElementById('sidebarNav');
  if (!nav) return;

  const sections = [
    { label: 'Main Menu' },
    { id: 'dashboard', icon: 'bi-grid-1x2', label: 'Dashboard', href: 'dashboard.html' },
    { id: 'members', icon: 'bi-people', label: 'Members', href: 'members.html' },
    { id: 'plans', icon: 'bi-boxes', label: 'Plans', href: 'plans.html' },
    { id: 'services', icon: 'bi-gear', label: 'Services', href: 'services.html' },
    { label: 'Finance' },
    { id: 'revenue', icon: 'bi-currency-dollar', label: 'Revenue', href: 'revenue.html' },
    { id: 'reports', icon: 'bi-file-earmark-bar-graph', label: 'Reports', href: 'reports.html' },
    { label: 'System' },
    { id: 'settings', icon: 'bi-sliders', label: 'Settings', href: 'settings.html' },
  ];

  nav.innerHTML = sections.map(s => {
    if (s.label && !s.id) {
      return `<div class="nav-label">${s.label}</div>`;
    }
    const active = s.id === activePage ? 'active' : '';
    return `<a href="${s.href}" class="${active}"><i class="bi ${s.icon}"></i> ${s.label}</a>`;
  }).join('');

  initMobileToggle();
  initLogout();
  initThemeToggle();
}

export function initTopbar(pageTitle) {
  const left = document.querySelector('.topbar-left h2');
  if (left) left.textContent = pageTitle;
  const right = document.querySelector('.topbar-right');
  if (right && !right.hasChildNodes()) {
    right.innerHTML = `
      <button class="btn btn-ghost btn-icon theme-toggle-btn" title="Toggle theme">
        <i class="bi ${getTheme() === 'dark' ? 'bi-sun' : 'bi-moon'} theme-toggle-icon"></i>
      </button>
      <button class="btn btn-ghost btn-icon" id="logoutBtn" title="Sign Out">
        <i class="bi bi-box-arrow-right"></i>
      </button>`;
    initThemeToggle();
    initLogout();
  }
}

export function pageTransition() {
  document.querySelectorAll('.page-content > *').forEach((el, i) => {
    el.style.animation = `fadeUp 0.5s ease ${i * 0.05}s both`;
  });
}

export function skeletonLoader(container, count = 3, type = 'card') {
  if (!container) return;
  if (type === 'card') {
    container.innerHTML = Array(count).fill(`
      <div class="member-card">
        <div class="member-card-top">
          <div class="skeleton skeleton-avatar"></div>
          <div class="member-card-info">
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text"></div>
          </div>
        </div>
        <div class="member-card-body">
          ${Array(3).fill('<div class="skeleton skeleton-text" style="width:70%"></div>').join('')}
        </div>
      </div>`).join('');
  } else if (type === 'table') {
    container.innerHTML = `
      <div class="table-container">
        <div class="table-wrapper">
          <table class="table">
            <thead><tr>${Array(6).fill('<th><div class="skeleton skeleton-text"></div></th>').join('')}</tr></thead>
            <tbody>${Array(count).fill(`<tr>${Array(6).fill('<td><div class="skeleton skeleton-text"></div></td>').join('')}</tr>`).join('')}</tbody>
          </table>
        </div>
      </div>`;
  } else if (type === 'stat') {
    container.innerHTML = Array(count).fill('<div class="stat-card"><div class="stat-icon skeleton" style="width:48px;height:48px;border-radius:12px"></div><div class="stat-info"><div class="skeleton skeleton-title" style="width:50%"></div><div class="skeleton skeleton-text" style="width:30%"></div></div></div>').join('');
  }
}
