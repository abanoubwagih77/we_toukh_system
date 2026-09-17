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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-[#4A154B] to-[#7C3AED] flex items-center justify-center text-white font-black text-xl shadow-md border border-purple-400/40 shrink-0">
              we
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base sm:text-lg text-slate-950 leading-tight">
                  منظومة WE للتطبيقات التكنولوجية
                </span>
                {isAdmin ? (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black border border-amber-500 shadow-xs">
                    <Crown className="w-3 h-3 text-slate-950" />
                    <span>مدير المنظومة (Admin)</span>
                  </span>
                ) : (
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold border border-purple-200">
                    لوحة المعلم
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                {currentTeacher ? (
                  <span>المعلم: <strong>{currentTeacher.name}</strong> • {currentTeacher.subject}</span>
                ) : (
                  'متابعة السلوك والأداء الأكاديمي • بطاقات QR • سيكريت ميشن'
                )}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => onViewChange('students')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                activeView === 'students'
                  ? 'bg-white text-purple-800 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>الطلاب</span>
            </button>

            <button
              onClick={() => onViewChange('leaderboard')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                activeView === 'leaderboard'
                  ? 'bg-white text-purple-800 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>لوحة الصدارة</span>
            </button>

            <button
              onClick={() => onViewChange('attribution')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                activeView === 'attribution'
                  ? 'bg-white text-purple-800 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4 text-purple-600" />
              <span>تدقيق المعلمين</span>
            </button>

            <button
              onClick={() => onViewChange('missions')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all relative ${
                activeView === 'missions'
                  ? 'bg-white text-purple-800 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Target className="w-4 h-4 text-purple-600" />
              <span>سيكريت ميشن</span>
              <span className="px-1.5 py-0.2 bg-purple-600 text-white rounded-full text-[10px] font-mono">
                {missionsCount}
              </span>
            </button>

            <button
              onClick={() => onViewChange('badges')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                activeView === 'badges'
                  ? 'bg-white text-purple-800 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>البادجات</span>
            </button>

            {/* Admin Management Tab */}
            {isAdmin && (
              <button
                onClick={() => onViewChange('admin')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                  activeView === 'admin'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                    : 'text-amber-800 hover:text-amber-950 bg-amber-100/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-slate-950" />
                <span>إدارة المعلمين (Admin)</span>
              </button>
            )}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            {/* Quick button to Admin if Admin role and on different view */}
            {isAdmin && activeView !== 'admin' && (
              <button
                onClick={() => onViewChange('admin')}
                className="hidden md:flex items-center gap-1 px-2.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-black border border-amber-300 transition-colors"
                title="لوحة تحكم إدارة المعلمين"
              >
                <Crown className="w-3.5 h-3.5 text-amber-700" />
                <span>لوحة المدير</span>
              </button>
            )}

            <button
              onClick={onOpenScanner}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-linear-to-r from-purple-700 via-indigo-600 to-purple-800 hover:from-purple-800 hover:to-indigo-700 text-white text-xs sm:text-sm font-black shadow-md shadow-purple-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <ScanLine className="w-4 h-4 text-cyan-300 animate-pulse" />
              <span>مسح QR</span>
            </button>

            <button
              onClick={onOpenAddStudent}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-colors"
            >
              <Plus className="w-4 h-4 text-purple-700" />
              <span>إضافة طالب</span>
            </button>

            {/* Switch to Student Portal / Auth Portal */}
            <button
              onClick={onSwitchToStudentPortal}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-900 text-xs font-bold border border-cyan-200 transition-colors"
              title="التبديل لبوابة استعلام الطالب بالرقم القومي"
            >
              <GraduationCap className="w-4 h-4 text-cyan-700" />
              <span>بوابة الطالب</span>
            </button>

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="p-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200"
              title="تسجيل الخروج والعودة للبوابة الرئيسية"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex xl:hidden items-center overflow-x-auto py-2 border-t border-slate-100 text-xs font-bold gap-1 scrollbar-none">
          <button
            onClick={() => onViewChange('students')}
            className={`py-1.5 px-2.5 rounded-lg flex items-center gap-1 shrink-0 ${
              activeView === 'students' ? 'text-purple-700 bg-purple-50 font-black' : 'text-slate-600'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>الطلاب</span>
          </button>

          <button
            onClick={() => onViewChange('leaderboard')}
            className={`py-1.5 px-2.5 rounded-lg flex items-center gap-1 shrink-0 ${
              activeView === 'leaderboard' ? 'text-purple-700 bg-purple-50 font-black' : 'text-slate-600'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>الصدارة</span>
          </button>

          <button
            onClick={() => onViewChange('attribution')}
            className={`py-1.5 px-2.5 rounded-lg flex items-center gap-1 shrink-0 ${
              activeView === 'attribution' ? 'text-purple-700 bg-purple-50 font-black' : 'text-slate-600'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>التدقيق</span>
          </button>

          <button
            onClick={() => onViewChange('missions')}
            className={`py-1.5 px-2.5 rounded-lg flex items-center gap-1 shrink-0 ${
              activeView === 'missions' ? 'text-purple-700 bg-purple-50 font-black' : 'text-slate-600'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>سيكريت ميشن ({missionsCount})</span>
          </button>

          <button
            onClick={() => onViewChange('badges')}
            className={`py-1.5 px-2.5 rounded-lg flex items-center gap-1 shrink-0 ${
              activeView === 'badges' ? 'text-purple-700 bg-purple-50 font-black' : 'text-slate-600'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>البادجات</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => onViewChange('admin')}
              className={`py-1.5 px-2.5 rounded-lg flex items-center gap-1 shrink-0 ${
                activeView === 'admin' ? 'text-slate-950 bg-amber-400 font-black' : 'text-amber-800 bg-amber-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>إدارة المعلمين</span>
            </button>
          )}

          <button
            onClick={onSwitchToStudentPortal}
            className="py-1.5 px-2.5 rounded-lg flex items-center gap-1 text-cyan-800 bg-cyan-50 font-bold shrink-0 mr-auto"
          >
            <GraduationCap className="w-3.5 h-3.5 text-cyan-600" />
            <span>بوابة الطالب</span>
          </button>
        </div>
      </div>
    </header>
  );
};
