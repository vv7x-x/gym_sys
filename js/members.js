import { supabase } from './supabase.js';
import { getStatus, formatDate, calculateDaysRemaining, deletePhoto, getMemberPhotoUrl, generateShortCode, showToast } from './utils.js';
import { t } from './i18n.js';

let allMembers = [];

export async function loadMembers() {
    const { data, error } = await supabase.from('members').select('*').order('created_at', { ascending: false });
    if (error) { return []; }
    allMembers = data || [];
    return allMembers;
}

export async function generateUniqueCode() {
    for (let i = 0; i < 20; i++) {
        const code = generateShortCode();
        const { data } = await supabase.from('members').select('id').eq('code', code).maybeSingle();
        if (!data) return code;
    }
    return String(Date.now()).slice(-6);
}

export function renderMembers(members) {
    const container = document.getElementById('membersContainer');
    if (!container) return;

    if (!members || members.length === 0) {
        container.innerHTML = `<div class="empty-state"><div class="empty-state-fig"><i class="fas fa-users"></i></div><h3>${t('members.noMembers')}</h3><p>${t('members.noMembersDesc')}</p></div>`;
        return;
    }

    container.innerHTML = members.map((m, i) => {
        const status = getStatus(m.end_date);
        const days = calculateDaysRemaining(m.end_date);
        const photo = getMemberPhotoUrl(m.photo_url);
        const initials = m.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        const isActive = status === 'Active';
        const statusLabel = isActive ? t('common.active') : t('common.expired');
        const daysLabel = isActive ? `${days} ${days === 1 ? t('common.day') : t('common.days')}` : t('common.expired');

        return `
        <div class="member-card" style="animation-delay:${i * 0.05}s">
            <div class="member-card-header">
                <img src="${photo}" alt="${m.full_name}" onerror="this.src='https://ui-avatars.com/api/?name=${initials}&background=1e3a5f&color=fff&size=80'">
                <div class="member-card-info">
                    <h3>${m.full_name} <span class="member-code">#${m.code}</span></h3>
                    <span>${m.phone}</span>
                </div>
                <span class="badge badge-${status.toLowerCase()}">${statusLabel}</span>
            </div>
            <div class="member-card-body">
                <div class="member-detail"><span>${t('members.age')}</span><span>${m.age}</span></div>
                <div class="member-detail"><span>${t('members.weight')}</span><span>${m.weight} kg</span></div>
                ${m.height ? `<div class="member-detail"><span>${t('members.height')}</span><span>${m.height} cm</span></div>` : ''}
                <div class="member-detail"><span>${t('members.plan')}</span><span class="plan-badge">${m.plan}</span></div>
                <div class="member-detail"><span>${t('members.endDate')}</span><span>${formatDate(m.end_date)}</span></div>
                <div class="member-detail"><span>${t('members.daysLeft')}</span><span class="${isActive ? 'text-success' : 'text-danger'}">${daysLabel}</span></div>
            </div>
            <div class="member-card-actions">
                <button class="btn btn-sm btn-ghost view-member" data-id="${m.id}"><i class="fas fa-eye"></i> ${t('members.view')}</button>
                <button class="btn btn-sm btn-ghost edit-member" data-id="${m.id}"><i class="fas fa-edit"></i> ${t('members.edit')}</button>
                <button class="btn btn-sm btn-danger delete-member" data-id="${m.id}"><i class="fas fa-trash"></i> ${t('members.delete')}</button>
            </div>
        </div>`;
    }).join('');

    attachMemberEvents();
}

function attachMemberEvents() {
    document.querySelectorAll('.view-member').forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = `member.html?id=${btn.dataset.id}`;
        });
    });

    document.querySelectorAll('.edit-member').forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = `edit-member.html?id=${btn.dataset.id}`;
        });
    });

    document.querySelectorAll('.delete-member').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (!confirm(t('members.confirmDelete'))) return;
            const id = btn.dataset.id;
            const member = allMembers.find(m => m.id === id);
            if (member?.photo_url) {
                try { await deletePhoto(member.photo_url); } catch (e) {}
            }
            const { error } = await supabase.from('members').delete().eq('id', id);
            if (error) { showToast(t('members.deleteError'), 'error'); return; }
            await loadMembers();
            applyFilters();
        });
    });
}

export function applyFilters() {
    const search = (document.getElementById('searchInput')?.value || '').toLowerCase();
    const statusFilter = document.getElementById('statusFilter')?.value || 'all';
    const planFilter = document.getElementById('planFilter')?.value || 'all';

    let filtered = [...allMembers];

    if (search) {
        filtered = filtered.filter(m =>
            m.full_name.toLowerCase().includes(search) ||
            m.phone.includes(search) ||
            (m.code && m.code.includes(search))
        );
    }

    if (statusFilter !== 'all') {
        filtered = filtered.filter(m => getStatus(m.end_date).toLowerCase() === statusFilter);
    }

    if (planFilter !== 'all') {
        filtered = filtered.filter(m => m.plan === planFilter);
    }

    renderMembers(filtered);
}
