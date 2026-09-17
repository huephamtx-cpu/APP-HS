import React, { useState } from 'react';
import {
  CalendarCheck2,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  CheckCheck,
  Search,
  Download,
  Filter,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { useClassroom } from '../context/ClassroomContext';
import { AttendanceStatus, Student } from '../types';
import * as XLSX from 'xlsx';

interface AttendanceViewProps {
  onSelectStudent: (student: Student) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({ onSelectStudent }) => {
  const { data, selectedDate, setSelectedDate, markAllPresent, updateAttendance, saveDataNow } = useClassroom();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [justMarkedAll, setJustMarkedAll] = useState<boolean>(false);
  const [isSavingAttendance, setIsSavingAttendance] = useState<boolean>(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string>('');

  const handleSaveAttendanceNow = async () => {
    setIsSavingAttendance(true);
    await saveDataNow();
    setIsSavingAttendance(false);
    setSaveSuccessMessage(`Đã lưu dữ liệu điểm danh ngày ${selectedDate} thành công!`);
    setTimeout(() => setSaveSuccessMessage(''), 3000);
  };

  // Get attendance status for a student on current date
  const getRecordForStudent = (studentId: string) => {
    return data.attendance.find((a) => a.student_id === studentId && a.date === selectedDate);
  };

  const handleAllPresentClick = () => {
    markAllPresent(selectedDate);
    setJustMarkedAll(true);
    setTimeout(() => setJustMarkedAll(false), 2000);
  };

  // Compute counts for today
  const todayAttendance = data.attendance.filter((a) => a.date === selectedDate);
  const total = data.students.length;
  const presentCount = data.students.filter((s) => getRecordForStudent(s.id)?.status === 'present').length;
  const excusedCount = data.students.filter((s) => getRecordForStudent(s.id)?.status === 'excused').length;
  const unexcusedCount = data.students.filter((s) => getRecordForStudent(s.id)?.status === 'unexcused').length;
  const lateCount = data.students.filter((s) => getRecordForStudent(s.id)?.status === 'late').length;

  const attendanceRate = total > 0 ? Math.round(((presentCount + lateCount * 0.5) / total) * 100) : 100;

  const filteredStudents = data.students.filter((s) => {
    const record = getRecordForStudent(s.id);
    const status = record ? record.status : 'present';
    const matchSearch =
      s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.student_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleExportAttendance = () => {
    const rows = data.students.map((s, idx) => {
      const record = getRecordForStudent(s.id);
      const st = record ? record.status : 'present';
      return {
        STT: s.stt || idx + 1,
        'Mã HS': s.student_code,
        'Họ và tên': s.full_name,
        Ngày: selectedDate,
        'Trạng thái':
          st === 'present'
            ? 'Có mặt'
            : st === 'late'
            ? 'Đi trễ'
            : st === 'excused'
            ? 'Vắng có phép'
            : 'Vắng không phép',
        'Lý do / Ghi chú': record?.note || '',
        'Thời gian ghi': record?.recorded_at || '',
      };
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `DiemDanh_${selectedDate}`);
    XLSX.writeFile(wb, `DiemDanh_Lop9_7_${selectedDate}.xlsx`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Date Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-800">
              ĐIỂM DANH LỚP 9/7
            </span>
            <span className="text-xs text-slate-500">• Giờ vào lớp: {data.settings.class.morning_start_time}</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">Sổ Điểm Danh & Chuyên Cần</h2>
          <p className="text-xs text-slate-500">
            Quy trình 1-chạm: Chọn &quot;Tất cả có mặt&quot;, sau đó bấm điều chỉnh nhanh những học sinh vắng hoặc trễ.
          </p>
        </div>

        {/* Date Selector & 1-touch Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center space-x-2 px-3 py-2 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-600">Ngày:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent font-bold text-slate-900 focus:outline-hidden cursor-pointer"
            />
          </div>

          <button
            type="button"
            onClick={handleAllPresentClick}
            className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center space-x-2 transition-all shadow-xs cursor-pointer ${
              justMarkedAll
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
            }`}
          >
            <CheckCheck className="w-4 h-4" />
            <span>{justMarkedAll ? 'ĐÃ ĐIỂM DANH XONG!' : 'TẤT CẢ CÓ MẶT (1 CHẠM)'}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAttendanceNow}
            disabled={isSavingAttendance}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-xs cursor-pointer disabled:opacity-50 ${
              saveSuccessMessage
                ? 'bg-emerald-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            title="Lưu dữ liệu điểm danh vào hệ thống"
          >
            <Save className="w-4 h-4" />
            <span>
              {isSavingAttendance
                ? 'Đang lưu...'
                : saveSuccessMessage
                ? 'Đã lưu ✓'
                : 'Lưu điểm danh'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleExportAttendance}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
            title="Xuất bảng điểm danh Excel"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Save Success Banner */}
      {saveSuccessMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Sĩ số lớp</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{total} học sinh</div>
          <div className="text-[11px] text-blue-600 font-semibold mt-0.5">Biên chế 9/7</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Có mặt hôm nay</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{presentCount}</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">Đúng giờ</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Vắng có phép</div>
          <div className="text-2xl font-black text-blue-600 mt-1">{excusedCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Phụ huynh đã báo</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Vắng không phép</div>
          <div className="text-2xl font-black text-rose-600 mt-1">{unexcusedCount}</div>
          <div className="text-[11px] text-rose-600 font-semibold mt-0.5">Cần gọi phụ huynh ngay</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
          <div className="text-xs text-slate-500 font-medium">Đi trễ</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{lateCount}</div>
          <div className="text-[11px] text-amber-700 font-semibold mt-0.5">Chuyên cần: {attendanceRate}%</div>
        </div>
      </div>

      {/* Filter Chips & Search Bar */}
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

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: 'all', label: `Tất cả (${total})` },
            { id: 'present', label: `Có mặt (${presentCount})` },
            { id: 'excused', label: `Vắng phép (${excusedCount})` },
            { id: 'unexcused', label: `Vắng KP (${unexcusedCount})` },
            { id: 'late', label: `Đi trễ (${lateCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Attendance Roster List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="divide-y divide-slate-100">
          {filteredStudents.map((s, idx) => {
            const record = getRecordForStudent(s.id);
            const currentStatus: AttendanceStatus = record ? record.status : 'present';
            const currentNote = record?.note || '';

            return (
              <div
                key={s.id}
                className="p-3 sm:p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Student Info */}
                <div
                  className="flex items-center space-x-3 cursor-pointer"
                  onClick={() => onSelectStudent(s)}
                >
                  <span className="font-mono text-xs font-bold text-slate-400 w-8 text-center">
                    #{s.stt || idx + 1}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                      <span className="hover:text-blue-700">{s.full_name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({s.student_code})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5">
                      <span>Phụ huynh: {s.mother_name || s.father_name}</span>
                      <span>•</span>
                      <span className="font-mono text-blue-600 font-semibold">{s.mother_phone || s.father_phone}</span>
                    </div>
                  </div>
                </div>

                {/* Status Toggle Chips & Note input */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Status Toggle Buttons (1-touch per student) */}
                  <div className="inline-flex bg-slate-100 p-1 rounded-xl gap-1">
                    <button
                      type="button"
                      onClick={() => updateAttendance(s.id, 'present', currentNote, selectedDate)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        currentStatus === 'present'
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-emerald-700'
                      }`}
                    >
                      Có mặt
                    </button>

                    <button
                      type="button"
                      onClick={() => updateAttendance(s.id, 'late', currentNote || 'Đến lớp trễ', selectedDate)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        currentStatus === 'late'
                          ? 'bg-amber-500 text-slate-950 shadow-2xs'
                          : 'text-slate-600 hover:text-amber-700'
                      }`}
                    >
                      Đi trễ
                    </button>

                    <button
                      type="button"
                      onClick={() => updateAttendance(s.id, 'excused', currentNote || 'Có phép', selectedDate)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        currentStatus === 'excused'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-blue-700'
                      }`}
                    >
                      Vắng phép
                    </button>

                    <button
                      type="button"
                      onClick={() => updateAttendance(s.id, 'unexcused', currentNote || 'Không phép', selectedDate)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        currentStatus === 'unexcused'
                          ? 'bg-rose-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-rose-700'
                      }`}
                    >
                      Vắng KP
                    </button>
                  </div>

                  {/* Note Input for Reason */}
                  {currentStatus !== 'present' && (
                    <input
                      type="text"
                      placeholder="Lý do / ghi chú..."
                      value={currentNote}
                      onChange={(e) => updateAttendance(s.id, currentStatus, e.target.value, selectedDate)}
                      className="w-40 sm:w-48 px-2.5 py-1 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-blue-500"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
