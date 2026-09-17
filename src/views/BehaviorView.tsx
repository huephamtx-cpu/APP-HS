import React, { useState } from 'react';
import {
  Star,
  AlertTriangle,
  Award,
  Download,
  Trash2,
  Filter,
  Search,
  PlusCircle,
  TrendingUp,
} from 'lucide-react';
import { useClassroom } from '../context/ClassroomContext';
import { Student } from '../types';
import { exportCompetitionReportToExcel } from '../utils/excel';

interface BehaviorViewProps {
  onOpenQuickBehavior: (student?: Student, type?: 'positive' | 'violation') => void;
  onSelectStudent: (student: Student) => void;
}

export const BehaviorView: React.FC<BehaviorViewProps> = ({
  onOpenQuickBehavior,
  onSelectStudent,
}) => {
  const { data, classStats, deleteBehaviorRecord } = useClassroom();
  const [activeTab, setActiveTab] = useState<'ranking' | 'history'>('ranking');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'positive' | 'violation'>('all');

  const filteredStats = classStats.studentStatsList.filter((st) =>
    st.student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    st.student.student_code.includes(searchTerm)
  );

  const filteredBehaviors = data.behaviors.filter((b) => {
    const student = data.students.find((s) => s.id === b.student_id);
    const matchSearch =
      (student && student.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      b.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'all' || b.type === typeFilter;
    return matchSearch && matchType;
  });

  const handleExportExcel = () => {
    exportCompetitionReportToExcel(classStats.studentStatsList, 'Bang_Xep_Hang_Thi_Dua_Lop_9_7.xlsx');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-800">
              THI ĐUA NỀ NẾP LỚP 9/7
            </span>
            <span className="text-xs text-slate-500">• Điểm chuẩn tuần: 100 điểm</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">Nề nếp & Bảng Điểm Thi đua</h2>
          <p className="text-xs text-slate-500">
            Hệ thống chấm điểm tự động: Ghi nhận việc tốt (+2 đến +5đ), nhắc nhở vi phạm (-2 đến -10đ), xếp loại tuần.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onOpenQuickBehavior(undefined, 'positive')}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Star className="w-4 h-4" />
            <span>+ Khen ngợi (+đ)</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenQuickBehavior(undefined, 'violation')}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>- Ghi vi phạm (-đ)</span>
          </button>

          <button
            type="button"
            onClick={handleExportExcel}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
            title="Xuất bảng xếp hạng Excel"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('ranking')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'ranking'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          🏆 Bảng Xếp Hạng & Điểm Tuần (45 HS)
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'history'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          📜 Lịch Sử Ghi Nhận Nề Nếp ({data.behaviors.length})
        </button>
      </div>

      {/* Tab 1: Ranking Table */}
      {activeTab === 'ranking' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200">
            <div className="relative w-full max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm học sinh trong bảng..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-blue-500"
              />
            </div>
            <div className="text-xs text-slate-500">
              Điểm trung bình toàn lớp: <span className="font-bold text-indigo-700">{classStats.averageScore}đ</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3 w-14 text-center">Hạng</th>
                    <th className="py-3 px-3 w-20">Mã HS</th>
                    <th className="py-3 px-3">Họ và tên</th>
                    <th className="py-3 px-3 text-center">Chuyên cần</th>
                    <th className="py-3 px-3 text-center">Điểm cộng</th>
                    <th className="py-3 px-3 text-center">Điểm trừ</th>
                    <th className="py-3 px-3 text-center">Điểm tuần</th>
                    <th className="py-3 px-3 text-center">Xếp loại</th>
                    <th className="py-3 px-3 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStats.map((st) => {
                    return (
                      <tr
                        key={st.student.id}
                        className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                        onClick={() => onSelectStudent(st.student)}
                      >
                        <td className="py-3 px-3 text-center font-black">
                          <span
                            className={`inline-block w-6 h-6 leading-6 rounded-full text-center text-xs ${
                              st.rank === 1
                                ? 'bg-amber-400 text-slate-950 font-black'
                                : st.rank === 2
                                ? 'bg-slate-200 text-slate-800 font-bold'
                                : st.rank === 3
                                ? 'bg-amber-700/80 text-white font-bold'
                                : 'text-slate-500 font-mono'
                            }`}
                          >
                            {st.rank}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-500 font-semibold">{st.student.student_code}</td>
                        <td className="py-3 px-3 font-bold text-slate-900 hover:text-blue-700">{st.student.full_name}</td>
                        <td className="py-3 px-3 text-center font-bold text-emerald-600">{st.attendanceRate}%</td>
                        <td className="py-3 px-3 text-center font-bold text-emerald-600">+{st.bonusPoints}</td>
                        <td className="py-3 px-3 text-center font-bold text-rose-600">
                          {st.penaltyPoints > 0 ? `-${st.penaltyPoints}` : '0'}
                        </td>
                        <td className="py-3 px-3 text-center font-black text-blue-800 text-sm">
                          {st.currentWeeklyScore}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              st.rating === 'Xuất sắc'
                                ? 'bg-emerald-100 text-emerald-800'
                                : st.rating === 'Tốt'
                                ? 'bg-blue-100 text-blue-800'
                                : st.rating === 'Khá'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {st.rating}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => onOpenQuickBehavior(st.student, 'positive')}
                            className="px-2 py-1 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 rounded-lg text-[11px] font-bold transition-colors cursor-pointer mr-1"
                          >
                            + Điểm
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenQuickBehavior(st.student, 'violation')}
                            className="px-2 py-1 bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-800 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            - Điểm
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: History Log */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo học sinh hoặc hành vi..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-blue-500"
              />
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  typeFilter === 'all' ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setTypeFilter('positive')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  typeFilter === 'positive' ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600'
                }`}
              >
                ⭐ Tích cực
              </button>
              <button
                onClick={() => setTypeFilter('violation')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  typeFilter === 'violation' ? 'bg-rose-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600'
                }`}
              >
                ⚠️ Vi phạm
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100">
              {filteredBehaviors.map((b) => {
                const student = data.students.find((s) => s.id === b.student_id);

                return (
                  <div
                    key={b.id}
                    className="p-4 hover:bg-slate-50 flex items-center justify-between transition-colors text-xs"
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`p-2 rounded-xl shrink-0 ${
                          b.type === 'positive'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {b.type === 'positive' ? <Star className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span
                            className="font-bold text-slate-900 hover:text-blue-700 cursor-pointer"
                            onClick={() => student && onSelectStudent(student)}
                          >
                            {student?.full_name || 'Học sinh'}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">
                            ({student?.student_code})
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="font-semibold text-slate-700">{b.category}</span>
                        </div>
                        <p className="text-slate-600 mt-0.5">{b.description}</p>
                        {b.note && <p className="text-[11px] text-slate-500 italic mt-0.5">Ghi chú: {b.note}</p>}
                        <div className="text-[10px] text-slate-400 font-mono mt-1">
                          {b.date} • Ghi nhận bởi {b.recorded_by}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span
                        className={`font-black text-sm px-2.5 py-1 rounded-xl ${
                          b.type === 'positive'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {b.type === 'positive' ? `+${b.points}đ` : `${b.points}đ`}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteBehaviorRecord(b.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Xóa bản ghi này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
