import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { PerformanceDataPoint } from '../types';
import { TrendingUp, TrendingDown, Activity, Award } from 'lucide-react';

interface PerformanceChartProps {
  data: PerformanceDataPoint[];
  studentName: string;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, studentName }) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
        لا توجد بيانات أداء مسجلة حتى الآن
      </div>
    );
  }

  const firstPoint = data[0];
  const lastPoint = data[data.length - 1];
  const percentageDelta = lastPoint.percentage - firstPoint.percentage;
  const isRising = percentageDelta >= 0;

  return (
    <div id="student-performance-section" className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
              <Activity className="w-5 h-5" />
            </span>
            <h3 className="text-base font-bold text-slate-900">مؤشر تطور المستوى والأداء الزمني</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            متابعة صعود وهبوط نسبة النقاط والمستوى السلوكي والأكاديمي للطالب {studentName}
          </p>
        </div>

        {/* Trend Indicator Pill */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
              isRising
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            {isRising ? (
              <>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>مسار صاعد (+{percentageDelta}% منذ البداية)</span>
              </>
            ) : (
              <>
                <TrendingDown className="w-4 h-4 text-rose-600" />
                <span>مسار هابط ({percentageDelta}% يحتاج متابعة)</span>
              </>
            )}
          </div>
          <div className="px-3 py-1.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-purple-600" />
            <span>النسبة الحالية: {lastPoint.percentage}%</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="percentageGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="academicGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="behavioralGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={{ stroke: '#CBD5E1' }}
              tick={{ fill: '#64748B', fontSize: 12, fontFamily: 'Cairo' }}
            />
            <YAxis
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748B', fontSize: 12 }}
              unit="%"
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as PerformanceDataPoint;
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-700 min-w-44 text-right" dir="rtl">
                      <div className="font-bold text-slate-200 border-b border-slate-700 pb-1 flex justify-between items-center">
                        <span>{label}</span>
                        {item.label && <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-300">{item.label}</span>}
                      </div>
                      <div className="flex justify-between text-purple-300 font-semibold">
                        <span>نسبة النقاط والبادج:</span>
                        <span>{item.percentage}% ({item.points} نقطة)</span>
                      </div>
                      <div className="flex justify-between text-cyan-300">
                        <span>المستوى الأكاديمي:</span>
                        <span>{item.academic}%</span>
                      </div>
                      <div className="flex justify-between text-emerald-300">
                        <span>الانضباط السلوكي:</span>
                        <span>{item.behavioral}%</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="top"
              align="left"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '12px', fontFamily: 'Cairo' }}
              formatter={(value) => {
                if (value === 'percentage') return 'نسبة إنجاز النقاط والبادج';
                if (value === 'academic') return 'التقييم الأكاديمي';
                if (value === 'behavioral') return 'الانضباط السلوكي';
                return value;
              }}
            />
            <Area
              type="monotone"
              dataKey="percentage"
              stroke="#7C3AED"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#percentageGradient)"
              activeDot={{ r: 6, fill: '#7C3AED', stroke: '#FFFFFF', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="academic"
              stroke="#06B6D4"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#academicGradient)"
            />
            <Area
              type="monotone"
              dataKey="behavioral"
              stroke="#10B981"
              strokeWidth={2}
              strokeDasharray="2 2"
              fillOpacity={1}
              fill="url(#behavioralGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block"></span>
          الهدف المطلوب للوصول لرتبة القائد التكنولوجي: <strong className="text-slate-700">90% فأعلى</strong>
        </span>
        <span className="text-slate-400">يتم تحديث المؤشر آلياً فور تسجيل أي نقطة أو مخالفة</span>
      </div>
    </div>
  );
};
