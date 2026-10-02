import React, { useState } from 'react';
import { Teacher, Student } from '../types';
import { INITIAL_TEACHERS } from '../data/mockData';
import { fetchTeachersFromCloud, fetchStudentsFromCloud } from '../services/firebase';
import {
  Lock,
  User,
  GraduationCap,
  Search,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  IdCard,
  Eye,
  EyeOff,
  CloudCheck,
  RefreshCw,
  Database
} from 'lucide-react';

interface AuthPortalProps {
  students: Student[];
  teachers?: Teacher[];
  onTeacherLogin: (teacher: Teacher) => void;
  onStudentLogin: (student: Student) => void;
  onSyncTeachers?: (teachers: Teacher[]) => void;
  onSyncStudents?: (students: Student[]) => void;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({
  students,
  teachers = INITIAL_TEACHERS,
  onTeacherLogin,
  onStudentLogin,
  onSyncTeachers,
  onSyncStudents
}) => {
  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');

  // Teacher Form State - Clean initial inputs
  const [teacherUsername, setTeacherUsername] = useState<string>('');
  const [teacherPassword, setTeacherPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [teacherError, setTeacherError] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  // Student Form State - Clean initial inputs
  const [nationalIdInput, setNationalIdInput] = useState<string>('');
  const [studentError, setStudentError] = useState<string>('');

  // Always prefetch live data from Google Cloud Firestore on mount
  // to ensure any new teacher, new student, or password change from another laptop is instant
  React.useEffect(() => {
    let isMounted = true;
    async function prefetchCloud() {
      try {
        const [cloudT, cloudS] = await Promise.all([
          fetchTeachersFromCloud(),
          fetchStudentsFromCloud()
        ]);
        if (isMounted) {
          if (cloudT.length > 0 && onSyncTeachers) onSyncTeachers(cloudT);
          if (cloudS.length > 0 && onSyncStudents) onSyncStudents(cloudS);
        }
      } catch (err) {
        console.warn('Initial cloud prefetch error:', err);
      }
    }
    prefetchCloud();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeTeachers = teachers && teachers.length > 0 ? teachers : INITIAL_TEACHERS;

  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTeacherError('');
    setIsAuthenticating(true);

    const trimmedUser = teacherUsername.trim();
    const trimmedPass = teacherPassword.trim();

    try {
      // 1. Check existing in-memory teachers
      let matched = activeTeachers.find(
        (t) =>
          (t.username.toLowerCase() === trimmedUser.toLowerCase() ||
            t.name.toLowerCase().includes(trimmedUser.toLowerCase())) &&
          t.password === trimmedPass
      );

      // 2. If not matched, query live Cloud Firestore directly!
      // This guarantees that any password change or new account made on another laptop or deployed server
      // is instantly verified live without race conditions.
      if (!matched) {
        const liveTeachers = await fetchTeachersFromCloud();
        if (liveTeachers && liveTeachers.length > 0) {
          if (onSyncTeachers) onSyncTeachers(liveTeachers);
          matched = liveTeachers.find(
            (t) =>
              (t.username.toLowerCase() === trimmedUser.toLowerCase() ||
                t.name.toLowerCase().includes(trimmedUser.toLowerCase())) &&
              t.password === trimmedPass
          );
        }
      }

      if (matched) {
        if (matched.status === 'suspended') {
          setTeacherError('عذراً، هذا الحساب معطل حالياً من قِبل إدارة المدرسة. يرجى مراجعة مسؤول النظام.');
          return;
        }
        onTeacherLogin(matched);
      } else {
        setTeacherError('اسم المستخدم أو كلمة المرور غير صحيحة. يرجى التأكد من البيانات المدخلة.');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setTeacherError('حدث خطأ أثناء الاتصال بقاعدة البيانات السحابية. يرجى إعادة المحاولة.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError('');

    const query = nationalIdInput.trim();
    if (!query) {
      setStudentError('يرجى إدخال الرقم القومي للطالب');
      return;
    }

    setIsAuthenticating(true);

    try {
      let found = students.find(
        (s) =>
          s.nationalId === query ||
          s.code === query ||
          s.id.toLowerCase() === query.toLowerCase()
      );

      // If not in local cache, verify live from Cloud Firestore!
      if (!found) {
        const liveStudents = await fetchStudentsFromCloud();
        if (liveStudents && liveStudents.length > 0) {
          if (onSyncStudents) onSyncStudents(liveStudents);
          found = liveStudents.find(
            (s) =>
              s.nationalId === query ||
              s.code === query ||
              s.id.toLowerCase() === query.toLowerCase()
          );
        }
      }

      if (found) {
        onStudentLogin(found);
      } else {
        setStudentError(
          'لم يتم العثور على طالب بهذا الرقم القومي أو الكود. يرجى التأكد من الـ 14 رقماً.'
        );
      }
    } catch (err) {
      console.error('Student login error:', err);
      setStudentError('حدث خطأ أثناء الاتصال بقاعدة البيانات. يرجى المحاولة ثانية.');
    } finally {
      setIsAuthenticating(false);
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
              disabled={isAuthenticating}
              className="w-full py-3.5 px-4 bg-linear-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 disabled:opacity-60 text-white font-extrabold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isAuthenticating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جاري التحقق والاتصال السحابي...</span>
                </>
              ) : (
                <>
                  <span>دخول لملفي الشخصي ومتابعة مستواي</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <p className="text-[11px] text-slate-400">
                🔒 الدخول مخصص فقط للطلاب المسجلين بالرقم القومي
              </p>
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
                  placeholder="أدخل اسم المستخدم الخاص بك"
                  value={teacherUsername}
                  onChange={(e) => setTeacherUsername(e.target.value)}
                  className="w-full px-4 py-3 pl-10 text-xs sm:text-sm border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-slate-50/50"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">كلمة المرور:</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>إخفاء</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>إظهار كلمة المرور</span>
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="أدخل كلمة المرور"
                  value={teacherPassword}
                  onChange={(e) => setTeacherPassword(e.target.value)}
                  className="w-full px-4 py-3 pl-10 text-xs sm:text-sm border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-slate-50/50 font-sans"
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
              disabled={isAuthenticating}
              className="w-full py-3.5 px-4 bg-linear-to-r from-[#4A154B] to-purple-800 hover:from-purple-950 hover:to-purple-900 disabled:opacity-60 text-white font-extrabold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isAuthenticating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جاري التحقق والمزامنة السحابية...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-cyan-300" />
                  <span>تسجيل دخول المعلم للوحة التحكم</span>
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <p className="text-[11px] text-slate-400">
                🔒 لوحة خاصة بأعضاء هيئة التدريس والإدارة المدرسية
              </p>
            </div>
          </form>
        )}

        {/* Live Cloud Status Banner */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-500 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-bold text-slate-700">سحابة مركزية حية: Google Cloud Firestore</span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center text-xs text-slate-500 max-w-md">
        <p className="font-semibold">مدارس التكنولوجيا التطبيقية • المصرية للاتصالات WE • وزارة التربية والتعليم</p>
        <p className="text-[11px] text-slate-400 mt-1">
          🌐 البيانات مخزنة سحابياً ومحدثة في الوقت الفعلي بين جميع الأجهزة والمتصفحات
        </p>
      </div>
    </div>
  );
};
