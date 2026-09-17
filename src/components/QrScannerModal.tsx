import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import { parseQrCodePayload } from '../utils/qrUtils';
import { Student } from '../types';
import {
  X,
  Camera,
  Upload,
  Search,
  ScanLine,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Smartphone
} from 'lucide-react';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onScanSuccess: (studentId: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  students,
  onScanSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'simulate' | 'upload' | 'manual'>('camera');
  const [cameraError, setCameraError] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [manualQuery, setManualQuery] = useState<string>('');
  const [simulatedFilter, setSimulatedFilter] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera helper
  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  // Start Camera
  const startCamera = async () => {
    stopCamera();
    setCameraError('');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('المتصفح لا يدعم الوصول للكاميرا، يمكنك استخدام الفحص اليدوي أو رفع صورة الكود.');
        setActiveTab('simulate');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setIsScanning(true);
        scanFrame();
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('تعذر فتح الكاميرا (ربما بسبب صلاحيات المتصفح). يمكنك تجربة المحاكاة السريعة أو إدخال كود الطالب.');
      setActiveTab('simulate');
    }
  };

  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (ctx) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        });

        if (code && code.data) {
          const { studentId, valid } = parseQrCodePayload(code.data);
          if (valid || studentId) {
            handleFoundStudent(studentId);
            return;
          }
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanFrame);
  };

  const handleFoundStudent = (targetId: string) => {
    stopCamera();
    // Match against students list by ID or code
    const found = students.find(
      (s) => s.id.toLowerCase() === targetId.toLowerCase() || s.code === targetId
    );

    if (found) {
      onScanSuccess(found.id);
    } else {
      // If exact ID exists in raw string
      onScanSuccess(targetId);
    }
    onClose();
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            const { studentId } = parseQrCodePayload(code.data);
            handleFoundStudent(studentId);
          } else {
            alert('لم يتم العثور على رمز QR صالح في هذه الصورة. يرجى تجربة صورة أوضح.');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const filteredSimulatedStudents = students.filter(
    (s) =>
      s.name.includes(simulatedFilter) ||
      s.code.includes(simulatedFilter) ||
      s.major.includes(simulatedFilter)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-200"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-purple-100 text-purple-700 rounded-xl">
              <ScanLine className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">ماسح كود QR الذكي للمعلمين</h2>
              <p className="text-xs text-slate-500">امسح كود بطاقة الطالب للوصول المباشر للبروفايل</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl mb-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'camera' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>كاميرا الفحص</span>
          </button>

          <button
            onClick={() => setActiveTab('simulate')}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'simulate' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>محاكاة الفحص السريع</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'upload' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>رفع صورة QR</span>
          </button>

          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'manual' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>بحث يدوي</span>
          </button>
        </div>

        {/* Tab 1: Live Camera Scanner */}
        {activeTab === 'camera' && (
          <div className="space-y-4">
            <div className="relative bg-slate-950 rounded-2xl overflow-hidden aspect-4/3 flex items-center justify-center border-2 border-purple-500/40">
              <video ref={videoRef} className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="hidden" />

              {/* Viewfinder Target Graphic */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-52 h-52 border-2 border-purple-400 rounded-2xl relative shadow-2xl">
                  {/* Glowing corners */}
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-cyan-400 rounded-tr-lg"></div>
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-cyan-400 rounded-tl-lg"></div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-cyan-400 rounded-br-lg"></div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-cyan-400 rounded-bl-lg"></div>

                  {/* Laser scan line animation */}
                  <div className="w-full h-0.5 bg-linear-to-r from-transparent via-cyan-400 to-transparent absolute top-1/2 -translate-y-1/2 animate-bounce"></div>
                </div>
              </div>

              {!isScanning && (
                <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center p-6 text-center text-white">
                  <Camera className="w-10 h-10 text-purple-400 mb-2 animate-pulse" />
                  <p className="text-xs text-slate-300 mb-3">
                    {cameraError || 'جاري تهيئة كاميرا المعلم... يرجى منح الإذن عند المطالبة'}
                  </p>
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold"
                  >
                    إعادة محاولة فتح الكاميرا
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs text-center text-slate-500">
              قم بتوجيه الكاميرا نحو كود QR الموجود على بطاقة الطالب (ID Card). سيتم فتح الملف الشخصي فوراً.
            </p>
          </div>
        )}

        {/* Tab 2: Simulated Quick Scan (Test Any Student Instantly) */}
        {activeTab === 'simulate' && (
          <div className="space-y-3">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>وضع المحاكاة السريعة:</strong> انقر على أي طالب لمحاكاة مسح الكود فورياً كأنك قمت بمسحه عبر الكاميرا الآن.
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن طالب بالاسم أو الكود..."
                value={simulatedFilter}
                onChange={(e) => setSimulatedFilter(e.target.value)}
                className="w-full px-3 py-2 pr-9 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {filteredSimulatedStudents.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-xl transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={s.avatar}
                      alt={s.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-lg object-cover border"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{s.name}</div>
                      <div className="text-[10px] text-slate-500">
                        كود: <span className="font-mono">{s.code}</span> • {s.major}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleFoundStudent(s.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    <ScanLine className="w-3.5 h-3.5" />
                    <span>مسح هذا الكود</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Upload QR Image */}
        {activeTab === 'upload' && (
          <div className="p-8 border-2 border-dashed border-purple-200 bg-purple-50/40 rounded-2xl text-center space-y-3">
            <Upload className="w-10 h-10 text-purple-600 mx-auto" />
            <div>
              <h3 className="text-sm font-bold text-slate-800">اختر صورة أو لقطة شاشة لكود QR</h3>
              <p className="text-xs text-slate-500 mt-1">سيتم استخراج بيانات الطالب وفتح بروفايله تلقائياً</p>
            </div>
            <label className="inline-block cursor-pointer px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors">
              <span>تصفح ملفات الجهاز</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        )}

        {/* Tab 4: Manual Student ID / Code Search */}
        {activeTab === 'manual' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                أدخل كود الطالب أو رقمه التعريفي:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="مثال: 10401 أو WE-2025-0101"
                  value={manualQuery}
                  onChange={(e) => setManualQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && manualQuery.trim()) {
                      handleFoundStudent(manualQuery.trim());
                    }
                  }}
                  className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (manualQuery.trim()) {
                      handleFoundStudent(manualQuery.trim());
                    }
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold"
                >
                  فتح البروفايل
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 space-y-1">
              <div className="font-semibold text-slate-700">أكواد سريعة للتجربة:</div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {students.slice(0, 4).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleFoundStudent(s.id)}
                    className="px-2 py-1 bg-white border border-slate-200 hover:border-purple-400 rounded-md text-[11px] text-purple-700 font-mono"
                  >
                    #{s.code} ({s.name.split(' ')[0]})
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
