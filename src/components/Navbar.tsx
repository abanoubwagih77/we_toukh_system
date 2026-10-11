import React, { useState, useRef, useEffect } from 'react';
import { Teacher } from '../types';
import {
  ScanLine,
  Target,
  Users,
  Award,
  Plus,
  LogOut,
  GraduationCap,
  Trophy,
  UserCheck,
  ShieldCheck,
  Crown,
  Menu,
  X,
  UserPlus,
  ChevronDown
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
  const [isToggleOpen, setIsToggleOpen] = useState<boolean>(false);
  const toggleMenuRef = useRef<HTMLDivElement | null>(null);
  const isAdmin = currentTeacher?.role === 'admin';

  // Close toggle dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toggleMenuRef.current && !toggleMenuRef.current.contains(event.target as Node)) {
        setIsToggleOpen(false);
      }
    };

    if (isToggleOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isToggleOpen]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs w-full" dir="rtl">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6">
        {/* ============================================================== */}
        {/* TOP ROW: BRAND IDENTITY & ACTION BUTTONS / MOBILE TOGGLE      */}
        {/* ============================================================== */}
        <div className="flex items-center justify-between h-15 sm:h-16 gap-3">
          {/* Right: Brand Logo & Teacher Info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-linear-to-tr from-[#4A154B] to-[#7C3AED] flex items-center justify-center text-white font-black text-base shadow-xs shrink-0 select-none">
              we
            </div>

            {currentTeacher && (
              <div className="hidden md:block shrink-0">
                <TeacherAvatar
                  name={currentTeacher.name}
                  avatar={currentTeacher.avatar}
                  size="sm"
                />
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
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

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="hidden sm:inline">سحابة مركزية (Firestore)</span>
                  <span className="sm:hidden">سحابي</span>
                </span>
              </div>

              {currentTeacher && (
                <p className="text-[11px] text-slate-500 truncate max-w-[200px] sm:max-w-md leading-none mt-0.5">
                  {currentTeacher.name}
                  {currentTeacher.subject ? ` • ${currentTeacher.subject}` : ''}
                  {currentTeacher.majorDepartment ? ` (${currentTeacher.majorDepartment})` : ''}
                </p>
              )}
            </div>
          </div>

          {/* Left Actions Area */}
          <div className="flex items-center gap-2 shrink-0">
            {/* -------------------------------------------------------- */}
            {/* 1. LARGE SCREENS (lg and up): DIRECT BUTTONS IN NAVBAR   */}
            {/* -------------------------------------------------------- */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              {/* Scan QR */}
              <button
                onClick={onOpenScanner}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
                title="مسح رمز الاستجابة السريعة (QR Code)"
              >
                <ScanLine className="w-3.5 h-3.5 text-cyan-300" />
                <span>مسح QR</span>
              </button>

              {/* Add Student */}
              <button
                onClick={onOpenAddStudent}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold border border-purple-200 transition-colors cursor-pointer shadow-xs active:scale-95"
                title="إضافة طالب جديد للمنظومة"
              >
                <Plus className="w-3.5 h-3.5 text-purple-700" />
                <span>إضافة طالب</span>
              </button>

              {/* Student Portal */}
              <button
                onClick={onSwitchToStudentPortal}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-900 text-xs font-bold border border-cyan-200 transition-colors cursor-pointer shadow-xs active:scale-95"
                title="التبديل لبوابة استعلام الطالب بالرقم القومي"
              >
                <GraduationCap className="w-3.5 h-3.5 text-cyan-700" />
                <span>بوابة الطالب</span>
              </button>
            </div>

            {/* -------------------------------------------------------- */}
            {/* 2. SMALL & TABLET SCREENS (< lg): TOGGLE HAMBURGER MENU  */}
            {/* -------------------------------------------------------- */}
            <div className="flex lg:hidden items-center relative" ref={toggleMenuRef}>
              <button
                onClick={() => setIsToggleOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-bold transition-all border shadow-xs cursor-pointer select-none active:scale-95 ${
                  isToggleOpen
                    ? 'bg-purple-700 text-white border-purple-800'
                    : 'bg-purple-50 hover:bg-purple-100 text-purple-900 border-purple-200'
                }`}
                title="القائمة السريعة للعمليات (مسح QR، إضافة طالب، بوابة الطالب)"
                aria-label="القائمة السريعة"
                aria-expanded={isToggleOpen}
              >
                {isToggleOpen ? (
                  <X className="w-4 h-4 text-white" />
                ) : (
                  <Menu className="w-4 h-4 text-purple-800" />
                )}
                <span className="text-[11px] sm:text-xs">العمليات السريعة</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 hidden sm:inline ${
                    isToggleOpen ? 'rotate-180 text-white' : 'text-purple-600'
                  }`}
                />
              </button>

              {/* Mobile/Tablet Toggle Dropdown Menu */}
              {isToggleOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <span className="text-[11px] font-extrabold text-slate-400 block">العمليات والخدمات السريعة:</span>
                  </div>

                  <div className="space-y-1">
                    {/* Option 1: QR Scanner */}
                    <button
                      onClick={() => {
                        setIsToggleOpen(false);
                        onOpenScanner();
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl text-right hover:bg-purple-50 text-slate-800 hover:text-purple-900 transition-colors group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 group-hover:bg-purple-700 group-hover:text-white transition-colors">
                        <ScanLine className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-black block">مسح كود QR (سكان)</span>
                        <span className="text-[10px] text-slate-500 block truncate">
                          فتح كاميرا المسح لرصد نقاط الطالب فوراً
                        </span>
                      </div>
                    </button>

                    {/* Option 2: Add Student */}
                    <button
                      onClick={() => {
                        setIsToggleOpen(false);
                        onOpenAddStudent();
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl text-right hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 transition-colors group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                        <UserPlus className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-black block">إضافة طالب جديد</span>
                        <span className="text-[10px] text-slate-500 block truncate">
                          تسجيل وتسكين طالب جديد في المنظومة
                        </span>
                      </div>
                    </button>

                    {/* Option 3: Student Portal */}
                    <button
                      onClick={() => {
                        setIsToggleOpen(false);
                        onSwitchToStudentPortal();
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl text-right hover:bg-cyan-50 text-slate-800 hover:text-cyan-900 transition-colors group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0 group-hover:bg-cyan-700 group-hover:text-white transition-colors">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-black block">بوابة استعلام الطالب</span>
                        <span className="text-[10px] text-slate-500 block truncate">
                          استعلام الطالب بالرقم القومي وحل التحديات
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Logout Button (Always visible on all screens next to toggle/buttons) */}
            <button
              onClick={onLogout}
              className="p-1.5 sm:p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200 shrink-0 cursor-pointer shadow-xs active:scale-95"
              title="تسجيل الخروج والعودة للبوابة الرئيسية"
              aria-label="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* NAVIGATION TABS: LARGE SCREENS (SINGLE SPACIOUS ROW)           */}
        {/* ============================================================== */}
        <nav className="hidden lg:flex items-center justify-center gap-1.5 py-2 border-t border-slate-100 w-full select-none">
          <button
            onClick={() => onViewChange('students')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeView === 'students'
                ? 'bg-purple-700 text-white font-black shadow-xs'
                : 'text-slate-600 hover:text-purple-900 hover:bg-purple-50/70 font-bold'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span className="text-xs">الطلاب</span>
          </button>

          <button
            onClick={() => onViewChange('leaderboard')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeView === 'leaderboard'
                ? 'bg-purple-700 text-white font-black shadow-xs'
                : 'text-slate-600 hover:text-purple-900 hover:bg-purple-50/70 font-bold'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs">الصدارة</span>
          </button>

          <button
            onClick={() => onViewChange('attribution')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeView === 'attribution'
                ? 'bg-purple-700 text-white font-black shadow-xs'
                : 'text-slate-600 hover:text-purple-900 hover:bg-purple-50/70 font-bold'
            }`}
          >
            <UserCheck className="w-4 h-4 shrink-0" />
            <span className="text-xs">التدقيق ومصادر النقاط</span>
          </button>

          <button
            onClick={() => onViewChange('missions')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all relative cursor-pointer ${
              activeView === 'missions'
                ? 'bg-purple-700 text-white font-black shadow-xs'
                : 'text-slate-600 hover:text-purple-900 hover:bg-purple-50/70 font-bold'
            }`}
          >
            <Target className="w-4 h-4 shrink-0" />
            <span className="text-xs">سيكريت ميشن</span>
            {missionsCount > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black shrink-0 ${
                  activeView === 'missions'
                    ? 'bg-white text-purple-800'
                    : 'bg-purple-600 text-white'
                }`}
              >
                {missionsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onViewChange('badges')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeView === 'badges'
                ? 'bg-purple-700 text-white font-black shadow-xs'
                : 'text-slate-600 hover:text-purple-900 hover:bg-purple-50/70 font-bold'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs">الأوسمة</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => onViewChange('admin')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeView === 'admin'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                  : 'text-amber-800 hover:text-amber-950 bg-amber-100/60 font-bold'
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="text-xs">المعلمين والمهندسين</span>
            </button>
          )}
        </nav>

        {/* ============================================================== */}
        {/* NAVIGATION TABS: MOBILE & TABLET SCREENS (< lg)                */}
        {/* ORGANIZED IN 2 CLEAN ROWS (3 IN ROW 1, 2-3 IN ROW 2)          */}
        {/* ============================================================== */}
        <div className="block lg:hidden py-2 border-t border-slate-100 w-full space-y-1.5 select-none">
          {/* Row 1: 3 tabs (الطلاب، الصدارة، التدقيق) */}
          <div className="grid grid-cols-3 gap-1.5 w-full">
            <button
              onClick={() => onViewChange('students')}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl transition-all cursor-pointer ${
                activeView === 'students'
                  ? 'bg-purple-700 text-white font-black shadow-xs'
                  : 'text-slate-700 bg-slate-50 hover:bg-purple-50 border border-slate-200/60 font-bold'
              }`}
            >
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span className="text-xs truncate">الطلاب</span>
            </button>

            <button
              onClick={() => onViewChange('leaderboard')}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl transition-all cursor-pointer ${
                activeView === 'leaderboard'
                  ? 'bg-purple-700 text-white font-black shadow-xs'
                  : 'text-slate-700 bg-slate-50 hover:bg-purple-50 border border-slate-200/60 font-bold'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="text-xs truncate">الصدارة</span>
            </button>

            <button
              onClick={() => onViewChange('attribution')}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl transition-all cursor-pointer ${
                activeView === 'attribution'
                  ? 'bg-purple-700 text-white font-black shadow-xs'
                  : 'text-slate-700 bg-slate-50 hover:bg-purple-50 border border-slate-200/60 font-bold'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="text-xs truncate">التدقيق</span>
            </button>
          </div>

          {/* Row 2: 2 tabs (سيكريت ميشن، الأوسمة) or 3 tabs if Admin (المعلمين) */}
          <div className={`grid ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'} gap-1.5 w-full`}>
            {/* Secret Missions - Distinct, Spacious and with prominent Count Badge */}
            <button
              onClick={() => onViewChange('missions')}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl transition-all relative cursor-pointer ${
                activeView === 'missions'
                  ? 'bg-purple-700 text-white font-black shadow-xs'
                  : 'text-slate-700 bg-slate-50 hover:bg-purple-50 border border-slate-200/60 font-bold'
              }`}
            >
              <Target className="w-3.5 h-3.5 shrink-0 text-purple-600" />
              <span className="text-xs font-black truncate">سيكريت ميشن</span>
              {missionsCount > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black shrink-0 ${
                    activeView === 'missions'
                      ? 'bg-white text-purple-800'
                      : 'bg-purple-600 text-white'
                  }`}
                >
                  {missionsCount}
                </span>
              )}
            </button>

            {/* Badges Guide */}
            <button
              onClick={() => onViewChange('badges')}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl transition-all cursor-pointer ${
                activeView === 'badges'
                  ? 'bg-purple-700 text-white font-black shadow-xs'
                  : 'text-slate-700 bg-slate-50 hover:bg-purple-50 border border-slate-200/60 font-bold'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="text-xs truncate">الأوسمة</span>
            </button>

            {/* Teachers Management (Admin only) */}
            {isAdmin && (
              <button
                onClick={() => onViewChange('admin')}
                className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl transition-all cursor-pointer ${
                  activeView === 'admin'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                    : 'text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 font-bold'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-slate-950" />
                <span className="text-xs truncate">المعلمين</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
