import React from 'react';
import {
  Calendar,
  CloudCheck,
  Search,
  User,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  School,
  Save,
  Dice5,
} from 'lucide-react';
import { useClassroom } from '../context/ClassroomContext';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenImport: () => void;
  onOpenAIAssistant: () => void;
  onOpenRandomPicker?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenImport,
  onOpenAIAssistant,
  onOpenRandomPicker,
}) => {
  const { data, currentUser, selectedDate, setSelectedDate, saveStatus, saveDataNow } = useClassroom();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Notification / Demo Mode Banner if active */}
      {data.is_demo_mode && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="px-1.5 py-0.5 rounded-md bg-black/20 text-slate-900 font-bold uppercase tracking-wider text-[10px]">
              DEMO DATA – NOT REAL STUDENTS
            </span>
            <span>
              Đang hiển thị 45 học sinh mẫu thử nghiệm cho Lớp 9/7. Cô có thể tải lên danh sách thực tế bất kỳ lúc nào.
            </span>
          </div>
          <button
            onClick={onOpenImport}
            className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-slate-950 text-white hover:bg-slate-800 text-[11px] rounded-md font-bold transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
            <span>Import file Excel 45 HS</span>
          </button>
        </div>
      )}

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-blue-700 via-blue-800 to-indigo-900 flex items-center justify-center text-white shadow-md shadow-blue-500/15 border border-blue-600/30">
              <span className="text-xl">🎓</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-extrabold tracking-tight text-slate-900 flex items-center space-x-1.5">
                  <span>CLASS 9/7 MANAGER</span>
                  <span className="text-blue-700 font-bold">– CÔ HUE PHAM</span>
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-extrabold tracking-wide uppercase bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                  AI System
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium flex items-center space-x-2">
                <span className="text-blue-900 font-semibold">Lớp 9/7</span>
                <span>•</span>
                <span>Năm học {data.settings.class.school_year}</span>
                <span>•</span>
                <span className="font-semibold text-slate-700">Sĩ số: {data.students.length}/45 HS</span>
                <span className="hidden md:inline">•</span>
                <span className="hidden md:inline text-slate-500">{data.settings.class.school_name}</span>
              </p>
            </div>
          </div>

          {/* Center Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm học sinh, phụ huynh, vi phạm..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs border border-transparent focus:border-blue-400 rounded-xl transition-all focus:outline-hidden text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Right Tools: Date Picker, Sync indicator, Teacher Badge */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Date Selector */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent font-medium text-slate-700 text-xs focus:outline-hidden cursor-pointer"
              />
            </div>

            {/* Random Student Picker Button */}
            {onOpenRandomPicker && (
              <button
                type="button"
                onClick={onOpenRandomPicker}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                title="Gọi tên ngẫu nhiên học sinh lớp 9/7 lên bảng"
              >
                <Dice5 className="w-3.5 h-3.5 text-amber-300" />
                <span>Gọi tên ngẫu nhiên</span>
              </button>
            )}

            {/* AI Assistant Quick Launcher */}
            <button
              onClick={onOpenAIAssistant}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              title="Mở Trợ lý AI Cô Hue Pham"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Hỏi AI</span>
            </button>

            {/* Explicit Save Button */}
            <button
              type="button"
              onClick={() => saveDataNow()}
              disabled={saveStatus === 'saving'}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer ${
                saveStatus === 'saving'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                  : saveStatus === 'saved'
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
              title="Bấm để lưu toàn bộ thay đổi dữ liệu hiện tại"
            >
              <Save className="w-3.5 h-3.5" />
              <span>
                {saveStatus === 'saving'
                  ? 'Đang lưu...'
                  : saveStatus === 'saved'
                  ? 'Đã lưu ✓'
                  : 'Lưu thay đổi'}
              </span>
            </button>

            {/* Teacher Profile Avatar */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                HP
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight">Cô Hue Pham</div>
                <div className="text-[10px] text-blue-600 font-semibold">GVCN Lớp 9/7</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2 lg:hidden">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm nhanh học sinh hoặc phụ huynh..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-100 text-xs border border-transparent focus:border-blue-400 rounded-xl transition-all focus:outline-hidden text-slate-800"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
