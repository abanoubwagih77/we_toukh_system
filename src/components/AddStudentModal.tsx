import React, { useState, useRef, useEffect } from 'react';
import { Student } from '../types';
import { SCHOOL_INFO } from '../data/mockData';
import { calculateBadge, calculatePercentage } from '../utils/badges';
import { compressImageFile } from '../utils/imageUtils';
import { X, UserPlus, Upload, Image as ImageIcon, Sparkles, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (student: Student) => void;
  existingCount: number;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onAddStudent,
  existingCount
}) => {
  const [name, setName] = useState<string>('');
  const [nationalId, setNationalId] = useState<string>('');
  const [grade, setGrade] = useState<string>(SCHOOL_INFO.grades[0]);
  const [major, setMajor] = useState<string>(SCHOOL_INFO.majors[0]);
  const [initialPoints, setInitialPoints] = useState<number>(15);
  const [attendanceRate, setAttendanceRate] = useState<number>(100);
  const [avatarBase64, setAvatarBase64] = useState<string>('');
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Clear form completely whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setNationalId('');
      setGrade(SCHOOL_INFO.grades[0]);
      setMajor(SCHOOL_INFO.majors[0]);
      setInitialPoints(15);
      setAttendanceRate(100);
      setAvatarBase64('');
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const nextCodeNumber = 10400 + existingCount + 1;
  const nextId = `WE-2025-0${100 + existingCount + 1}`;

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP)');
      return;
    }

    try {
      setIsCompressing(true);
      setErrorMessage('');
      const compressed = await compressImageFile(file, 280, 280, 0.82);
      setAvatarBase64(compressed);
    } catch (err: any) {
      setErrorMessage(err?.message || 'حدث خطأ أثناء معالجة الصورة');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanName = name.trim();
    if (!cleanName) {
      setErrorMessage('يرجى إدخال اسم الطالب الرباعي باللغة العربية');
      return;
    }

    const cleanNationalId = nationalId.trim();
    if (!cleanNationalId) {
      setErrorMessage('يرجى إدخال الرقم القومي للطالب');
      return;
    }

    if (!/^\d{14}$/.test(cleanNationalId)) {
      setErrorMessage('الرقم القومي يجب أن يتكون من 14 رقماً بالضبط');
      return;
    }

    const initialPercentage = calculatePercentage(initialPoints, 50);
    const initialBadge = calculateBadge(initialPercentage);

    // Fallback if no photo uploaded
    const finalAvatar =
      avatarBase64 ||
      `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" fill="%234A154B"/><text x="50%" y="54%" font-family="Arial,sans-serif" font-size="52" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${encodeURIComponent(
        cleanName.slice(0, 1) || 'ط'
      )}</text></svg>`;

    const newStudent: Student = {
      id: nextId,
      code: String(nextCodeNumber),
      nationalId: cleanNationalId,
      name: cleanName,
      grade,
      major,
      avatar: finalAvatar,
      email: `${cleanName.toLowerCase().replace(/\s+/g, '.')}@we-school.edu.eg`,
      phone: `01${Math.floor(100000000 + Math.random() * 900000000)}`,
      points: initialPoints,
      totalPositive: initialPoints,
      totalNegative: 0,
      targetPoints: 50,
      percentage: initialPercentage,
      badge: initialBadge,
      attendanceRate: Math.min(100, Math.max(0, attendanceRate)),
      academicScore: 85,
      behavioralScore: 90,
      secretMissionsCompleted: 0,
      performanceHistory: [
        {
          date: 'بداية التسجيل',
          points: initialPoints,
          percentage: initialPercentage,
          behavioral: 90,
          academic: 85,
          label: 'انضمام للمنظومة'
        }
      ],
      logs: [
        {
          id: `log-init-${Date.now()}`,
          studentId: nextId,
          type: 'positive',
          category: 'رصيد نقاط الترحيب والبداية',
          points: initialPoints,
          note: `تسجيل الطالب رسمياً في الصف (${grade}) وتخصص (${major}) بمدرسة WE للتطبيقات التكنولوجية (حضور: ${attendanceRate}%)`,
          teacherName: 'إدارة شؤون الطلاب',
          createdAt: new Date().toISOString()
        }
      ]
    };

    onAddStudent(newStudent);
    setName('');
    setNationalId('');
    setAvatarBase64('');
    setAttendanceRate(100);
    setInitialPoints(15);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-200"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-purple-100 text-purple-700 rounded-xl">
              <UserPlus className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">إضافة طالب جديد للمنظومة</h2>
              <p className="text-xs text-slate-500">تسجيل بيانات الطالب وتوليد كود QR وبطاقة الـ ID فورياً</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Name */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">اسم الطالب الرباعي بالعربية: *</label>
            <input
              type="text"
              required
              placeholder="مثال: يوسف محمد علي حسن"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* National ID */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              الرقم القومي للطالب (14 رقم - للدخول والاستعلام): *
            </label>
            <input
              type="text"
              required
              maxLength={14}
              pattern="\d{14}"
              placeholder="مثال: 30801200104521"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value.replace(/\D/g, ''))}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono tracking-wider focus:ring-2 focus:ring-purple-500"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              {nationalId.length}/14 رقماً (هذا الرقم يستخدمه الطالب للدخول على ملفه وبطاقته)
            </span>
          </div>

          {/* Grade, Attendance Rate, and Points */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">الصف والفصل: *</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-purple-500 font-bold"
              >
                <optgroup label="الصف الأول الثانوي">
                  {SCHOOL_INFO.grades.slice(0, 6).map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="الصف الثاني الثانوي">
                  {SCHOOL_INFO.grades.slice(6, 12).map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="الصف الثالث الثانوي">
                  {SCHOOL_INFO.grades.slice(12, 18).map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">نسبة الحضور والالتزام (%):</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={attendanceRate}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setAttendanceRate(isNaN(val) ? 0 : Math.min(100, Math.max(0, val)));
                  }}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-bold text-emerald-700 focus:ring-2 focus:ring-purple-500 bg-emerald-50/30"
                  placeholder="100"
                />
                <span className="absolute left-2.5 top-2 text-xs font-bold text-slate-400">%</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">رصيد النقاط المبدئي:</label>
              <input
                type="number"
                min="0"
                max="50"
                value={initialPoints}
                onChange={(e) => setInitialPoints(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-bold text-purple-700 focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Technological Major */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">التخصص التكنولوجي: *</label>
            <select
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-bold text-slate-800 focus:ring-2 focus:ring-purple-500"
            >
              {SCHOOL_INFO.majors.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Student Photo Upload from Device (NO FAKE AVATARS) */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              صورة الطالب الشخصية للكارنيه والبروفايل (من جهازك):
            </label>

            <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 flex items-center justify-center">
                {avatarBase64 ? (
                  <img src={avatarBase64} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-400" />
                )}
              </div>

              <div className="space-y-1.5 flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isCompressing}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 hover:bg-purple-100 disabled:opacity-60 text-purple-800 font-bold text-xs rounded-xl border border-purple-200 transition-colors cursor-pointer"
                >
                  {isCompressing ? (
                    <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 text-purple-600" />
                  )}
                  <span>
                    {isCompressing
                      ? 'جاري تجهيز الصورة...'
                      : avatarBase64
                      ? 'تغيير صورة الطالب'
                      : 'اختر صورة الطالب من جهازك'}
                  </span>
                </button>
                <p className="text-[10px] text-slate-500">
                  يمكنك رفع صورة الطالب مباشرة من الموبايل أو الكمبيوتر لتظهر في بطاقة الـ ID الذكية.
                </p>
              </div>
            </div>
          </div>

          {/* Generated ID & Code Preview */}
          <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-purple-900 text-[11px] space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-purple-950">
              <ShieldCheck className="w-4 h-4 text-purple-700" />
              <span>بيانات المعرف المولد تلقائياً للطالب:</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-slate-600">كود المنظومة (Unique ID):</span>
              <span className="font-bold text-purple-800">{nextId}</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-slate-600">كود الطالب المختصر:</span>
              <span className="font-bold text-purple-800">#{nextCodeNumber}</span>
            </div>
            <div className="text-[10px] text-purple-700 pt-1 border-t border-purple-200">
              ✨ يتم إنشاء كود QR مشفر وفريد خاص بهذا الطالب فور حفظ البيانات.
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#4A154B] hover:bg-[#3B0764] text-white font-bold rounded-xl shadow-md transition-all hover:scale-102 active:scale-98"
            >
              حفظ الطالب وتوليد البطاقة الذكية
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
