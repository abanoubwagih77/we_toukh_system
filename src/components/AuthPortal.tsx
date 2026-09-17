import React, { useState } from 'react';
import { Teacher, Student } from '../types';
import { INITIAL_TEACHERS } from '../data/mockData';
import {
  Lock,
  User,
  GraduationCap,
  School,
  Search,
  KeyRound,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  IdCard,
  Cpu
} from 'lucide-react';

interface AuthPortalProps {
  students: Student[];
  teachers?: Teacher[];
  onTeacherLogin: (teacher: Teacher) => void;
  onStudentLogin: (student: Student) => void;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({
  students,
  teachers = INITIAL_TEACHERS,
  onTeacherLogin,
  onStudentLogin
}) => {
  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');

  // Teacher Form State - Clean initial inputs
  const [teacherUsername, setTeacherUsername] = useState<string>('');
  const [teacherPassword, setTeacherPassword] = useState<string>('');
  const [teacherError, setTeacherError] = useState<string>('');

  // Student Form State - Clean initial inputs
  const [nationalIdInput, setNationalIdInput] = useState<string>('');
  const [studentError, setStudentError] = useState<string>('');

  const activeTeachers = teachers && teachers.length > 0 ? teachers : INITIAL_TEACHERS;

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTeacherError('');

    const trimmedUser = teacherUsername.trim();
    const trimmedPass = teacherPassword.trim();

    const teacher = activeTeachers.find(
      (t) =>
        (t.username.toLowerCase() === trimmedUser.toLowerCase() ||
          t.name.includes(trimmedUser)) &&
        t.password === trimmedPass
    );

    if (teacher) {
      if (teacher.status === 'suspended') {
        setTeacherError('عذراً، هذا الحساب معطل حالياً من قِبل إدارة المدرسة. يرجى مراجعة مسؤول النظام.');
        return;
      }
      onTeacherLogin(teacher);
    } else {
      setTeacherError('اسم المستخدم أو كلمة المرور غير صحيحة. يمكنك النقر على الحسابات التجريبية بالأسفل.');
    }
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError('');

    const query = nationalIdInput.trim();
    if (!query) {
      setStudentError('يرجى إدخال الرقم القومي للطالب');
      return;
    }

    const found = students.find(
      (s) =>
        s.nationalId === query ||
        s.code === query ||
        s.id.toLowerCase() === query.toLowerCase()
    );

    if (found) {
      onStudentLogin(found);
    } else {
      setStudentError(
        'لم يتم العثور على طالب بهذا الرقم القومي أو الكود. يرجى التأكد من الـ 14 رقماً أو اختيار طالب تجريبي.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 sm:p-6" dir="rtl">
      {/* Brand Header */}
      <div className="text-center mb-6 max-w-lg">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-linear-to-tr from-[#4A154B] to-[#7C3AED] text-white font-black text-2xl shadow-xl shadow-purple-900/20 mb-3 border-2 border-purple-400/40">
          we
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          مدارس WE للتطبيقات التكنولوجية
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          بوابة المنظومة الذكية لمتابعة السلوك والبطاقات الرقمية والأداء الأكاديمي
        </p>
      </div>

      {/* Main Login Card */}
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#4A154B] via-purple-600 to-cyan-400" />

        {/* Portal Role Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('student')}
            className={`py-3 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'student'
                ? 'bg-white text-purple-900 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-purple-600" />
            <span>بوابة الطلاب (بالرقم القومي)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('teacher')}
            className={`py-3 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'teacher'
                ? 'bg-white text-purple-900 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-4 h-4 text-purple-600" />
            <span>دخول المعلمين (اسم وكلمة مرور)</span>
          </button>
        </div>

        {/* TAB 1: STUDENT LOGIN VIA NATIONAL ID */}
        {activeTab === 'student' && (
          <form onSubmit={handleStudentSubmit} className="space-y-4">
            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900 flex items-start gap-2">
              <IdCard className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <strong>استعلام الطالب:</strong> أدخل رقمك القومي (14 رقماً) لمعرفة نقاطك، رتبة البادج،
                جراف مستواك، والمهام السرية المتاحة لك.
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                الرقم القومي للطالب (14 رقم) أو كود الطالب:
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="مثال: 30708150102934 أو 10401"
                  value={nationalIdInput}
                  onChange={(e) => setNationalIdInput(e.target.value)}
                  className="w-full px-4 py-3 pl-10 text-xs sm:text-sm font-mono border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-slate-50/50"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {studentError && (
              <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-bold border border-rose-200">
                {studentError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-linear-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>دخول لملفي الشخصي ومتابعة مستواي</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Students Chips */}
            <div className="pt-3 border-t border-slate-100">
              <div className="text-[11px] font-bold text-slate-500 mb-2 flex items-center justify-between">
                <span>أرقام قومية تجريبية مسجلة:</span>
                <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full font-bold">
                  انقر لتعبئة الرقم القومي
                </span>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {students.slice(0, 3).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setNationalIdInput(s.nationalId);
                    }}
                    className="w-full text-right p-2 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-xs transition-all flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-slate-800">{s.name}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        الرقم القومي: {s.nationalId}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-purple-700 bg-white border border-purple-200 px-2 py-0.5 rounded-md">
                      تعبئة الرقم
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: TEACHER LOGIN VIA USERNAME & PASSWORD */}
        {activeTab === 'teacher' && (
          <form onSubmit={handleTeacherSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">اسم المستخدم للمعلم:</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="مثال: ahmed.mamdouh"
                  value={teacherUsername}
                  onChange={(e) => setTeacherUsername(e.target.value)}
                  className="w-full px-4 py-3 pl-10 text-xs sm:text-sm border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-slate-50/50"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور:</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="أدخل كلمة المرور"
                  value={teacherPassword}
                  onChange={(e) => setTeacherPassword(e.target.value)}
                  className="w-full px-4 py-3 pl-10 text-xs sm:text-sm border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-slate-50/50"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {teacherError && (
              <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-bold border border-rose-200">
                {teacherError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-linear-to-r from-[#4A154B] to-purple-800 hover:from-purple-950 hover:to-purple-900 text-white font-extrabold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-300" />
              <span>تسجيل دخول المعلم للوحة التحكم</span>
            </button>

            {/* Quick Demo Teachers */}
            <div className="pt-3 border-t border-slate-100">
              <div className="text-[11px] font-bold text-slate-500 mb-2 flex items-center justify-between">
                <span>حسابات تجريبية مسجلة بالنظام:</span>
                <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full font-bold">
                  انقر لتعبئة البيانات والدخول
                </span>
              </div>
              <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {activeTeachers.map((t) => {
                  const isAdmin = t.role === 'admin';
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setTeacherUsername(t.username);
                        setTeacherPassword(t.password);
                      }}
                      className={`w-full text-right p-2 rounded-xl border text-xs transition-all flex items-center justify-between ${
                        isAdmin
                          ? 'bg-amber-50/70 border-amber-300 hover:bg-amber-100/80'
                          : 'bg-slate-50 hover:bg-purple-50 border-slate-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isAdmin ? (
                          <span className="px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[9px]">
                            أدمن (مدير)
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-700 font-bold text-[9px]">
                            معلم/مهندس
                          </span>
                        )}
                        <div>
                          <span className="font-bold text-slate-800">{t.name}</span>
                          <span className="text-[10px] text-slate-500 block">
                            يوزر: <span className="font-mono text-purple-700">{t.username}</span> | مادة: {t.subject}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-md font-mono shrink-0">
                        باسورد: {t.password}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center text-xs text-slate-400">
        مدارس التكنولوجيا التطبيقية • المصرية للاتصالات WE • وزارة التربية والتعليم والتعليم الفني
      </div>
    </div>
  );
};
