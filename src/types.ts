export type BadgeTier = 'novice' | 'good' | 'advanced' | 'pro' | 'leader';

export interface BadgeInfo {
  tier: BadgeTier;
  title: string;
  minPercent: number;
  maxPercent: number;
  icon: string;
  badgeEmoji: string;
  textColor: string;
  badgeBg: string;
  borderColor: string;
  description: string;
}

export type PointType = 'positive' | 'negative';

export interface PointLog {
  id: string;
  studentId: string;
  type: PointType;
  category: string;
  points: number;
  note: string;
  teacherName: string;
  createdAt: string;
}

export interface PerformanceDataPoint {
  date: string;
  points: number;
  percentage: number;
  behavioral: number;
  academic: number;
  label?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface MissionSubmission {
  studentId: string;
  studentName: string;
  submittedAt: string;
  answerText?: string;
  quizScore?: number;
  status: 'pending' | 'approved' | 'rejected';
  teacherFeedback?: string;
  awardedPoints?: number;
}

export interface Teacher {
  id: string;
  name: string;
  username: string;
  password: string;
  subject: string;
  majorDepartment: string;
  avatar: string;
  role: 'teacher' | 'supervisor' | 'admin';
  phone?: string;
  email?: string;
  status?: 'active' | 'suspended';
  title?: string;
  createdAt?: string;
}

export interface SecretMission {
  id: string;
  title: string;
  description: string;
  type: 'task' | 'quiz' | 'challenge';
  target: 'all' | string; // 'all' or studentId
  targetMajor?: string;
  pointsReward: number;
  badgeReward?: string;
  deadline: string;
  secretCode: string;
  createdAt: string;
  createdBy: string;
  status: 'active' | 'completed' | 'archived';
  quizQuestions?: QuizQuestion[];
  submissions: MissionSubmission[];
}

export interface Student {
  id: string;
  code: string;
  nationalId: string;
  name: string;
  grade: string;
  major: string;
  avatar: string;
  email: string;
  phone: string;
  points: number;
  totalPositive: number;
  totalNegative: number;
  targetPoints: number;
  percentage: number;
  badge: BadgeTier;
  attendanceRate: number;
  academicScore: number;
  behavioralScore: number;
  performanceHistory: PerformanceDataPoint[];
  logs: PointLog[];
  secretMissionsCompleted: number;
}
