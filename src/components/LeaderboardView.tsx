import React, { useState, useMemo } from 'react';
import { Student } from '../types';
import { SCHOOL_INFO } from '../data/mockData';
import { BADGE_TIERS } from '../utils/badges';
import {
  Trophy,
  Crown,
  Medal,
  Award,
  Sparkles,
  TrendingUp,
  Search,
  Filter,
  Eye,
  FileCheck,
  Star,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { exportStudentsRoster } from '../utils/exportUtils';

interface LeaderboardViewProps {
  students: Student[];
  onOpenProfile: (student: Student) => void;
  onOpenCertificate: (student: Student) => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  students,
  onOpenProfile,
  onOpenCertificate
}) => {
  const [selectedMajor, setSelectedMajor] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sorted and filtered students
  const filteredRankedStudents = useMemo(() => {
    return students
      .filter((s) => {
        const matchMajor = selectedMajor === 'all' || s.major === selectedMajor;
        const matchGrade = selectedGrade === 'all' || s.grade === selectedGrade;
        const matchSearch =
          s.name.includes(searchQuery) ||
          s.code.includes(searchQuery) ||
          s.major.includes(searchQuery);
        return matchMajor && matchGrade && matchSearch;
      })
      .sort((a, b) => {
        // Sort by points desc, then percentage desc, then behavioral desc
        if (b.points !== a.points) return b.points - a.points;
        if (b.percentage !== a.percentage) return b.percentage - a.percentage;
        return b.behavioralScore - a.behavioralScore;
      });
  }, [students, selectedMajor, selectedGrade, searchQuery]);

  const topThree = filteredRankedStudents.slice(0, 3);
  const remainingStudents = filteredRankedStudents.slice(3);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-amber-600 via-purple-900 to-indigo-950 text-white p-6 rounded-3xl shadow-lg border border-amber-400/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-amber-400/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-amber-300/40 text-amber-300">
            <Trophy className="w-7 h-7 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">لوحة الشرف وتصنيف قادة التكنولوجيا</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black">
                WE Hall of Fame
              </span>
            </div>
            <p className="text-xs text-amber-100 mt-1 max-w-2xl leading-relaxed">
              تكريم الطلاب الأكثر تميزاً في السلوك والابتكار التقني عبر مختلف التخصصات التكنولوجية بمدرسة WE،
              مع إمكانية استخراج شهادات تقدير رسمية فورية بنقرة واحدة.
            </p>
          </div>
        </div>

        <button
          onClick={() => exportStudentsRoster(students)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-amber-50 text-slate-950 text-xs font-black rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <Award className="w-4 h-4 text-amber-600" />
          <span>تصدير كشف الأوائل (Excel)</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative">
            <input
              type="text"
              placeholder="ابحث باسم الطالب، الكود الأكاديمي، التخصص..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 pr-10 text-xs border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-slate-50/60"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
              className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="all">كافة التخصصات التكنولوجية</option>
              {SCHOOL_INFO.majors.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="all">كافة الصفوف الدراسية</option>
              {SCHOOL_INFO.grades.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end pt-4">
          {/* Rank 2 (Silver) */}
          {topThree[1] && (
            <div className="order-2 md:order-1 bg-linear-to-b from-slate-100 to-white border-2 border-slate-300 rounded-3xl p-5 shadow-sm text-center relative overflow-hidden flex flex-col items-center">
              <div className="absolute top-3 right-3 bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
                <Medal className="w-3.5 h-3.5 text-slate-500" />
                <span>المركز الثاني 🥈</span>
              </div>

              <div className="relative mt-5 mb-3">
                <img
                  src={topThree[1].avatar}
                  alt={topThree[1].name}
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-300 shadow-md"
                />
                <span className="absolute -bottom-2 -right-2 text-2xl">🥈</span>
              </div>

              <h3 className="font-black text-base text-slate-900">{topThree[1].name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{topThree[1].major}</p>

              <div className="my-3 py-2 px-4 bg-white rounded-2xl border border-slate-200 w-full flex items-center justify-around text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">النقاط</span>
                  <span className="font-black text-slate-900 font-mono text-sm">{topThree[1].points}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">النسبة</span>
                  <span className="font-black text-purple-700 font-mono text-sm">{topThree[1].percentage}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">البادج</span>
                  <span className="font-bold text-xs">{BADGE_TIERS[topThree[1].badge].badgeEmoji}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full mt-1">
                <button
                  onClick={() => onOpenProfile(topThree[1])}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
                >
                  البروفايل
                </button>
                <button
                  onClick={() => onOpenCertificate(topThree[1])}
                  className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl transition-colors flex items-center justify-center gap-1"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>شهادة</span>
                </button>
              </div>
            </div>
          )}

          {/* Rank 1 (Gold Champion) */}
          {topThree[0] && (
            <div className="order-1 md:order-2 bg-linear-to-b from-amber-100/70 via-white to-amber-50/50 border-3 border-amber-400 rounded-3xl p-6 shadow-xl text-center relative overflow-hidden flex flex-col items-center md:-translate-y-3">
              <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 px-3.5 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-xs">
                <Crown className="w-4 h-4 text-amber-900" />
                <span>المركز الأول 👑</span>
              </div>

              <div className="relative mt-5 mb-3">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Crown className="w-7 h-7 text-amber-500 animate-pulse drop-shadow-md" />
                </div>
                <img
                  src={topThree[0].avatar}
                  alt={topThree[0].name}
                  className="w-24 h-24 rounded-3xl object-cover border-4 border-amber-400 shadow-xl"
                />
                <span className="absolute -bottom-2 -right-2 text-3xl">🥇</span>
              </div>

              <h3 className="font-black text-lg text-slate-950">{topThree[0].name}</h3>
              <p className="text-xs text-purple-800 font-bold mt-0.5">{topThree[0].major}</p>

              <div className="my-4 py-2.5 px-4 bg-white/90 rounded-2xl border border-amber-200 w-full flex items-center justify-around text-xs shadow-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">النقاط المحققة</span>
                  <span className="font-black text-amber-700 font-mono text-base">{topThree[0].points}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">نسبة الإنجاز</span>
                  <span className="font-black text-purple-700 font-mono text-base">{topThree[0].percentage}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">الرتبة التكنولوجية</span>
                  <span className="font-black text-xs text-slate-800">
                    {BADGE_TIERS[topThree[0].badge].title}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full">
                <button
                  onClick={() => onOpenProfile(topThree[0])}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
                >
                  عرض الملف الكامل
                </button>
                <button
                  onClick={() => onOpenCertificate(topThree[0])}
                  className="flex-1 py-2.5 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-black rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>إصدار شهادة تميز</span>
                </button>
              </div>
            </div>
          )}

          {/* Rank 3 (Bronze) */}
          {topThree[2] && (
            <div className="order-3 md:order-3 bg-linear-to-b from-amber-50/50 to-white border-2 border-amber-300/80 rounded-3xl p-5 shadow-sm text-center relative overflow-hidden flex flex-col items-center">
              <div className="absolute top-3 right-3 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
                <Medal className="w-3.5 h-3.5 text-amber-700" />
                <span>المركز الثالث 🥉</span>
              </div>

              <div className="relative mt-5 mb-3">
                <img
                  src={topThree[2].avatar}
                  alt={topThree[2].name}
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-amber-300 shadow-md"
                />
                <span className="absolute -bottom-2 -right-2 text-2xl">🥉</span>
              </div>

              <h3 className="font-black text-base text-slate-900">{topThree[2].name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{topThree[2].major}</p>

              <div className="my-3 py-2 px-4 bg-white rounded-2xl border border-slate-200 w-full flex items-center justify-around text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">النقاط</span>
                  <span className="font-black text-slate-900 font-mono text-sm">{topThree[2].points}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">النسبة</span>
                  <span className="font-black text-purple-700 font-mono text-sm">{topThree[2].percentage}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">البادج</span>
                  <span className="font-bold text-xs">{BADGE_TIERS[topThree[2].badge].badgeEmoji}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full mt-1">
                <button
                  onClick={() => onOpenProfile(topThree[2])}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
                >
                  البروفايل
                </button>
                <button
                  onClick={() => onOpenCertificate(topThree[2])}
                  className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl transition-colors flex items-center justify-center gap-1"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>شهادة</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Roster of All Ranked Students */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="font-black text-sm text-slate-900">جدول الترتيب العام وقائمة الشرف</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            عرض {filteredRankedStudents.length} طالب مصنف
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredRankedStudents.map((student, index) => {
            const rank = index + 1;
            const badgeInfo = BADGE_TIERS[student.badge];

            return (
              <div
                key={student.id}
                className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Rank & Student Info */}
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 font-mono ${
                      rank === 1
                        ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                        : rank === 2
                        ? 'bg-slate-300 text-slate-900'
                        : rank === 3
                        ? 'bg-amber-200 text-amber-950'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : `#${rank}`}
                  </div>

                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200 cursor-pointer shrink-0"
                    onClick={() => onOpenProfile(student)}
                  />

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenProfile(student)}
                        className="font-black text-sm text-slate-900 hover:text-purple-700 text-right transition-colors"
                      >
                        {student.name}
                      </button>
                      <span className="text-base">{badgeInfo.badgeEmoji}</span>
                    </div>

                    <p className="text-xs text-slate-500">
                      {student.grade} • <strong className="text-purple-900">{student.major}</strong> •
                      كود: <span className="font-mono">{student.code}</span>
                    </p>
                  </div>
                </div>

                {/* Scores & Quick Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900 font-mono">
                        {student.points} نقطة
                      </span>
                      <span className="text-xs text-purple-700 font-extrabold">
                        ({student.percentage}%)
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      حضور: {student.attendanceRate}% • سلوك: {student.behavioralScore}/100
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenCertificate(student)}
                      className="flex items-center gap-1 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-black rounded-xl border border-amber-200 transition-colors"
                      title="استخراج شهادة تميز"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-700" />
                      <span className="hidden sm:inline">شهادة تميز</span>
                    </button>

                    <button
                      onClick={() => onOpenProfile(student)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
                    >
                      الملف
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
