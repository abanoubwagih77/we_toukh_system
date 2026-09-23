import React, { useState, useMemo } from 'react';
import { Student, SecretMission, PointLog } from '../types';
import { BADGE_TIERS, calculateNextBadgeInfo } from '../utils/badges';
import { PerformanceChart } from './PerformanceChart';
import { IdCardModal } from './IdCardModal';
import {
  Award,
  TrendingUp,
  TrendingDown,
  Target,
  FileText,
  ScanLine,
  LogOut,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  Cpu,
  GraduationCap,
  ShieldCheck,
  Zap,
  UserCheck
} from 'lucide-react';

interface StudentPortalViewProps {
  student: Student;
  missions: SecretMission[];
  onLogout: () => void;
  onSubmitQuiz: (missionId: string, studentId: string, score: number, answerText: string) => void;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  student,
  missions,
  onLogout,
  onSubmitQuiz
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'attribution' | 'logs' | 'missions' | 'badges'>('overview');
  const [isIdCardOpen, setIsIdCardOpen] = useState<boolean>(false);

  // Quiz interactive state for student
  const [activeQuizMission, setActiveQuizMission] = useState<SecretMission | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [writtenAnswer, setWrittenAnswer] = useState<string>('');
  const [quizSubmittedMessage, setQuizSubmittedMessage] = useState<string>('');

  const badgeInfo = BADGE_TIERS[student.badge];
  const nextBadge = calculateNextBadgeInfo(student.percentage, student.points, student.targetPoints);

  // Teacher breakdown for student
  const teacherBreakdownList = useMemo(() => {
    const map = new Map<string, { name: string; positive: number; negative: number; count: number; logs: PointLog[] }>();
    student.logs.forEach((log) => {
      const tName = log.teacherName || 'معلم المادة التكنولوجية';
      if (!map.has(tName)) {
        map.set(tName, { name: tName, positive: 0, negative: 0, count: 0, logs: [] });
      }
      const item = map.get(tName)!;
      item.count += 1;
      if (log.type === 'positive') item.positive += log.points;
      else item.negative += Math.abs(log.points);
      item.logs.push(log);
    });
    return Array.from(map.values()).sort((a, b) => b.positive - a.positive);
  }, [student.logs]);

  const studentMissions = missions.filter(
    (m) =>
      m.assignedTo === 'all' ||
      (m.assignedTo === 'track' && m.targetTrack === student.major) ||
      (m.assignedTo === 'specific_student' && m.targetStudentId === student.id)
  );

  const isRising =
    student.performanceHistory.length >= 2
      ? student.performanceHistory[student.performanceHistory.length - 1].percentage >=
        student.performanceHistory[0].percentage
      : true;

  const handleStartQuiz = (mission: SecretMission) => {
    setActiveQuizMission(mission);
    setSelectedAnswers({});
    setWrittenAnswer('');
    setQuizSubmittedMessage('');
  };

  const handleFinishQuiz = () => {
    if (!activeQuizMission) return;

    let score = 0;
    if (activeQuizMission.quizQuestions && activeQuizMission.quizQuestions.length > 0) {
      activeQuizMission.quizQuestions.forEach((q) => {
        if (selectedAnswers[q.id] === q.correctIndex) {
          score += 100 / activeQuizMission.quizQuestions!.length;
        }
      });
      score = Math.round(score);
    } else {
      score = 100;
    }

    onSubmitQuiz(
      activeQuizMission.id,
      student.id,
      score,
      writtenAnswer.trim() || 'تم تسليم الإجابة من بوابة الطالب الذكية'
    );

    setQuizSubmittedMessage(`تهانينا! تم تسليم المهمة واحتساب +${activeQuizMission.pointsReward} نقطة لرصيدك بنجاح!`);
    setTimeout(() => {
      setActiveQuizMission(null);
      setQuizSubmittedMessage('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16" dir="rtl">
      {/* Top Student Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-[#4A154B] to-[#7C3AED] flex items-center justify-center text-white font-black text-xl shadow-md border border-purple-400/40 shrink-0">
                we
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-base sm:text-lg text-slate-950">
                    بوابة الطالب التكنولوجية
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-900 text-[10px] font-extrabold border border-cyan-200">
                    طالب WE
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  مرحباً بك: <strong>{student.name}</strong> • #{student.code}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsIdCardOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold border border-purple-200 transition-colors cursor-pointer"
              >
                <ScanLine className="w-4 h-4 text-purple-700" />
                <span className="hidden sm:inline">كارنيهي وكود QR</span>
              </button>

              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
                title="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
                <span>خروج</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        {/* Student Hero Banner */}
        <div className="bg-linear-to-r from-purple-950 via-[#3B0764] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-400/30 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            {/* Student Info */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative">
                <img
                  src={student.avatar}
                  alt={student.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-3 border-purple-300 shadow-xl bg-purple-900"
                />
                <span
                  className="absolute -bottom-1 -left-1 p-1 bg-white border border-slate-200 rounded-full shadow-md text-sm"
                  title={badgeInfo.title}
                >
                  {badgeInfo.badgeEmoji}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-xl sm:text-2xl font-black text-white">{student.name}</h1>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black border ${badgeInfo.badgeBg} ${badgeInfo.textColor} ${badgeInfo.borderColor}`}
                  >
                    {badgeInfo.badgeEmoji} {badgeInfo.title}
                  </span>
                </div>
                <div className="text-xs text-purple-200 font-mono">
                  الرقم القومي: {student.nationalId} • كود: #{student.code}
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-lg mt-2 border border-cyan-400/30">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>{student.major}</span> • <span>{student.grade}</span>
                </div>
              </div>
            </div>

            {/* Score & Next Rank Box */}
            <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 min-w-64 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-purple-200">رصيدك الحالي:</span>
                <span className="text-lg font-black text-white">{student.points} نقطة ({student.percentage}%)</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-cyan-400 to-amber-300 rounded-full transition-all duration-500"
                  style={{ width: `${student.percentage}%` }}
                />
              </div>

              <div className="text-[11px] text-cyan-200 flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>
                  {nextBadge.nextBadge
                    ? `متبقي لك ${nextBadge.pointsNeeded} نقاط للوصول لرتبة ${nextBadge.nextBadge.title} ${nextBadge.nextBadge.badgeEmoji}`
                    : 'تهانينا! أنت في الرتبة القيادية القصوى بالمدرسة 👑'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs for Student */}
        <div className="flex border-b border-slate-200 bg-white p-2 rounded-2xl border shadow-2xs text-xs font-bold gap-2 overflow-x-auto whitespace-nowrap">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>منحنى مستواي وجراف الأداء</span>
          </button>

          <button
            onClick={() => setActiveTab('attribution')}
            className={`py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'attribution'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>المعلمون والمهندسون الراصدون ({teacherBreakdownList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'logs'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>سجل نقاطي وملاحظات المعلمين ({student.logs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('missions')}
            className={`py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'missions'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>سيكريت ميشن والتحديات ({studentMissions.length})</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & PERFORMANCE CHART */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-500 font-bold block">إجمالي النقاط المكتسبة</span>
                <span className="text-xl font-black text-emerald-600 mt-1 block">+{student.totalPositive} نقطة</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-500 font-bold block">مجموع خصم المخالفات</span>
                <span className="text-xl font-black text-rose-600 mt-1 block">-{student.totalNegative} نقطة</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-500 font-bold block">معدل الانضباط السلوكي</span>
                <span className="text-xl font-black text-purple-700 mt-1 block">{student.behavioralScore}%</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-500 font-bold block">مهام سرية منجزة</span>
                <span className="text-xl font-black text-amber-600 mt-1 block">{student.secretMissionsCompleted} مهمة</span>
              </div>
            </div>

            {/* Trajectory Insights Banner */}
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                isRising
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isRising ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                  }`}
                >
                  {isRising ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm">
                    {isRising ? 'مؤشر أدائك في مسار صاعد متميز!' : 'تنبيه: مؤشر أدائك يشهد تراجعاً مؤقتاً'}
                  </h4>
                  <p className="text-xs opacity-90 mt-0.5">
                    {isRising
                      ? 'مشاركتك الفعالة بالمعامل وحل المهام السرية رفعت رصيد نقاطك نحو الرتبة القيادية.'
                      : 'سجلت بعض الملاحظات السلوكية مؤخراً. شارك في المعمل التقني وحل السيكريت ميشن لتعويض النقاط!'}
                  </p>
                </div>
              </div>
            </div>

            {/* Performance Chart Component */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    جراف وتطور النقاط والمستوى خلال الأسابيع
                  </h3>
                  <p className="text-xs text-slate-500">
                    تتبع دقيق لنسبة النقاط، الأداء الأكاديمي، والانضباط السلوكي
                  </p>
                </div>
              </div>

              <PerformanceChart history={student.performanceHistory} />
            </div>
          </div>
        )}

        {/* TAB 2: DETAILED LOGS & TEACHER FEEDBACK */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 pb-2 border-b border-slate-100">
              سجل الحوافز والمخالفات المرصودة من المعلمين
            </h3>

            {student.logs.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                لا توجد سجلات مسجلة حتى الآن.
              </div>
            ) : (
              <div className="space-y-3">
                {student.logs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-4 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      log.type === 'positive'
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-rose-50/50 border-rose-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          log.type === 'positive'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {log.type === 'positive' ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <AlertTriangle className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-slate-900">{log.category}</span>
                          <span
                            className={`font-black px-2 py-0.5 rounded-md text-[11px] ${
                              log.type === 'positive'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-rose-600 text-white'
                            }`}
                          >
                            {log.type === 'positive' ? `+${log.points}` : log.points} نقطة
                          </span>
                        </div>
                        <p className="text-slate-600 mt-1">{log.note}</p>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                          <span>المعلم الراصد: {log.teacherName}</span>
                          <span>•</span>
                          <span>{new Date(log.createdAt).toLocaleDateString('ar-EG')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SECRET MISSIONS */}
        {activeTab === 'missions' && (
          <div className="space-y-6">
            <div className="p-4 bg-linear-to-r from-purple-100 to-indigo-100 rounded-2xl border border-purple-200 text-purple-900 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-700 shrink-0" />
                <div>
                  <strong>تحديات سيكريت ميشن:</strong> حل الكويزات والمهام البرمجية بالأسفل لتكسب مكافأة
                  نقاط فورية وترفع بادجك التكنولوجي!
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {studentMissions.map((m) => {
                const sub = m.submissions.find((s) => s.studentId === student.id);
                const isApproved = sub?.status === 'approved';

                return (
                  <div
                    key={m.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-xl bg-purple-100 text-purple-800 text-[11px] font-bold">
                          {m.type === 'quiz' ? 'كويز تفاعلي' : m.type === 'code_task' ? 'مهمة برمجية' : 'تحدي عملي'}
                        </span>
                        <span className="font-extrabold text-amber-600 text-xs bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          +{m.pointsReward} نقطة
                        </span>
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-sm mb-1">{m.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">{m.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      {isApproved ? (
                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>تم إنجاز المهمة واعتماد النقاط!</span>
                          </span>
                          <span className="text-[11px] bg-emerald-600 text-white px-2 py-0.5 rounded-md">
                            +{sub.awardedPoints} نقطة
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartQuiz(m)}
                          className="w-full py-2.5 px-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Zap className="w-4 h-4 text-amber-300" />
                          <span>ابدأ حل التحدي الآن</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: TEACHER ATTRIBUTION FOR STUDENT */}
        {activeTab === 'attribution' && (
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-purple-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-sm mb-1 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-purple-700" />
                  <span>توزيع نقاطك وملاحظاتك حسب السادة المعلمين والمهندسين</span>
                </h3>
                <p className="text-xs text-purple-700">
                  شفافية كاملة: تعرف على من قام بمنحك الحوافز أو رصد الملاحظات من معلمي المواد ومهندسي التدريب العملي بمدرسة WE.
                </p>
              </div>
            </div>

            {teacherBreakdownList.length === 0 ? (
              <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200 text-sm">
                لم يتم رصد إجراءات لك حتى الآن من قبل السادة المعلمين
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teacherBreakdownList.map((item) => (
                  <div key={item.name} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                          <UserCheck className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900">{item.name}</h4>
                          <p className="text-xs text-slate-500">{item.count} ملاحظة / تقييم</p>
                        </div>
                      </div>

                      <div className="text-left font-mono">
                        <span
                          className={`px-3 py-1.5 rounded-xl text-xs font-black ${
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

                    <div className="grid grid-cols-2 gap-2 text-center text-xs py-2.5 bg-slate-50 rounded-xl">
                      <div>
                        <span className="text-slate-400 block text-[10px]">حوافز إيجابية لك</span>
                        <span className="font-black text-emerald-600 text-sm">+{item.positive}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">ملاحظات سلوكية / خصم</span>
                        <span className="font-black text-rose-600 text-sm">-{item.negative}</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <span className="text-[11px] font-bold text-slate-500 block">سجل ملاحظات هذا المعلم لك:</span>
                      {item.logs.map((l) => (
                        <div
                          key={l.id}
                          className="text-xs text-slate-700 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 flex items-start justify-between gap-2"
                        >
                          <div className="flex items-start gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-md font-mono font-bold text-[11px] shrink-0 ${
                                l.type === 'positive'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {l.points > 0 ? `+${l.points}` : l.points}
                            </span>
                            <div>
                              <span className="font-bold text-slate-900">{l.category}</span>
                              <p className="text-slate-500 text-[11px] mt-0.5">{l.note}</p>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 shrink-0 font-mono">{l.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL: SOLVE SECRET MISSION QUIZ */}
      {activeQuizMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8" dir="rtl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                  +{activeQuizMission.pointsReward} نقطة مكافأة
                </span>
                <h3 className="font-extrabold text-sm text-slate-900 mt-1">{activeQuizMission.title}</h3>
              </div>
              <button
                onClick={() => setActiveQuizMission(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                إغلاق
              </button>
            </div>

            {quizSubmittedMessage ? (
              <div className="p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="font-black text-base text-slate-900">{quizSubmittedMessage}</h4>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <p className="text-slate-600 leading-relaxed">{activeQuizMission.description}</p>

                {/* Multiple choice questions if present */}
                {activeQuizMission.quizQuestions && activeQuizMission.quizQuestions.length > 0 && (
                  <div className="space-y-4">
                    {activeQuizMission.quizQuestions.map((q, idx) => (
                      <div key={q.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <div className="font-extrabold text-slate-900">
                          س{idx + 1}: {q.question}
                        </div>
                        <div className="space-y-1.5">
                          {q.options.map((opt, oIdx) => (
                            <label
                              key={oIdx}
                              className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-all ${
                                selectedAnswers[q.id] === oIdx
                                  ? 'bg-purple-100 border-purple-500 text-purple-900 font-bold'
                                  : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`q-${q.id}`}
                                checked={selectedAnswers[q.id] === oIdx}
                                onChange={() =>
                                  setSelectedAnswers((prev) => ({ ...prev, [q.id]: oIdx }))
                                }
                                className="text-purple-600"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Free text or project link submission */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    إجابتك / رابط المشروع أو المستودع (GitHub / CodePen):
                  </label>
                  <textarea
                    rows={3}
                    placeholder="اكتب توضيحك أو رابط الحل هنا..."
                    value={writtenAnswer}
                    onChange={(e) => setWrittenAnswer(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => setActiveQuizMission(null)}
                    className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleFinishQuiz}
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md"
                  >
                    تسليم الإجابة واحتساب النقاط
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ID Card Modal */}
      <IdCardModal
        student={student}
        isOpen={isIdCardOpen}
        onClose={() => setIsIdCardOpen(false)}
      />
    </div>
  );
};
