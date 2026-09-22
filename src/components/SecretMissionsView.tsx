import React, { useState } from 'react';
import { SecretMission, Student, QuizQuestion } from '../types';
import { SCHOOL_INFO } from '../data/mockData';
import confetti from 'canvas-confetti';
import {
  Target,
  Plus,
  Shield,
  HelpCircle,
  FileCode,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  Send,
  Sparkles,
  Users,
  Eye,
  Check,
  X,
  Code,
  Trash2
} from 'lucide-react';

interface SecretMissionsViewProps {
  missions: SecretMission[];
  students: Student[];
  onAddMission: (newMission: SecretMission) => void;
  onDeleteMission?: (missionId: string) => void;
  onGradeSubmission: (
    missionId: string,
    studentId: string,
    status: 'approved' | 'rejected',
    feedback: string,
    points: number
  ) => void;
  onSimulateStudentQuiz: (
    missionId: string,
    studentId: string,
    score: number,
    answerText: string
  ) => void;
}

export const SecretMissionsView: React.FC<SecretMissionsViewProps> = ({
  missions,
  students,
  onAddMission,
  onDeleteMission,
  onGradeSubmission,
  onSimulateStudentQuiz
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [activeReviewMission, setActiveReviewMission] = useState<SecretMission | null>(null);
  const [activeQuizStudentModal, setActiveQuizStudentModal] = useState<SecretMission | null>(null);

  // New Mission Form State
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [type, setType] = useState<'task' | 'quiz' | 'challenge'>('task');
  const [targetType, setTargetType] = useState<'all' | 'major' | 'student'>('all');
  const [selectedMajor, setSelectedMajor] = useState<string>(SCHOOL_INFO.majors[0]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [pointsReward, setPointsReward] = useState<number>(20);
  const [badgeReward, setBadgeReward] = useState<string>('مبتكر WE التقني');
  const [deadline, setDeadline] = useState<string>('2026-10-01');
  const [secretCode, setSecretCode] = useState<string>('WE-SECRET-01');
  const [teacherName, setTeacherName] = useState<string>('م. المشرف التكنولوجي');

  // Quiz Builder
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q1',
      question: 'ما هو البروتوكول المستخدم لنقل صفحات الويب الآمنة؟',
      options: ['HTTP', 'HTTPS', 'FTP', 'SMTP'],
      correctIndex: 1
    }
  ]);

  const handleAddQuestion = () => {
    setQuizQuestions([
      ...quizQuestions,
      {
        id: `q_${Date.now()}`,
        question: '',
        options: ['', '', '', ''],
        correctIndex: 0
      }
    ]);
  };

  const handleUpdateQuestion = (index: number, field: string, value: any) => {
    const updated = [...quizQuestions];
    if (field === 'question') {
      updated[index].question = value;
    } else if (field === 'correctIndex') {
      updated[index].correctIndex = value;
    }
    setQuizQuestions(updated);
  };

  const handleUpdateOption = (qIndex: number, optIndex: number, text: string) => {
    const updated = [...quizQuestions];
    updated[qIndex].options[optIndex] = text;
    setQuizQuestions(updated);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    let target = 'all';
    let targetMajor: string | undefined = undefined;

    if (targetType === 'major') {
      targetMajor = selectedMajor;
    } else if (targetType === 'student') {
      target = selectedStudentId;
    }

    const newMission: SecretMission = {
      id: `mission-${Date.now()}`,
      title,
      description,
      type,
      target,
      targetMajor,
      pointsReward,
      badgeReward,
      deadline,
      secretCode: secretCode.toUpperCase(),
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: teacherName,
      status: 'active',
      quizQuestions: type === 'quiz' ? quizQuestions.filter((q) => q.question.trim().length > 0) : undefined,
      submissions: []
    };

    onAddMission(newMission);
    setIsCreateOpen(false);

    // Reset Form
    setTitle('');
    setDescription('');
    setType('task');

    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch {}
  };

  const filteredMissions = missions.filter((m) => {
    if (filterType === 'all') return true;
    return m.type === filterType;
  });

  return (
    <div className="space-y-6" dir="rtl">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-500/30 relative overflow-hidden">
        <div className="absolute left-4 -bottom-10 opacity-10 text-purple-300 pointer-events-none">
          <Target className="w-64 h-64" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/30">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>نظام التحديات السرية • مدرسة WE التكنولوجية</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              صفحة سيكريت ميشن (Secret Missions Hub)
            </h1>
            <p className="text-xs sm:text-sm text-purple-200 max-w-2xl leading-relaxed">
              خصص لطلابك مهاماً عملية وكويزات سرية لقياس مستواهم الأكاديمي والمهاري. فور إنجاز الطالب
              للمهمة واعتمادها، تضاف نقاط المكافأة تلقائياً إلى بروفايله ويرتقي مؤشر أدائه والبادج!
            </p>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-purple-900/50 transition-all shrink-0 hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>إنشاء مهمة أو كويز سري جديد</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 font-bold ml-1">تصفية المهام:</span>
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterType === 'all'
                ? 'bg-white text-purple-950 shadow-xs'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            جميع المهام ({missions.length})
          </button>
          <button
            onClick={() => setFilterType('task')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterType === 'task'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            تاسكات عملية ({missions.filter((m) => m.type === 'task').length})
          </button>
          <button
            onClick={() => setFilterType('quiz')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterType === 'quiz'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            كويزات سرية ({missions.filter((m) => m.type === 'quiz').length})
          </button>
          <button
            onClick={() => setFilterType('challenge')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterType === 'challenge'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            تحديات كود ({missions.filter((m) => m.type === 'challenge').length})
          </button>
        </div>
      </div>

      {/* Missions Grid */}
      {filteredMissions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-purple-200 shadow-xs">
          <div className="w-16 h-16 bg-purple-50 text-purple-700 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-purple-100">
            <Target className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-slate-900">لا توجد مهام سرية مضافة حالياً</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            تم تفريغ كافة البيانات الوهمية بنجاح! يمكنك الآن الضغط على زر "إنشاء مهمة سرية جديدة" باللون البنفسجي بالأعلى لإضافة كويزاتك الحقيقية أو مهامك البرمجية والعملية لطلابك، مع إمكانية حذف أي مهمة بعد إنشائها في أي وقت.
          </p>
          <div className="mt-5">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-2xl shadow-xs transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>إنشاء أول مهمة سرية الآن</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMissions.map((mission) => {
            const approvedCount = mission.submissions.filter((s) => s.status === 'approved').length;
            const pendingCount = mission.submissions.filter((s) => s.status === 'pending').length;

            return (
              <div
                key={mission.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative group"
              >
                <div>
                  {/* Header Tag */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`p-1.5 rounded-xl text-xs ${
                          mission.type === 'quiz'
                            ? 'bg-cyan-100 text-cyan-800'
                            : mission.type === 'task'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {mission.type === 'quiz' ? (
                          <HelpCircle className="w-4 h-4" />
                        ) : mission.type === 'task' ? (
                          <FileCode className="w-4 h-4" />
                        ) : (
                          <Code className="w-4 h-4" />
                        )}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {mission.type === 'quiz'
                          ? 'كويز سري'
                          : mission.type === 'task'
                          ? 'تاسك عملي'
                          : 'تحدي تقني'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        +{mission.pointsReward} نقطة
                      </span>
                      {onDeleteMission && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`هل أنت متأكد من رغبتك في حذف مهمة "${mission.title}" نهائياً؟`)) {
                              onDeleteMission(mission.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-200"
                          title="حذف هذه المهمة نهائياً"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                {/* Title & Description */}
                <h3 className="font-extrabold text-base text-slate-900 leading-snug mb-2 group-hover:text-purple-700 transition-colors">
                  {mission.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {mission.description}
                </p>

                {/* Target & Code badges */}
                <div className="space-y-1.5 pb-4 border-b border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-purple-600" />
                      المستهدفون:
                    </span>
                    <span className="font-bold text-slate-800">
                      {mission.targetMajor
                        ? mission.targetMajor
                        : mission.target === 'all'
                        ? 'كافة الطلاب'
                        : students.find((s) => s.id === mission.target)?.name || 'طالب محدد'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500">
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Shield className="w-3.5 h-3.5 text-cyan-600" />
                      كود المهمة:
                    </span>
                    <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                      {mission.secretCode}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      الموعد الأخير:
                    </span>
                    <span className="font-bold text-slate-700">{mission.deadline}</span>
                  </div>
                </div>
              </div>

              {/* Submissions & Actions Bar */}
              <div className="pt-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">حالة التسليمات:</span>
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {approvedCount} مكتمل
                    </span>
                    {pendingCount > 0 && (
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                        {pendingCount} قيد المراجعة
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveReviewMission(mission)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold transition-colors border border-purple-200"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>مراجعة التسليمات ({mission.submissions.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveQuizStudentModal(mission)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>تجربة حل لطالب</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* CREATE NEW MISSION MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2">
                <span className="p-2.5 bg-purple-100 text-purple-700 rounded-xl">
                  <Target className="w-6 h-6" />
                </span>
                <div>
                  <h2 className="text-lg font-black text-slate-900">إنشاء سيكريت ميشن جديدة</h2>
                  <p className="text-xs text-slate-500">
                    أضف مهمة عملية أو كويز لطلاب مدرسة WE للتطبيقات التكنولوجية
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Title & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">عنوان المهمة:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: تحدي برمجة خادم الويب السريع"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">نوع المهمة:</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    <option value="task">تاسك عملي بالمعمل</option>
                    <option value="quiz">كويز سريع وسري</option>
                    <option value="challenge">تحدي تقني متقدم</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  شرح المهمة والمتطلبات المطلوبة من الطالب:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="اشرح بدقة ما يجب على الطالب تنفيذه، مثل بناء كود، توصيل شبكة، أو حل أسئلة محددة..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Targeting */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-800">تخصيص المهمة:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetType('all')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      targetType === 'all'
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    كافة طلاب المدرسة
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetType('major')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      targetType === 'major'
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    تخصص محدد
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetType('student')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      targetType === 'student'
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    طالب معين بعينه
                  </button>
                </div>

                {targetType === 'major' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">اختر التخصص:</label>
                    <select
                      value={selectedMajor}
                      onChange={(e) => setSelectedMajor(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                    >
                      {SCHOOL_INFO.majors.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {targetType === 'student' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">اختر الطالب:</label>
                    <select
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                    >
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.code} - {s.major})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Reward & Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">النقاط المكتسبة (+):</label>
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={pointsReward}
                    onChange={(e) => setPointsReward(parseInt(e.target.value) || 20)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-bold text-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">كود الأمان السري:</label>
                  <input
                    type="text"
                    value={secretCode}
                    onChange={(e) => setSecretCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الموعد النهائي:</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* If type is Quiz -> Quiz Questions Builder */}
              {type === 'quiz' && (
                <div className="p-4 bg-cyan-50/60 rounded-2xl border border-cyan-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-cyan-900 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-cyan-700" />
                      <span>أسئلة الكويز السري ({quizQuestions.length})</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      className="px-3 py-1 bg-cyan-700 text-white rounded-lg text-xs font-bold hover:bg-cyan-800"
                    >
                      + إضافة سؤال جديد
                    </button>
                  </div>

                  <div className="space-y-3 max-h-52 overflow-y-auto">
                    {quizQuestions.map((q, qIdx) => (
                      <div key={q.id} className="p-3 bg-white rounded-xl border border-cyan-200 space-y-2 text-xs">
                        <div className="font-bold text-slate-700">السؤال #{qIdx + 1}:</div>
                        <input
                          type="text"
                          placeholder="نص السؤال..."
                          value={q.question}
                          onChange={(e) => handleUpdateQuestion(qIdx, 'question', e.target.value)}
                          className="w-full px-2.5 py-1.5 border rounded-lg"
                        />
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          {q.options.map((opt, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-1">
                              <input
                                type="radio"
                                name={`correct-${q.id}`}
                                checked={q.correctIndex === optIdx}
                                onChange={() => handleUpdateQuestion(qIdx, 'correctIndex', optIdx)}
                                title="اختر الإجابة الصحيحة"
                              />
                              <input
                                type="text"
                                placeholder={`الخيار ${optIdx + 1}`}
                                value={opt}
                                onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                                className="w-full px-2 py-1 text-xs border rounded-md"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  نشر المهمة السرية الآن
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW SUBMISSIONS MODAL */}
      {activeReviewMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  تسليمات مهمة: {activeReviewMission.title}
                </h2>
                <p className="text-xs text-slate-500">
                  المكافأة: +{activeReviewMission.pointsReward} نقطة • الكود:{' '}
                  {activeReviewMission.secretCode}
                </p>
              </div>
              <button
                onClick={() => setActiveReviewMission(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {activeReviewMission.submissions.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed text-xs">
                  لم يسلم أي طالب هذه المهمة حتى الآن. يمكنك استخدام زر "تجربة حل لطالب" لاختبار التسليم ومنح النقاط.
                </div>
              ) : (
                activeReviewMission.submissions.map((sub, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2.5 text-xs text-right"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-extrabold text-slate-900 text-sm">
                        {sub.studentName} ({sub.studentId})
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          sub.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {sub.status === 'approved' ? 'معتمد وممنوح النقاط' : 'بانتظار المراجعة'}
                      </span>
                    </div>

                    {sub.answerText && (
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-700">
                        <strong className="block text-slate-900 mb-1">إجابة الطالب:</strong>
                        {sub.answerText}
                      </div>
                    )}

                    {sub.quizScore !== undefined && (
                      <div className="text-cyan-800 font-bold bg-cyan-50 p-2 rounded-lg border border-cyan-200">
                        درجة الكويز السري: {sub.quizScore} أسئلة صحيحة
                      </div>
                    )}

                    {sub.teacherFeedback && (
                      <div className="text-purple-800 font-semibold text-[11px]">
                        ملاحظة المعلم: {sub.teacherFeedback}
                      </div>
                    )}

                    {sub.status !== 'approved' && (
                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          onClick={() => {
                            onGradeSubmission(
                              activeReviewMission.id,
                              sub.studentId,
                              'approved',
                              'إجابة نموذجية وإتقان ممتاز للتحدي التقني!',
                              activeReviewMission.pointsReward
                            );
                            setActiveReviewMission(null);
                          }}
                          className="flex items-center gap-1 px-4 py-1.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 text-xs"
                        >
                          <Check className="w-4 h-4" />
                          <span>اعتماد ومنح +{activeReviewMission.pointsReward} نقطة</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SIMULATE STUDENT QUIZ / TASK MODAL */}
      {activeQuizStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative my-8 text-right">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  محاكاة تسليم المهمة للطالب
                </h3>
                <p className="text-xs text-slate-500">{activeQuizStudentModal.title}</p>
              </div>
              <button
                onClick={() => setActiveQuizStudentModal(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اختر الطالب المسلّم:</label>
                <select
                  id="sim-student-select"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code}) - {s.major}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ملخص الإجابة أو الكود المرفوع:</label>
                <textarea
                  id="sim-answer-text"
                  rows={3}
                  defaultValue={
                    activeQuizStudentModal.type === 'quiz'
                      ? 'تم حل جميع أسئلة الكويز السري بنجاح.'
                      : 'تم بناء المشروع العملي ورفع الشيفرة البرمجية مع ملف التوثيق.'
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200">
                سيتم فورياً تسجيل المهمة كمكتملة بامتياز وإضافة{' '}
                <strong>+{activeQuizStudentModal.pointsReward} نقطة</strong> مباشرة لبروفايل الطالب
                وتحديث البادج والمنحنى البياني!
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveQuizStudentModal(null)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const sel = (document.getElementById('sim-student-select') as HTMLSelectElement).value;
                    const ans = (document.getElementById('sim-answer-text') as HTMLTextAreaElement).value;
                    onSimulateStudentQuiz(activeQuizStudentModal.id, sel, 3, ans);
                    setActiveQuizStudentModal(null);
                  }}
                  className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md"
                >
                  تأكيد التسليم ومنح النقاط
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
