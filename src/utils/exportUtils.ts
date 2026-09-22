import { Student, PointLog } from '../types';

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
 * Exports complete student roster with scores, badges and contact details.
 */
export function exportStudentsRoster(students: Student[]): void {
  const headers = [
    'كود الطالب',
    'الرقم القومي',
    'اسم الطالب',
    'الصف الدراسي',
    'التخصص التكنولوجي',
    'رصيد النقاط الحالي',
    'إجمالي النقاط الإيجابية',
    'إجمالي المخالفات',
    'نسبة الإنجاز %',
    'الرتبة والبادج',
    'نسبة الحضور %',
    'المعدل السلوكي',
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

  const data = students.map((s) => [
    s.code,
    s.nationalId,
    s.name,
    s.grade,
    s.major,
    s.points,
    s.totalPositive,
    s.totalNegative,
    `${s.percentage}%`,
    badgeLabels[s.badge] || s.badge,
    `${s.attendanceRate}%`,
    s.behavioralScore,
    s.secretMissionsCompleted,
    s.email,
    s.phone
  ]);

  const timestamp = new Date().toISOString().split('T')[0];
  exportToCSV(`كشف_طلاب_مدرسة_WE_${timestamp}.csv`, [headers, ...data]);
}

/**
 * Exports all points and infractions attribution logs showing student and awarding engineer/teacher.
 */
export function exportAttributionLogs(students: Student[]): void {
  const headers = [
    'تاريخ الإجراء',
    'اسم الطالب',
    'كود الطالب',
    'تخصص الطالب',
    'المعلم / المهندس الراصد',
    'نوع الإجراء',
    'قيمة النقاط',
    'بند التقييم',
    'الملاحظة والتوجيه'
  ];

  const allLogs: (string | number)[][] = [];

  students.forEach((student) => {
    student.logs.forEach((log) => {
      allLogs.push([
        new Date(log.createdAt).toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        student.name,
        student.code,
        student.major,
        log.teacherName || 'معلم المادة التكنولوجية',
        log.type === 'positive' ? 'إيجابي (+)' : 'مخالفة (-)',
        log.points > 0 ? `+${log.points}` : `${log.points}`,
        log.category,
        log.note
      ]);
    });
  });

  const timestamp = new Date().toISOString().split('T')[0];
  exportToCSV(`سجل_نقاط_المعلمين_والمهندسين_WE_${timestamp}.csv`, [headers, ...allLogs]);
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

