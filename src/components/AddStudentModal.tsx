import React, { useState } from 'react';
import { Student } from '../types';
import { SCHOOL_INFO } from '../data/mockData';
import { calculateBadge, calculatePercentage } from '../utils/badges';
import { X, UserPlus, Cpu, GraduationCap, Sparkles } from 'lucide-react';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (student: Student) => void;
  existingCount: number;
}

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300'
];

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onAddStudent,
  existingCount
}) => {
  const [name, setName] = useState<string>('');
  const [grade, setGrade] = useState<string>(SCHOOL_INFO.grades[1]); // Grade 11 default
  const [major, setMajor] = useState<string>(SCHOOL_INFO.majors[0]);
  const [initialPoints, setInitialPoints] = useState<number>(15);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(AVATAR_OPTIONS[0]);

  if (!isOpen) return null;

  const nextCodeNumber = 10400 + existingCount + 1;
  const nextId = `WE-2025-0${100 + existingCount + 1}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const initialPercentage = calculatePercentage(initialPoints, 50);
    const initialBadge = calculateBadge(initialPercentage);

    const newStudent: Student = {
      id: nextId,
      code: String(nextCodeNumber),
      nationalId: `308${Math.floor(10000000000 + Math.random() * 90000000000)}`,
      name: name.trim(),
      grade,
      major,
      avatar: selectedAvatar,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@we-school.edu.eg`,
      phone: `01${Math.floor(100000000 + Math.random() * 900000000)}`,
      points: initialPoints,
      totalPositive: initialPoints,
      totalNegative: 0,
      targetPoints: 50,
      percentage: initialPercentage,
      badge: initialBadge,
      attendanceRate: 95,
      academicScore: 85,
      behavioralScore: 88,
      secretMissionsCompleted: 0,
      performanceHistory: [
        {
          date: 'بداية التسجيل',
          points: initialPoints,
          percentage: initialPercentage,
          behavioral: 85,
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
          note: 'تسجيل الطالب بنجاح في قاعدة بيانات مدرسة WE للتطبيقات التكنولوجية',
          teacherName: 'إدارة شؤون الطلاب',
          createdAt: new Date().toISOString()
        }
      ]
    };

    onAddStudent(newStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-200"
        dir="rtl"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-purple-100 text-purple-700 rounded-xl">
              <UserPlus className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">إضافة طالب جديد للمنظومة</h2>
              <p className="text-xs text-slate-500">توليد بطاقة هوية وكود QR تلقائياً للطالب الجديد</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">اسم الطالب الرباعي بالعربية:</label>
            <input
              type="text"
              required
              placeholder="مثال: أحمد سامي عبد المنعم"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">الصف الدراسي:</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
              >
                {SCHOOL_INFO.grades.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">رصيد النقاط المبدئي:</label>
              <input
                type="number"
                min="0"
                max="50"
                value={initialPoints}
                onChange={(e) => setInitialPoints(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-bold text-purple-700"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">التخصص التكنولوجي:</label>
            <select
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
            >
              {SCHOOL_INFO.majors.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-2">اختر صورة البروفايل والكارنيه:</label>
            <div className="flex items-center gap-3 overflow-x-auto py-1">
              {AVATAR_OPTIONS.map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedAvatar(img)}
                  className={`w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedAvatar === img
                      ? 'border-purple-600 ring-2 ring-purple-300 scale-105'
                      : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Avatar" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Generated ID Preview */}
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-900 text-[11px] space-y-1">
            <div className="flex justify-between">
              <span>كود المنظومة المولد:</span>
              <span className="font-mono font-bold">{nextId}</span>
            </div>
            <div className="flex justify-between">
              <span>كود الطالب المختصر:</span>
              <span className="font-mono font-bold">#{nextCodeNumber}</span>
            </div>
          </div>

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
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md"
            >
              إضافة وتوليد البطاقة الذكية
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
