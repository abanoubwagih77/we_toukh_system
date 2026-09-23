import React from 'react';
import { Student } from '../types';
import { BADGE_TIERS } from '../utils/badges';
import {
  Award,
  TrendingUp,
  TrendingDown,
  ScanLine,
  PlusCircle,
  MinusCircle,
  Eye,
  Target,
  Cpu,
  Pencil
} from 'lucide-react';

interface StudentCardProps {
  student: Student;
  onOpenProfile: (student: Student) => void;
  onOpenIdCard: (student: Student) => void;
  onOpenAddPoints: (student: Student, defaultType?: 'positive' | 'negative') => void;
  onEditStudent?: (student: Student) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onOpenProfile,
  onOpenIdCard,
  onOpenAddPoints,
  onEditStudent
}) => {
  const badgeInfo = BADGE_TIERS[student.badge];
  const history = student.performanceHistory;
  const isRising =
    history.length >= 2
      ? history[history.length - 1].percentage >= history[0].percentage
      : true;

  return (
    <div
      id={`student-card-${student.id}`}
      className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group relative overflow-hidden text-right"
      dir="rtl"
    >
      {/* Top Banner highlight based on badge */}
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 ${
          student.badge === 'leader'
            ? 'bg-linear-to-r from-amber-400 via-purple-500 to-amber-500'
            : student.badge === 'pro'
            ? 'bg-purple-600'
            : student.badge === 'advanced'
            ? 'bg-emerald-500'
            : student.badge === 'good'
            ? 'bg-blue-500'
            : 'bg-amber-400'
        }`}
      />

      <div>
        {/* Header: Photo + Basic Info + Badge Pill */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={student.avatar}
                alt={student.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-xs bg-slate-100"
              />
              <span
                className="absolute -bottom-1 -left-1 p-0.5 bg-white border border-slate-200 rounded-full shadow-xs text-xs"
                title={badgeInfo.title}
              >
                {badgeInfo.badgeEmoji}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-purple-700 transition-colors">
                  {student.name}
                </h3>
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                كود: #{student.code} • {student.grade}
              </div>
              <div className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-md mt-1 border border-cyan-100">
                <Cpu className="w-3 h-3 text-cyan-600" />
                <span>{student.major}</span>
              </div>
            </div>
          </div>

          {/* Badge Pill */}
          <div
            className={`px-2.5 py-1 rounded-xl text-xs font-bold border shrink-0 flex items-center gap-1 ${badgeInfo.badgeBg} ${badgeInfo.textColor} ${badgeInfo.borderColor}`}
          >
            <span>{badgeInfo.badgeEmoji}</span>
            <span className="hidden sm:inline">{badgeInfo.title}</span>
          </div>
        </div>

        {/* Points & Progress Section */}
        <div className="space-y-2 py-3 border-y border-slate-100 my-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">نسبة النقاط والرتبة:</span>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-slate-900 text-sm">{student.points} نقطة</span>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-md">
                ({student.percentage}%)
              </span>
            </div>
          </div>

          {/* Linear Progress Bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                student.badge === 'leader'
                  ? 'bg-linear-to-r from-purple-600 to-amber-500'
                  : student.badge === 'pro'
                  ? 'bg-purple-600'
                  : student.badge === 'advanced'
                  ? 'bg-emerald-500'
                  : student.badge === 'good'
                  ? 'bg-blue-500'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${student.percentage}%` }}
            />
          </div>

          {/* Trend & Mission Stats */}
          <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
            <div className="flex items-center gap-1">
              {isRising ? (
                <span className="text-emerald-600 flex items-center gap-0.5 font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>المسار صاعد</span>
                </span>
              ) : (
                <span className="text-rose-600 flex items-center gap-0.5 font-bold">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>المسار هابط</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-purple-700 font-bold">
              <Target className="w-3.5 h-3.5" />
              <span>مهام سرية: {student.secretMissionsCompleted}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onOpenAddPoints(student, 'positive')}
            className="flex items-center justify-center gap-1 py-2 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>+ نقاط</span>
          </button>

          <button
            onClick={() => onOpenAddPoints(student, 'negative')}
            className="flex items-center justify-center gap-1 py-2 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold rounded-xl border border-rose-200 transition-colors"
          >
            <MinusCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>- مخالفة</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => onOpenProfile(student)}
            className="flex items-center justify-center gap-1 py-2 px-2 bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>البروفايل</span>
          </button>

          <button
            onClick={() => onOpenIdCard(student)}
            className="flex items-center justify-center gap-1 py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-xl transition-colors cursor-pointer"
          >
            <ScanLine className="w-3.5 h-3.5 text-purple-600" />
            <span>الكارنيه</span>
          </button>

          {onEditStudent && (
            <button
              onClick={() => onEditStudent(student)}
              className="flex items-center justify-center gap-1 py-2 px-2 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold rounded-xl border border-amber-200 transition-colors cursor-pointer"
              title="تعديل بيانات الطالب"
            >
              <Pencil className="w-3.5 h-3.5 text-amber-600" />
              <span>تعديل</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
