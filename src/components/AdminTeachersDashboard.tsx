import React, { useState, useMemo } from 'react';
import { Teacher, Student } from '../types';
import { SCHOOL_INFO } from '../data/mockData';
import {
  ShieldCheck,
  UserPlus,
  Users,
  Search,
  Filter,
  Edit2,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Award,
  BookOpen,
  Phone,
  Mail,
  RefreshCw,
  LogIn,
  KeyRound,
  X,
  Sparkles,
  Cpu,
  Camera,
  Upload,
  Download,
  Database,
  Check,
  FileUp,
  Loader2,
  HardDrive
} from 'lucide-react';
import { compressImageFile } from '../utils/imageUtils';
import { exportSystemDatabaseJSON } from '../utils/exportUtils';

interface AdminTeachersDashboardProps {
  teachers: Teacher[];
  students: Student[];
  currentTeacher: Teacher | null;
  missions?: any[];
  onAddTeacher: (teacher: Teacher) => void;
  onUpdateTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (teacherId: string) => void;
  onImpersonateTeacher?: (teacher: Teacher) => void;
  onRestoreFullDatabase?: (data: { students: Student[]; teachers: Teacher[]; missions: any[] }) => void;
  onSeedSampleStudents?: () => void;
}

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200';

export const AdminTeachersDashboard: React.FC<AdminTeachersDashboardProps> = ({
  teachers,
  students,
  currentTeacher,
  missions = [],
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  onImpersonateTeacher,
  onRestoreFullDatabase,
  onSeedSampleStudents
}) => {
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCompressingTeacherPhoto, setIsCompressingTeacherPhoto] = useState<boolean>(false);
  const [backupSuccessMessage, setBackupSuccessMessage] = useState<string>('');
  const importFileRef = React.useRef<HTMLInputElement | null>(null);
  const teacherPhotoRef = React.useRef<HTMLInputElement | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [deletingTeacher, setDeletingTeacher] = useState<Teacher | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    title: 'مهندس',
    name: '',
    username: '',
    password: '',
    role: 'teacher' as 'teacher' | 'supervisor' | 'admin',
    subject: '',
    phone: '',
    email: '',
    status: 'active' as 'active' | 'suspended',
    avatar: DEFAULT_AVATAR
  });

  const [formError, setFormError] = useState<string>('');

  // Calculate teacher stats from student logs
  const teacherStats = useMemo(() => {
    const map = new Map<string, { positiveCount: number; negativeCount: number; positiveSum: number; negativeSum: number }>();
    students.forEach((s) => {
      s.logs.forEach((log) => {
        const name = log.teacherName || 'معلم المادة التكنولوجية';
        if (!map.has(name)) {
          map.set(name, { positiveCount: 0, negativeCount: 0, positiveSum: 0, negativeSum: 0 });
        }
        const item = map.get(name)!;
        if (log.type === 'positive') {
          item.positiveCount += 1;
          item.positiveSum += log.points;
        } else {
          item.negativeCount += 1;
          item.negativeSum += Math.abs(log.points);
        }
      });
    });
    return map;
  }, [students]);

  // Filtered teachers list
  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.username.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        (t.majorDepartment && t.majorDepartment.toLowerCase().includes(q)) ||
        (t.phone && t.phone.includes(q));

      const matchRole = roleFilter === 'all' || t.role === roleFilter;
      const matchSubject = subjectFilter === 'all' || t.subject === subjectFilter;
      const matchStatus = statusFilter === 'all' || (t.status || 'active') === statusFilter;

      return matchSearch && matchRole && matchSubject && matchStatus;
    });
  }, [teachers, searchQuery, roleFilter, subjectFilter, statusFilter]);

  // Open Edit Modal with teacher data
  const handleStartEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      title: teacher.title || 'مهندس',
      name: teacher.name,
      username: teacher.username,
      password: teacher.password,
      role: teacher.role,
      subject: teacher.subject,
      phone: teacher.phone || '',
      email: teacher.email || '',
      status: teacher.status || 'active',
      avatar: teacher.avatar || DEFAULT_AVATAR
    });
    setFormError('');
  };

  // Open Add Modal with fresh data
  const handleStartAdd = () => {
    setEditingTeacher(null);
    setFormData({
      title: 'مهندس',
      name: '',
      username: '',
      password: '123',
      role: 'teacher',
      subject: '',
      phone: '',
      email: '',
      status: 'active',
      avatar: DEFAULT_AVATAR
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  // Handle Form Submit (Add or Edit)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('يرجى إدخال اسم المعلم أو المهندس');
      return;
    }
    if (!formData.username.trim()) {
      setFormError('يرجى إدخال اسم المستخدم لتسجيل الدخول');
      return;
    }
    if (!formData.password.trim()) {
      setFormError('يرجى إدخال كلمة المرور');
      return;
    }
    if (!formData.subject.trim()) {
      setFormError('يرجى إدخال المادة أو التخصص الذي يدرسه');
      return;
    }

    // Check username uniqueness
    const userConflict = teachers.find(
      (t) =>
        t.username.toLowerCase() === formData.username.trim().toLowerCase() &&
        (!editingTeacher || t.id !== editingTeacher.id)
    );
    if (userConflict) {
      setFormError('اسم المستخدم هذا مستخدم بالفعل من قبل معلم آخر. يرجى اختيار اسم مستخدم مختلف.');
      return;
    }

    // Format full name with title prefix if not already present
    let formattedName = formData.name.trim();
    if (
      formData.title &&
      !formattedName.startsWith('م.') &&
      !formattedName.startsWith('د.') &&
      !formattedName.startsWith('أ.')
    ) {
      const prefix =
        formData.title === 'مهندس' || formData.title === 'مهندسة'
          ? 'م.'
          : formData.title === 'دكتور' || formData.title === 'دكتورة'
          ? 'د.'
          : formData.title === 'أستاذ' || formData.title === 'أستاذة'
          ? 'أ.'
          : '';
      if (prefix) {
        formattedName = `${prefix} ${formattedName}`;
      }
    }

    const finalAvatar = formData.avatar.trim() || DEFAULT_AVATAR;

    if (editingTeacher) {
      // Update existing
      const updated: Teacher = {
        ...editingTeacher,
        name: formattedName,
        username: formData.username.trim().toLowerCase(),
        password: formData.password.trim(),
        role: formData.role,
        subject: formData.subject.trim(),
        majorDepartment: editingTeacher.majorDepartment,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        status: formData.status,
        avatar: finalAvatar,
        title: formData.title
      };
      onUpdateTeacher(updated);
      setEditingTeacher(null);
    } else {
      // Create new
      const newTeacher: Teacher = {
        id: `t-${Date.now().toString().slice(-4)}`,
        name: formattedName,
        username: formData.username.trim().toLowerCase(),
        password: formData.password.trim(),
        role: formData.role,
        subject: formData.subject.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        status: formData.status,
        avatar: finalAvatar,
        title: formData.title,
        createdAt: new Date().toISOString().split('T')[0]
      };
      onAddTeacher(newTeacher);
      setIsAddModalOpen(false);
    }
  };

  // Toggle active/suspended status directly
  const handleToggleStatus = (teacher: Teacher) => {
    const updatedStatus = teacher.status === 'suspended' ? 'active' : 'suspended';
    onUpdateTeacher({
      ...teacher,
      status: updatedStatus
    });
  };

  // Toggle password visibility
  const togglePasswordVisibility = (teacherId: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [teacherId]: !prev[teacherId]
    }));
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (deletingTeacher) {
      onDeleteTeacher(deletingTeacher.id);
      setDeletingTeacher(null);
    }
  };

  // Database Backup & Restore Handlers
  const handleExportBackup = () => {
    exportSystemDatabaseJSON({
      students,
      teachers,
      missions
    });
    setBackupSuccessMessage('تم تصدير ملف النسخة الاحتياطية بنجاح بصيغة JSON');
    setTimeout(() => setBackupSuccessMessage(''), 4000);
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.students && Array.isArray(parsed.students) && onRestoreFullDatabase) {
          onRestoreFullDatabase({
            students: parsed.students,
            teachers: parsed.teachers || teachers,
            missions: parsed.missions || missions
          });
          setBackupSuccessMessage('تم استيراد واستعادة قاعدة البيانات بنجاح في المنظومة!');
          setTimeout(() => setBackupSuccessMessage(''), 5000);
        } else {
          alert('الملف المحدد لا يحتوي على بنية بيانات مدرسة WE صالحة');
        }
      } catch {
        alert('حدث خطأ أثناء قراءة ملف النسخة الاحتياطية');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleTeacherPhotoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressingTeacherPhoto(true);
      const compressed = await compressImageFile(file, 260, 260, 0.85);
      setFormData((prev) => ({ ...prev, avatar: compressed }));
    } catch (err: any) {
      alert(err?.message || 'فشل ضغط صورة المعلم');
    } finally {
      setIsCompressingTeacherPhoto(false);
    }
  };

  // Guard: Strictly deny access to non-admin accounts
  if (currentTeacher?.role !== 'admin') {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-red-200 shadow-xs max-w-lg mx-auto my-12" dir="rtl">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-200">
          <Lock className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">منطقة محمية - صلاحيات غير كافية</h3>
        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          هذه الصفحة مخصصة لمدير المنظومة (Admin) فقط لإدارة حسابات وصلاحيات المعلمين والمهندسين.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Top Header Card with WE School Branding */}
      <div className="bg-linear-to-r from-purple-950 via-[#3B0764] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-400/30 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black shadow-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>لوحة تحكم مدير النظام (Super Admin)</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold font-mono">
                {teachers.length} أعضاء هيئة تدريس
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              إدارة حسابات المعلمين والمهندسين بمدرسة WE
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 max-w-2xl leading-relaxed">
              تحكم كامل في إضافة، تعديل، تفعيل أو حذف حسابات السادة المهندسين والمعلمين، وتعيين الصلاحيات، وإدارة كلمات المرور لضمان أمان ودقة منظومة رصد النقاط والسلوك.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleStartAdd}
              className="px-5 py-3 rounded-2xl bg-linear-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <UserPlus className="w-5 h-5 text-slate-950" />
              <span>إضافة معلم / مهندس جديد</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <span className="text-[11px] text-purple-200 block font-bold">إجمالي الكادر التكنولوجي</span>
            <span className="text-xl font-black text-white mt-1 block">{teachers.length} معلماً ومهندساً</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <span className="text-[11px] text-purple-200 block font-bold">الحسابات النشطة</span>
            <span className="text-xl font-black text-emerald-300 mt-1 block">
              {teachers.filter((t) => (t.status || 'active') === 'active').length} مفعل
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <span className="text-[11px] text-purple-200 block font-bold">مشرفو ومسؤولو النظام</span>
            <span className="text-xl font-black text-amber-300 mt-1 block">
              {teachers.filter((t) => t.role === 'admin' || t.role === 'supervisor').length} مشرف
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <span className="text-[11px] text-purple-200 block font-bold">المواد والمهام التدريسية</span>
            <span className="text-xl font-black text-cyan-300 mt-1 block">
              {new Set(teachers.map((t) => t.subject)).size} مادة
            </span>
          </div>
        </div>
      </div>

      {/* Hidden file input for database restore */}
      <input
        type="file"
        ref={importFileRef}
        accept=".json,application/json"
        onChange={handleImportFileChange}
        className="hidden"
      />

      {/* Hidden file input for teacher photo */}
      <input
        type="file"
        ref={teacherPhotoRef}
        accept="image/*"
        onChange={handleTeacherPhotoFile}
        className="hidden"
      />

      {/* Database & Dual-Layer Persistence Hub */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-xs sm:text-sm font-black text-slate-900">
                إدارة قاعدة البيانات والحفظ السحابي
              </h4>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>سحابي متزامن نشط (Google Cloud Firestore)</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              بيانات المعلمين والطلاب والنقاط والمهام مربوطة بسيرفرات سحابية حقيقية وتتزامن تلقائياً بين كل الأجهزة وأي شخص يفتح الموقع من أي مكان.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {students.length === 0 && onSeedSampleStudents && (
            <button
              type="button"
              onClick={onSeedSampleStudents}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-xl border border-amber-200 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>توليد عينة طلاب المدرسة</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportBackup}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-700" />
            <span>تصدير نسخة احتياطية (JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => importFileRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold rounded-xl border border-purple-200 transition-all cursor-pointer"
          >
            <FileUp className="w-3.5 h-3.5 text-purple-700" />
            <span>استيراد واستعادة قاعدة البيانات (JSON)</span>
          </button>
        </div>
      </div>

      {backupSuccessMessage && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-bold text-center">
          {backupSuccessMessage}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search */}
          <div className="sm:col-span-5 relative">
            <input
              type="text"
              placeholder="ابحث باسم المعلم، اسم المستخدم، المادة، أو رقم الهاتف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 pr-10 text-xs border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-slate-50/50"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
          </div>

          {/* Role Filter */}
          <div className="sm:col-span-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="all">كافة الصلاحيات</option>
              <option value="admin">👑 مدير النظام (Admin)</option>
              <option value="supervisor">⭐ مشرف تدريب / شؤون</option>
              <option value="teacher">👨‍🏫 معلم / مهندس مادة</option>
            </select>
          </div>

          {/* Subject Filter */}
          <div className="sm:col-span-3">
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="all">كافة المواد والتخصصات</option>
              {Array.from(new Set(teachers.map((t) => t.subject).filter(Boolean))).map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="all">كافة الحالات</option>
              <option value="active">🟢 الحسابات المفعلة</option>
              <option value="suspended">🔴 الحسابات المعطلة</option>
            </select>
          </div>
        </div>

        {/* Results Counter and Reset */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            عرض <strong>{filteredTeachers.length}</strong> من أصل {teachers.length} معلماً
          </span>
          {(searchQuery || roleFilter !== 'all' || subjectFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setRoleFilter('all');
                setSubjectFilter('all');
                setStatusFilter('all');
              }}
              className="text-purple-700 hover:text-purple-900 font-bold"
            >
              إعادة ضبط الفلاتر
            </button>
          )}
        </div>
      </div>

      {/* Teachers Cards Grid */}
      {filteredTeachers.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">لم يتم العثور على معلمين يطابقون شروط البحث</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            تأكد من كتابة الاسم أو اسم المستخدم بشكل صحيح، أو اضغط على إضافة معلم لإنشاء حساب جديد.
          </p>
          <button
            onClick={handleStartAdd}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold"
          >
            إضافة معلم الآن
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeachers.map((teacher) => {
            const stats = teacherStats.get(teacher.name) || {
              positiveCount: 0,
              negativeCount: 0,
              positiveSum: 0,
              negativeSum: 0
            };
            const isCurrent = currentTeacher?.id === teacher.id;
            const isSuspended = teacher.status === 'suspended';
            const isPasswordVisible = !!showPasswords[teacher.id];

            return (
              <div
                key={teacher.id}
                className={`bg-white rounded-3xl border p-5 shadow-xs space-y-4 transition-all hover:shadow-md relative overflow-hidden flex flex-col justify-between ${
                  isCurrent
                    ? 'border-purple-400 ring-2 ring-purple-400/30'
                    : isSuspended
                    ? 'border-rose-200 bg-rose-50/20'
                    : 'border-slate-200'
                }`}
              >
                {/* Top Status Strip */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={teacher.avatar}
                        alt={teacher.name}
                        referrerPolicy="no-referrer"
                        className="w-13 h-13 rounded-2xl object-cover border-2 border-purple-200 bg-purple-50 shadow-xs"
                      />
                      <span
                        className={`absolute -bottom-1 -left-1 w-4 h-4 rounded-full border-2 border-white ${
                          isSuspended ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                        title={isSuspended ? 'الحساب معطل' : 'الحساب نشط'}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-extrabold text-sm text-slate-900">{teacher.name}</h4>
                        {isCurrent && (
                          <span className="px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-black">
                            أنت
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-purple-700 font-bold mt-0.5">{teacher.subject}</p>
                      {teacher.majorDepartment && (
                        <span className="text-[10px] text-slate-400 block">{teacher.majorDepartment}</span>
                      )}
                    </div>
                  </div>

                  {/* Role Badge */}
                  <div>
                    {teacher.role === 'admin' ? (
                      <span className="px-2 py-1 bg-purple-100 text-purple-900 font-black text-[10px] rounded-lg border border-purple-300">
                        👑 مدير نظام
                      </span>
                    ) : teacher.role === 'supervisor' ? (
                      <span className="px-2 py-1 bg-blue-100 text-blue-900 font-black text-[10px] rounded-lg border border-blue-300">
                        ⭐ مشرف تدريب
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-900 font-black text-[10px] rounded-lg border border-emerald-300">
                        👨‍🏫 معلم / مهندس
                      </span>
                    )}
                  </div>
                </div>

                {/* Account Credentials Box */}
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">اسم المستخدم:</span>
                    <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {teacher.username}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px] flex items-center gap-1">
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span>كلمة المرور:</span>
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {isPasswordVisible ? teacher.password : '••••••'}
                      </span>
                      <button
                        onClick={() => togglePasswordVisibility(teacher.id)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
                        title={isPasswordVisible ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                      >
                        {isPasswordVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {(teacher.phone || teacher.email) && (
                    <div className="pt-1 border-t border-slate-200/70 text-[11px] text-slate-500 flex items-center justify-between">
                      {teacher.phone && (
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{teacher.phone}</span>
                        </span>
                      )}
                      {teacher.email && (
                        <span className="truncate max-w-[140px]" title={teacher.email}>
                          {teacher.email}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Activity Stats */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs py-2 bg-purple-50/50 rounded-2xl border border-purple-100">
                  <div>
                    <span className="text-slate-400 block text-[10px]">حوافز إيجابية منحها</span>
                    <span className="font-black text-emerald-600 font-mono">+{stats.positiveSum} نقطة</span>
                    <span className="text-[9px] text-slate-400 block">({stats.positiveCount} إجراء)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">مخالفات سجلها</span>
                    <span className="font-black text-rose-600 font-mono">-{stats.negativeSum} نقطة</span>
                    <span className="text-[9px] text-slate-400 block">({stats.negativeCount} مخالفة)</span>
                  </div>
                </div>

                {/* Management Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEdit(teacher)}
                      className="px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold transition-colors flex items-center gap-1"
                      title="تعديل بيانات المعلم"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>تعديل</span>
                    </button>

                    <button
                      onClick={() => handleToggleStatus(teacher)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                        isSuspended
                          ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                      title={isSuspended ? 'تفعيل الحساب' : 'تعطيل الحساب مؤقتاً'}
                    >
                      {isSuspended ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>تفعيل</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-slate-500" />
                          <span>تعطيل</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    {onImpersonateTeacher && !isCurrent && (
                      <button
                        onClick={() => onImpersonateTeacher(teacher)}
                        className="px-2 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-900 text-xs font-bold transition-colors flex items-center gap-1"
                        title="الدخول بهذا الحساب لمعاينة لوحته"
                      >
                        <LogIn className="w-3.5 h-3.5 text-cyan-700" />
                        <span className="hidden sm:inline">دخول</span>
                      </button>
                    )}

                    <button
                      onClick={() => setDeletingTeacher(teacher)}
                      disabled={isCurrent}
                      className={`p-1.5 rounded-xl text-xs transition-colors ${
                        isCurrent
                          ? 'text-slate-300 cursor-not-allowed'
                          : 'text-rose-500 hover:bg-rose-50 hover:text-rose-700'
                      }`}
                      title={isCurrent ? 'لا يمكنك حذف الحساب الذي تستخدمه حالياً' : 'حذف المعلم'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: ADD OR EDIT TEACHER */}
      {(isAddModalOpen || editingTeacher) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
          <div
            className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 relative my-auto animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
            dir="rtl"
          >
            {/* Modal Header */}
            <div className="bg-linear-to-r from-purple-950 via-[#3B0764] to-slate-900 text-white p-5 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    {editingTeacher ? 'تعديل بيانات المعلم / المهندس' : 'إضافة معلم أو مهندس جديد'}
                  </h3>
                  <p className="text-[11px] text-purple-200">
                    مدرسة WE المشتركة للتطبيقات التكنولوجية
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingTeacher(null);
                }}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-center gap-2 font-bold">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title and Name */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">اللقب</label>
                  <select
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-purple-500 font-bold text-xs sm:text-sm"
                  >
                    <option value="مهندس">م. (مهندس)</option>
                    <option value="مهندسة">م. (مهندسة)</option>
                    <option value="دكتور">د. (دكتور)</option>
                    <option value="دكتورة">د. (دكتورة)</option>
                    <option value="أستاذ">أ. (أستاذ)</option>
                    <option value="أستاذة">أ. (أستاذة)</option>
                    <option value="أخصائي">أخصائي</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    الاسم بالكامل <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: حسام الدين نبيل"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Username and Password */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    اسم المستخدم للدخول <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: hossam.nabil"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-purple-500 text-left"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    كلمة المرور <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="كلمة المرور (مثال: 123)"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-purple-500 text-left"
                      dir="ltr"
                    />
                    <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Role & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نوع الصلاحية والحساب</label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as 'teacher' | 'supervisor' | 'admin'
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-purple-500 font-bold"
                  >
                    <option value="teacher">👨‍🏫 معلم / مهندس مادة</option>
                    <option value="supervisor">⭐ مشرف تدريب ميداني / شؤون طلاب</option>
                    <option value="admin">👑 مدير نظام كامل الصلاحيات (Admin)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">حالة الحساب</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'active' | 'suspended'
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-purple-500 font-bold"
                  >
                    <option value="active">🟢 مفعل (يستطيع تسجيل الدخول والرصد)</option>
                    <option value="suspended">🔴 معطل مؤقتاً</option>
                  </select>
                </div>
              </div>

              {/* Subject (Primary field) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  المادة / التخصص التدريسي <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: هندسة البرمجيات، شبكات الألياف الضوئية، تدريب عملي، لغة عربية..."
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 text-sm font-medium"
                />
              </div>

              {/* Phone & Email (Optional) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">رقم الهاتف (اختياري)</label>
                  <input
                    type="tel"
                    placeholder="01012345678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-mono text-left"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">البريد الإلكتروني (اختياري)</label>
                  <input
                    type="email"
                    placeholder="name@we.school.edu.eg"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-mono text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Custom Photo URL Input & Live Preview */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-purple-600" />
                  رابط صورة المعلم / المهندس
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={formData.avatar || DEFAULT_AVATAR}
                      alt="معاينة الصورة"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
                      }}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-300 bg-purple-50 shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isCompressingTeacherPhoto}
                        onClick={() => teacherPhotoRef.current?.click()}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 disabled:opacity-60 text-purple-800 text-xs font-bold rounded-xl border border-purple-200 cursor-pointer transition-colors"
                      >
                        {isCompressingTeacherPhoto ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-700" />
                        ) : (
                          <Upload className="w-3.5 h-3.5 text-purple-700" />
                        )}
                        <span>
                          {isCompressingTeacherPhoto
                            ? 'جاري تجهيز الصورة...'
                            : 'رفع صورة من جهازك'}
                        </span>
                      </button>
                      <span className="text-[10px] text-slate-400">أو ألصق رابط URL أدناه</span>
                    </div>
                    <input
                      type="url"
                      placeholder="أدخل رابط صورة المعلم (URL) أو اتركها للصورة الافتراضية"
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-mono text-left"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingTeacher(null);
                  }}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-linear-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white rounded-xl font-black shadow-md transition-all hover:scale-105 active:scale-95"
                >
                  {editingTeacher ? 'حفظ التعديلات' : 'إضافة المعلم الآن'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRM DELETE */}
      {deletingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-center" dir="rtl">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                هل أنت متأكد من حذف حساب {deletingTeacher.name}؟
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                سيتم حذف حساب المعلم ولن يتمكن من تسجيل الدخول. ستبقى النقاط والمخالفات المسجلة للطلاب سابقاً باسمه موثقة في سجل التدقيق الأكاديمي.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                onClick={() => setDeletingTeacher(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold text-xs"
              >
                تراجع
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-xs shadow-md"
              >
                تأكيد الحذف نهائياً
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
