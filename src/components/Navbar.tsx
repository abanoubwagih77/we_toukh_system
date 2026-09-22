import React from 'react';
import { Teacher } from '../types';
import {
  ScanLine,
  Target,
  Users,
  Award,
  Plus,
  LogOut,
  GraduationCap,
  Sparkles,
  Trophy,
  UserCheck,
  ShieldCheck,
  Crown
} from 'lucide-react';
import { TeacherAvatar } from './TeacherAvatar';

export type MainViewType = 'students' | 'leaderboard' | 'attribution' | 'missions' | 'badges' | 'admin';

interface NavbarProps {
  activeView: MainViewType;
  onViewChange: (view: MainViewType) => void;
  onOpenScanner: () => void;
  onOpenAddStudent: () => void;
  missionsCount: number;
  currentTeacher: Teacher | null;
  onLogout: () => void;
  onSwitchToStudentPortal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onViewChange,
  onOpenScanner,
  onOpenAddStudent,
  missionsCount,
  currentTeacher,
  onLogout,
  onSwitchToStudentPortal
}) => {
  const isAdmin = currentTeacher?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs w-full" dir="rtl">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand Logo & Compact Title */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-[#4A154B] to-[#7C3AED] flex items-center justify-center text-white font-black text-base shadow-xs shrink-0 select-none">
              we
            </div>
            {currentTeacher && (
              <div className="hidden sm:block shrink-0">
                <TeacherAvatar
                  name={currentTeacher.name}
                  avatar={currentTeacher.avatar}
                  size="sm"
                />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight truncate">
                  منظومة WE التكنولوجية
                </span>
                {isAdmin ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold shrink-0">
                    <Crown className="w-2.5 h-2.5" />
                    <span>الأدمن</span>
                  </span>
                ) : (
                  <span className="inline-block px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold shrink-0">
                    معلم
                  </span>
                )}
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>سحابي متزامن</span>
                </span>
              </div>
              {currentTeacher && (
                <p className="text-[11px] text-slate-500 truncate max-w-[180px] sm:max-w-xs leading-none mt-0.5">
                  {currentTeacher.name} {currentTeacher.subject ? `• ${currentTeacher.subject}` : ''}
                </p>
              )}
            </div>
          </div>

          {/* Navigation Links (Desktop: xl and above) */}
          <nav className="hidden xl:flex items-center gap-0.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold shrink-0">
            <button
              onClick={() => onViewChange('students')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                activeView === 'students'
                  ? 'bg-white text-purple-800 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>الطلاب</span>
            </button>

            <button
              onClick={() => onViewChange('leaderboard')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                activeView === 'leaderboard'
                  ? 'bg-white text-purple-800 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>الصدارة</span>
            </button>

            <button
              onClick={() => onViewChange('attribution')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                activeView === 'attribution'
                  ? 'bg-white text-purple-800 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>التدقيق</span>
            </button>

            <button
              onClick={() => onViewChange('missions')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all relative ${
                activeView === 'missions'
                  ? 'bg-white text-purple-800 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-purple-600" />
              <span>المهمات</span>
              {missionsCount > 0 && (
                <span className="px-1.5 py-0.2 bg-purple-600 text-white rounded-full text-[10px] font-mono">
                  {missionsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onViewChange('badges')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                activeView === 'badges'
                  ? 'bg-white text-purple-800 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>الأوسمة</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => onViewChange('admin')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                  activeView === 'admin'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'text-amber-800 hover:text-amber-950 bg-amber-100/60'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
                <span>المعلمين</span>
              </button>
            )}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={onOpenScanner}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs transition-all active:scale-95 shrink-0"
            >
              <ScanLine className="w-3.5 h-3.5 text-cyan-300" />
              <span>مسح QR</span>
            </button>

            <button
              onClick={onOpenAddStudent}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-purple-700" />
              <span>إضافة طالب</span>
            </button>

            <button
              onClick={onSwitchToStudentPortal}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-900 text-xs font-semibold border border-cyan-200 transition-colors shrink-0"
              title="التبديل لبوابة استعلام الطالب بالرقم القومي"
            >
              <GraduationCap className="w-3.5 h-3.5 text-cyan-700" />
              <span>بوابة الطالب</span>
            </button>

            <button
              onClick={onLogout}
              className="p-1.5 sm:p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200 shrink-0"
              title="تسجيل الخروج والعودة للبوابة الرئيسية"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Navigation Row */}
        <div className="flex xl:hidden items-center overflow-x-auto py-1.5 border-t border-slate-100 text-xs font-semibold gap-1 scrollbar-none w-full">
          <button
            onClick={() => onViewChange('students')}
            className={`py-1 px-2.5 rounded-lg flex items-center gap-1 shrink-0 ${
              activeView === 'students' ? 'text-purple-700 bg-purple-50 font-bold' : 'text-slate-600'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>الطلاب</span>
          </button>

          <button
            onClick={() => onViewChange('leaderboard')}
            className={`py-1 px-2.5 rounded-lg flex items-center gap-1 shrink-0 ${
              activeView === 'leaderboard' ? 'text-purple-700 bg-purple-50 font-bold' : 'text-slate-600'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>الصدارة</span>
          </button>

          <button
            onClick={() => onViewChange('attribution')}
            className={`py-1 px-2.5 rounded-lg flex items-center gap-1 shrink-0 ${
              activeView === 'attribution' ? 'text-purple-700 bg-purple-50 font-bold' : 'text-slate-600'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>التدقيق</span>
          </button>

          <button
            onClick={() => onViewChange('missions')}
            className={`py-1 px-2.5 rounded-lg flex items-center gap-1 shrink-0 ${
              activeView === 'missions' ? 'text-purple-700 bg-purple-50 font-bold' : 'text-slate-600'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>المهمات ({missionsCount})</span>
          </button>

          <button
            onClick={() => onViewChange('badges')}
            className={`py-1 px-2.5 rounded-lg flex items-center gap-1 shrink-0 ${
              activeView === 'badges' ? 'text-purple-700 bg-purple-50 font-bold' : 'text-slate-600'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>الأوسمة</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => onViewChange('admin')}
              className={`py-1 px-2.5 rounded-lg flex items-center gap-1 shrink-0 ${
                activeView === 'admin' ? 'text-slate-950 bg-amber-400 font-bold' : 'text-amber-800 bg-amber-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>المعلمين</span>
            </button>
          )}

          <button
            onClick={onSwitchToStudentPortal}
            className="py-1 px-2.5 rounded-lg flex items-center gap-1 text-cyan-800 bg-cyan-50 font-semibold shrink-0 mr-auto"
          >
            <GraduationCap className="w-3.5 h-3.5 text-cyan-600" />
            <span>بوابة الطالب</span>
          </button>
        </div>
      </div>
    </header>
  );
};
