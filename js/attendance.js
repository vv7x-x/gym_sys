import { supabase } from './supabase.js';
import { getLang, t } from './i18n.js';

export async function checkIn(code) {
    const { data: member, error: memberErr } = await supabase
        .from('members')
        .select('id, full_name, code, status')
        .eq('code', code)
        .single();
    if (memberErr || !member) {
        return { success: false, msg: t('attendance.memberNotFound') || 'Member not found' };
    }
    if (member.status !== 'Active') {
        return { success: false, msg: t('attendance.inactive') || 'Member is not active' };
    }
    const today = new Date().toISOString().split('T')[0];
    const { data: existing } = await supabase
        .from('attendance')
        .select('id')
        .eq('member_id', member.id)
        .eq('check_in_date', today)
        .maybeSingle();
    if (existing) {
        return { success: false, msg: `${member.full_name} — ${t('attendance.checkedInToday') || 'already checked in today'}` };
    }
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const { error: insertErr } = await supabase.from('attendance').insert({
        member_id: member.id,
        check_in_date: today,
        check_in_time: timeStr,
    });
    if (insertErr) {
        return { success: false, msg: insertErr.message };
    }
    return { success: true, msg: `${member.full_name} — ${t('attendance.success') || 'Checked in successfully'}` };
}

export async function getTodayAttendance() {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
        .from('attendance')
        .select('*, members(full_name, code, photo_url)')
        .eq('check_in_date', today)
        .order('check_in_time', { ascending: false });
    if (error) { return []; }
    return data;
}

export async function getAttendanceByMember(memberId, limit = 30) {
    const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('member_id', memberId)
        .order('check_in_date', { ascending: false })
        .limit(limit);
    if (error) { return []; }
    return data;
}

export async function getAttendanceCountToday() {
    const today = new Date().toISOString().split('T')[0];
    const { count, error } = await supabase
        .from('attendance')
        .select('id', { count: 'exact', head: true })
        .eq('check_in_date', today);
    if (error) return 0;
    return count || 0;
}
