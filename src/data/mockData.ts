import { Student, SecretMission, Teacher } from '../types';

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 't-admin',
    name: 'م. أبانوب وجيه (مدير المنظومة)',
    username: 'admin',
    password: 'Bebo@1234',
    subject: 'الإدارة العامة والإشراف التكنولوجي',
    majorDepartment: 'إدارة مدرسة WE للتكنولوجيا التطبيقية',
    avatar: '',
    role: 'admin',
    phone: '',
    email: '',
    status: 'active',
    title: 'مهندس'
  }
];

export const INITIAL_STUDENTS: Student[] = [];

export const INITIAL_MISSIONS: SecretMission[] = [];

export interface SchoolStage {
  id: string;
  name: string;
  shortName: string;
  letter: string;
  classes: string[];
}

export const SCHOOL_STAGES: SchoolStage[] = [
  {
    id: 'stage-1',
    name: 'الصف الأول الثانوي التكنولوجي',
    shortName: 'سنة أولى',
    letter: 'A',
    classes: [
      'الصف الأول - A1',
      'الصف الأول - A2',
      'الصف الأول - A3',
      'الصف الأول - A4',
      'الصف الأول - A5',
      'الصف الأول - A6'
    ]
  },
  {
    id: 'stage-2',
    name: 'الصف الثاني الثانوي التكنولوجي',
    shortName: 'سنة ثانية',
    letter: 'B',
    classes: [
      'الصف الثاني - B1',
      'الصف الثاني - B2',
      'الصف الثاني - B3',
      'الصف الثاني - B4',
      'الصف الثاني - B5',
      'الصف الثاني - B6'
    ]
  },
  {
    id: 'stage-3',
    name: 'الصف الثالث الثانوي التكنولوجي',
    shortName: 'سنة ثالثة',
    letter: 'C',
    classes: [
      'الصف الثالث - C1',
      'الصف الثالث - C2',
      'الصف الثالث - C3',
      'الصف الثالث - C4',
      'الصف الثالث - C5',
      'الصف الثالث - C6'
    ]
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
