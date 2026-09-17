import React, { useState, useMemo } from 'react';
import { Student, Teacher, PointLog } from '../types';
import { INITIAL_TEACHERS } from '../data/mockData';
import {
  UserCheck,
  Search,
  Filter,
  PlusCircle,
  MinusCircle,
  Clock,
  Award,
  Sparkles,
  Download,
  Eye,
  FileCheck,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Calendar,
  Layers
} from 'lucide-react';
import { exportAttributionLogs } from '../utils/exportUtils';

interface TeacherAttributionViewProps {
  students: Student[];
  onOpenStudentProfile: (student: Student) => void;
  onOpenCertificate: (student: Student, teacherName: string) => void;
}

export const TeacherAttributionView: React.FC<TeacherAttributionViewProps> = ({
  students,
  onOpenStudentProfile,
  onOpenCertificate
}) => {
  const [selectedTeacher, setSelectedTeacher] = useState<string>('all');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'positive' | 'negative'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Collect all logs flattened across all students with reference to their student
  const allLogsWithStudent = useMemo(() => {
    const list: Array<{
      log: PointLog;
      student: Student;
    }> = [];

    students.forEach((student) => {
      student.logs.forEach((log) => {
        list.push({
          log,
          student
        });
      });
    });

    // Sort chronologically newest first
    return list.sort(
      (a, b) => new Date(b.log.createdAt).getTime() - new Date(a.log.createdAt).getTime()
    );
  }, [students]);

  // Aggregate statistics per teacher
  const teacherStats = useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        positivePoints: number;
        negativePoints: number;
        positiveCount: number;
        negativeCount: number;
        studentsRewarded: Set<string>;
        topCategory: Record<string, number>;
      }
    >();

    INITIAL_TEACHERS.forEach((t) => {
      map.set(t.name, {
        name: t.name,
        positivePoints: 0,
        negativePoints: 0,
        positiveCount: 0,
        negativeCount: 0,
        studentsRewarded: new Set(),
        topCategory: {}
      });
    });

    allLogsWithStudent.forEach(({ log, student }) => {
      const teacherName = log.teacherName || 'معلم المادة التكنولوجية';
      if (!map.has(teacherName)) {
        map.set(teacherName, {
          name: teacherName,
          positivePoints: 0,
          negativePoints: 0,
          positiveCount: 0,
          negativeCount: 0,
          studentsRewarded: new Set(),
          topCategory: {}
        });
      }
      const entry = map.get(teacherName)!;
      if (log.type === 'positive') {
        entry.positivePoints += log.points;
        entry.positiveCount += 1;
        entry.studentsRewarded.add(student.name);
      } else {
        entry.negativePoints += Math.abs(log.points);
        entry.negativeCount += 1;
      }
      entry.topCategory[log.category] = (entry.topCategory[log.category] || 0) + 1;
    });

    return Array.from(map.values());
  }, [allLogsWithStudent]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return allLogsWithStudent.filter(({ log, student }) => {
      // Filter by teacher
      if (selectedTeacher !== 'all' && log.teacherName !== selectedTeacher) {
        return false;
      }

      // Filter by student
      if (selectedStudentId !== 'all' && student.id !== selectedStudentId) {
        return false;
      }

      // Filter by type
      if (typeFilter !== 'all' && log.type !== typeFilter) {
        return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchStudent =
          student.name.toLowerCase().includes(query) ||
          student.code.includes(query) ||
          student.nationalId.includes(query) ||
          student.major.toLowerCase().includes(query);
        const matchTeacher = log.teacherName.toLowerCase().includes(query);
        const matchNote = log.note.toLowerCase().includes(query);
        const matchCategory = log.category.toLowerCase().includes(query);

        if (!matchStudent && !matchTeacher && !matchNote && !matchCategory) {
          return false;
        }
      }

      return true;
    });
  }, [allLogsWithStudent, selectedTeacher, selectedStudentId, typeFilter, searchQuery]);

  // If a student is selected, get detailed teacher breakdown for THAT student
  const activeStudent = useMemo(() => {
    if (selectedStudentId === 'all') return null;
    return students.find((s) => s.id === selectedStudentId) || null;
  }, [students, selectedStudentId]);

  const activeStudentTeacherBreakdown = useMemo(() => {
    if (!activeStudent) return [];
    const map = new Map<
      string,
      {
        teacherName: string;
        positive: number;
        negative: number;
        logs: PointLog[];
      }
    >();

    activeStudent.logs.forEach((log) => {
      const tName = log.teacherName || 'معلم المادة التكنولوجية';
      if (!map.has(tName)) {
        map.set(tName, { teacherName: tName, positive: 0, negative: 0, logs: [] });
      }
      const item = map.get(tName)!;
      if (log.type === 'positive') {
        item.positive += log.points;
      } else {
        item.negative += Math.abs(log.points);
      }
      item.logs.push(log);
    });

    return Array.from(map.values()).sort((a, b) => b.positive - a.positive);
  }, [activeStudent]);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-md border border-purple-400/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
            <UserCheck className="w-7 h-7 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">سجل مصادر النقاط وتوزيع تقييمات المعلمين والمهندسين</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-200 text-xs font-bold border border-cyan-400/30">
                Attribution & Audit
              </span>
            </div>
            <p className="text-xs text-purple-200 mt-1 max-w-2xl leading-relaxed">
              تعرف بدقة على كل نقطة حصل عليها أي طالب: من هو المعلم أو المهندس الذي رصدها، سبب المكافأة أو المخالفة،
              ومقدار مساهمة كل مهندس في نقاط الطالب وبادجاته.
            </p>
          </div>
        </div>

        <button
          onClick={() => exportAttributionLogs(students)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-purple-50 text-purple-950 text-xs font-black rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <Download className="w-4 h-4 text-purple-700" />
          <span>تصدير السجل الكامل (Excel)</span>
        </button>
      </div>

      {/* Teacher / Engineer Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {teacherStats.map((t) => {
          const matchingTeacher = INITIAL_TEACHERS.find((it) => it.name === t.name);
          const isSelected = selectedTeacher === t.name;

          return (
            <div
              key={t.name}
              onClick={() => setSelectedTeacher(isSelected ? 'all' : t.name)}
              className={`bg-white rounded-3xl p-4 border transition-all cursor-pointer text-right flex flex-col justify-between ${
                isSelected
                  ? 'border-purple-600 ring-2 ring-purple-500/20 shadow-md bg-purple-50/20'
                  : 'border-slate-200 hover:border-purple-300 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={
                      matchingTeacher?.avatar ||
                      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
                    }
                    alt={t.name}
                    className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-black text-slate-900 truncate">{t.name}</h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      {matchingTeacher?.subject || 'معلم المادة التكنولوجية'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-2xl text-center mb-3">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">نقاط محفزة</span>
                    <span className="text-sm font-black text-emerald-600">+{t.positivePoints}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">مخالفات</span>
                    <span className="text-sm font-black text-rose-600">-{t.negativePoints}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                <span>{t.positiveCount + t.negativeCount} إجراء مرصود</span>
                <span
                  className={`font-black ${
                    isSelected ? 'text-purple-700' : 'text-slate-400'
                  }`}
                >
                  {isSelected ? '✓ مُفعّل' : 'تصفية'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Focus Inspection: Specific Student Attribution Box */}
      {activeStudent && (
        <div className="bg-white rounded-3xl p-6 border-2 border-purple-200 shadow-md animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3.5">
              <img
                src={activeStudent.avatar}
                alt={activeStudent.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-300 shadow-xs"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-950">{activeStudent.name}</h3>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-bold rounded-full">
                    كود: {activeStudent.code}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {activeStudent.grade} • تخصص: <strong>{activeStudent.major}</strong> • رصيد النقاط:{' '}
                  <strong className="text-purple-700 font-mono text-sm">{activeStudent.points}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenStudentProfile(activeStudent)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black rounded-xl transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-purple-700" />
                <span>عرض الملف الشامل</span>
              </button>
              <button
                onClick={() =>
                  onOpenCertificate(
                    activeStudent,
                    activeStudentTeacherBreakdown[0]?.teacherName || 'م. أحمد ممدوح'
                  )
                }
                className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl shadow-xs transition-colors"
              >
                <Award className="w-3.5 h-3.5" />
                <span>إصدار شهادة تقدير</span>
              </button>
              <button
                onClick={() => setSelectedStudentId('all')}
                className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800 font-bold"
              >
                إلغاء التحديد
              </button>
            </div>
          </div>

          {/* Breakdown per Teacher for this student */}
          <div className="pt-4">
            <h4 className="text-xs font-extrabold text-slate-700 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>من أين حصل الطالب على نقاطه؟ (توزيع السادة المهندسين والمعلمين):</span>
            </h4>

            {activeStudentTeacherBreakdown.length === 0 ? (
              <p className="text-xs text-slate-500 italic">لا توجد سجلات نقاط مسجلة لهذا الطالب بعد.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {activeStudentTeacherBreakdown.map((item) => {
                  const teacherObj = INITIAL_TEACHERS.find((t) => t.name === item.teacherName);
                  const netScore = item.positive - item.negative;

                  return (
                    <div
                      key={item.teacherName}
                      className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              teacherObj?.avatar ||
                              'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
                            }
                            alt={item.teacherName}
                            className="w-8 h-8 rounded-xl object-cover border border-slate-300"
                          />
                          <div>
                            <span className="text-xs font-black text-slate-900 block">
                              {item.teacherName}
                            </span>
                            <span className="text-[10px] text-slate-500 block truncate max-w-[130px]">
                              {teacherObj?.subject || 'معلم المادة التكنولوجية'}
                            </span>
                          </div>
                        </div>

                        <div className="text-left">
                          <span
                            className={`text-xs font-black font-mono px-2 py-0.5 rounded-lg ${
                              netScore >= 0
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {netScore >= 0 ? `+${netScore}` : netScore} نقطة
                          </span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-600 flex items-center justify-between bg-white px-2.5 py-1.5 rounded-xl border border-slate-200">
                        <span className="text-emerald-700 font-bold">
                          +{item.positive} حوافز
                        </span>
                        <span className="text-rose-700 font-bold">
                          -{item.negative} مخالفات
                        </span>
                        <span className="text-slate-400 font-mono">
                          {item.logs.length} إجراء
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Query */}
          <div className="sm:col-span-4 relative">
            <input
              type="text"
              placeholder="ابحث باسم الطالب، المعلم، سبب المنح، الملاحظة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 pr-10 text-xs border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-slate-50/60"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
          </div>

          {/* Filter by Specific Student */}
          <div className="sm:col-span-3">
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="all">كافة طلاب المدرسة (عرض مجمع)</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code} - {s.major})
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Teacher */}
          <div className="sm:col-span-3">
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="all">كافة السادة المعلمين والمهندسين</option>
              {INITIAL_TEACHERS.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name} ({t.subject})
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Type */}
          <div className="sm:col-span-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="all">كافة الأنواع (+ و -)</option>
              <option value="positive">نقاط إيجابية فقط (+)</option>
              <option value="negative">مخالفات فقط (-)</option>
            </select>
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            تم العثور على <strong>{filteredLogs.length}</strong> إجراء موثق
            {selectedTeacher !== 'all' && ` للمهندس: ${selectedTeacher}`}
          </span>

          {(selectedTeacher !== 'all' ||
            selectedStudentId !== 'all' ||
            typeFilter !== 'all' ||
            searchQuery) && (
            <button
              onClick={() => {
                setSelectedTeacher('all');
                setSelectedStudentId('all');
                setTypeFilter('all');
                setSearchQuery('');
              }}
              className="text-purple-700 hover:text-purple-900 font-bold"
            >
              إعادة ضبط الفلاتر
            </button>
          )}
        </div>
      </div>

      {/* Comprehensive Activity Log Feed */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-700" />
            <h3 className="font-black text-sm text-slate-900">سجل الوقائع والتقييمات التفصيلي</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            مرتب زمنياً من الأحدث إلى الأقدم
          </span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <UserCheck className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="font-bold text-sm">لا توجد سجلات تطابق شروط البحث الحالية</p>
            <p className="text-xs text-slate-400">جرب تعديل المعلم المختار أو البحث عن طالب آخر</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLogs.map(({ log, student }, index) => {
              const teacherObj = INITIAL_TEACHERS.find(
                (t) => t.name === (log.teacherName || '')
              );
              const isPositive = log.type === 'positive';
              const logDate = new Date(log.createdAt).toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={`${log.id}-${index}`}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Student & Action Info */}
                  <div className="flex items-start gap-3.5">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      onClick={() => onOpenStudentProfile(student)}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 cursor-pointer shrink-0 hover:opacity-90"
                    />

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => onOpenStudentProfile(student)}
                          className="font-black text-sm text-slate-900 hover:text-purple-700 text-right transition-colors"
                        >
                          {student.name}
                        </button>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] font-mono rounded-lg">
                          {student.code}
                        </span>
                        <span className="text-[11px] text-slate-500 font-semibold">
                          {student.major}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isPositive
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {isPositive ? (
                            <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <MinusCircle className="w-3.5 h-3.5 text-rose-600" />
                          )}
                          <span>{log.category}</span>
                        </span>

                        <span className="text-xs text-slate-600 font-medium">
                          «{log.note}»
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Teacher Awarder & Points Display */}
                  <div className="flex items-center justify-between md:justify-end gap-5 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                    {/* The Teacher Who Awarded It */}
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <div className="text-right">
                          <span className="text-xs font-black text-slate-900 block">
                            {log.teacherName || 'معلم المادة التكنولوجية'}
                          </span>
                          <span className="text-[10px] text-purple-700 font-semibold block">
                            {teacherObj?.subject || 'مشرف تقني'}
                          </span>
                        </div>
                        <img
                          src={
                            teacherObj?.avatar ||
                            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
                          }
                          alt={log.teacherName}
                          className="w-8 h-8 rounded-xl object-cover border border-slate-300 shrink-0"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                        {logDate}
                      </span>
                    </div>

                    {/* Points Pill */}
                    <div
                      className={`min-w-[65px] text-center px-3 py-2 rounded-2xl font-black text-sm font-mono border ${
                        isPositive
                          ? 'bg-emerald-500/10 text-emerald-700 border-emerald-300'
                          : 'bg-rose-500/10 text-rose-700 border-rose-300'
                      }`}
                    >
                      {isPositive ? `+${log.points}` : log.points}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
