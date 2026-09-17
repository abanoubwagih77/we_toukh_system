import React from 'react';
import { BADGE_TIERS } from '../utils/badges';
import { Award, Sparkles, CheckCircle2, Zap, ShieldCheck, Crown, Target, Cpu } from 'lucide-react';

export const BadgeGuideView: React.FC = () => {
  const tiers = Object.values(BADGE_TIERS);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="bg-linear-to-r from-purple-950 via-[#3B0764] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-400/30">
        <div className="flex items-center gap-2 text-xs font-bold text-purple-300 mb-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>منظومة الحوافز التكنولوجية والأوسمة الرقمية</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          دليل مستويات وبادجات طلاب مدرسة WE
        </h1>
        <p className="text-xs sm:text-sm text-purple-200 mt-2 max-w-3xl leading-relaxed">
          نظام تصنيف وتدرج ذكي يعتمد على نسبة النقاط المكتسبة من خلال السلوك الإيجابي، الإبداع بالمعامل
          التقنية، والمشاركة في المهام السرية. يتغير بادج الطالب تلقائياً بمجرد تجاوز أي عتبة نقطية!
        </p>
      </div>

      {/* Badges Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tiers.map((b) => (
          <div
            key={b.tier}
            className={`p-6 rounded-3xl border shadow-xs transition-all flex flex-col justify-between ${
              b.tier === 'leader'
                ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-300'
                : 'bg-white border-slate-200 hover:shadow-md'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{b.badgeEmoji}</span>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-white border border-slate-200 text-slate-800 shadow-2xs font-mono">
                  {b.minPercent}% - {b.maxPercent}% إنجاز
                </span>
              </div>

              <h3 className="text-lg font-black text-slate-900 mb-1">{b.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">{b.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs space-y-2">
              <div className="text-slate-500 font-bold">طريقة الاستحقاق:</div>
              <ul className="space-y-1 text-slate-600 text-[11px] list-disc list-inside">
                {b.tier === 'novice' && (
                  <>
                    <li>بداية التسجيل في المدرسة ورصيد نقاط أقل من 15 نقطة</li>
                    <li>يحتاج إلى توجيه ومشاركة إيجابية لرفع النسبة</li>
                  </>
                )}
                {b.tier === 'good' && (
                  <>
                    <li>جمع من 15 إلى 29 نقطة (نسبة 30% إلى 59%)</li>
                    <li>المشاركة الصفية المنتظمة وحضور المعامل بدون مخالفات</li>
                  </>
                )}
                {b.tier === 'advanced' && (
                  <>
                    <li>جمع من 30 إلى 39 نقطة (نسبة 60% إلى 79%)</li>
                    <li>إتقان تطبيقات الشبكات أو البرمجة مع حل المهام العملية</li>
                  </>
                )}
                {b.tier === 'pro' && (
                  <>
                    <li>جمع من 40 إلى 44 نقطة (نسبة 80% إلى 89%)</li>
                    <li>التفوق في السلوك والمهام السرية وإرشاد الزملاء بالمعمل</li>
                  </>
                )}
                {b.tier === 'leader' && (
                  <>
                    <li>جمع 45 نقطة فأعلى (نسبة 90% إلى 100%)</li>
                    <li>صدارة تخصص المدرسة، قيادة الفرق، والمشاركة بمسابقات WE</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Secret Mission Bonus Info */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-purple-50 via-cyan-50 to-purple-50 border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">
              تسريع ترقية البادج عبر المهام السرية (سيكريت ميشن)
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              حل التحديات السرية يمنح الطالب مكافآت نقاط إضافية (+15 إلى +25 نقطة دفعة واحدة)، مما ينقله
              مباشرة من رتبة إلى رتبة أعلى!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
