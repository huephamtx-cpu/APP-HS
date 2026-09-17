import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  Phone,
} from 'lucide-react';
import { useClassroom } from '../context/ClassroomContext';
import { Student, AlertLevel } from '../types';

interface ProgressViewProps {
  onSelectStudent: (student: Student) => void;
  onOpenParentContact: (student: Student) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  onSelectStudent,
  onOpenParentContact,
}) => {
  const { classStats } = useClassroom();
  const [filterLevel, setFilterLevel] = useState<'all' | AlertLevel>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredList = classStats.studentStatsList.filter((st) => {
    const matchSearch =
      st.student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.student.student_code.includes(searchTerm);
    const matchLevel = filterLevel === 'all' || st.alertLevel === filterLevel;
    return matchSearch && matchLevel;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-100 text-indigo-800">
              PHÂN TÍCH TIẾN BỘ & AI CẢNH BÁO
            </span>
            <span className="text-xs text-slate-500">• Chu kỳ Tháng 9/2026</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">Theo Dõi Tiến Bộ & Cảnh Báo Sớm</h2>
          <p className="text-xs text-slate-500">
            Trợ lý AI tự động rà soát dữ liệu hành vi & chuyên cần, phân loại 3 mức cảnh báo sớm với ngôn từ sư phạm chuẩn mực.
          </p>
        </div>
      </div>

      {/* 3 Level Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Level 1: High Priority */}
        <div
          onClick={() => setFilterLevel('high_priority')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            filterLevel === 'high_priority'
              ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800">
              🔴 Ưu tiên cao ({classStats.highPriorityAlerts.length})
            </span>
            <ShieldAlert className="w-5 h-5 text-rose-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-3">Cần can thiệp & hỗ trợ sớm</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Học sinh vắng không phép từ 2 buổi trở lên, vi phạm nề nếp lặp lại hoặc điểm thi đua giảm sâu.
          </p>
        </div>

        {/* Level 2: Need Monitoring */}
        <div
          onClick={() => setFilterLevel('need_monitoring')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            filterLevel === 'need_monitoring'
              ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800">
              🟡 Cần theo dõi ({classStats.needMonitoringAlerts.length})
            </span>
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-3">Có dấu hiệu dao động</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Có dấu hiệu đi trễ nhiều lần, giảm điểm nhẹ, cần giáo viên nhắc nhở và theo dõi sát.
          </p>
        </div>

        {/* Level 3: Positive Progress */}
        <div
          onClick={() => setFilterLevel('positive_progress')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            filterLevel === 'positive_progress'
              ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
              🟢 Tiến bộ rõ rệt ({classStats.positiveProgressList.length})
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-3">Gương sáng thi đua</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Có tiến bộ rõ rệt trong tuần/tháng, đạt nhiều điểm cộng, chuyên cần tốt hoặc có thành tích.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên học sinh..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-blue-500"
          />
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setFilterLevel('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterLevel === 'all' ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Tất cả 45 HS
          </button>
        </div>
      </div>

      {/* Student List with Trends & AI Reasoning */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="divide-y divide-slate-100">
          {filteredList.map((st) => {
            const isHigh = st.alertLevel === 'high_priority';
            const isMedium = st.alertLevel === 'need_monitoring';
            const isPositive = st.alertLevel === 'positive_progress';

            return (
              <div
                key={st.student.id}
                className="p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                {/* Info */}
                <div
                  className="flex items-start space-x-3 cursor-pointer flex-1"
                  onClick={() => onSelectStudent(st.student)}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                      isHigh
                        ? 'bg-rose-100 text-rose-700'
                        : isMedium
                        ? 'bg-amber-100 text-amber-700'
                        : isPositive
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {isPositive ? '↗' : isHigh ? '↘' : isMedium ? '→' : '—'}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm hover:text-blue-700">
                        {st.student.full_name}
                      </span>
                      <span className="font-mono text-slate-400">({st.student.student_code})</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isHigh
                            ? 'bg-rose-100 text-rose-800'
                            : isMedium
                            ? 'bg-amber-100 text-amber-800'
                            : isPositive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {isHigh
                          ? '🔴 Ưu tiên cao'
                          : isMedium
                          ? '🟡 Cần theo dõi'
                          : isPositive
                          ? '🟢 Tiến bộ'
                          : 'Ổn định'}
                      </span>
                    </div>

                    <p className="text-slate-600 mt-1 leading-relaxed">
                      {st.alertReason ? (
                        <span className="font-semibold text-slate-800">
                          Nhận định AI: {st.alertReason}
                        </span>
                      ) : (
                        'Nề nếp và chuyên cần bình thường, học sinh tiếp thu và thực hiện đúng nội quy.'
                      )}
                    </p>

                    <div className="text-[11px] text-slate-400 flex items-center space-x-3 mt-1 font-mono">
                      <span>Chuyên cần: {st.attendanceRate}%</span>
                      <span>•</span>
                      <span>Trễ: {st.lateCount} lần</span>
                      <span>•</span>
                      <span>Vắng KP: {st.unexcusedAbsence} buổi</span>
                      <span>•</span>
                      <span>Điểm tuần: {st.currentWeeklyScore}đ</span>
                    </div>
                  </div>
                </div>

                {/* Sparkline Visual (4 weeks) & Contact action */}
                <div className="flex items-center space-x-4 self-end md:self-center shrink-0">
                  <div className="flex items-end space-x-1 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    {st.weeklyScoresHistory.map((item, idx) => (
                      <div
                        key={idx}
                        className={`w-3.5 rounded-xs transition-all ${
                          item.score >= 90
                            ? 'bg-blue-600'
                            : item.score >= 80
                            ? 'bg-indigo-500'
                            : item.score >= 65
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ height: `${Math.max(12, item.score * 0.28)}px` }}
                        title={`${item.week}: ${item.score}đ`}
                      ></div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenParentContact(st.student)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Liên hệ PH</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
