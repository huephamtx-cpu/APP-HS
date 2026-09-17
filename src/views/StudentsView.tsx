import React, { useState } from 'react';
import {
  Search,
  FileSpreadsheet,
  Download,
  Filter,
  Eye,
  Star,
  Phone,
  LayoutGrid,
  List,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Edit3,
  Dice5,
} from 'lucide-react';
import { useClassroom } from '../context/ClassroomContext';
import { Student } from '../types';
import { exportStudentsToExcel } from '../utils/excel';

interface StudentsViewProps {
  onSelectStudent: (student: Student) => void;
  onEditStudent?: (student: Student) => void;
  onOpenImportModal: () => void;
  onOpenQuickBehavior: (student: Student) => void;
  onOpenRandomPicker?: () => void;
  initialSearch?: string;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  onSelectStudent,
  onEditStudent,
  onOpenImportModal,
  onOpenQuickBehavior,
  onOpenRandomPicker,
  initialSearch = '',
}) => {
  const { data, classStats } = useClassroom();
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [genderFilter, setGenderFilter] = useState<'all' | 'Nam' | 'Nữ'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const filteredStudents = data.students.filter((s) => {
    const matchName =
      s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.student_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGender = genderFilter === 'all' || s.gender === genderFilter;
    return matchName && matchGender;
  });

  const getStatsForStudent = (id: string) => {
    return classStats.studentStatsList.find((st) => st.student.id === id);
  };

  const handleExport = () => {
    exportStudentsToExcel(data.students, 'Danh_Sach_45_Hoc_Sinh_Lop_9_7.xlsx');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-800">
              SĨ SỐ BIÊN CHẾ: 45 HỌC SINH
            </span>
            <span className="text-xs text-slate-500">• Lớp 9/7 • GVCN: Cô Hue Pham</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">Hồ sơ Học sinh Lớp 9/7</h2>
          <p className="text-xs text-slate-500">
            Quản lý lý lịch, thông tin phụ huynh, chỉ số chuyên cần và tiến bộ nề nếp của từng học sinh.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2.5 shrink-0">
          {onOpenRandomPicker && (
            <button
              type="button"
              onClick={onOpenRandomPicker}
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              title="Gọi tên ngẫu nhiên 1 học sinh lên bảng"
            >
              <Dice5 className="w-4 h-4 text-amber-300" />
              <span>Gọi tên ngẫu nhiên</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenImportModal}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Import Excel</span>
          </button>

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Verification status banner */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
        <div className="flex items-center space-x-2">
          {data.students.length === 45 ? (
            <span className="text-emerald-700 flex items-center space-x-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Chuẩn sĩ số: Đã đồng bộ chính xác 45/45 học sinh của Lớp 9/7.</span>
            </span>
          ) : (
            <span className="text-amber-700 flex items-center space-x-1.5 font-bold">
              <AlertCircle className="w-4 h-4" />
              <span>Hiện có {data.students.length} học sinh (Quy chuẩn lớp 9/7 là 45 học sinh).</span>
            </span>
          )}
        </div>
        <div className="text-slate-500 font-medium">
          Nam: {data.students.filter((s) => s.gender === 'Nam').length} • Nữ:{' '}
          {data.students.filter((s) => s.gender === 'Nữ').length}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        <div className="flex items-center space-x-2 w-full sm:w-auto flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên học sinh, mã HS, SĐT..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Gender Filter */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setGenderFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                genderFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Tất cả ({data.students.length})
            </button>
            <button
              onClick={() => setGenderFilter('Nam')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                genderFilter === 'Nam' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Nam
            </button>
            <button
              onClick={() => setGenderFilter('Nữ')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                genderFilter === 'Nữ' ? 'bg-white text-pink-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Nữ
            </button>
          </div>

          {/* View toggle */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Xem bảng"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Xem thẻ lưới"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* View: Table Mode */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3 w-12 text-center">STT</th>
                  <th className="py-3 px-3 w-20">Mã HS</th>
                  <th className="py-3 px-3">Họ và tên</th>
                  <th className="py-3 px-3 w-16 text-center">Phái</th>
                  <th className="py-3 px-3">Ngày sinh</th>
                  <th className="py-3 px-3">Phụ huynh chính</th>
                  <th className="py-3 px-3">SĐT liên hệ</th>
                  <th className="py-3 px-3 text-center">Chuyên cần</th>
                  <th className="py-3 px-3 text-center">Điểm tuần</th>
                  <th className="py-3 px-3 text-center">Xếp loại</th>
                  <th className="py-3 px-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((s, idx) => {
                  const stats = getStatsForStudent(s.id);
                  const isPositive = stats?.alertLevel === 'positive_progress';
                  const isAlert = stats?.alertLevel === 'high_priority';

                  return (
                    <tr
                      key={s.id}
                      className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                      onClick={() => onSelectStudent(s)}
                    >
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-500">
                        {s.stt || idx + 1}
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-slate-600">
                        {s.student_code}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 group-hover:text-blue-700 flex items-center space-x-1.5">
                          <span>{s.full_name}</span>
                          {isAlert && <span className="w-2 h-2 rounded-full bg-rose-500"></span>}
                          {isPositive && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold ${
                            s.gender === 'Nữ'
                              ? 'bg-pink-100 text-pink-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {s.gender}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600 text-[11px]">
                        {s.date_of_birth}
                      </td>
                      <td className="py-3 px-3 text-slate-700">
                        {s.mother_name || s.father_name || 'Chưa có'}
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-blue-700 text-[11px]">
                        {s.mother_phone || s.father_phone || '—'}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-emerald-600">
                        {stats?.attendanceRate ?? 100}%
                      </td>
                      <td className="py-3 px-3 text-center font-black text-blue-700">
                        {stats?.currentWeeklyScore ?? 100}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                          {stats?.rating ?? 'Tốt'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => onOpenQuickBehavior(s)}
                            title="Ghi nề nếp"
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Star className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => (onEditStudent ? onEditStudent(s) : onSelectStudent(s))}
                            title="Chỉnh sửa thông tin học sinh"
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onSelectStudent(s)}
                            title="Xem hồ sơ"
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View: Grid Mode */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredStudents.map((s, idx) => {
            const stats = getStatsForStudent(s.id);

            return (
              <div
                key={s.id}
                onClick={() => onSelectStudent(s)}
                className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-400 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      #{s.stt || idx + 1} • {s.student_code}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.gender === 'Nữ' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {s.gender}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{s.full_name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Sinh ngày: {s.date_of_birth}</p>

                  <div className="mt-3 p-2.5 bg-slate-50 rounded-xl text-xs flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400">Chuyên cần</div>
                      <div className="font-bold text-emerald-600">{stats?.attendanceRate ?? 100}%</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Điểm thi đua</div>
                      <div className="font-black text-blue-700">{stats?.currentWeeklyScore ?? 100}đ</div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 truncate max-w-[120px]">
                    {s.mother_name || s.father_name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onEditStudent) onEditStudent(s);
                        else onSelectStudent(s);
                      }}
                      className="px-2 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 rounded-md text-[11px] font-bold flex items-center space-x-1 transition-colors"
                      title="Chỉnh sửa thông tin"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Sửa</span>
                    </button>
                    <span className="font-bold text-blue-600 hover:underline">Hồ sơ →</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
