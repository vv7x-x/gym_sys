const STORAGE_KEY = 'gymos_prefs';

const translations = {
  en: {
    nav: { dashboard: 'Dashboard', members: 'Members', revenue: 'Revenue', plans: 'Plans', services: 'Services', reports: 'Reports', settings: 'Settings', scan: 'Scan QR', logout: 'Sign Out', lang: 'العربية' },
    common: { save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', confirm: 'Confirm', loading: 'Loading...', noData: 'No data', search: 'Search...', filter: 'Filter', export: 'Export', actions: 'Actions', back: 'Back', view: 'View', close: 'Close' },
    dashboard: { title: 'Dashboard', subtitle: 'Your gym at a glance', totalMembers: 'Total Members', activeSubs: 'Active Subscriptions', expiringSoon: 'Expiring Soon', expired: 'Expired', todayRevenue: "Today's Revenue", thisMonth: 'This Month', totalRevenue: 'Total Revenue', activeRate: 'Active Rate', recentMembers: 'Recent Members', recentActivity: 'Recent Activity', noMembers: 'No members yet', noExpiring: 'No members expiring soon', noActivity: 'No recent activity', monthlyRevenue: 'Monthly Revenue', membershipDist: 'Membership Distribution', addMember: 'Add Member', viewMembers: 'View Members' },
    members: { title: 'Members', subtitle: 'Manage your gym members', add: 'Add Member', searchPlaceholder: 'Search by name, ID, or phone...', all: 'All Status', noFound: 'No members found', trySearch: 'Try a different search term.', addFirst: 'Add your first member to get started.', phone: 'Phone', age: 'Age', plan: 'Plan', endDate: 'End Date', daysLeft: 'days left', deleteConfirm: 'Delete Member', deleteMsg: 'Are you sure you want to delete this member? This action cannot be undone.' },
    member: { title: 'Member Profile', notFound: 'Member not found', noId: 'No member ID provided', memberSince: 'Member Since', subscription: 'Subscription', startDate: 'Start Date', planPrice: 'Plan Price', services: 'Services', totalPaid: 'Total Paid', extraServices: 'Extra Services', paymentHistory: 'Payment History', date: 'Date', amount: 'Amount', type: 'Type', method: 'Method', notes: 'Notes', noPlan: 'No Plan', edit: 'Edit Member', renew: 'Renew Subscription', back: 'Back to Members' },
    revenue: { title: 'Revenue', subtitle: "Track your gym's financial performance", today: "Today's Revenue", week: 'This Week', month: 'This Month', year: 'This Year', total: 'Total Revenue', revenueOverTime: 'Revenue Over Time', revenueByPlan: 'Revenue by Plan', recentTransactions: 'Recent Transactions', noData: 'No transactions yet' },
    plans: { title: 'Plans', add: 'Add Plan', noPlans: 'No plans yet', createFirst: 'Create your first membership plan.', name: 'Plan Name', duration: 'Duration (days)', price: 'Price', description: 'Description', color: 'Color', edit: 'Edit Plan', deleteConfirm: 'Delete Plan', deleteMsg: 'Are you sure? Members assigned to this plan will not be affected.', create: 'Create Plan', update: 'Update Plan' },
    services: { title: 'Services', add: 'Add Service', noServices: 'No services yet', createFirst: 'Create extra services like Personal Trainer, Locker, etc.', name: 'Service Name', price: 'Price', description: 'Description', edit: 'Edit Service', deleteConfirm: 'Delete Service', deleteMsg: 'Are you sure?', create: 'Create Service', update: 'Update Service' },
    reports: { title: 'Reports', subtitle: 'Generate and export reports', members: 'Members Report', revenue: 'Revenue Report', subscriptions: 'Subscriptions Report', expiring: 'Expiring Members', noData: 'No data to export', openFirst: 'Open a report first', exportCSV: 'Export CSV', exportExcel: 'Export Excel', exportPDF: 'Export PDF' },
    settings: { title: 'Settings', subtitle: 'Manage your gym settings', general: 'General Settings', gymName: 'Gym Name', currency: 'Currency', phone: 'Phone', address: 'Address', save: 'Save Settings', saved: 'Settings saved successfully', appearance: 'Appearance', theme: 'Theme', dark: 'Dark', light: 'Light', account: 'Account', signOut: 'Sign Out' },
    scan: { title: 'Scan QR', subtitle: 'Scan member QR code to view profile', scanning: 'Scanning...', notFound: 'Member not found. Try again.', cameraDenied: 'Camera access denied or not available.', stop: 'Stop Scan', found: 'Found! Redirecting...' },
    addMember: { title: 'Add Member', subtitle: 'Register a new member', name: 'Full Name', age: 'Age', phone: 'Phone', gender: 'Gender', male: 'Male', female: 'Female', weight: 'Weight (kg)', height: 'Height (cm)', notes: 'Notes', notesPlaceholder: 'Any additional information...', membership: 'Membership Details', plan: 'Membership Plan', selectPlan: 'Select plan...', startDate: 'Start Date', extraServices: 'Extra Services', planPrice: 'Plan Price', servicesTotal: 'Services Total', total: 'Total', photo: 'Member Photo', photoHint: 'Optional. Max 5MB. JPG, PNG, WEBP.', save: 'Save Member', cancel: 'Cancel', saved: 'Member added successfully!' },
    editMember: { title: 'Edit Member', notFound: 'Member not found', noId: 'No member ID provided', updated: 'Member updated successfully!' },
    login: { title: 'Sign In', subtitle: 'Sign in to manage your gym', email: 'Email', password: 'Password', signIn: 'Sign In', signingIn: 'Signing in...', noAccount: "Don't have an account?", signUp: 'Sign Up', divider: 'Or continue with', google: 'Google', error: 'Invalid email or password', welcome: 'Welcome back! Redirecting...' },
    days: 'days',
    day: 'day',
    daysLeft: 'days left',
    left: 'left',
    noPlan: 'No Plan',
  },
  ar: {
    nav: { dashboard: 'لوحة التحكم', members: 'الأعضاء', revenue: 'الإيرادات', plans: 'الباقات', services: 'الخدمات', reports: 'التقارير', settings: 'الإعدادات', scan: 'مسح QR', logout: 'تسجيل الخروج', lang: 'English' },
    common: { save: 'حفظ', cancel: 'إلغاء', delete: 'حذف', edit: 'تعديل', confirm: 'تأكيد', loading: 'جاري التحميل...', noData: 'لا توجد بيانات', search: 'بحث...', filter: 'تصفية', export: 'تصدير', actions: 'إجراءات', back: 'رجوع', view: 'عرض', close: 'إغلاق' },
    dashboard: { title: 'لوحة التحكم', subtitle: 'نظرة سريعة على صالة الألعاب', totalMembers: 'إجمالي الأعضاء', activeSubs: 'اشتراكات نشطة', expiringSoon: 'تنتهي قريباً', expired: 'منتهية', todayRevenue: 'إيرادات اليوم', thisMonth: 'هذا الشهر', totalRevenue: 'إجمالي الإيرادات', activeRate: 'نسبة النشاط', recentMembers: 'آخر الأعضاء', recentActivity: 'آخر النشاطات', noMembers: 'لا يوجد أعضاء بعد', noExpiring: 'لا يوجد أعضاء تنتهي صلاحيتهم قريباً', noActivity: 'لا توجد نشاطات حديثة', monthlyRevenue: 'الإيرادات الشهرية', membershipDist: 'توزيع العضويات', addMember: 'إضافة عضو', viewMembers: 'عرض الأعضاء' },
    members: { title: 'الأعضاء', subtitle: 'إدارة أعضاء الصالة', add: 'إضافة عضو', searchPlaceholder: 'بحث بالاسم أو الرقم أو الهاتف...', all: 'جميع الحالات', noFound: 'لم يتم العثور على أعضاء', trySearch: 'جرب كلمة بحث مختلفة.', addFirst: 'أضف أول عضو للبدء.', phone: 'الهاتف', age: 'العمر', plan: 'الباقة', endDate: 'تاريخ الانتهاء', daysLeft: 'أيام متبقية', deleteConfirm: 'حذف العضو', deleteMsg: 'هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.' },
    member: { title: 'الملف الشخصي', notFound: 'لم يتم العثور على العضو', noId: 'لم يتم توفير معرف العضو', memberSince: 'عضو منذ', subscription: 'الاشتراك', startDate: 'تاريخ البداية', planPrice: 'سعر الباقة', services: 'الخدمات', totalPaid: 'الإجمالي المدفوع', extraServices: 'خدمات إضافية', paymentHistory: 'سجل المدفوعات', date: 'التاريخ', amount: 'المبلغ', type: 'النوع', method: 'طريقة الدفع', notes: 'ملاحظات', noPlan: 'لا توجد باقة', edit: 'تعديل العضو', renew: 'تجديد الاشتراك', back: 'رجوع للأعضاء' },
    revenue: { title: 'الإيرادات', subtitle: 'تتبع الأداء المالي لصالتك', today: 'إيرادات اليوم', week: 'هذا الأسبوع', month: 'هذا الشهر', year: 'هذا العام', total: 'إجمالي الإيرادات', revenueOverTime: 'الإيرادات على مدار الوقت', revenueByPlan: 'الإيرادات حسب الباقة', recentTransactions: 'آخر المعاملات', noData: 'لا توجد معاملات بعد' },
    plans: { title: 'الباقات', add: 'إضافة باقة', noPlans: 'لا توجد باقات بعد', createFirst: 'أنشئ أول باقة اشتراك.', name: 'اسم الباقة', duration: 'المدة (أيام)', price: 'السعر', description: 'الوصف', color: 'اللون', edit: 'تعديل الباقة', deleteConfirm: 'حذف الباقة', deleteMsg: 'هل أنت متأكد؟ الأعضاء المسجلين في هذه الباقة لن يتأثروا.', create: 'إنشاء باقة', update: 'تحديث الباقة' },
    services: { title: 'الخدمات', add: 'إضافة خدمة', noServices: 'لا توجد خدمات بعد', createFirst: 'أنشئ خدمات إضافية مثل مدرب شخصي، خزينة، إلخ.', name: 'اسم الخدمة', price: 'السعر', description: 'الوصف', edit: 'تعديل الخدمة', deleteConfirm: 'حذف الخدمة', deleteMsg: 'هل أنت متأكد؟', create: 'إنشاء خدمة', update: 'تحديث الخدمة' },
    reports: { title: 'التقارير', subtitle: 'إنشاء وتصدير التقارير', members: 'تقرير الأعضاء', revenue: 'تقرير الإيرادات', subscriptions: 'تقرير الاشتراكات', expiring: 'الأعضاء المنتهية صلاحيتهم', noData: 'لا توجد بيانات للتصدير', openFirst: 'افتح تقرير أولاً', exportCSV: 'تصدير CSV', exportExcel: 'تصدير Excel', exportPDF: 'تصدير PDF' },
    settings: { title: 'الإعدادات', subtitle: 'إدارة إعدادات الصالة', general: 'الإعدادات العامة', gymName: 'اسم الصالة', currency: 'العملة', phone: 'الهاتف', address: 'العنوان', save: 'حفظ الإعدادات', saved: 'تم حفظ الإعدادات بنجاح', appearance: 'المظهر', theme: 'السمة', dark: 'داكن', light: 'فاتح', account: 'الحساب', signOut: 'تسجيل الخروج' },
    scan: { title: 'مسح QR', subtitle: 'امسح رمز QR للعضو لعرض الملف الشخصي', scanning: 'جاري المسح...', notFound: 'لم يتم العثور على العضو. حاول مرة أخرى.', cameraDenied: 'تم رفض الوصول إلى الكاميرا أو غير متوفرة.', stop: 'إيقاف المسح', found: 'تم العثور! جاري التوجيه...' },
    addMember: { title: 'إضافة عضو', subtitle: 'تسجيل عضو جديد', name: 'الاسم الكامل', age: 'العمر', phone: 'الهاتف', gender: 'الجنس', male: 'ذكر', female: 'أنثى', weight: 'الوزن (كجم)', height: 'الطول (سم)', notes: 'ملاحظات', notesPlaceholder: 'أي معلومات إضافية...', membership: 'تفاصيل الاشتراك', plan: 'باقة الاشتراك', selectPlan: 'اختر باقة...', startDate: 'تاريخ البداية', extraServices: 'خدمات إضافية', planPrice: 'سعر الباقة', servicesTotal: 'إجمالي الخدمات', total: 'الإجمالي', photo: 'صورة العضو', photoHint: 'اختياري. حد أقصى 5 ميجابايت. JPG, PNG, WEBP.', save: 'حفظ العضو', cancel: 'إلغاء', saved: 'تم إضافة العضو بنجاح!' },
    editMember: { title: 'تعديل العضو', notFound: 'لم يتم العثور على العضو', noId: 'لم يتم توفير معرف العضو', updated: 'تم تحديث العضو بنجاح!' },
    login: { title: 'تسجيل الدخول', subtitle: 'سجل الدخول لإدارة صالتك', email: 'البريد الإلكتروني', password: 'كلمة المرور', signIn: 'تسجيل الدخول', signingIn: 'جاري تسجيل الدخول...', noAccount: 'ليس لديك حساب؟', signUp: 'إنشاء حساب', divider: 'أو تابع بواسطة', google: 'جوجل', error: 'بريد إلكتروني أو كلمة مرور غير صحيحة', welcome: 'مرحباً بعودتك! جاري التوجيه...' },
    days: 'أيام',
    day: 'يوم',
    daysLeft: 'أيام متبقية',
    left: 'متبقي',
    noPlan: 'لا توجد باقة',
  }
};

function getPrefs() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}

export function getLang() {
  return getPrefs().lang || 'en';
}

export function setLang(lang) {
  const prefs = getPrefs();
  prefs.lang = lang;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('data-lang', lang);
}

export function t(key) {
  const lang = getLang();
  const keys = key.split('.');
  let val = translations[lang];
  for (const k of keys) {
    if (!val) return key;
    val = val[k];
  }
  return val || key;
}

export function dir() {
  return getLang() === 'ar' ? 'rtl' : 'ltr';
}

export function applyLang() {
  const lang = getLang();
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('data-lang', lang);
}
