import React, { useState, useEffect, useRef } from 'react';
import { Student } from '../types';
import { SCHOOL_INFO } from '../data/mockData';
import { compressImageFile } from '../utils/imageUtils';
import {
  X,
  Pencil,
  Trash2,
  Save,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  User,
  Cpu,
  GraduationCap,
  Percent,
  Hash,
  Phone,
  Mail,
  RotateCcw
} from 'lucide-react';

interface EditStudentModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveStudent: (updatedStudent: Student) => void;
  onDeleteStudent?: (studentId: string) => void;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({
  student,
  isOpen,
  onClose,
  onSaveStudent,
  onDeleteStudent
}) => {
  const [name, setName] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [nationalId, setNationalId] = useState<string>('');
  const [grade, setGrade] = useState<string>(SCHOOL_INFO.grades[0]);
  const [isCustomGrade, setIsCustomGrade] = useState<boolean>(false);
  const [customGrade, setCustomGrade] = useState<string>('');
  const [major, setMajor] = useState<string>(SCHOOL_INFO.majors[0]);
  const [attendanceRate, setAttendanceRate] = useState<number>(100);
  const [academicScore, setAcademicScore] = useState<number>(85);
  const [behavioralScore, setBehavioralScore] = useState<number>(90);
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync state whenever the student changes or modal opens
  useEffect(() => {
    if (student && isOpen) {
      setName(student.name || '');
      setCode(student.code || '');
      setNationalId(student.nationalId || '');

      const isKnownGrade = SCHOOL_INFO.grades.includes(student.grade);
      if (isKnownGrade) {
        setGrade(student.grade);
        setIsCustomGrade(false);
        setCustomGrade('');
      } else {
        setGrade('custom');
        setIsCustomGrade(true);
        setCustomGrade(student.grade || '');
      }

      setMajor(student.major || SCHOOL_INFO.majors[0]);
      setAttendanceRate(student.attendanceRate ?? 100);
      setAcademicScore(student.academicScore ?? 85);
      setBehavioralScore(student.behavioralScore ?? 90);
      setPhone(student.phone || '');
      setEmail(student.email || '');
      setAvatar(student.avatar || '');
      setErrorMessage('');
      setIsConfirmDeleteOpen(false);
    }
  }, [student, isOpen]);

  if (!isOpen || !student) return null;

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
      setAvatar(compressed);
    } catch (err: any) {
      setErrorMessage(err?.message || 'حدث خطأ أثناء معالجة الصورة');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemovePhoto = () => {
    const cleanName = name.trim() || student.name || 'ط';
    const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" fill="%234A154B"/><text x="50%" y="54%" font-family="Arial,sans-serif" font-size="52" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${encodeURIComponent(
      cleanName.slice(0, 1) || 'ط'
    )}</text></svg>`;
    setAvatar(fallbackSvg);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanName = name.trim();
    if (!cleanName) {
      setErrorMessage('يرجى إدخال اسم الطالب');
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

    const finalGrade = isCustomGrade ? customGrade.trim() : grade;
    if (!finalGrade) {
      setErrorMessage('يرجى تحديد أو كتابة الصف / الفصل الدراسي');
      return;
    }

    const validAttendance = Math.min(100, Math.max(0, Number(attendanceRate) || 0));
    const validAcademic = Math.min(100, Math.max(0, Number(academicScore) || 0));
    const validBehavioral = Math.min(100, Math.max(0, Number(behavioralScore) || 0));

    // Update student performance history point if attendance/academic/behavioral changed
    const updatedHistory = [...(student.performanceHistory || [])];
    if (
      student.attendanceRate !== validAttendance ||
      student.academicScore !== validAcademic ||
      student.behavioralScore !== validBehavioral
    ) {
      updatedHistory.push({
        date: 'تعديل بيانات',
        points: student.points,
        percentage: student.percentage,
        behavioral: validBehavioral,
        academic: validAcademic,
        label: 'تحديث تقييم الطالب'
      });
    }

    const updatedStudent: Student = {
      ...student,
      name: cleanName,
      code: code.trim() || student.code,
      nationalId: cleanNationalId,
      grade: finalGrade,
      major,
      attendanceRate: validAttendance,
      academicScore: validAcademic,
      behavioralScore: validBehavioral,
      avatar: avatar || student.avatar,
      phone: phone.trim() || student.phone,
      email: email.trim() || `${cleanName.toLowerCase().replace(/\s+/g, '.')}@we-school.edu.eg`,
      performanceHistory: updatedHistory
    };

    onSaveStudent(updatedStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative my-6 animate-in fade-in zoom-in-95 duration-200"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-amber-100 text-amber-800 rounded-xl">
              <Pencil className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">تعديل بيانات الطالب</h2>
              <p className="text-xs text-slate-500">
                تعديل الاسم، الفصل الدراسي، التخصص، نسبة الحضور، والصورة الشخصية
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Name */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-purple-600" />
              <span>اسم الطالب الرباعي: *</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-bold text-slate-900"
              placeholder="مثال: يوسف محمد علي حسن"
            />
          </div>

          {/* National ID & Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-purple-600" />
                <span>الرقم القومي (14 رقم للدخول): *</span>
              </label>
              <input
                type="text"
                required
                maxLength={14}
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono tracking-wider focus:ring-2 focus:ring-purple-500"
                placeholder="14 رقم"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-purple-600" />
                <span>كود الطالب المختصر: *</span>
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono font-bold focus:ring-2 focus:ring-purple-500"
                placeholder="مثال: 10401"
              />
            </div>
          </div>

          {/* Classroom / Grade & Major */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                <span>الفصل / الصف الدراسي: *</span>
              </label>
              {!isCustomGrade ? (
                <div className="space-y-1.5">
                  <select
                    value={grade}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setIsCustomGrade(true);
                      } else {
                        setGrade(e.target.value);
                      }
                    }}
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
                    <option value="custom">✏️ كتابة فصل / صف يدوي مخصص...</option>
                  </select>
                </div>
              ) : (
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    required
                    placeholder="مثال: فصل 1/2 أو الصف الأول - فايبر"
                    value={customGrade}
                    onChange={(e) => setCustomGrade(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomGrade(false);
                      setGrade(SCHOOL_INFO.grades[0]);
                    }}
                    className="px-2.5 py-1 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer shrink-0"
                    title="الرجوع للقائمة"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-600" />
                <span>التخصص التكنولوجي: *</span>
              </label>
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
          </div>

          {/* Attendance Rate & Behavioral & Academic */}
          <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-blue-950 flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-blue-600" />
                <span>نسبة الحضور والالتزام والتقييمات:</span>
              </span>
              <span className="text-[10px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full font-bold">
                تحكم كامل للمعلم
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  نسبة الحضور والالتزام (%): *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={attendanceRate}
                    onChange={(e) => setAttendanceRate(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-full px-3 py-2 text-xs border border-blue-200 rounded-xl font-black text-blue-900 bg-white focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute left-3 top-2 text-xs font-black text-blue-400">%</span>
                </div>
                <span className="text-[9px] text-slate-500 mt-0.5 block">
                  حدد النسبة الدقيقة لحضور الطالب
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  الدرجة السلوكية (من 100):
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={behavioralScore}
                  onChange={(e) => setBehavioralScore(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-bold text-slate-800 bg-white focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-[9px] text-slate-500 mt-0.5 block">تقييم الانضباط والمواظبة</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  الدرجة الأكاديمية (من 100):
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={academicScore}
                  onChange={(e) => setAcademicScore(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-bold text-slate-800 bg-white focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-[9px] text-slate-500 mt-0.5 block">تطبيقات عملية وامتحانات</span>
              </div>
            </div>
          </div>

          {/* Phone & Email (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-purple-600" />
                <span>رقم هاتف الطالب / ولي الأمر:</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-purple-500"
                placeholder="01xxxxxxxxx"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-600" />
                <span>البريد الإلكتروني المؤسسي:</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-purple-500 text-left"
                placeholder="student@we-school.edu.eg"
              />
            </div>
          </div>

          {/* Student Photo */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
              <span>صورة الطالب الشخصية:</span>
            </label>

            <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 flex items-center justify-center">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
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
                <div className="flex items-center gap-2 flex-wrap">
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
                    <span>{isCompressing ? 'جاري تجهيز الصورة...' : 'رفع صورة جديدة'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-2.5 py-2 text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl font-bold transition-colors cursor-pointer"
                  >
                    حذف الصورة
                  </button>
                </div>
                <p className="text-[10px] text-slate-500">
                  تظهر الصورة في بطاقة الكارنيه المطبوعة وملف الطالب الإلكتروني.
                </p>
              </div>
            </div>
          </div>

          {/* Delete Danger Zone */}
          {onDeleteStudent && (
            <div className="pt-2 border-t border-slate-100">
              {!isConfirmDeleteOpen ? (
                <button
                  type="button"
                  onClick={() => setIsConfirmDeleteOpen(true)}
                  className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1.5 py-1 px-2 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف هذا الطالب من المنظومة وقاعدة البيانات...</span>
                </button>
              ) : (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                  <p className="text-xs text-rose-800 font-bold">
                    ⚠️ هل أنت متأكد من حذف الطالب ({student.name}) نهائياً؟ سيتم مسح بطاقته وسجل نقاطه بالكامل.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onDeleteStudent(student.id)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs"
                    >
                      نعم، احذف الطالب نهائياً
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsConfirmDeleteOpen(false)}
                      className="px-3 py-1.5 bg-white text-slate-700 border border-slate-300 rounded-lg font-bold text-xs hover:bg-slate-50 cursor-pointer"
                    >
                      إلغاء التراجع
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-md transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>حفظ التعديلات وتحديث البيانات</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
