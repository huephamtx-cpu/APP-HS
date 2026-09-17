import React, { useState, useRef } from 'react';
import {
  Settings,
  Save,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  School,
  Lock,
} from 'lucide-react';
import { useClassroom } from '../context/ClassroomContext';

export const SettingsView: React.FC = () => {
  const {
    data,
    updateClassSettings,
    updateCompetitionSettings,
    loadDemoData,
    clearAllData,
    exportBackupJson,
    importBackupJson,
    saveDataNow,
  } = useClassroom();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Form local state
  const [morningTime, setMorningTime] = useState<string>(data.settings.class.morning_start_time || '07:15');
  const [basePoints, setBasePoints] = useState<number>(data.settings.competition.base_weekly_points || 100);
  const [schoolName, setSchoolName] = useState<string>(data.settings.class.school_name || 'THCS Tân Xuân');
  const [teacherName, setTeacherName] = useState<string>(data.settings.class.teacher_name || 'Cô Hue Pham');

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    updateClassSettings({
      morning_start_time: morningTime,
      school_name: schoolName,
      teacher_name: teacherName,
    });
    updateCompetitionSettings({ base_weekly_points: Number(basePoints) });
    await saveDataNow();
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      const ok = importBackupJson(content);
      if (ok) {
        alert('Khôi phục dữ liệu thành công!');
      } else {
        alert('File dữ liệu không đúng cấu trúc.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-slate-100 text-slate-800">
            HỆ THỐNG
          </span>
          <span className="text-xs text-slate-500">• Phiên bản v1.0 • {data.settings.class.school_name || 'THCS Tân Xuân'}</span>
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 mt-1">Cài Đặt Hệ Thống & Sao Lưu Dữ Liệu</h2>
        <p className="text-xs text-slate-500">
          Cấu hình quy chuẩn thi đua, giờ điểm danh, bảo mật và sao lưu dự phòng cho Lớp 9/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Fixed Info & Rules Configuration */}
        <div className="space-y-6">
          {/* Fixed Class Information */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <School className="w-4 h-4 text-blue-600" />
              <span>Thông tin Lớp học cố định (Theo đề bài)</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <span className="text-slate-500 font-medium">Trường học:</span>
                <span className="font-bold text-slate-900">{data.settings.class.school_name || 'THCS Tân Xuân'}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <span className="text-slate-500 font-medium">Giáo viên chủ nhiệm:</span>
                <span className="font-bold text-slate-900 flex items-center space-x-1">
                  <span>Cô Hue Pham</span>
                  <Lock className="w-3 h-3 text-slate-400" />
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <span className="text-slate-500 font-medium">Lớp biên chế:</span>
                <span className="font-bold text-blue-700 font-mono">9/7</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <span className="text-slate-500 font-medium">Năm học:</span>
                <span className="font-bold text-slate-900">2026–2027</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <span className="text-slate-500 font-medium">Sĩ số quy định:</span>
                <span className="font-bold text-slate-900">Chính xác 45 học sinh</span>
              </div>
            </div>
          </div>

          {/* Scoring & Attendance Configuration Form */}
          <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Settings className="w-4 h-4 text-indigo-600" />
              <span>Chỉnh sửa thông tin & Quy định lớp học</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên trường học:
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  placeholder="THCS Tân Xuân"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Giáo viên chủ nhiệm:
                </label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  placeholder="Cô Hue Pham"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Điểm chuẩn đầu tuần (Thang điểm cơ sở):
              </label>
              <input
                type="number"
                value={basePoints}
                onChange={(e) => setBasePoints(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                min={50}
                max={100}
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Mỗi học sinh bắt đầu tuần với 100 điểm, tự động cộng trừ theo hành vi.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mốc giờ quy định vào lớp buổi sáng (Đi trễ nếu sau mốc này):
              </label>
              <input
                type="text"
                value={morningTime}
                onChange={(e) => setMorningTime(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                placeholder="07:15"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              {saveSuccess ? (
                <span className="text-xs text-emerald-600 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Đã cập nhật và lưu thay đổi thành công!</span>
                </span>
              ) : (
                <span className="text-xs text-slate-400">Thay đổi sẽ áp dụng toàn hệ thống</span>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition-colors cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Backup, Restore, Demo Reset */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Sao lưu & Khôi phục dữ liệu (JSON Backup)</span>
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              Dữ liệu của Cô luôn được lưu tự động trên trình duyệt và máy chủ. Ngoài ra Cô có thể tải file sao lưu về máy tính bất kỳ lúc nào để lưu trữ an toàn.
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={exportBackupJson}
                className="w-full py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Tải file Sao lưu dữ liệu (.JSON)</span>
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportBackup}
                accept=".json"
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Khôi phục từ file JSON đã lưu</span>
              </button>
            </div>
          </div>

          {/* Demo Data & Reset zone */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 text-amber-600" />
              <span>Quản lý chế độ Demo & Dữ liệu</span>
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              Trạng thái hiện tại:{' '}
              <span className="font-bold text-blue-700">
                {data.is_demo_mode ? 'Đang chạy dữ liệu mẫu (45 HS mẫu)' : 'Dữ liệu thực tế của GVCN'}
              </span>
            </p>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={loadDemoData}
                className="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-amber-700" />
                <span>Nạp lại 45 học sinh mẫu và lịch sử thi đua</span>
              </button>

              <button
                type="button"
                onClick={clearAllData}
                className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Xóa trắng dữ liệu (Để bắt đầu nhập mới hoàn toàn)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
