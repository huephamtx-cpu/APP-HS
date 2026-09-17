import React, { useState } from 'react';
import {
  Users,
  CheckCircle,
  AlertTriangle,
  Clock,
  Award,
  TrendingUp,
  Star,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  HeartHandshake,
  CheckCheck,
  Flame,
  Calendar,
  Dice5,
} from 'lucide-react';
import { useClassroom } from '../context/ClassroomContext';
import { TabKey } from '../components/Navigation';
import { Student } from '../types';

interface DashboardViewProps {
  onNavigate: (tab: TabKey) => void;
  onSelectStudent: (student: Student) => void;
  onOpenQuickBehavior: (student?: Student, type?: 'positive' | 'violation') => void;
  onOpenQuickReward: () => void;
  onOpenRandomPicker?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onSelectStudent,
  onOpenQuickBehavior,
  onOpenQuickReward,
  onOpenRandomPicker,
}) => {
  const { data, classStats, selectedDate, markAllPresent } = useClassroom();
  const [allPresentSuccess, setAllPresentSuccess] = useState<boolean>(false);

  const handle1TouchAllPresent = () => {
    markAllPresent(selectedDate);
    setAllPresentSuccess(true);
    setTimeout(() => setAllPresentSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Welcome Greeting & Header Section */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative background element */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-amber-400 text-slate-950 shadow-xs">
                GVCN: Cô Hue Pham
              </span>
              <span className="text-xs text-blue-200 font-mono">
                Lớp 9/7 • Năm học 2026–2027
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Bảng Quản lý Chủ nhiệm Lớp 9/7
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl leading-relaxed">
              Hệ thống quản trị lớp thông minh: Chuyên cần 45 học sinh, thi đua nề nếp thời gian thực,
              cảnh báo sớm học sinh sa sút và trợ lý AI sư phạm.
            </p>
          </div>

          {/* Quick Date Display & 1-Touch Attendance */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-col sm:items-end justify-center shrink-0">
            <div className="text-xs text-blue-200 flex items-center space-x-1.5 mb-2 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span>Hôm nay: {selectedDate}</span>
            </div>
            <button
              type="button"
              onClick={handle1TouchAllPresent}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer ${
                allPresentSuccess
                  ? 'bg-emerald-500 text-white'
                  : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 hover:shadow-emerald-500/20'
              }`}
            >
              <CheckCheck className="w-4 h-4" />
              <span>{allPresentSuccess ? 'ĐÃ ĐIỂM DANH TẤT CẢ 45 HS!' : '1-CHẠM: TẤT CẢ CÓ MẶT'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Mobile Quick Action Bar (6 Essential Buttons) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Các Thao Tác Trọng Tâm Giờ Học (3-Click Rule)
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {/* 1. Điểm danh */}
          <button
            type="button"
            onClick={() => onNavigate('attendance')}
            className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-blue-900">📅 ĐIỂM DANH</span>
            <span className="text-[10px] text-blue-600">Sĩ số 45 em</span>
          </button>

          {/* 2. Gọi tên ngẫu nhiên */}
          <button
            type="button"
            onClick={onOpenRandomPicker}
            className="p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Dice5 className="w-5 h-5 text-amber-300" />
            </div>
            <span className="text-xs font-bold text-purple-950">🎲 GỌI TÊN</span>
            <span className="text-[10px] text-purple-700">Ngẫu nhiên lên bảng</span>
          </button>

          {/* 3. Ghi nề nếp */}
          <button
            type="button"
            onClick={() => onOpenQuickBehavior(undefined, 'positive')}
            className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Star className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-900">⭐ GHI NỀ NẾP</span>
            <span className="text-[10px] text-emerald-600">Cộng điểm tốt</span>
          </button>

          {/* 4. Khen thưởng */}
          <button
            type="button"
            onClick={onOpenQuickReward}
            className="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-amber-900">🏆 KHEN THƯỞNG</span>
            <span className="text-[10px] text-amber-700">Tuyên dương tuần</span>
          </button>

          {/* 5. Ghi vi phạm */}
          <button
            type="button"
            onClick={() => onOpenQuickBehavior(undefined, 'violation')}
            className="p-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-rose-900">⚠️ GHI VI PHẠM</span>
            <span className="text-[10px] text-rose-600">Trừ điểm thi đua</span>
          </button>

          {/* 6. Hỏi AI */}
          <button
            type="button"
            onClick={() => onNavigate('ai_assistant')}
            className="p-3 bg-linear-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border border-indigo-200 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <span className="text-xs font-bold text-indigo-950">🤖 HỎI AI</span>
            <span className="text-[10px] text-indigo-600">Trợ lý Cô Hue Pham</span>
          </button>
        </div>
      </div>

      {/* 3. Core Overview Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Sĩ số */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold text-slate-600">Sĩ số lớp</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {classStats.totalStudents}<span className="text-xs font-medium text-slate-400">/45</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Đủ chỉ tiêu biên chế</div>
        </div>

        {/* Có mặt */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold text-slate-600">Có mặt hôm nay</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {classStats.presentToday}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            {classStats.totalStudents > 0
              ? `${Math.round((classStats.presentToday / classStats.totalStudents) * 100)}% sĩ số`
              : '100%'}
          </div>
        </div>

        {/* Vắng phép & không phép */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold text-slate-600">Vắng hôm nay</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600">
            {classStats.excusedToday + classStats.unexcusedToday}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {classStats.excusedToday} phép • {classStats.unexcusedToday} KP
          </div>
        </div>

        {/* Đi trễ */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold text-slate-600">Đi trễ hôm nay</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">
            {classStats.lateToday}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Sau 07:15 sáng</div>
        </div>

        {/* Điểm thi đua trung bình */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold text-slate-600">Thi đua TB</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-600">
            {classStats.averageScore}
          </div>
          <div className="text-[11px] text-indigo-700 font-semibold mt-1">Thang 100 điểm</div>
        </div>

        {/* Khen thưởng & Cần quan tâm */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold text-slate-600">Cần quan tâm</span>
            <ShieldAlert className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-700">
            {classStats.highPriorityAlerts.length + classStats.needMonitoringAlerts.length}
          </div>
          <div className="text-[11px] text-purple-600 font-semibold mt-1">
            {classStats.highPriorityAlerts.length} mức cao
          </div>
        </div>
      </div>

      {/* 4. Two-Column Layout: TOP STUDENTS & AI EARLY ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Top Students & Weekly Highlights */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Top Học Sinh Xuất Sắc Tuần Này</h3>
                  <p className="text-xs text-slate-500">Xếp hạng theo điểm thi đua và rèn luyện</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('behavior')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer"
              >
                <span>Xem cả lớp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              {classStats.topStudents.map((item, idx) => (
                <div
                  key={item.student.id}
                  onClick={() => onSelectStudent(item.student)}
                  className="p-3 rounded-xl border border-slate-100 hover:border-blue-300 bg-slate-50/50 hover:bg-blue-50/40 flex items-center justify-between transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        idx === 0
                          ? 'bg-amber-400 text-slate-950 shadow-xs'
                          : idx === 1
                          ? 'bg-slate-300 text-slate-800'
                          : idx === 2
                          ? 'bg-amber-700/80 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                        <span>{item.student.full_name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({item.student.student_code})</span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5">
                        <span className="text-emerald-600 font-semibold">Chuyên cần: {item.attendanceRate}%</span>
                        <span>•</span>
                        <span className="text-amber-600 font-semibold">Khen thưởng: {item.meritCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black text-blue-700">{item.currentWeeklyScore}đ</div>
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {item.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Suggestion Chips for Teacher */}
          <div className="bg-linear-to-br from-indigo-50 via-purple-50 to-blue-50 p-5 rounded-2xl border border-indigo-100">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wide">
                Gợi ý phân tích nhanh cùng AI Cô Hue Pham
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                'Hôm nay lớp có vấn đề gì?',
                'Những học sinh nào cần quan tâm tuần này?',
                'Ai tiến bộ nhất?',
                'Ai có chuyên cần thấp?',
                'Ai đi trễ nhiều nhất?',
                'Tạo báo cáo tuần.',
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => onNavigate('ai_assistant')}
                  className="px-3 py-1.5 bg-white hover:bg-indigo-600 hover:text-white text-indigo-900 border border-indigo-200/80 rounded-xl text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                >
                  💬 {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 cols: AI Early Warning (3 Levels) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">AI Cảnh Báo Sớm Học Sinh</h3>
                  <p className="text-xs text-slate-500">Phát hiện dấu hiệu sa sút để hỗ trợ kịp thời</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('progress')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Chi tiết
              </button>
            </div>

            {/* Warning Cards List */}
            <div className="space-y-2.5">
              {/* High Priority Alerts */}
              {classStats.highPriorityAlerts.map((item) => (
                <div
                  key={item.student.id}
                  onClick={() => onSelectStudent(item.student)}
                  className="p-3 bg-rose-50 border border-rose-200 rounded-xl hover:border-rose-400 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-950 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                      <span>{item.student.full_name}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-200 text-rose-800">
                      🔴 Ưu tiên cao
                    </span>
                  </div>
                  <p className="text-xs text-rose-800 font-medium mt-1 leading-snug">
                    {item.alertReason}
                  </p>
                  <div className="text-[10px] text-rose-700 flex items-center space-x-2 mt-1.5 pt-1 border-t border-rose-200/60">
                    <span>Điểm: {item.currentWeeklyScore}đ</span>
                    <span>•</span>
                    <span>Vắng: {item.unexcusedAbsence} KP</span>
                    <span>•</span>
                    <span>Đi trễ: {item.lateCount}</span>
                  </div>
                </div>
              ))}

              {/* Need Monitoring */}
              {classStats.needMonitoringAlerts.slice(0, 3).map((item) => (
                <div
                  key={item.student.id}
                  onClick={() => onSelectStudent(item.student)}
                  className="p-3 bg-amber-50 border border-amber-200 rounded-xl hover:border-amber-400 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-950">
                      {item.student.full_name}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-200 text-amber-800">
                      🟡 Cần theo dõi
                    </span>
                  </div>
                  <p className="text-xs text-amber-800 font-medium mt-1 leading-snug">
                    {item.alertReason}
                  </p>
                  <div className="text-[10px] text-amber-700 flex items-center space-x-2 mt-1.5 pt-1 border-t border-amber-200/60">
                    <span>Điểm: {item.currentWeeklyScore}đ</span>
                    <span>•</span>
                    <span>Đi trễ: {item.lateCount}</span>
                  </div>
                </div>
              ))}

              {/* Positive Progress */}
              {classStats.positiveProgressList.slice(0, 2).map((item) => (
                <div
                  key={item.student.id}
                  onClick={() => onSelectStudent(item.student)}
                  className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl hover:border-emerald-400 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-950">
                      {item.student.full_name}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-200 text-emerald-800">
                      🟢 Tiến bộ rõ rệt
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 font-medium mt-1 leading-snug">
                    {item.alertReason}
                  </p>
                </div>
              ))}

              {classStats.highPriorityAlerts.length === 0 &&
                classStats.needMonitoringAlerts.length === 0 && (
                  <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                    ✅ Tuần này nề nếp lớp 9/7 rất tốt, không có học sinh nào nằm trong diện cảnh báo cao.
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
