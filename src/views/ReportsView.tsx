import React, { useState } from 'react';
import { BarChart3, Download, Printer, Sparkles, Calendar, Award, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useClassroom } from '../context/ClassroomContext';
import { exportCompetitionReportToExcel } from '../utils/excel';

export const ReportsView: React.FC = () => {
  const { data, classStats, selectedDate } = useClassroom();
  const [reportPeriod, setReportPeriod] = useState<'day' | 'week' | 'month' | 'semester'>('week');
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);

  const handleGenerateAiSummary = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/ai/period-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          period:
            reportPeriod === 'day'
              ? `Ngày ${selectedDate}`
              : reportPeriod === 'week'
              ? 'Tuần 4 (Tháng 9/2026)'
              : reportPeriod === 'month'
              ? 'Tháng 9/2026'
              : 'Học kỳ I (2026–2027)',
          stats: {
            totalStudents: data.students.length,
            avgScore: classStats.averageScore,
            totalMerits: classStats.totalMerits,
            highAlertCount: classStats.highPriorityAlerts.length,
            lateCount: classStats.lateToday,
            unexcusedCount: classStats.unexcusedToday,
            topStudents: classStats.topStudents.map((s) => s.student.full_name).join(', '),
            concernStudents: classStats.highPriorityAlerts.map((s) => `${s.student.full_name} (${s.alertReason})`).join('; '),
          },
        }),
      });
      const json = await res.json();
      setAiSummary(json.summary || 'Chưa nhận được phản hồi.');
    } catch (e: any) {
      setAiSummary('Lỗi khi gọi AI: ' + e.message);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    exportCompetitionReportToExcel(classStats.studentStatsList, `Bao_Cao_Lop_9_7_${reportPeriod}.xlsx`);
  };

  return (
    <div className="space-y-6 pb-12 print:p-0">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
              BÁO CÁO CHỦ NHIỆM LỚP 9/7
            </span>
            <span className="text-xs text-slate-500">• Cô Hue Pham • {data.settings.class.school_name || 'THCS Tân Xuân'}</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">Báo Cáo & Tổng Hợp Thi Đua</h2>
          <p className="text-xs text-slate-500">
            Tổng hợp dữ liệu chuyên cần, nề nếp, thành tích học sinh để báo cáo Ban Giám hiệu hoặc lưu hồ sơ.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Excel</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>In Báo Cáo</span>
          </button>
        </div>
      </div>

      {/* Period Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2 print:hidden">
        {[
          { id: 'day', label: 'Báo cáo Ngày' },
          { id: 'week', label: 'Báo cáo Tuần' },
          { id: 'month', label: 'Báo cáo Tháng' },
          { id: 'semester', label: 'Báo cáo Học kỳ' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportPeriod(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              reportPeriod === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Printable Report Document */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Document Header */}
        <div className="text-center border-b border-slate-200 pb-6">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">
            {data.settings.class.school_name}
          </p>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase mt-1">
            BÁO CÁO TÌNH HÌNH LỚP CHỦ NHIỆM 9/7
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Kỳ báo cáo:{' '}
            <span className="font-bold text-blue-800">
              {reportPeriod === 'day'
                ? `Ngày ${selectedDate}`
                : reportPeriod === 'week'
                ? 'Tuần 4 (Tháng 9/2026)'
                : reportPeriod === 'month'
                ? 'Tháng 9/2026'
                : 'Học kỳ I (Năm học 2026–2027)'}
            </span>{' '}
            • Giáo viên chủ nhiệm: <span className="font-bold">Cô Hue Pham</span>
          </p>
        </div>

        {/* 1. Numerical Statistics */}
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            I. Thống Kê Số Liệu Trọng Tâm (Sĩ số 45 học sinh)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500">Sĩ số duy trì:</span>
              <div className="text-lg font-black text-slate-900 mt-0.5">{data.students.length}/45 HS</div>
              <div className="text-[11px] text-slate-500">Đạt 100% biên chế</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500">Điểm thi đua trung bình:</span>
              <div className="text-lg font-black text-blue-700 mt-0.5">{classStats.averageScore} / 100</div>
              <div className="text-[11px] text-emerald-600 font-semibold">Xếp loại: Tốt</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500">Tổng khen thưởng đã trao:</span>
              <div className="text-lg font-black text-amber-600 mt-0.5">{classStats.totalMerits} lượt</div>
              <div className="text-[11px] text-slate-500">Biểu dương trước lớp</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500">Học sinh cần lưu tâm:</span>
              <div className="text-lg font-black text-rose-600 mt-0.5">
                {classStats.highPriorityAlerts.length} học sinh
              </div>
              <div className="text-[11px] text-slate-500">Đã trao đổi phụ huynh</div>
            </div>
          </div>
        </div>

        {/* 2. Top Outstanding Students */}
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            II. Học Sinh Tiêu Biểu & Khen Thưởng
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {classStats.topStudents.slice(0, 3).map((st, i) => (
              <div key={i} className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                <div className="font-bold text-amber-950 flex items-center space-x-1.5">
                  <span>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                  <span>{st.student.full_name}</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-1">
                  Điểm tuần: <span className="font-bold text-blue-800">{st.currentWeeklyScore}đ</span> • Khen thưởng:{' '}
                  <span className="font-bold text-amber-700">{st.meritCount} lần</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Students Needing Attention */}
        {classStats.highPriorityAlerts.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              III. Các Trường Hợp Cần Giáo Viên & Gia Đình Hỗ Trợ Kịp Thời
            </h3>
            <div className="space-y-2 text-xs">
              {classStats.highPriorityAlerts.map((st) => (
                <div key={st.student.id} className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                  <div className="font-bold text-rose-900">{st.student.full_name} ({st.student.student_code})</div>
                  <p className="text-slate-700 mt-0.5">{st.alertReason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. AI Automated Synthesis Section */}
        <div className="pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between mb-3 print:hidden">
            <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>IV. Đoạn Nhận Xét Tổng Quan Đề Xuất (Tạo bởi AI)</span>
            </h3>

            <button
              type="button"
              onClick={handleGenerateAiSummary}
              disabled={isGeneratingAi}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGeneratingAi ? 'Đang tổng hợp...' : 'Tạo đoạn báo cáo AI'}</span>
            </button>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
            {aiSummary ? (
              <div className="whitespace-pre-wrap">{aiSummary}</div>
            ) : (
              <p className="text-slate-500 italic">
                Bấm &quot;Tạo đoạn báo cáo AI&quot; để hệ thống tự động sinh văn bản báo cáo sư phạm hoàn chỉnh cho kỳ này dựa trên dữ liệu lớp.
              </p>
            )}
          </div>
        </div>

        {/* Signatures */}
        <div className="pt-8 border-t border-slate-200 flex justify-between items-center text-center text-xs">
          <div className="w-1/2">
            <p className="text-slate-500 italic mb-8">Nơi nhận: Ban Giám hiệu</p>
            <p className="font-bold text-slate-700">BAN GIÁM HIỆU DUYỆT</p>
          </div>
          <div className="w-1/2">
            <p className="text-slate-500 italic mb-8">TP. Hồ Chí Minh, ngày ... tháng ... năm 2026</p>
            <p className="font-bold text-slate-900">GIÁO VIÊN CHỦ NHIỆM</p>
            <p className="mt-8 font-extrabold text-blue-900">{data.settings.class.teacher_name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
