import { supabase } from './supabase.js';
import { getStatus, calculateDaysRemaining, formatDate } from './utils.js';
import { t } from './i18n.js';

export async function loadDashboardStats() {
    const { data: members, error } = await supabase.from('members').select('*');
    if (error) { return; }

    const total = members.length;
    const active = members.filter(m => getStatus(m.end_date) === 'Active').length;
    const expired = members.filter(m => getStatus(m.end_date) === 'Expired').length;

    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const addedThisMonth = members.filter(m => {
        const d = new Date(m.created_at);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;

    animateNumber('statTotal', total);
    animateNumber('statActive', active);
    animateNumber('statExpired', expired);
    animateNumber('statNewMonth', addedThisMonth);

    showRecentMembers(members);
    showExpiringSoon(members);
}

function animateNumber(elementId, target) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const duration = 800;
    const start = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(0 + (target - 0) * eased);
        el.textContent = current;
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

function showRecentMembers(members) {
    const container = document.getElementById('recentMembers');
    if (!container) return;
    const sorted = [...members].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
    if (sorted.length === 0) {
        container.innerHTML = `<p class="text-muted">${t('dashboard.noMembers')}</p>`;
        return;
    }
    container.innerHTML = sorted.map((m, i) => {
        const status = getStatus(m.end_date);
        const statusLabel = status === 'Active' ? t('common.active') : t('common.expired');
        return `
        <div class="recent-member" style="animation: fadeIn 0.4s ease ${i * 0.08}s both;">
            <img src="${m.photo_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(m.full_name) + '&background=1e3a5f&color=fff&size=40'}" alt="${m.full_name}">
            <div>
                <strong>${m.full_name}</strong>
                <small>${formatDate(m.created_at)}</small>
            </div>
            <span class="badge badge-${status.toLowerCase()}">${statusLabel}</span>
        </div>`;
    }).join('');
}

function showExpiringSoon(members) {
    const container = document.getElementById('expiringSoon');
    if (!container) return;
    const expiring = members
        .filter(m => {
            const days = calculateDaysRemaining(m.end_date);
            return days >= 0 && days <= 7;
        })
        .sort((a, b) => calculateDaysRemaining(a.end_date) - calculateDaysRemaining(b.end_date))
        .slice(0, 5);
    if (expiring.length === 0) {
        container.innerHTML = `<p class="text-muted">${t('dashboard.noExpiring')}</p>`;
        return;
    }
    container.innerHTML = expiring.map((m, i) => {
        const days = calculateDaysRemaining(m.end_date);
        const label = days === 1 ? t('dashboard.days_left') : t('dashboard.days_left_plural');
        return `
        <div class="recent-member" style="animation: fadeIn 0.4s ease ${i * 0.08}s both;">
            <img src="${m.photo_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(m.full_name) + '&background=1e3a5f&color=fff&size=40'}" alt="${m.full_name}">
            <div>
                <strong>${m.full_name}</strong>
                <small>${days} ${label}</small>
            </div>
            <span class="badge badge-warning">${days}d</span>
        </div>`;
    }).join('');
}
