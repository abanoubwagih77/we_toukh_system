import { Student, SecretMission, Teacher } from '../types';

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 't-admin',
    name: 'م. بهاء وجيه (مدير المنظومة والأدمن)',
    username: 'admin',
    password: '123',
    subject: 'الإدارة العامة والإشراف التكنولوجي',
    majorDepartment: 'إدارة مدرسة WE للتكنولوجيا التطبيقية',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    role: 'admin',
    phone: '01012345678',
    email: 'admin@we.school.edu.eg',
    status: 'active',
    title: 'مدير النظام'
  },
  {
    id: 't-101',
    name: 'م. أحمد ممدوح',
    username: 'ahmed.mamdouh',
    password: '123',
    subject: 'هندسة البرمجيات وتطبيقات الويب',
    majorDepartment: 'تطوير البرمجيات وحلول الويب',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    role: 'teacher',
    phone: '01123456789',
    email: 'ahmed.mamdouh@we.school.edu.eg',
    status: 'active',
    title: 'مهندس برمجيات'
  },
  {
    id: 't-102',
    name: 'د. سارة عادل',
    username: 'sarah.adel',
    password: '123',
    subject: 'أمن المعلومات والسيبراني',
    majorDepartment: 'أمن المعلومات والأمن السيبراني',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    role: 'supervisor',
    phone: '01234567890',
    email: 'sarah.adel@we.school.edu.eg',
    status: 'active',
    title: 'مشرفة أمن سيبراني'
  },
  {
    id: 't-103',
    name: 'م. إبراهيم فؤاد',
    username: 'ibrahim.fouad',
    password: '123',
    subject: 'شبكات الألياف الضوئية وأنظمة WE',
    majorDepartment: 'هندسة الشبكات والاتصالات',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    role: 'teacher',
    phone: '01098765432',
    email: 'ibrahim.fouad@we.school.edu.eg',
    status: 'active',
    title: 'مهندس اتصالات وشبكات'
  },
  {
    id: 't-104',
    name: 'م. طارق فاروق',
    username: 'tareq.farouk',
    password: '123',
    subject: 'التدريب الميداني OJT ومراكز بيانات WE',
    majorDepartment: 'التدريب الميداني OJT',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    role: 'teacher',
    phone: '01511223344',
    email: 'tareq.farouk@we.school.edu.eg',
    status: 'active',
    title: 'مهندس تدريب ميداني'
  },
  {
    id: 't-105',
    name: 'أ. محمود رضوان',
    username: 'mahmoud.radwan',
    password: '123',
    subject: 'شؤون الطلاب والانضباط السلوكي',
    majorDepartment: 'إدارة المدرسة والانضباط',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    role: 'supervisor',
    phone: '01055443322',
    email: 'mahmoud.radwan@we.school.edu.eg',
    status: 'active',
    title: 'أخصائي انضباط وشؤون طلاب'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'WE-2025-0101',
    code: '10401',
    nationalId: '30708150102934',
    name: 'عمر شريف الدسوقي',
    grade: 'الصف الثاني الثانوي',
    major: 'تطوير البرمجيات وحلول الويب',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
    email: 'omar.sherif@we-school.edu.eg',
    phone: '01023456781',
    points: 46,
    totalPositive: 56,
    totalNegative: 10,
    targetPoints: 50,
    percentage: 92,
    badge: 'leader',
    attendanceRate: 98,
    academicScore: 94,
    behavioralScore: 92,
    secretMissionsCompleted: 3,
    performanceHistory: [
      { date: 'الأسبوع 1', points: 14, percentage: 28, behavioral: 80, academic: 82, label: 'بداية الفصل' },
      { date: 'الأسبوع 2', points: 22, percentage: 44, behavioral: 86, academic: 85, label: 'مشاركة ممتازة' },
      { date: 'الأسبوع 3', points: 20, percentage: 40, behavioral: 78, academic: 88, label: 'تأخير بالمعمل' },
      { date: 'الأسبوع 4', points: 32, percentage: 64, behavioral: 88, academic: 91, label: 'مشروع React' },
      { date: 'الأسبوع 5', points: 40, percentage: 80, behavioral: 92, academic: 93, label: 'مهمة سرية 1' },
      { date: 'الأسبوع 6', points: 46, percentage: 92, behavioral: 95, academic: 94, label: 'قائد تكنولوجي' }
    ],
    logs: [
      {
        id: 'log-1',
        studentId: 'WE-2025-0101',
        type: 'positive',
        category: 'إنجاز مهمة سرية أو مشروع حر',
        points: 15,
        note: 'حل لغز كويز الخوارزميات وبناء تطبيق واجهة مستخدم ممتاز لمشروع WE',
        teacherName: 'م. أحمد ممدوح',
        createdAt: '2026-09-15T10:30:00Z'
      },
      {
        id: 'log-2',
        studentId: 'WE-2025-0101',
        type: 'positive',
        category: 'تطبيق عملي متميز بالمعمل',
        points: 10,
        note: 'ربط واجهة برمجية وتصحيح أخطاء الشيفرة البرمجية لزملائه في المعمل',
        teacherName: 'د. سارة عادل',
        createdAt: '2026-09-12T11:15:00Z'
      },
      {
        id: 'log-3',
        studentId: 'WE-2025-0101',
        type: 'negative',
        category: 'استخدام الهاتف أثناء الشرح',
        points: -5,
        note: 'انشغال بالهاتف المحمول خلال جلسة مراجعة أمن الشبكات',
        teacherName: 'م. طارق فاروق',
        createdAt: '2026-09-08T09:40:00Z'
      },
      {
        id: 'log-4',
        studentId: 'WE-2025-0101',
        type: 'positive',
        category: 'حضور مبكر وانضباط سلوكي',
        points: 5,
        note: 'حضور مبكر وتنظيم المعمل ومساعدة المشرف',
        teacherName: 'أ. محمود رضوان',
        createdAt: '2026-09-03T07:45:00Z'
      }
    ]
  },
  {
    id: 'WE-2025-0102',
    code: '10402',
    nationalId: '30801200104521',
    name: 'مريم محمود الخولي',
    grade: 'الصف الثاني الثانوي',
    major: 'أمن المعلومات والأمن السيبراني',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    email: 'mariam.kholy@we-school.edu.eg',
    phone: '01145678912',
    points: 42,
    totalPositive: 45,
    totalNegative: 3,
    targetPoints: 50,
    percentage: 84,
    badge: 'pro',
    attendanceRate: 96,
    academicScore: 92,
    behavioralScore: 96,
    secretMissionsCompleted: 2,
    performanceHistory: [
      { date: 'الأسبوع 1', points: 10, percentage: 20, behavioral: 90, academic: 80, label: 'بداية العام' },
      { date: 'الأسبوع 2', points: 18, percentage: 36, behavioral: 92, academic: 84, label: 'كويز التشفير' },
      { date: 'الأسبوع 3', points: 26, percentage: 52, behavioral: 95, academic: 87, label: 'محاكاة جدار ناري' },
      { date: 'الأسبوع 4', points: 34, percentage: 68, behavioral: 94, academic: 90, label: 'اكتشاف ثغرة' },
      { date: 'الأسبوع 5', points: 39, percentage: 78, behavioral: 97, academic: 91, label: 'تحليل أمني' },
      { date: 'الأسبوع 6', points: 42, percentage: 84, behavioral: 96, academic: 92, label: 'مستوى محترف' }
    ],
    logs: [
      {
        id: 'log-201',
        studentId: 'WE-2025-0102',
        type: 'positive',
        category: 'تطبيق عملي متميز بالمعمل',
        points: 10,
        note: 'تحليل حزم البيانات ببرنامج Wireshark واكتشاف ثغرة مصطنعة في معمل الأمن',
        teacherName: 'م. أيمن حسني',
        createdAt: '2026-09-14T13:20:00Z'
      },
      {
        id: 'log-202',
        studentId: 'WE-2025-0102',
        type: 'positive',
        category: 'مساعدة الزملاء وروح الفريق',
        points: 5,
        note: 'شرح مبادئ التشفير المتماثل لفريق العمل المصاحب',
        teacherName: 'د. سارة عادل',
        createdAt: '2026-09-10T10:00:00Z'
      }
    ]
  },
  {
    id: 'WE-2025-0103',
    code: '10403',
    nationalId: '30711050106278',
    name: 'يوسف كريم المنشاوي',
    grade: 'الصف الثالث الثانوي',
    major: 'هندسة الشبكات والاتصالات',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    email: 'youssef.karim@we-school.edu.eg',
    phone: '01234567890',
    points: 34,
    totalPositive: 46,
    totalNegative: 12,
    targetPoints: 50,
    percentage: 68,
    badge: 'advanced',
    attendanceRate: 91,
    academicScore: 86,
    behavioralScore: 81,
    secretMissionsCompleted: 1,
    performanceHistory: [
      { date: 'الأسبوع 1', points: 15, percentage: 30, behavioral: 85, academic: 82, label: 'توصيل الراوتر' },
      { date: 'الأسبوع 2', points: 12, percentage: 24, behavioral: 70, academic: 80, label: 'تأخير ولخبطة كابلات' },
      { date: 'الأسبوع 3', points: 22, percentage: 44, behavioral: 78, academic: 84, label: 'إعداد سويتش Cisco' },
      { date: 'الأسبوع 4', points: 20, percentage: 40, behavioral: 74, academic: 85, label: 'عدم إحضار لابتوب' },
      { date: 'الأسبوع 5', points: 30, percentage: 60, behavioral: 80, academic: 86, label: 'تسليم الفايبر' },
      { date: 'الأسبوع 6', points: 34, percentage: 68, behavioral: 81, academic: 86, label: 'صعود ملحوظ' }
    ],
    logs: [
      {
        id: 'log-301',
        studentId: 'WE-2025-0103',
        type: 'positive',
        category: 'تطبيق عملي متميز بالمعمل',
        points: 10,
        note: 'لحام كابل ألياف ضوئية (Fiber Optic) واختبار الفقد بنجاح عالي',
        teacherName: 'م. إبراهيم فؤاد',
        createdAt: '2026-09-13T12:00:00Z'
      },
      {
        id: 'log-302',
        studentId: 'WE-2025-0103',
        type: 'negative',
        category: 'عدم إحضار اللابتوب أو الأدوات',
        points: -5,
        note: 'نسي الحاسب المحمول الخاص بالتدريب العملي في معمل اتصالات المصرية للاتصالات',
        teacherName: 'م. إبراهيم فؤاد',
        createdAt: '2026-09-09T08:30:00Z'
      }
    ]
  },
  {
    id: 'WE-2025-0104',
    code: '10404',
    nationalId: '30805120108392',
    name: 'حنين أحمد عبد السلام',
    grade: 'الصف الأول الثانوي',
    major: 'الذكاء الاصطناعي وإنترنت الأشياء',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
    email: 'haneen.ahmed@we-school.edu.eg',
    phone: '01098765432',
    points: 24,
    totalPositive: 27,
    totalNegative: 3,
    targetPoints: 50,
    percentage: 48,
    badge: 'good',
    attendanceRate: 94,
    academicScore: 82,
    behavioralScore: 88,
    secretMissionsCompleted: 1,
    performanceHistory: [
      { date: 'الأسبوع 1', points: 6, percentage: 12, behavioral: 80, academic: 75, label: 'تعريف بإنترنت الأشياء' },
      { date: 'الأسبوع 2', points: 12, percentage: 24, behavioral: 85, academic: 78, label: 'توصيل حساس Arduino' },
      { date: 'الأسبوع 3', points: 16, percentage: 32, behavioral: 86, academic: 80, label: 'كتابة أول كود C++' },
      { date: 'الأسبوع 4', points: 21, percentage: 42, behavioral: 88, academic: 81, label: 'تفاعل ممتاز' },
      { date: 'الأسبوع 5', points: 20, percentage: 40, behavioral: 84, academic: 82, label: 'تأخير صباحي' },
      { date: 'الأسبوع 6', points: 24, percentage: 48, behavioral: 88, academic: 82, label: 'طالبة مجتهدة' }
    ],
    logs: [
      {
        id: 'log-401',
        studentId: 'WE-2025-0104',
        type: 'positive',
        category: 'إجابة نموذجية ومشاركة صفية',
        points: 5,
        note: 'شرح كيفية عمل حساسات الموجات فوق الصوتية واستخدامها في القياس',
        teacherName: 'د. سامح الجوهري',
        createdAt: '2026-09-14T09:15:00Z'
      }
    ]
  },
  {
    id: 'WE-2025-0105',
    code: '10405',
    nationalId: '30709210103456',
    name: 'زياد طارق الهواري',
    grade: 'الصف الأول الثانوي',
    major: 'تطوير البرمجيات وحلول الويب',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    email: 'ziad.tarek@we-school.edu.eg',
    phone: '01512345678',
    points: 11,
    totalPositive: 22,
    totalNegative: 11,
    targetPoints: 50,
    percentage: 22,
    badge: 'novice',
    attendanceRate: 85,
    academicScore: 71,
    behavioralScore: 68,
    secretMissionsCompleted: 0,
    performanceHistory: [
      { date: 'الأسبوع 1', points: 4, percentage: 8, behavioral: 70, academic: 65, label: 'بداية دراسية' },
      { date: 'الأسبوع 2', points: 10, percentage: 20, behavioral: 75, academic: 70, label: 'مقدمة HTML' },
      { date: 'الأسبوع 3', points: 6, percentage: 12, behavioral: 65, academic: 68, label: 'إهمال الواجب' },
      { date: 'الأسبوع 4', points: 12, percentage: 24, behavioral: 70, academic: 71, label: 'محاولة تعويض' },
      { date: 'الأسبوع 5', points: 8, percentage: 16, behavioral: 62, academic: 69, label: 'استخدام الهاتف' },
      { date: 'الأسبوع 6', points: 11, percentage: 22, behavioral: 68, academic: 71, label: 'يحتاج تشجيع' }
    ],
    logs: [
      {
        id: 'log-501',
        studentId: 'WE-2025-0105',
        type: 'negative',
        category: 'إهمال تسليم الواجب أو المشروع',
        points: -8,
        note: 'لم يسلم تكليف تصميم الصفحة الرئيسية بلغة CSS في الموعد المحدد',
        teacherName: 'م. أحمد ممدوح',
        createdAt: '2026-09-11T14:00:00Z'
      },
      {
        id: 'log-502',
        studentId: 'WE-2025-0105',
        type: 'positive',
        category: 'مساعدة الزملاء وروح الفريق',
        points: 5,
        note: 'تعاون إيجابي مع زميله أثناء إعداد بيئة التطوير VS Code',
        teacherName: 'م. أحمد ممدوح',
        createdAt: '2026-09-05T10:10:00Z'
      }
    ]
  },
  {
    id: 'WE-2025-0106',
    code: '10406',
    nationalId: '30803150109123',
    name: 'نور الدين مصطفى رضوان',
    grade: 'الصف الثالث الثانوي',
    major: 'أمن المعلومات والأمن السيبراني',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300',
    email: 'nour.radwan@we-school.edu.eg',
    phone: '01123459876',
    points: 48,
    totalPositive: 52,
    totalNegative: 4,
    targetPoints: 50,
    percentage: 96,
    badge: 'leader',
    attendanceRate: 99,
    academicScore: 98,
    behavioralScore: 97,
    secretMissionsCompleted: 3,
    performanceHistory: [
      { date: 'الأسبوع 1', points: 18, percentage: 36, behavioral: 94, academic: 90, label: 'أول تدريب' },
      { date: 'الأسبوع 2', points: 26, percentage: 52, behavioral: 95, academic: 93, label: 'أداء متميز' },
      { date: 'الأسبوع 3', points: 34, percentage: 68, behavioral: 96, academic: 95, label: 'مسابقة CTF' },
      { date: 'الأسبوع 4', points: 41, percentage: 82, behavioral: 98, academic: 96, label: 'تأهل محترف' },
      { date: 'الأسبوع 5', points: 45, percentage: 90, behavioral: 97, academic: 97, label: 'حل مهمة سرية' },
      { date: 'الأسبوع 6', points: 48, percentage: 96, behavioral: 97, academic: 98, label: 'صدارة المدرسة' }
    ],
    logs: [
      {
        id: 'log-601',
        studentId: 'WE-2025-0106',
        type: 'positive',
        category: 'إنجاز مهمة سرية أو مشروع حر',
        points: 15,
        note: 'الفوز بالمركز الأول في تحدي الأمن السيبراني المدرسي CTF',
        teacherName: 'م. أيمن حسني',
        createdAt: '2026-09-15T15:00:00Z'
      }
    ]
  }
];

export const INITIAL_MISSIONS: SecretMission[] = [
  {
    id: 'mission-001',
    title: 'تحدي كود الألياف الضوئية: بناء كابل الفايبر الافتراضي',
    description: 'مهمة سرية لطلاب تخصص الاتصالات والشبكات: محاكاة توصيل مسار فايبر من سنترال WE الرئيسي إلى مدرسة التكنولوجيا وحساب نسبة فقد الإشارة dB.',
    type: 'task',
    target: 'all',
    targetMajor: 'هندسة الشبكات والاتصالات',
    pointsReward: 20,
    badgeReward: 'خبير الفايبر',
    deadline: '2026-09-25',
    secretCode: 'FIBER-WE-99',
    createdAt: '2026-09-10',
    createdBy: 'م. إبراهيم فؤاد (رئيس قسم الاتصالات)',
    status: 'active',
    submissions: [
      {
        studentId: 'WE-2025-0103',
        studentName: 'يوسف كريم المنشاوي',
        submittedAt: '2026-09-13T16:00:00Z',
        answerText: 'تم إعداد المحاكاة على بروتوكول Cisco Packet Tracer مع ضبط مسار الألياف الضوئية وحساب الفقد بنسبة 0.2 dB/km.',
        status: 'approved',
        teacherFeedback: 'إنجاز ممتاز ومطابق لمواصفات الشركة المصرية للاتصالات WE!',
        awardedPoints: 20
      }
    ]
  },
  {
    id: 'mission-002',
    title: 'كويز الثغرات الخفية: اختبار اختراق الويب السري',
    description: 'كويز سريع وسري لقياس فهم الطلاب لثغرات حقن SQL وطرق تأمين قواعد بيانات المدارس الذكية.',
    type: 'quiz',
    target: 'all',
    targetMajor: 'أمن المعلومات والأمن السيبراني',
    pointsReward: 15,
    badgeReward: 'صياد الثغرات',
    deadline: '2026-09-22',
    secretCode: 'SEC-ZERO-DAY',
    createdAt: '2026-09-12',
    createdBy: 'م. أيمن حسني (مشرف أمن المعلومات)',
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
    submissions: [
      {
        studentId: 'WE-2025-0102',
        studentName: 'مريم محمود الخولي',
        submittedAt: '2026-09-14T18:30:00Z',
        quizScore: 3,
        status: 'approved',
        teacherFeedback: 'علامة كاملة 3/3 في كويز الأمان السري، أحسنتِ!',
        awardedPoints: 15
      }
    ]
  },
  {
    id: 'mission-003',
    title: 'تحدي المطور الخارق: خوارزمية فرز ذكية بلغة بايثون',
    description: 'تحدي برمجي سري: كتابة دالة فرز سريع (QuickSort) مع تعليقات توضيحية بالعربية واختبار كفاءة الذاكرة Big-O.',
    type: 'challenge',
    target: 'WE-2025-0101',
    targetMajor: 'تطوير البرمجيات وحلول الويب',
    pointsReward: 25,
    badgeReward: 'ماستر الخوارزميات',
    deadline: '2026-09-28',
    secretCode: 'CODE-NINJA-07',
    createdAt: '2026-09-14',
    createdBy: 'م. أحمد ممدوح',
    status: 'active',
    submissions: [
      {
        studentId: 'WE-2025-0101',
        studentName: 'عمر شريف الدسوقي',
        submittedAt: '2026-09-15T09:20:00Z',
        answerText: 'تمت كتابة خوارزمية QuickSort باستخدام Pivot عشوائي لتحقيق O(N log N) وتجربتها على مصفوفة من 10,000 عنصر.',
        status: 'approved',
        teacherFeedback: 'تنفيذ احترافي من طراز رفيع! تم منح النقاط كاملة وتحديث البادج.',
        awardedPoints: 25
      }
    ]
  }
];

export const SCHOOL_INFO = {
  name: 'مدرسة WE للتطبيقات التكنولوجية',
  subTitle: 'وزارة التربية والتعليم والتعليم الفني بالتعاون مع المصرية للاتصالات Telecom Egypt',
  academicYear: 'العام الدراسي 2025 - 2026',
  branches: ['مدينة نصر', 'الشيخ زايد', 'الإسكندرية', 'المنيا', 'السويس', 'الدقهلية'],
  grades: ['الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي'],
  majors: [
    'تطوير البرمجيات وحلول الويب',
    'أمن المعلومات والأمن السيبراني',
    'هندسة الشبكات والاتصالات',
    'الذكاء الاصطناعي وإنترنت الأشياء'
  ]
};
