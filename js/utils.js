import { supabase } from './supabase.js';
import { STORAGE_BUCKET } from './config.js';

export function formatDate(dateStr, lang) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  const l = lang || getUILang();
  return d.toLocaleDateString(l === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateISO(date) {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

export function formatCurrency(amount, currency = 'EGP') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount || 0);
}

const STORAGE_KEY = 'gymos_prefs';
function getUILang() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY))?.lang || 'en'; }
  catch { return 'en'; }
}

export function calculateEndDate(startDate, durationDays) {
  const d = new Date(startDate);
  d.setDate(d.getDate() + durationDays);
  return d.toISOString().split('T')[0];
}

export function calculateDaysRemaining(endDate) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
}

export function getSubscriptionStatus(endDate) {
  const days = calculateDaysRemaining(endDate);
  if (days <= 0) return 'expired';
  if (days <= 7) return 'expiring_soon';
  return 'active';
}

export function getStatusLabel(status) {
  const labels = { active: 'Active', expiring_soon: 'Expiring Soon', expired: 'Expired' };
  return labels[status] || status;
}

export function getStatusBadgeClass(status) {
  const classes = { active: 'badge-active', expiring_soon: 'badge-expiring', expired: 'badge-expired' };
  return classes[status] || 'badge-info';
}

export function generateMemberId() {
  const prefix = 'GYM';
  const num = String(Math.floor(100000 + Math.random() * 900000));
  return `${prefix}${num}`;
}

export function getMemberPhotoUrl(url) {
  return url || `https://ui-avatars.com/api/?name=U&background=1e3a5f&color=fff&size=200`;
}

export function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export async function uploadPhoto(file) {
  const ext = file.name.split('.').pop();
  const path = `photos/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file);
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return publicUrl;
}

export async function deletePhoto(url) {
  if (!url) return;
  const parts = url.split('/');
  const path = parts.slice(parts.indexOf(STORAGE_BUCKET) + 1).join('/');
  if (path) {
    await supabase.storage.from(STORAGE_BUCKET).remove([path]);
  }
}

export function getPhotoFile(event) {
  const file = event.target.files[0];
  if (!file) return null;
  if (file.size > 5 * 1024 * 1024) {
    showToast('Photo must be less than 5MB', 'error');
    return null;
  }
  return file;
}

export function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) {
    const c = document.createElement('div');
    c.id = 'toastContainer';
    c.className = 'toast-container';
    document.body.appendChild(c);
    showToast(message, type);
    return;
  }
  const icons = { success: 'bi-check-circle', error: 'bi-exclamation-circle', warning: 'bi-exclamation-triangle', info: 'bi-info-circle' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="bi ${icons[type] || icons.info}"></i> ${message}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast-removing');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

export function showLoading(btn, text) {
  const original = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner-border spinner-border-sm"></span> ${text || 'Loading...'}`;
  return original;
}

export function hideLoading(btn, originalHtml) {
  btn.disabled = false;
  if (originalHtml) btn.innerHTML = originalHtml;
}

export function showConfirm(title, message, type = 'danger') {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay open';
    overlay.innerHTML = `
      <div class="modal modal-sm">
        <div class="modal-body">
          <div class="confirm-dialog ${type}">
            <i class="bi ${type === 'danger' ? 'bi-exclamation-triangle' : 'bi-question-circle'}"></i>
            <h3>${title}</h3>
            <p>${message}</p>
            <div class="confirm-actions">
              <button class="btn btn-ghost" id="confirmCancel">Cancel</button>
              <button class="btn ${type === 'danger' ? 'btn-danger' : 'btn-primary'}" id="confirmOk">Confirm</button>
            </div>
          </div>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('#confirmCancel').onclick = () => { overlay.remove(); resolve(false); };
    overlay.querySelector('#confirmOk').onclick = () => { overlay.remove(); resolve(true); };
    overlay.onclick = (e) => { if (e.target === overlay) { overlay.remove(); resolve(false); } };
  });
}

export function showModal(title, contentHtml, options = {}) {
  const { onClose } = options;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.innerHTML = `
    <div class="modal ${options.large ? 'modal-lg' : ''}">
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="modal-close" id="modalCloseBtn">&times;</button>
      </div>
      <div class="modal-body">${contentHtml}</div>
    </div>`;
  document.body.appendChild(overlay);
  const close = () => { overlay.remove(); if (onClose) onClose(); };
  overlay.querySelector('#modalCloseBtn').onclick = close;
  overlay.onclick = (e) => { if (e.target === overlay) close(); };
  return { overlay, close };
}

export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
