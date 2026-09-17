import React, { useState } from 'react';
import { Student, PointType } from '../types';
import { QUICK_ACTIONS, calculateBadge, calculatePercentage, BADGE_TIERS } from '../utils/badges';
import confetti from 'canvas-confetti';
import {
  X,
  PlusCircle,
  MinusCircle,
  Sparkles,
  AlertTriangle,
  Award,
  Laptop,
  Users,
  Clock,
  Smartphone,
  FileWarning,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

interface AddPointsModalProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onAddPoint: (
    studentId: string,
    type: PointType,
    category: string,
    points: number,
    note: string,
    teacherName: string
  ) => void;
}

export const AddPointsModal: React.FC<AddPointsModalProps> = ({
  student,
  isOpen,
  onClose,
  onAddPoint
}) => {
  const [pointType, setPointType] = useState<PointType>('positive');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('pos_1');
  const [category, setCategory] = useState<string>('إجابة نموذجية ومشاركة صفية');
  const [pointsAmount, setPointsAmount] = useState<number>(5);
  const [note, setNote] = useState<string>('');
  const [teacherName, setTeacherName] = useState<string>('م. المشرف التكنولوجي');

  if (!isOpen) return null;

  // Filter presets based on selected type
  const availablePresets = QUICK_ACTIONS.filter((p) => p.type === pointType);

  const handlePresetSelect = (preset: (typeof QUICK_ACTIONS)[0]) => {
    setSelectedPresetId(preset.id);
    setCategory(preset.category);
    setPointsAmount(Math.abs(preset.points));
    if (!note) {
      setNote(preset.description);
    }
  };

  // Preview resulting points
  const deltaPoints = pointType === 'positive' ? pointsAmount : -pointsAmount;
  const projectedPoints = Math.max(0, student.points + deltaPoints);
  const projectedPercentage = calculatePercentage(projectedPoints, student.targetPoints);
  const currentBadge = BADGE_TIERS[student.badge];
  const projectedBadgeTier = calculateBadge(projectedPercentage);
  const projectedBadge = BADGE_TIERS[projectedBadgeTier];
  const isBadgeUpgrade =
    pointType === 'positive' && projectedBadgeTier !== student.badge && projectedPercentage > student.percentage;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.trim() || pointsAmount <= 0) return;

    onAddPoint(
      student.id,
      pointType,
      category,
      pointType === 'positive' ? pointsAmount : -pointsAmount,
      note.trim() || category,
      teacherName.trim() || 'معلم المدرسة'
    );

    if (isBadgeUpgrade) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.error(err);
      }
    }

    onClose();
  };

  const getPresetIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageSquareCheck':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'Laptop':
        return <Laptop className="w-4 h-4 text-blue-600" />;
      case 'Users':
        return <Users className="w-4 h-4 text-indigo-600" />;
      case 'Clock':
        return <Clock className="w-4 h-4 text-purple-600" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'Smartphone':
        return <Smartphone className="w-4 h-4 text-rose-600" />;
      case 'FileWarning':
        return <FileWarning className="w-4 h-4 text-orange-600" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-4 h-4 text-red-600" />;
      default:
        return <Award className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-200"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-3">
            <img
              src={student.avatar}
              alt={student.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-xl object-cover border border-purple-200"
            />
            <div>
              <h2 className="text-base font-extrabold text-slate-900">{student.name}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>كود: {student.code}</span>
                <span>•</span>
                <span className="font-semibold text-purple-700">{student.major}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector: Positive Incentive vs Negative Infraction */}
        <div className="grid grid-cols-2 gap-3 mb-5 p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setPointType('positive');
              const firstPos = QUICK_ACTIONS.find((p) => p.type === 'positive');
              if (firstPos) handlePresetSelect(firstPos);
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs transition-all ${
              pointType === 'positive'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>نقاط تحفيزية إيجابية (+)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPointType('negative');
              const firstNeg = QUICK_ACTIONS.find((p) => p.type === 'negative');
              if (firstNeg) handlePresetSelect(firstNeg);
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs transition-all ${
              pointType === 'negative'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MinusCircle className="w-4 h-4" />
            <span>تسجيل مخالفة سلوكية (-)</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick Preset Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              اختر سبباً سريعاً من اللائحة المدرسية:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
              {availablePresets.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    className={`flex items-start gap-2 p-2.5 rounded-xl border text-right transition-all text-xs ${
                      isSelected
                        ? pointType === 'positive'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-400'
                          : 'border-rose-500 bg-rose-50 text-rose-950 ring-1 ring-rose-400'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="mt-0.5 shrink-0">{getPresetIcon(preset.icon)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold truncate">{preset.category}</div>
                      <div className="text-[10px] text-slate-500 truncate">{preset.description}</div>
                    </div>
                    <span
                      className={`text-xs font-extrabold px-1.5 py-0.5 rounded-md shrink-0 ${
                        pointType === 'positive'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {preset.points > 0 ? `+${preset.points}` : preset.points}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Category & Amount */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                بند التقييم / التصنيف:
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSelectedPresetId('');
                }}
                required
                placeholder="مثال: إجابة مميزة في معمل الشبكات"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                عدد النقاط:
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={pointsAmount}
                  onChange={(e) => setPointsAmount(Math.max(1, parseInt(e.target.value) || 1))}
                  required
                  className={`w-full px-3 py-2 text-xs font-bold border rounded-xl focus:outline-hidden focus:ring-2 ${
                    pointType === 'positive'
                      ? 'border-emerald-300 text-emerald-700 focus:ring-emerald-400'
                      : 'border-rose-300 text-rose-700 focus:ring-rose-400'
                  }`}
                />
                <span className="absolute left-2.5 top-2 text-[10px] text-slate-400">
                  {pointType === 'positive' ? 'إضافة +' : 'خصم -'}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ملاحظة توضيحية / تفاصيل الموقف السلوكي:
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="اكتب تفاصيل إضافية لتظهر في سجل الطالب وتقارير ولي الأمر والمشرف..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Teacher name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              اسم المعلم / القائم بالرصد:
            </label>
            <input
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Dynamic Preview Card */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">المستوى الحالي:</span>
              <span className="font-bold text-slate-800">
                {student.points} نقطة ({student.percentage}%) • {currentBadge.badgeEmoji} {currentBadge.title}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">المستوى المتوقع بعد التسجيل:</span>
              <span className="font-extrabold text-purple-700">
                {projectedPoints} نقطة ({projectedPercentage}%) • {projectedBadge.badgeEmoji} {projectedBadge.title}
              </span>
            </div>

            {isBadgeUpgrade && (
              <div className="flex items-center gap-1.5 p-2 bg-amber-50 border border-amber-300 rounded-xl text-amber-800 text-xs font-bold animate-pulse">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>تهانينا! سيرتقي الطالب لرتبة جديدة: {projectedBadge.title} 🎉</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-md transition-all ${
                pointType === 'positive'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                  : 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
              }`}
            >
              {pointType === 'positive' ? <PlusCircle className="w-4 h-4" /> : <MinusCircle className="w-4 h-4" />}
              <span>تأكيد تسجيل {pointType === 'positive' ? 'النقاط' : 'المخالفة'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
