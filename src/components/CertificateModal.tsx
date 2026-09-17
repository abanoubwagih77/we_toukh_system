import React, { useRef } from 'react';
import { Student } from '../types';
import { BADGE_TIERS } from '../utils/badges';
import { Award, Printer, X, CheckCircle2, Shield, Sparkles, Download } from 'lucide-react';

interface CertificateModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  issuerName?: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  student,
  isOpen,
  onClose,
  issuerName = 'م. أحمد ممدوح'
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !student) return null;

  const badgeInfo = BADGE_TIERS[student.badge];
  const certId = `WE-CERT-${student.code}-${new Date().getFullYear()}`;
  const todayArabic = new Date().toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
      dir="rtl"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-400/20 text-amber-300 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-white">شهادة تميز تكنولوجي معتمدة</h3>
              <p className="text-xs text-slate-400">
                منظومة التحفيز المدرسي • مدارس WE للتكنولوجيا التطبيقية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الشهادة / تصدير PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Frame */}
        <div
          ref={certificateRef}
          className="p-6 sm:p-12 bg-linear-to-b from-amber-50/40 via-white to-purple-50/30 print:p-8 print:m-0 print:border-none print:shadow-none"
        >
          {/* Outer Border with Ornamental Tech Frame */}
          <div className="relative border-4 border-amber-500/80 rounded-3xl p-6 sm:p-10 bg-white shadow-xl overflow-hidden print:border-4 print:border-amber-600">
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-amber-400/20 via-purple-600/10 to-transparent rounded-bl-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-linear-to-tr from-purple-700/20 via-amber-400/10 to-transparent rounded-tr-full pointer-events-none" />

            {/* Inner Border */}
            <div className="border border-amber-300/60 rounded-2xl p-6 sm:p-8 relative">
              {/* Header: Republic + Ministry + WE Applied Tech Schools */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-amber-200/80 pb-6 text-center sm:text-right">
                <div className="space-y-0.5">
                  <div className="text-[11px] font-bold text-slate-600">جمهورية مصر العربية</div>
                  <div className="text-xs font-black text-slate-800">وزارة التربية والتعليم والتعليم الفني</div>
                  <div className="text-xs font-black text-purple-900">مدارس WE للتكنولوجيا التطبيقية</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-[#4A154B] to-[#7C3AED] text-white font-black text-2xl flex items-center justify-center shadow-lg border border-purple-300">
                    we
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-slate-900">المصرية للاتصالات WE</div>
                    <div className="text-[10px] text-purple-700 font-bold">الشريك الصناعي الرائد</div>
                  </div>
                </div>

                <div className="text-center sm:text-left space-y-0.5">
                  <div className="text-[11px] font-mono text-slate-500">{certId}</div>
                  <div className="text-xs font-bold text-slate-700">{todayArabic}</div>
                  <div className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>شهادة موثقة ورسمية</span>
                  </div>
                </div>
              </div>

              {/* Certificate Main Body */}
              <div className="py-8 sm:py-10 text-center space-y-5">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-linear-to-r from-amber-100 via-amber-200 to-amber-100 text-amber-900 border border-amber-300 text-xs sm:text-sm font-black shadow-xs">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>شهادة تميز واستحقاق تكنولوجي</span>
                  <Sparkles className="w-4 h-4 text-amber-600" />
                </div>

                <p className="text-sm sm:text-base text-slate-600 font-medium">
                  تتشرف إدارة مدرسة WE للتكنولوجيا التطبيقية ولجنة التقييم التكنولوجي بمنح هذه الشهادة للطالب/ة:
                </p>

                <div className="relative inline-block">
                  <h1 className="text-2xl sm:text-4xl font-black text-purple-950 tracking-tight py-2 px-8 border-b-2 border-dashed border-amber-400">
                    {student.name}
                  </h1>
                </div>

                <div className="text-xs sm:text-sm text-slate-700 space-y-1">
                  <p>
                    المقيد بالصف: <strong>{student.grade}</strong> • تخصص:{' '}
                    <strong className="text-purple-900">{student.major}</strong>
                  </p>
                  <p className="text-slate-500 text-xs">
                    كود الطالب الأكاديمي: <span className="font-mono font-bold text-slate-700">{student.code}</span> •
                    الرقم القومي: <span className="font-mono font-bold text-slate-700">{student.nationalId}</span>
                  </p>
                </div>

                {/* Badge Achievement Box */}
                <div className="max-w-xl mx-auto bg-linear-to-r from-slate-50 via-purple-50/50 to-slate-50 border border-purple-200/80 rounded-2xl p-5 shadow-xs">
                  <p className="text-xs text-slate-600 font-semibold mb-2">
                    تقديراً للتميز السلوكي والأكاديمي والالتزام التقني بمشاريع التكنولوجيا، ونيل رتبة:
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl">{badgeInfo.badgeEmoji}</span>
                    <div className="text-right">
                      <div className="text-lg sm:text-xl font-black text-purple-900">{badgeInfo.title}</div>
                      <div className="text-xs text-slate-600">
                        برصيد <strong>{student.points}</strong> نقطة • نسبة إنجاز{' '}
                        <strong className="text-purple-700">{student.percentage}%</strong> • معدل سلوكي{' '}
                        <strong>{student.behavioralScore}/100</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 italic max-w-lg mx-auto">
                  «تُمنح هذه الشهادة تشجيعاً لمواصلة التميز والمنافسة الشريفة وريادة التخصص التقني في سوق العمل الرقمي»
                </p>
              </div>

              {/* Signatures & Seal */}
              <div className="border-t border-amber-200/80 pt-6 grid grid-cols-3 gap-4 items-end text-center">
                {/* Left: Supervisor / Teacher */}
                <div className="space-y-1">
                  <div className="text-[11px] text-slate-500 font-bold">مهندس التخصص الراصد</div>
                  <div className="font-black text-xs sm:text-sm text-slate-800">{issuerName}</div>
                  <div className="text-[10px] text-purple-700 font-semibold">توقيع معتمد</div>
                </div>

                {/* Center: Official Seal */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-amber-500 bg-amber-50/70 flex flex-col items-center justify-center text-amber-800 shadow-inner p-1">
                    <Shield className="w-5 h-5 text-amber-600" />
                    <span className="text-[8px] font-black text-center leading-tight mt-0.5">
                      خاتم اعتماد
                      <br />
                      مدارس WE
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 mt-1">APPLIED TECH</span>
                </div>

                {/* Right: School Principal */}
                <div className="space-y-1">
                  <div className="text-[11px] text-slate-500 font-bold">مدير المدرسة والشريك الأكاديمي</div>
                  <div className="font-black text-xs sm:text-sm text-slate-800">إدارة مدرسة WE</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">اعتماد رسمي</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions (Hidden on Print) */}
        <div className="print:hidden px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>
            يمكنك طباعة الشهادة مباشرة أو حفظها كملف PDF عالي الجودة عبر خيار "Save as PDF" في نافذة الطباعة.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
