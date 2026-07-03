import { supabase } from './supabase.js';
import { getStatus, formatDate, calculateDaysRemaining, generateQR, downloadQR, printQR, getMemberPhotoUrl } from './utils.js';
import { t, getLang } from './i18n.js';
import { getAttendanceByMember } from './attendance.js';

export async function loadMember(idOrCode) {
    const { data, error } = await supabase.from('members').select('*').eq('id', idOrCode).maybeSingle();
    if (error) throw error;
    if (data) return data;

    try {
        const { data: d2 } = await supabase.from('members').select('*').eq('code', idOrCode).maybeSingle();
        return d2 || null;
    } catch (e) {
        return null;
    }
}

export function renderMemberProfile(member) {
    document.title = `${member.full_name} - ${t('app.name')}`;
    const codeEl = document.getElementById('profileCode');
    if (codeEl) codeEl.textContent = member.code ? `#${member.code}` : '---';
    document.getElementById('profileAge').textContent = `${member.age} ${t('memberProfile.years')}`;
    document.getElementById('profilePhone').textContent = member.phone;
    document.getElementById('profileWeight').textContent = `${member.weight} ${t('memberProfile.kg')}`;
    document.getElementById('profileHeight').textContent = member.height ? `${member.height} ${t('memberProfile.cm')}` : '-';
    document.getElementById('profileGender').textContent = member.gender === 'Male' ? t('addMember.male') : t('addMember.female');
    document.getElementById('profilePlan').textContent = member.plan;
    document.getElementById('profileStartDate').textContent = formatDate(member.start_date);
    document.getElementById('profileEndDate').textContent = formatDate(member.end_date);

    const days = calculateDaysRemaining(member.end_date);
    const status = getStatus(member.end_date);
    const daysText = status === 'Expired'
        ? t('common.expired')
        : `${days} ${days === 1 ? t('common.day') : t('common.days')}`;
    document.getElementById('profileDaysLeft').textContent = daysText;
    document.getElementById('profileDaysLeft').className = status === 'Expired' ? 'text-danger' : 'text-success';

    const badge = document.getElementById('profileStatus');
    badge.textContent = status === 'Active' ? t('common.active') : t('common.expired');
    badge.className = `badge badge-lg badge-${status.toLowerCase()}`;

    const planBadge = document.getElementById('profilePlanBadge');
    planBadge.textContent = member.plan;

    const photo = getMemberPhotoUrl(member.photo_url);
    const img = document.getElementById('profilePhoto');
    img.src = photo;
    img.alt = member.full_name;

    const initials = member.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    img.onerror = function () {
        this.style.display = 'none';
        document.getElementById('profilePhotoFallback').textContent = initials;
    };
    img.onload = function () {
        document.getElementById('profilePhotoFallback').style.display = 'none';
        this.style.display = 'block';
    };

    const qrContainer = document.getElementById('profileQR');
    const qrData = member.code || member.id;
    generateQR(qrContainer, qrData, 220);

    const editBtn = document.getElementById('editMemberBtn');
    if (editBtn) editBtn.href = `edit-member.html?id=${member.id}`;

    const downloadBtn = document.getElementById('downloadQRBtn');
    if (downloadBtn) {
        downloadBtn.onclick = () => {
            const canvas = qrContainer.querySelector('canvas');
            if (canvas) downloadQR(canvas, `QR-${member.full_name}.png`);
        };
    }

    const printBtn = document.getElementById('printQRBtn');
    if (printBtn) {
        printBtn.onclick = () => {
            const canvas = qrContainer.querySelector('canvas');
            if (canvas) printQR(canvas);
        };
    }

    const historySection = document.getElementById('attendanceHistorySection');
    if (historySection) historySection.style.display = member.code ? 'block' : 'none';
    if (member.code) loadAttendanceHistory(member.id);
}

async function loadAttendanceHistory(memberId) {
    const container = document.getElementById('attendanceHistory');
    if (!container) return;

    const records = await getAttendanceByMember(memberId, 30);
    if (!records.length) {
        container.innerHTML = `<p class="text-muted text-center">${t('memberProfile.noAttendance')}</p>`;
        return;
    }

    document.getElementById('attendanceCount').textContent = records.length;
    container.innerHTML = records.map(r => {
        const d = new Date(r.check_in_date + 'T' + r.check_in_time);
        const dateStr = d.toLocaleDateString(getLang() === 'ar' ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        const timeStr = r.check_in_time?.slice(0, 5) || '--:--';
        return `<div class="attendance-row"><span>${dateStr}</span><span>${timeStr}</span></div>`;
    }).join('');
}
