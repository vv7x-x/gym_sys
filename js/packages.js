import { supabase } from './supabase.js';
import { showToast } from './utils.js';
import { getLang, t } from './i18n.js';

export async function loadPackages() {
    const { data, error } = await supabase.from('packages').select('*').order('duration_days');
    if (error) { return []; }
    return data;
}

export async function savePackage(pkg) {
    if (pkg.id) {
        const { error } = await supabase.from('packages').update(pkg).eq('id', pkg.id);
        if (error) { showToast(error.message, 'error'); return false; }
        showToast(t('packages.saved'), 'success');
        return true;
    } else {
        const { error } = await supabase.from('packages').insert(pkg);
        if (error) { showToast(error.message, 'error'); return false; }
        showToast(t('packages.saved'), 'success');
        return true;
    }
}

export async function deletePackage(id) {
    const { error } = await supabase.from('packages').delete().eq('id', id);
    if (error) { showToast(error.message, 'error'); return false; }
    showToast(t('packages.deleted'), 'success');
    return true;
}

export function renderPackageTable(packages, tbodyId) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    const lang = getLang();
    if (!packages.length) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-muted text-center">${t('packages.noPackages') || 'No packages yet'}</td></tr>`;
        return;
    }
    tbody.innerHTML = packages.map(p => `
        <tr>
            <td>${p.name}</td>
            <td>${p.duration_days} ${lang === 'ar' ? 'يوم' : 'days'}</td>
            <td>${Number(p.price).toFixed(2)} ج.م</td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-ghost edit-pkg-btn" data-id="${p.id}" data-name="${p.name}" data-days="${p.duration_days}" data-price="${p.price}"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger delete-pkg-btn" data-id="${p.id}" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}
