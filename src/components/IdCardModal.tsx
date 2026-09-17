import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { BADGE_TIERS } from '../utils/badges';
import { generateQrCodeDataUrl } from '../utils/qrUtils';
import { X, Printer, Download, ScanLine, ShieldCheck, Cpu } from 'lucide-react';

interface IdCardModalProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onSimulateScan?: (studentId: string) => void;
}

export const IdCardModal: React.FC<IdCardModalProps> = ({
  student,
  isOpen,
  onClose,
  onSimulateScan
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const badgeInfo = BADGE_TIERS[student.badge];

  useEffect(() => {
    if (student) {
      generateQrCodeDataUrl(student.id, student.name).then((url) => {
        setQrDataUrl(url);
      });
    }
  }, [student]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QR_${student.code}_${student.name.replace(/\s+/g, '_')}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-200"
        dir="rtl"
      >
        {/* Header Action Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-purple-100 text-purple-700 rounded-xl">
              <ScanLine className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-black text-slate-900">بطاقة الهوية التكنولوجية الذكية (Smart ID)</h2>
              <p className="text-xs text-slate-500">كود QR مخصص للمسح الفوري من قبل معلمي المدرسة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable ID Card Container */}
        <div className="flex justify-center mb-6">
          <div
            id="printable-id-card"
            className="printable-id-card w-full max-w-md bg-linear-to-br from-slate-900 via-[#3B0764] to-[#1E1B4B] text-white rounded-2xl shadow-xl overflow-hidden border border-purple-400/30 relative"
          >
            {/* Top School Header Bar */}
            <div className="bg-white/10 backdrop-blur-md px-5 py-3 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#4A154B] font-black text-xs shadow-xs">
                  we
                </div>
                <div>
                  <div className="text-[11px] font-black tracking-wider text-purple-200">
                    مدارس WE للتطبيقات التكنولوجية
                  </div>
                  <div className="text-[9px] text-slate-300">
                    WE Applied Technology Schools
                  </div>
                </div>
              </div>
              <div className="text-left">
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold">
                  طالب نظامي نشط
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5">
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Avatar and Hologram */}
                <div className="col-span-4 flex flex-col items-center">
                  <div className="relative">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      referrerPolicy="no-referrer"
                      className="w-24 h-28 object-cover rounded-xl border-2 border-purple-300 shadow-md bg-slate-800"
                    />
                    <div
                      className="absolute -bottom-2 -left-2 bg-slate-900 border border-purple-400/50 rounded-full p-1 shadow-lg text-xs"
                      title={badgeInfo.title}
                    >
                      <span className="text-base">{badgeInfo.badgeEmoji}</span>
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <span className="text-[10px] font-mono text-purple-300 tracking-wider">
                      #{student.code}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="col-span-8 space-y-2 text-right">
                  <div>
                    <span className="text-[10px] text-purple-300 block">اسم الطالب</span>
                    <h3 className="text-base font-extrabold text-white leading-tight">
                      {student.name}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-[9px] text-slate-400 block">المرحلة الدراسية</span>
                      <span className="font-semibold text-slate-200">{student.grade}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block">كود المنظومة</span>
                      <span className="font-mono font-bold text-amber-300">{student.id}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-400 block">التخصص التكنولوجي</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-500/30">
                      <Cpu className="w-3 h-3" />
                      {student.major}
                    </span>
                  </div>

                  <div className="pt-1 flex items-center justify-between border-t border-white/10 text-[10px] text-slate-300">
                    <span>رتبة الطالب: <strong className="text-white">{badgeInfo.title}</strong></span>
                    <span className="font-bold text-purple-300">{student.percentage}% إنجاز</span>
                  </div>
                </div>
              </div>

              {/* Lower Section with QR Code */}
              <div className="mt-4 pt-4 border-t border-white/10 bg-white/5 rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>رمز الاستجابة السريع (QR Code)</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-relaxed max-w-[200px]">
                    امسح الرمز بكاميرا المعلم لفتح ملف الطالب وتسجيل النقاط والمخالفات مباشرة.
                  </p>
                  <div className="text-[9px] text-slate-400 font-mono">
                    VERIFIED // WE-TECH-ID
                  </div>
                </div>

                {/* The QR Image */}
                <div className="bg-white p-1.5 rounded-xl shadow-md border-2 border-purple-400/40 shrink-0">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Student QR Code"
                      className="w-20 h-20 rounded-md"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-slate-200 animate-pulse rounded-md flex items-center justify-center text-slate-400 text-xs">
                      جاري التوليد...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Accent */}
            <div className="h-1.5 bg-linear-to-r from-purple-500 via-cyan-400 to-purple-600"></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-white hover:bg-slate-900 font-bold text-xs transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4 text-purple-400" />
            <span>طباعة الكارنيه</span>
          </button>

          <button
            onClick={handleDownloadQr}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs border border-purple-200 transition-colors"
          >
            <Download className="w-4 h-4 text-purple-600" />
            <span>تحميل كود QR</span>
          </button>

          {onSimulateScan && (
            <button
              onClick={() => {
                onClose();
                onSimulateScan(student.id);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs transition-colors shadow-xs"
            >
              <ScanLine className="w-4 h-4" />
              <span>تجربة مسح الكود كمعلم</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
