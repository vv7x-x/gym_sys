import { getTheme, setTheme, toggleTheme as toggle, getLang, setLang, toggleLang as toggleL, t } from './i18n.js';

export function initThemeUI() {
    const themeBtn = document.getElementById('themeToggle');
    const langBtn = document.getElementById('langToggle');

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            toggle();
            updateThemeIcon(themeBtn);
        });
        updateThemeIcon(themeBtn);
    }

    if (langBtn) {
        langBtn.addEventListener('click', () => {
            toggleL();
            updateLangBtn(langBtn);
        });
        updateLangBtn(langBtn);
    }
}

function updateThemeIcon(btn) {
    const theme = getTheme();
    btn.innerHTML = theme === 'dark'
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
    btn.title = t('theme.toggle');
}

function updateLangBtn(btn) {
    if (btn) btn.textContent = t('langToggle');
}

export function applySavedTheme() {
    const theme = getTheme();
    document.documentElement.setAttribute('data-theme', theme);
    const lang = getLang();
    document.documentElement.lang = lang === 'ar' ? 'ar' : 'en';
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
}

const navItems = [
    { id: 'dashboard', icon: 'fa-chart-pie', key: 'nav.dashboard', href: 'dashboard.html' },
    { id: 'members', icon: 'fa-users', key: 'nav.members', href: 'members.html' },
    { id: 'addMember', icon: 'fa-user-plus', key: 'nav.addMember', href: 'add-member.html' },
    { id: 'attendance', icon: 'fa-clipboard-check', key: 'nav.attendance', href: 'attendance.html' },
    { id: 'packages', icon: 'fa-box', key: 'nav.packages', href: 'packages.html' },
    { id: 'scanQR', icon: 'fa-qrcode', key: 'nav.scanQR', href: 'scan.html' },
];

export function renderNavigation(activeId) {
    const nav = document.getElementById('sidebarNav');
    if (!nav) return;
    nav.innerHTML = navItems.map(item => `
        <a href="${item.href}" class="${item.id === activeId ? 'active' : ''}" data-i18n="${item.key}">
            <i class="fas ${item.icon}"></i> <span>${t(item.key)}</span>
        </a>
    `).join('');

    const footer = document.getElementById('sidebarFooter');
    if (footer && !footer.hasChildNodes()) {
        footer.innerHTML = `
            <div class="sidebar-footer-actions">
                <button class="btn-icon" id="themeToggle" title="${t('theme.toggle')}"><i class="fas ${getTheme() === 'dark' ? 'fa-sun' : 'fa-moon'}"></i></button>
                <button class="btn-icon" id="langToggle" title="${t('langToggle')}">${t('langToggle').slice(0, 2)}</button>
                <button class="btn-icon" id="logoutBtn" title="${t('nav.signOut')}"><i class="fas fa-sign-out-alt"></i></button>
            </div>
        `;
        document.getElementById('logoutBtn')?.addEventListener('click', async () => {
            const { signOut } = await import('./auth.js');
            await signOut();
            window.location.href = 'login.html';
        });
    }
}
