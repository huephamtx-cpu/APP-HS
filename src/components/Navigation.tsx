import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarCheck2,
  Award,
  Star,
  TrendingUp,
  HeartHandshake,
  Bot,
  BookOpen,
  BarChart3,
  Settings,
} from 'lucide-react';
import { useClassroom } from '../context/ClassroomContext';

export type TabKey =
  | 'dashboard'
  | 'students'
  | 'attendance'
  | 'behavior'
  | 'rewards'
  | 'progress'
  | 'parents'
  | 'ai_assistant'
  | 'journal'
  | 'reports'
  | 'settings';

interface NavigationProps {
  currentTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export const MAIN_NAV_ITEMS: { id: TabKey; label: string; icon: React.ReactNode; badge?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'students', label: 'Hồ sơ học sinh', icon: <Users className="w-4 h-4" /> },
  { id: 'attendance', label: 'Điểm danh', icon: <CalendarCheck2 className="w-4 h-4" /> },
  { id: 'behavior', label: 'Nề nếp & Thi đua', icon: <Star className="w-4 h-4" /> },
  { id: 'rewards', label: 'Khen thưởng', icon: <Award className="w-4 h-4" /> },
  { id: 'progress', label: 'Theo dõi tiến bộ', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'parents', label: 'Phụ huynh', icon: <HeartHandshake className="w-4 h-4" /> },
  { id: 'ai_assistant', label: 'AI Trợ lý GVCN', icon: <Bot className="w-4 h-4" />, badge: 'AI' },
];

export const EXTENDED_NAV_ITEMS: { id: TabKey; label: string; icon: React.ReactNode }[] = [
  { id: 'journal', label: 'Nhật ký GVCN', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'reports', label: 'Báo cáo', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'settings', label: 'Cài đặt', icon: <Settings className="w-4 h-4" /> },
];

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  const { data } = useClassroom();
  const schoolName = data?.settings?.class?.school_name || 'THCS Tân Xuân';

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/90 p-4 shrink-0 h-[calc(100vh-4.5rem)] sticky top-[4.5rem] overflow-y-auto">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
          8 Menu Chính
        </div>
        <nav className="space-y-1">
          {MAIN_NAV_ITEMS.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black uppercase ${
                      isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mt-6 mb-2">
          Menu Mở Rộng
        </div>
        <nav className="space-y-1">
          {EXTENDED_NAV_ITEMS.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Info Card */}
        <div className="mt-auto pt-6">
          <div className="p-3 bg-linear-to-br from-slate-50 to-blue-50/50 rounded-2xl border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
            <div className="font-bold text-slate-800 flex items-center space-x-1.5">
              <span>Lớp 9/7 • Cô Hue Pham</span>
            </div>
            <p className="text-[10px] text-slate-500">{schoolName} (2026–2027)</p>
            <div className="pt-1 text-[10px] text-blue-700 font-semibold flex items-center space-x-1">
              <span>🔒 Dữ liệu bảo mật nội bộ GVCN</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Horizontal Scrollable Tab Bar */}
      <div className="md:hidden bg-white border-b border-slate-200 px-2 py-2 overflow-x-auto flex space-x-1 sticky top-[4.5rem] z-30 shadow-2xs">
        {[...MAIN_NAV_ITEMS, ...EXTENDED_NAV_ITEMS].map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
