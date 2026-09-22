import { Student, SecretMission, Teacher } from '../types';

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 't-admin',
    name: 'م. أبانوب وجيه (مدير المنظومة)',
    username: 'admin',
    password: '123',
    subject: 'الإدارة العامة والإشراف التكنولوجي',
    majorDepartment: 'إدارة مدرسة WE للتكنولوجيا التطبيقية',
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" fill="%234A154B"/><text x="50%" y="54%" font-family="Arial,sans-serif" font-size="52" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">أ</text></svg>',
    role: 'admin',
    phone: '',
    email: '',
    status: 'active',
    title: 'مهندس'
  }
];

export const INITIAL_STUDENTS: Student[] = [];

export const INITIAL_MISSIONS: SecretMission[] = [
  {
    id: 'mission-001',
    title: 'تحدي كود الألياف الضوئية: بناء كابل الفايبر الافتراضي',
    description: 'مهمة سرية لطلاب تخصص Telecommunication: محاكاة توصيل مسار فايبر من سنترال WE الرئيسي إلى مدرسة التكنولوجيا وحساب نسبة فقد الإشارة dB.',
    type: 'task',
    target: 'all',
    targetMajor: 'Telecommunication',
    pointsReward: 20,
    badgeReward: 'خبير الفايبر',
    deadline: '2026-09-25',
    secretCode: 'FIBER-WE-99',
    createdAt: '2026-09-10',
    createdBy: 'م. أبانوب وجيه (مدير المنظومة)',
    status: 'active',
    submissions: []
  },
  {
    id: 'mission-002',
    title: 'كويز الثغرات الخفية: اختبار اختراق الويب السري',
    description: 'كويز سريع وسري لقياس فهم الطلاب لثغرات حقن SQL وطرق تأمين قواعد بيانات المدارس الذكية.',
    type: 'quiz',
    target: 'all',
    targetMajor: 'Programming',
    pointsReward: 15,
    badgeReward: 'صياد الثغرات',
    deadline: '2026-09-22',
    secretCode: 'SEC-ZERO-DAY',
    createdAt: '2026-09-12',
    createdBy: 'م. أبانوب وجيه (مدير المنظومة)',
    status: 'active',
    quizQuestions: [
      {
        id: 'q1',
        question: 'ما هو الإجراء الأساسي لحماية المدخلات من هجمات SQL Injection؟',
        options: [
          'استخدام استعلامات معدة مسبقاً (Parameterized Queries)',
          'تغيير منفذ الخادم فقط',
          'إخفاء زر الإرسال',
          'استخدام بروتوكول HTTP عادي'
        ],
        correctIndex: 0
      },
      {
        id: 'q2',
        question: 'ما هو دور شهادة SSL/TLS في تأمين اتصالات شبكة المدرسة؟',
        options: [
          'تسريع تشغيل الألعاب',
          'تشفير البيانات المنقولة بين المتصفح والخادم لمنع التجسس',
          'تنظيف كابلات الشبكة',
          'زيادة سعة القرص الصلب'
        ],
        correctIndex: 1
      },
      {
        id: 'q3',
        question: 'ما هي ثغرة XSS المشهورة في تطبيقات الويب؟',
        options: [
          'انقطاع التيار الكهربائي',
          'حقن نصوص برمجية خبيثة (Cross-Site Scripting) في المتصفح',
          'امتلاء ذاكرة الوصول العشوائي RAM',
          'عطل في مروحة المعالج'
        ],
        correctIndex: 1
      }
    ],
    submissions: []
  }
];

export const SCHOOL_INFO = {
  name: 'مدرسة WE للتطبيقات التكنولوجية',
  subTitle: 'وزارة التربية والتعليم والتعليم الفني بالتعاون مع المصرية للاتصالات Telecom Egypt',
  academicYear: 'العام الدراسي 2025 - 2026',
  branches: ['طوخ', 'مدينة نصر', 'الشيخ زايد', 'الإسكندرية', 'المنيا', 'السويس', 'الدقهلية'],
  grades: [
    // الصف الأول
    'الصف الأول - A1',
    'الصف الأول - A2',
    'الصف الأول - A3',
    'الصف الأول - A4',
    'الصف الأول - A5',
    'الصف الأول - A6',
    // الصف الثاني
    'الصف الثاني - B1',
    'الصف الثاني - B2',
    'الصف الثاني - B3',
    'الصف الثاني - B4',
    'الصف الثاني - B5',
    'الصف الثاني - B6',
    // الصف الثالث
    'الصف الثالث - C1',
    'الصف الثالث - C2',
    'الصف الثالث - C3',
    'الصف الثالث - C4',
    'الصف الثالث - C5',
    'الصف الثالث - C6'
  ],
  majors: [
    'Network',
    'Programming',
    'Telecommunication',
    'AI',
    'Digital Art'
  ]
};
