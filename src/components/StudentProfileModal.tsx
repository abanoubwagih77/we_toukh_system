import React, { useState } from 'react';
import { Student, SecretMission, PointType, PointLog } from '../types';
import { BADGE_TIERS } from '../utils/badges';
import { PerformanceChart } from './PerformanceChart';
import {
  X,
  Award,
  TrendingUp,
  ScanLine,
  PlusCircle,
  MinusCircle,
  Calendar,
  UserCheck,
  ShieldCheck,
  Clock,
  Sparkles,
  FileText,
  AlertTriangle,
  Cpu,
  Target,
  Pencil
} from 'lucide-react';

interface StudentProfileModalProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  missions: SecretMission[];
  onOpenAddPoints: (student: Student, defaultType?: PointType) => void;
  onOpenIdCard: (student: Student) => void;
  onOpenCertificate?: (student: Student) => void;
  onEditStudent?: (student: Student) => void;
}

interface TeacherBreakdownItem {
  name: string;
  positive: number;
  negative: number;
  count: number;
  logs: PointLog[];
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  isOpen,
  onClose,
  missions,
  onOpenAddPoints,
  onOpenIdCard,
  onOpenCertificate,
  onEditStudent
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'attribution' | 'logs' | 'missions'>('overview');
  const [logFilter, setLogFilter] = useState<'all' | 'positive' | 'negative'>('all');

  if (!isOpen) return null;

  const badgeInfo = BADGE_TIERS[student.badge];
  const filteredLogs = student.logs.filter((log) => {
    if (logFilter === 'positive') return log.type === 'positive';
    if (logFilter === 'negative') return log.type === 'negative';
    return true;
  });

  // Calculate teacher breakdown for this specific student
  const initialMap: Record<string, TeacherBreakdownItem> = {};
  const teacherBreakdown = student.logs.reduce((acc, log) => {
    const tName = log.teacherName || 'معلم المادة التكنولوجية';
    if (!acc[tName]) {
      acc[tName] = { name: tName, positive: 0, negative: 0, count: 0, logs: [] };
    }
    acc[tName].count += 1;
    if (log.type === 'positive') acc[tName].positive += log.points;
    else acc[tName].negative += Math.abs(log.points);
    acc[tName].logs.push(log);
    return acc;
  }, initialMap);

  const teacherBreakdownList: TeacherBreakdownItem[] = (Object.values(teacherBreakdown) as TeacherBreakdownItem[]).sort(
    (a, b) => b.positive - a.positive
  );

  // Filter missions relevant to this student
  const studentMissions = missions.filter(
    (m) =>
      m.target === 'all' ||
      m.target === student.id ||
      (m.targetMajor && m.targetMajor === student.major)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 relative my-auto animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
        dir="rtl"
      >
        {/* Top Header with WE School purple accent */}
        <div className="bg-linear-to-r from-slate-900 via-[#3B0764] to-[#1E1B4B] text-white p-5 sm:p-6 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Student Info */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={student.avatar}
                  alt={student.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-purple-300 shadow-md bg-slate-800"
                />
                <span
                  className="absolute -bottom-1 -left-1 p-1 bg-slate-900 border border-purple-400 rounded-full text-base"
                  title={badgeInfo.title}
                >
                  {badgeInfo.badgeEmoji}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-white">{student.name}</h1>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-white/15 text-purple-200">
                    #{student.code}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-purple-200 mt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-cyan-300" />
                    {student.major}
                  </span>
                  <span>•</span>
                  <span>{student.grade}</span>
                  <span>•</span>
                  <span className="font-mono">{student.id}</span>
                </div>

                {/* Score & Badge Highlight */}
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black ${badgeInfo.badgeBg} ${badgeInfo.textColor} border ${badgeInfo.borderColor}`}
                  >
                    <span>{badgeInfo.badgeEmoji}</span>
                    <span>{badgeInfo.title}</span>
                  </span>
                  <span className="text-xs text-purple-200 font-bold">
                    {student.points} نقطة ({student.percentage}% إنجاز)
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons for Teacher */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end flex-wrap">
              <button
                onClick={() => onOpenAddPoints(student, 'positive')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>إضافة نقاط (+)</span>
              </button>

              <button
                onClick={() => onOpenAddPoints(student, 'negative')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600/90 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                <MinusCircle className="w-4 h-4" />
                <span>رصد مخالفة (-)</span>
              </button>

              <button
                onClick={() => onOpenIdCard(student)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition-all"
              >
                <ScanLine className="w-4 h-4 text-cyan-300" />
                <span>عرض الكارنيه وQR</span>
              </button>

              {onEditStudent && (
                <button
                  onClick={() => onEditStudent(student)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  title="تعديل بيانات الطالب، الفصل، ونسبة الحضور"
                >
                  <Pencil className="w-4 h-4" />
                  <span>تعديل البيانات</span>
                </button>
              )}

              {onOpenCertificate && (
                <button
                  onClick={() => onOpenCertificate(student)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>شهادة تميز</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-4 sm:px-6 bg-slate-50 text-xs font-bold gap-4 sm:gap-6 shrink-0 overflow-x-auto whitespace-nowrap">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
              activeTab === 'overview'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>نظرة عامة ورسم بياني</span>
          </button>

          <button
            onClick={() => setActiveTab('attribution')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
              activeTab === 'attribution'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>المعلمون والمهندسون الراصدون ({teacherBreakdownList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
              activeTab === 'logs'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>سجل النقاط والمخالفات ({student.logs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('missions')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
              activeTab === 'missions'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>المهام السرية الموكلة ({studentMissions.length})</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: Overview & Graph */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-100">
                  <div className="text-[11px] font-bold text-purple-600 mb-1">صافي النقاط</div>
                  <div className="text-xl font-black text-purple-950">{student.points} نقطة</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">من أصل {student.targetPoints} نقطة أساسية</div>
                </div>

                <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                  <div className="text-[11px] font-bold text-emerald-600 mb-1">إجمالي الحوافز الإيجابية</div>
                  <div className="text-xl font-black text-emerald-950">+{student.totalPositive} نقطة</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">مشاركات وتطبيقات عملية</div>
                </div>

                <div className="p-3.5 bg-rose-50/60 rounded-2xl border border-rose-100">
                  <div className="text-[11px] font-bold text-rose-600 mb-1">المخالفات المسجلة</div>
                  <div className="text-xl font-black text-rose-950">-{student.totalNegative} نقطة</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">ملاحظات انضباط ومواعيد</div>
                </div>

                <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100">
                  <div className="text-[11px] font-bold text-blue-600 mb-1">نسبة الحضور والالتزام</div>
                  <div className="text-xl font-black text-blue-950">{student.attendanceRate}%</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">سجل الحضور بالمعامل</div>
                </div>
              </div>

              {/* Trajectory Performance Graph */}
              <PerformanceChart
                data={student.performanceHistory}
                studentName={student.name}
              />

              {/* Badge Scale Details */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>مقياس البادجات والرتب لمدرسة WE التكنولوجية:</span>
                  </h4>
                  <span className="text-[11px] text-purple-700 font-bold">
                    الرتبة الحالية: {badgeInfo.title} ({student.percentage}%)
                  </span>
                </div>

                {/* Visual Progress Track */}
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden relative mb-3">
                  <div
                    className="bg-linear-to-r from-purple-600 via-indigo-600 to-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${student.percentage}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-5 gap-2 text-center">
                  <div className={`p-2 rounded-xl text-[10px] border ${student.percentage < 30 ? 'bg-amber-100 border-amber-300 font-black' : 'bg-white border-slate-200 text-slate-500'}`}>
                    <div>🥉 مبتدئ</div>
                    <div className="text-[9px]">0 - 29%</div>
                  </div>
                  <div className={`p-2 rounded-xl text-[10px] border ${student.percentage >= 30 && student.percentage < 60 ? 'bg-blue-100 border-blue-300 font-black text-blue-800' : 'bg-white border-slate-200 text-slate-500'}`}>
                    <div>🥈 جيد</div>
                    <div className="text-[9px]">30 - 59%</div>
                  </div>
                  <div className={`p-2 rounded-xl text-[10px] border ${student.percentage >= 60 && student.percentage < 80 ? 'bg-emerald-100 border-emerald-300 font-black text-emerald-800' : 'bg-white border-slate-200 text-slate-500'}`}>
                    <div>🥇 متقدم</div>
                    <div className="text-[9px]">60 - 79%</div>
                  </div>
                  <div className={`p-2 rounded-xl text-[10px] border ${student.percentage >= 80 && student.percentage < 90 ? 'bg-purple-100 border-purple-300 font-black text-purple-800' : 'bg-white border-slate-200 text-slate-500'}`}>
                    <div>💎 محترف</div>
                    <div className="text-[9px]">80 - 89%</div>
                  </div>
                  <div className={`p-2 rounded-xl text-[10px] border ${student.percentage >= 90 ? 'bg-amber-100 border-amber-400 font-black text-amber-900 ring-2 ring-amber-400' : 'bg-white border-slate-200 text-slate-500'}`}>
                    <div>👑 قائد</div>
                    <div className="text-[9px]">90%+</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Teacher & Engineer Attribution */}
          {activeTab === 'attribution' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50/80 rounded-2xl border border-purple-200 text-xs text-purple-900 flex items-center justify-between">
                <div>
                  <strong>مصادر نقاط الطالب ({student.name}):</strong> يوضح هذا القسم المعلمين والمهندسين الذين رصدوا له النقاط، مع إجمالي الحوافز والمخالفات لكل معلم.
                </div>
                <span className="px-3 py-1 bg-purple-600 text-white font-bold rounded-xl text-[11px]">
                  {teacherBreakdownList.length} معلمين ومهندسين
                </span>
              </div>

              {teacherBreakdownList.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs">
                  لا توجد إجراءات مسجلة لهذا الطالب حتى الآن
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teacherBreakdownList.map((item) => (
                    <div key={item.name} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-sm">
                            <UserCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-sm text-slate-900">{item.name}</h4>
                            <p className="text-[11px] text-slate-500">{item.count} إجراء مسجل للطالب</p>
                          </div>
                        </div>

                        <div className="text-left font-mono">
                          <span
                            className={`px-2.5 py-1 rounded-xl text-xs font-black ${
                              item.positive - item.negative >= 0
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {item.positive - item.negative >= 0
                              ? `+${item.positive - item.negative}`
                              : item.positive - item.negative}{' '}
                            نقطة
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center text-xs py-2 bg-slate-50 rounded-xl">
                        <div>
                          <span className="text-slate-400 block text-[10px]">حوافز إيجابية</span>
                          <span className="font-black text-emerald-600">+{item.positive}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">مخالفات مسجلة</span>
                          <span className="font-black text-rose-600">-{item.negative}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold text-slate-400 block">آخر الملاحظات:</span>
                        {item.logs.slice(0, 2).map((l) => (
                          <div
                            key={l.id}
                            className="text-[11px] text-slate-600 flex items-start gap-1.5 bg-slate-50 p-2 rounded-lg"
                          >
                            <span
                              className={
                                l.type === 'positive'
                                  ? 'text-emerald-600 font-bold'
                                  : 'text-rose-600 font-bold'
                              }
                            >
                              {l.points > 0 ? `+${l.points}` : l.points}
                            </span>
                            <span className="truncate">
                              {l.category}: {l.note}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Point Logs */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setLogFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      logFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    الكل ({student.logs.length})
                  </button>
                  <button
                    onClick={() => setLogFilter('positive')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      logFilter === 'positive' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    النقاط الإيجابية (+)
                  </button>
                  <button
                    onClick={() => setLogFilter('negative')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      logFilter === 'negative' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    المخالفات (-)
                  </button>
                </div>

                <button
                  onClick={() => onOpenAddPoints(student)}
                  className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>تسجيل إجراء جديد</span>
                </button>
              </div>

              {filteredLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs">
                  لا توجد سجلات مسجلة ضمن هذا التصنيف
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredLogs.map((log) => {
                    const isPos = log.type === 'positive';
                    return (
                      <div
                        key={log.id}
                        className={`p-3.5 rounded-2xl border transition-all text-xs flex items-start justify-between gap-3 ${
                          isPos
                            ? 'bg-emerald-50/40 border-emerald-200/80 hover:bg-emerald-50'
                            : 'bg-rose-50/40 border-rose-200/80 hover:bg-rose-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                              isPos
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {isPos ? <PlusCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                          </span>

                          <div className="space-y-1 text-right">
                            <div className="font-extrabold text-slate-900 text-sm">
                              {log.category}
                            </div>
                            <p className="text-slate-600 leading-relaxed">
                              {log.note}
                            </p>
                            <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-1">
                              <span className="flex items-center gap-1">
                                <UserCheck className="w-3 h-3 text-purple-600" />
                                {log.teacherName}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1 font-mono">
                                <Clock className="w-3 h-3" />
                                {new Date(log.createdAt).toLocaleDateString('ar-EG', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`text-sm font-black px-2.5 py-1 rounded-xl shrink-0 ${
                            isPos
                              ? 'bg-emerald-600 text-white'
                              : 'bg-rose-600 text-white'
                          }`}
                        >
                          {log.points > 0 ? `+${log.points}` : log.points} نقطة
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Secret Missions */}
          {activeTab === 'missions' && (
            <div className="space-y-4">
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900 flex items-center justify-between">
                <div>
                  <strong>المهام والتحديات السرية:</strong> مهام موكلة للطالب بناء على تخصصه (
                  {student.major}) لاختبار مهاراته التكنولوجية.
                </div>
                <span className="px-2.5 py-1 bg-purple-600 text-white font-bold rounded-lg text-[10px]">
                  مكتمل: {student.secretMissionsCompleted}
                </span>
              </div>

              {studentMissions.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs">
                  لا توجد مهام سرية موجهة لهذا الطالب حالياً
                </div>
              ) : (
                <div className="space-y-3">
                  {studentMissions.map((mission) => {
                    const submission = mission.submissions.find(
                      (sub) => sub.studentId === student.id
                    );
                    const isDone = !!submission;

                    return (
                      <div
                        key={mission.id}
                        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 text-right"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-md">
                                {mission.type === 'quiz' ? 'كويز سري' : mission.type === 'task' ? 'مهمة عملية' : 'تحدي تقني'}
                              </span>
                              <h4 className="font-extrabold text-sm text-slate-900">{mission.title}</h4>
                            </div>
                            <p className="text-xs text-slate-600 mt-1">{mission.description}</p>
                          </div>

                          <div className="text-left shrink-0">
                            <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                              +{mission.pointsReward} نقطة
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <div className="text-[11px] text-slate-500">
                            المعلم: <strong>{mission.createdBy}</strong> • الموعد النهائي: {mission.deadline}
                          </div>

                          <div>
                            {isDone ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg font-bold border border-emerald-200 text-[11px]">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>تم الإنجاز والتقييم ({submission.awardedPoints || mission.pointsReward} نقطة)</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg font-bold border border-amber-200 text-[11px]">
                                <Clock className="w-3.5 h-3.5" />
                                <span>قيد التنفيذ / بانتظار التسليم</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
