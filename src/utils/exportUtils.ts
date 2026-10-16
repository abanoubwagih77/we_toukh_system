import { Student, PointLog, Teacher } from '../types';

/**
 * Downloads a CSV file with UTF-8 BOM so Arabic characters open properly in Microsoft Excel.
 */
export function exportToCSV(filename: string, rows: (string | number)[][]): void {
  const processRow = (row: (string | number)[]) => {
    return row
      .map((val) => {
        const str = String(val ?? '');
        // Escape quotes
        const escaped = str.replace(/"/g, '""');
        return `"${escaped}"`;
      })
      .join(',');
  };

  const csvContent = '\uFEFF' + rows.map(processRow).join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports complete student roster with scores, badges, attendance and teachers breakdown.
 */
export function exportStudentsRoster(students: Student[]): void {
  exportComprehensiveStudentReport(students);
}

/**
 * 1. Comprehensive Student Master Report (One row per student)
 * Includes all personal details, grade, major, attendance, points, percentage, and awarding teachers list.
 */
export function exportComprehensiveStudentReport(students: Student[]): void {
  const headers = [
    'م',
    'كود الطالب الأكاديمي',
    'الرقم القومي (14 رقم)',
    'اسم الطالب الرباعي',
    'الصف والفصل الدراسي',
    'التخصص التكنولوجي',
    'رصيد النقاط الحالي',
    'نسبة الإنجاز % (كل 4 نقاط = 1%)',
    'الرتبة والوسام الحالي',
    'نسبة الحضور والالتزام %',
    'المعدل السلوكي',
    'إجمالي النقاط الإيجابية',
    'إجمالي الخصومات والمخالفات',
    'عدد الحركات المسجلة',
    'المعلمون والمهندسون الراصدون للطالب',
    'تفاصيل آخر إجراء تم رصده',
    'المهام السرية المنجزة',
    'البريد الإلكتروني',
    'رقم الهاتف'
  ];

  const badgeLabels: Record<string, string> = {
    leader: 'قائد تكنولوجي (90%+)',
    pro: 'محترف تقني (80-89%)',
    advanced: 'متقدم (60-79%)',
    good: 'جيد ومجتهد (30-59%)',
    novice: 'مبتدئ (0-29%)'
  };

  const data = students.map((s, idx) => {
    // Collect distinct teachers who gave points to this student
    const teacherNames = Array.from(
      new Set((s.logs || []).map((l) => l.teacherName).filter(Boolean))
    );
    const teachersSummary = teacherNames.length > 0 ? teacherNames.join(' | ') : 'لا يوجد راصدين بعد';

    // Last log info
    const lastLog = (s.logs || [])[s.logs.length - 1];
    const lastLogSummary = lastLog
      ? `${lastLog.category} (${lastLog.points > 0 ? `+${lastLog.points}` : lastLog.points}) بواسطة: ${lastLog.teacherName}`
      : 'لا توجد حركات مسجلة';

    return [
      idx + 1,
      s.code,
      `'${s.nationalId}`, // apostrophe prefix ensures Excel treats 14 digits as text
      s.name,
      s.grade,
      s.major,
      s.points,
      `${s.percentage}%`,
      badgeLabels[s.badge] || s.badge,
      `${s.attendanceRate}%`,
      s.behavioralScore,
      s.totalPositive,
      s.totalNegative,
      (s.logs || []).length,
      teachersSummary,
      lastLogSummary,
      s.secretMissionsCompleted,
      s.email,
      s.phone
    ];
  });

  const timestamp = new Date().toISOString().split('T')[0];
  exportToCSV(`كشف_بيانات_شامل_لطلاب_مدرسة_WE_${timestamp}.csv`, [headers, ...data]);
}

/**
 * 2. Full Action & Attribution Master History (One row per action log for every student)
 * Answers exactly: Who got points, what they did, who gave them points, attendance, notes, and full history.
 */
export function exportFullActionHistoryMaster(students: Student[]): void {
  const headers = [
    'م',
    'تاريخ وتوقيت الإجراء',
    'اسم الطالب الرباعي',
    'كود الطالب الأكاديمي',
    'الرقم القومي',
    'الصف والفصل الدراسي',
    'التخصص التكنولوجي',
    'نسبة حضور الطالب %',
    'المعلم / المهندس الراصد',
    'نوع الإجراء',
    'قيمة النقاط',
    'بند التقييم والمشاركة',
    'الملاحظة والتوجيه الإداري',
    'رصيد نقاط الطالب الحالي',
    'نسبة إنجاز الطالب الحالية %'
  ];

  const allRows: (string | number)[][] = [];
  let counter = 1;

  students.forEach((student) => {
    if (!student.logs || student.logs.length === 0) {
      // Still include student with an initial status row so no student is left behind
      allRows.push([
        counter++,
        'تسجيل جديد',
        student.name,
        student.code,
        `'${student.nationalId}`,
        student.grade,
        student.major,
        `${student.attendanceRate}%`,
        'إدارة شؤون الطلاب',
        'رصيد بداية',
        student.points,
        'تسجيل الطالب في المنظومة',
        'لم يتم رصد حركات إضافية بعد',
        student.points,
        `${student.percentage}%`
      ]);
      return;
    }

    student.logs.forEach((log) => {
      allRows.push([
        counter++,
        new Date(log.createdAt).toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        student.name,
        student.code,
        `'${student.nationalId}`,
        student.grade,
        student.major,
        `${student.attendanceRate}%`,
        log.teacherName || 'معلم المادة التكنولوجية',
        log.type === 'positive' ? 'مكافأة إيجابية (+)' : 'مخالفة سلوكية (-)',
        log.points > 0 ? `+${log.points}` : `${log.points}`,
        log.category,
        log.note || 'بدون ملاحظات',
        student.points,
        `${student.percentage}%`
      ]);
    });
  });

  const timestamp = new Date().toISOString().split('T')[0];
  exportToCSV(`السجل_الإداري_التفصيلي_لحركات_طلاب_WE_${timestamp}.csv`, [headers, ...allRows]);
}

/**
 * Exports all points and infractions attribution logs showing student and awarding engineer/teacher.
 */
export function exportAttributionLogs(students: Student[]): void {
  exportFullActionHistoryMaster(students);
}

/**
 * Exports complete application database as a JSON file for backup and migration
 */
export function exportSystemDatabaseJSON(payload: {
  students: Student[];
  teachers: any[];
  missions: any[];
}): void {
  const dataStr = JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      school: 'WE School of Applied Technology',
      ...payload
    },
    null,
    2
  );
  const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const timestamp = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `نسخة_احتياطية_منظومة_WE_${timestamp}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports all teachers and engineers accounts with username, password, subject, open status, and assigned classes (Excel / CSV compatible)
 */
export function exportTeachersAccounts(teachers: Teacher[]): void {
  const headers = [
    'م',
    'اسم المعلم / المهندس',
    'المادة التدريسية',
    'اسم المستخدم (Username)',
    'كلمة المرور الحالية (Password)',
    'حالة فتح واستخدام الحساب',
    'حالة كلمة المرور',
    'تاريخ أول فتح للحساب',
    'تاريخ آخر تسجيل دخول',
    'عدد مرات الدخول',
    'تاريخ تغيير كلمة المرور',
    'الفصول والصفوف المسندة',
    'الصلاحية في المنظومة',
    'التخصص / القسم',
    'رقم الهاتف',
    'البريد الإلكتروني',
    'حالة الحساب',
    'تاريخ الإنشاء'
  ];

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return '-';
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return isoStr;
      return d.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoStr;
    }
  };

  const data = teachers.map((t, idx) => {
    const roleLabel =
      t.role === 'admin'
        ? 'مدير النظام (Admin)'
        : t.role === 'supervisor'
        ? 'مشرف تدريب'
        : 'معلم / مهندس مادة';

    const classesLabel =
      t.role === 'admin'
        ? 'كافة فصول المدرسة (وصول شامل - 18 فصلاً)'
        : t.assignedGrades && t.assignedGrades.length > 0
        ? t.assignedGrades.join(' | ')
        : 'لم تسند فصول بعد';

    // Account Open & Usage Status
    let openStatus = '❌ لم يتم فتحه بعد (حساب جديد)';
    if (t.hasLoggedIn) {
      if (t.passwordChangedAt || !t.mustChangePassword) {
        openStatus = '✅ تم فتحه وتغيير كلمة السر واستخدامه';
      } else {
        openStatus = '⚠️ تم فتحه والدخول به (كلمة المرور مازالت مؤقتة)';
      }
    }

    // Password Status
    const passwordStatus = t.mustChangePassword
      ? 'مؤقتة لمرة واحدة (يلزم تغييرها عند الدخول)'
      : 'خاصة وسرية (تم تعيينها من قِبل المعلم)';

    return [
      idx + 1,
      t.name,
      t.subject || 'غير محدد',
      t.username,
      t.password,
      openStatus,
      passwordStatus,
      formatDate(t.firstLoginAt),
      formatDate(t.lastLoginAt),
      t.loginCount || (t.hasLoggedIn ? 1 : 0),
      formatDate(t.passwordChangedAt),
      classesLabel,
      roleLabel,
      t.majorDepartment || 'عام',
      t.phone || '-',
      t.email || '-',
      t.status === 'suspended' ? 'معطل' : 'نشط',
      t.createdAt || '-'
    ];
  });

  const timestamp = new Date().toISOString().split('T')[0];
  exportToCSV(`كشف_حسابات_معلمي_مدرسة_WE_${timestamp}.csv`, [headers, ...data]);
}

