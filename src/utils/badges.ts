import { BadgeInfo, BadgeTier } from '../types';

export const BADGE_TIERS: Record<BadgeTier, BadgeInfo> = {
  novice: {
    tier: 'novice',
    title: 'مبتدئ واعد',
    minPercent: 0,
    maxPercent: 29,
    icon: 'Sparkles',
    badgeEmoji: '🥉',
    textColor: 'text-amber-700',
    badgeBg: 'bg-amber-50',
    borderColor: 'border-amber-200',
    description: 'في بداية رحلته المدرسية التقنية ويحتاج إلى دعم ومشاركات إضافية'
  },
  good: {
    tier: 'good',
    title: 'طالب جيد ومجتهد',
    minPercent: 30,
    maxPercent: 59,
    icon: 'CheckCircle2',
    badgeEmoji: '🥈',
    textColor: 'text-blue-700',
    badgeBg: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'ملتزم سلوكياً ويشارك بإيجابية في الحصص والمعامل الدراسية'
  },
  advanced: {
    tier: 'advanced',
    title: 'متقدم تكنولوجي',
    minPercent: 60,
    maxPercent: 79,
    icon: 'Zap',
    badgeEmoji: '🥇',
    textColor: 'text-emerald-700',
    badgeBg: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    description: 'أداء أكاديمي وسلوكي رفيع ومتميز في المعامل والمشاريع التقنية'
  },
  pro: {
    tier: 'pro',
    title: 'محترف تقني',
    minPercent: 80,
    maxPercent: 89,
    icon: 'ShieldCheck',
    badgeEmoji: '💎',
    textColor: 'text-purple-700',
    badgeBg: 'bg-purple-50',
    borderColor: 'border-purple-200',
    description: 'قدوة لزملائه في الانضباط والإتقان والقدرات التكنولوجية العالية'
  },
  leader: {
    tier: 'leader',
    title: 'قائد تكنولوجي WE',
    minPercent: 90,
    maxPercent: 100,
    icon: 'Crown',
    badgeEmoji: '👑',
    textColor: 'text-amber-600',
    badgeBg: 'bg-amber-100/70',
    borderColor: 'border-amber-400',
    description: 'المرتبة الشرفية العليا! نموذج استثنائي في القيادة والالتزام والابتكار'
  }
};

export function calculateBadge(percentage: number): BadgeTier {
  if (percentage >= 90) return 'leader';
  if (percentage >= 80) return 'pro';
  if (percentage >= 60) return 'advanced';
  if (percentage >= 30) return 'good';
  return 'novice';
}

export function calculatePercentage(points: number, targetPoints: number = 50): number {
  if (targetPoints <= 0) return 0;
  const pct = Math.round((points / targetPoints) * 100);
  return Math.max(0, Math.min(100, pct));
}

export function calculateNextBadgeInfo(
  currentPercentage: number,
  currentPoints: number,
  targetPoints: number = 50
): { nextBadge: BadgeInfo | null; pointsNeeded: number; percentNeeded: number } {
  if (currentPercentage >= 90) {
    return { nextBadge: null, pointsNeeded: 0, percentNeeded: 0 };
  }
  let targetTier: BadgeTier = 'good';
  if (currentPercentage < 30) targetTier = 'good';
  else if (currentPercentage < 60) targetTier = 'advanced';
  else if (currentPercentage < 80) targetTier = 'pro';
  else targetTier = 'leader';

  const nextBadge = BADGE_TIERS[targetTier];
  const pointsRequired = Math.ceil((nextBadge.minPercent / 100) * targetPoints);
  const pointsNeeded = Math.max(1, pointsRequired - currentPoints);
  const percentNeeded = Math.max(1, nextBadge.minPercent - currentPercentage);

  return { nextBadge, pointsNeeded, percentNeeded };
}

export interface QuickActionPreset {
  id: string;
  category: string;
  points: number;
  type: 'positive' | 'negative';
  description: string;
  icon: string;
}

export const QUICK_ACTIONS: QuickActionPreset[] = [
  // Positive Actions
  {
    id: 'pos_1',
    category: 'إجابة نموذجية ومشاركة صفية',
    points: 5,
    type: 'positive',
    description: 'تفاعل ممتاز وإجابة ذكية أثناء الشرح',
    icon: 'MessageSquareCheck'
  },
  {
    id: 'pos_2',
    category: 'تطبيق عملي متميز بالمعمل',
    points: 10,
    type: 'positive',
    description: 'كتابة كود نظيف أو توصيل شبكة بنجاح كامل',
    icon: 'Laptop'
  },
  {
    id: 'pos_3',
    category: 'مساعدة الزملاء وروح الفريق',
    points: 5,
    type: 'positive',
    description: 'شرح فكرة لزميله والمساهمة في العمل الجماعي',
    icon: 'Users'
  },
  {
    id: 'pos_4',
    category: 'حضور مبكر وانضباط سلوكي',
    points: 5,
    type: 'positive',
    description: 'التزام تام بالمواعيد والزي المدرسي وقواعد المعمل',
    icon: 'Clock'
  },
  {
    id: 'pos_5',
    category: 'إنجاز مهمة سرية أو مشروع حر',
    points: 15,
    type: 'positive',
    description: 'تسليم تحدي تقني أو كويز بجدارة وتفوق',
    icon: 'Award'
  },
  // Negative Actions / Infractions
  {
    id: 'neg_1',
    category: 'تأخير عن الحصة أو المعمل',
    points: -3,
    type: 'negative',
    description: 'دخول متأخر دون عذر مقبول',
    icon: 'AlertTriangle'
  },
  {
    id: 'neg_2',
    category: 'عدم إحضار اللابتوب أو الأدوات',
    points: -5,
    type: 'negative',
    description: 'عدم الجاهزية للتدريب العملي في معمل WE',
    icon: 'XCircle'
  },
  {
    id: 'neg_3',
    category: 'استخدام الهاتف أثناء الشرح',
    points: -5,
    type: 'negative',
    description: 'انشغال وتشتت أثناء الحصة الدراسية',
    icon: 'Smartphone'
  },
  {
    id: 'neg_4',
    category: 'إهمال تسليم الواجب أو المشروع',
    points: -8,
    type: 'negative',
    description: 'تخلف عن موعد تسليم التكليف المطلوب',
    icon: 'FileWarning'
  },
  {
    id: 'neg_5',
    category: 'سلوك غير لائق أو إحداث فوضى',
    points: -10,
    type: 'negative',
    description: 'مخالفة لائحة الانضباط المدرسي للمدرسة التكنولوجية',
    icon: 'ShieldAlert'
  }
];
