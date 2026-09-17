import React, { useState, useEffect } from 'react';
import {
  Users,
  X,
  Shuffle,
  Crown,
  Download,
  Copy,
  Check,
  Award,
  Sparkles,
  Layers,
  Scale,
  Calendar,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { useClassroom } from '../context/ClassroomContext';
import { Student } from '../types';
import { getTodayDateString } from '../data/demoStudents';
import * as XLSX from 'xlsx';

interface GroupMakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStudentProfile?: (student: Student) => void;
}

interface GroupData {
  id: number;
  name: string;
  leaderId: string | null;
  members: Student[];
  color: string;
}

const THEME_NAMES: Record<string, string[]> = {
  numbers: ['Nhóm 1', 'Nhóm 2', 'Nhóm 3', 'Nhóm 4', 'Nhóm 5', 'Nhóm 6', 'Nhóm 7', 'Nhóm 8', 'Nhóm 9', 'Nhóm 10'],
  teams: ['Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4', 'Tổ 5', 'Tổ 6', 'Tổ 7', 'Tổ 8', 'Tổ 9', 'Tổ 10'],
  creative: [
    'Nhóm Đoàn Kết',
    'Nhóm Sáng Tạo',
    'Nhóm Khám Phá',
    'Nhóm Tiên Phong',
    'Nhóm Bứt Phá',
    'Nhóm Trí Tuệ',
    'Nhóm Năng Động',
    'Nhóm Tỏa Sáng',
    'Nhóm Chăm Ngoan',
    'Nhóm Thành Công',
  ],
};

const GROUP_COLORS = [
  { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', badge: 'bg-blue-600', ring: 'ring-blue-400' },
  { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', badge: 'bg-emerald-600', ring: 'ring-emerald-400' },
  { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900', badge: 'bg-purple-600', ring: 'ring-purple-400' },
  { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900', badge: 'bg-amber-600', ring: 'ring-amber-400' },
  { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-900', badge: 'bg-rose-600', ring: 'ring-rose-400' },
  { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-900', badge: 'bg-cyan-600', ring: 'ring-cyan-400' },
  { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-900', badge: 'bg-indigo-600', ring: 'ring-indigo-400' },
  { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-900', badge: 'bg-orange-600', ring: 'ring-orange-400' },
  { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-900', badge: 'bg-teal-600', ring: 'ring-teal-400' },
  { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-900', badge: 'bg-violet-600', ring: 'ring-violet-400' },
];

export const GroupMakerModal: React.FC<GroupMakerModalProps> = ({
  isOpen,
  onClose,
  onSelectStudentProfile,
}) => {
  const { data, selectedDate, addBehaviorRecord, saveDataNow } = useClassroom();

  // Settings
  const [numGroups, setNumGroups] = useState<number>(4); // Default 4 groups (4 Tổ)
  const [groupNamingTheme, setGroupNamingTheme] = useState<'numbers' | 'teams' | 'creative'>('creative');
  const [balanceMode, setBalanceMode] = useState<'random' | 'gender' | 'score'>('gender');
  const [onlyPresent, setOnlyPresent] = useState<boolean>(false);
  const [autoAssignLeader, setAutoAssignLeader] = useState<boolean>(true);

  // Generated groups state
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [rewardFeedback, setRewardFeedback] = useState<string>('');

  // Get eligible students
  const getEligibleStudents = (): Student[] => {
    let list = [...data.students];
    if (onlyPresent) {
      const todayAttendance = data.attendance.filter((a) => a.date === selectedDate);
      const absentIds = new Set(
        todayAttendance
          .filter((a) => a.status === 'excused' || a.status === 'unexcused')
          .map((a) => a.student_id)
      );
      list = list.filter((s) => !absentIds.has(s.id));
    }
    return list;
  };

  // Divide into groups algorithm
  const generateGroups = () => {
    setIsShuffling(true);
    const eligible = getEligibleStudents();

    if (eligible.length === 0) {
      setIsShuffling(false);
      return;
    }

    const targetGroupCount = Math.max(2, Math.min(numGroups, eligible.length));
    const themeList = THEME_NAMES[groupNamingTheme] || THEME_NAMES.creative;

    // Create empty group slots
    const newGroups: GroupData[] = Array.from({ length: targetGroupCount }, (_, i) => ({
      id: i + 1,
      name: themeList[i] || `Nhóm ${i + 1}`,
      leaderId: null,
      members: [],
      color: String(i % GROUP_COLORS.length),
    }));

    if (balanceMode === 'random') {
      // Shuffle completely randomly
      const shuffled = [...eligible].sort(() => Math.random() - 0.5);
      shuffled.forEach((student, idx) => {
        const groupIndex = idx % targetGroupCount;
        newGroups[groupIndex].members.push(student);
      });
    } else if (balanceMode === 'gender') {
      // Split boys and girls, shuffle each, distribute alternatively
      const males = eligible.filter((s) => s.gender === 'Nam').sort(() => Math.random() - 0.5);
      const females = eligible.filter((s) => s.gender === 'Nữ').sort(() => Math.random() - 0.5);

      males.forEach((student, idx) => {
        const groupIndex = idx % targetGroupCount;
        newGroups[groupIndex].members.push(student);
      });

      // Offset distribution for females to ensure even mix
      females.forEach((student, idx) => {
        const groupIndex = (targetGroupCount - 1 - (idx % targetGroupCount)) % targetGroupCount;
        newGroups[groupIndex].members.push(student);
      });
    } else if (balanceMode === 'score') {
      // Sort by current_score descending, snake draft distribution (1, 2, 3, 4, 4, 3, 2, 1)
      const sorted = [...eligible].sort((a, b) => b.current_score - a.current_score);
      let forward = true;
      let gIndex = 0;

      sorted.forEach((student) => {
        newGroups[gIndex].members.push(student);
        if (forward) {
          gIndex++;
          if (gIndex >= targetGroupCount) {
            gIndex = targetGroupCount - 1;
            forward = false;
          }
        } else {
          gIndex--;
          if (gIndex < 0) {
            gIndex = 0;
            forward = true;
          }
        }
      });
    }

    // Auto assign leader if toggled
    if (autoAssignLeader) {
      newGroups.forEach((g) => {
        if (g.members.length > 0) {
          // Pick a random member as leader
          const randomIndex = Math.floor(Math.random() * g.members.length);
          g.leaderId = g.members[randomIndex].id;
        }
      });
    }

    setTimeout(() => {
      setGroups(newGroups);
      setIsShuffling(false);
    }, 250);
  };

  // Generate on first open or when eligible list or count changes
  useEffect(() => {
    if (isOpen && groups.length === 0) {
      generateGroups();
    }
  }, [isOpen]);

  // Copy groups to clipboard
  const handleCopyGroups = () => {
    if (groups.length === 0) return;

    let text = `DANH SÁCH CHIA NHÓM HỌC TẬP - LỚP 9/7 (${data.settings.class.school_name || 'THCS Tân Xuân'})\n`;
    text += `Giáo viên chủ nhiệm: ${data.settings.class.teacher_name || 'Cô Hue Pham'}\n`;
    text += `Ngày: ${selectedDate} | Tổng số: ${getEligibleStudents().length} học sinh\n\n`;

    groups.forEach((g) => {
      text += `--- ${g.name.toUpperCase()} (${g.members.length} thành viên) ---\n`;
      const leader = g.members.find((m) => m.id === g.leaderId);
      if (leader) {
        text += `👑 Nhóm trưởng: ${leader.full_name} (${leader.student_code})\n`;
      }
      g.members.forEach((m, idx) => {
        const isLeader = m.id === g.leaderId;
        text += `  ${idx + 1}. ${m.full_name} (${m.gender}) ${isLeader ? '👑' : ''}\n`;
      });
      text += `\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Export to Excel
  const handleExportExcel = () => {
    if (groups.length === 0) return;

    const exportRows: Array<Record<string, unknown>> = [];
    groups.forEach((g) => {
      g.members.forEach((m, idx) => {
        exportRows.push({
          'Tên nhóm': g.name,
          'STT Nhóm': idx + 1,
          'Mã HS': m.student_code,
          'Họ và tên': m.full_name,
          'Giới tính': m.gender,
          'Vai trò': m.id === g.leaderId ? 'Nhóm trưởng 👑' : 'Thành viên',
          'Điểm thi đua': m.current_score,
          'Ghi chú': '',
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Chia_Nhom_9_7');
    XLSX.writeFile(workbook, `Danh_Sach_Chia_Nhom_Lop_9_7_${selectedDate}.xlsx`);
  };

  // Reward entire group (+ points for all members)
  const handleRewardGroup = async (group: GroupData, points: number, label: string) => {
    group.members.forEach((member) => {
      addBehaviorRecord({
        student_id: member.id,
        date: getTodayDateString(),
        type: points > 0 ? 'positive' : 'violation',
        category: 'Hoạt động nhóm',
        description: `${label} - ${group.name} (+${points}đ)`,
        points,
        note: `Được Cô Hue Pham khen thưởng qua Hoạt động nhóm (${group.name})`,
        recorded_by: 'Cô Hue Pham',
      });
    });

    await saveDataNow();
    setRewardFeedback(`Đã cộng +${points} điểm thi đua cho toàn bộ ${group.members.length} thành viên ${group.name}!`);
    setTimeout(() => setRewardFeedback(''), 3500);
  };

  // Manually toggle leader
  const handleToggleLeader = (groupId: number, studentId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            leaderId: g.leaderId === studentId ? null : studentId,
          };
        }
        return g;
      })
    );
  };

  if (!isOpen) return null;

  const eligibleCount = getEligibleStudents().length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-linear-to-r from-emerald-700 via-teal-700 to-indigo-800 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Users className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-black tracking-tight text-white uppercase">
                  Chia Nhóm Học Tập & Thảo Luận
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-emerald-400 text-slate-950 rounded-full">
                  Lớp 9/7
                </span>
              </div>
              <p className="text-[11px] text-emerald-100">
                Tự động chia nhóm công bằng, cân bằng nam nữ và học lực – Cô Hue Pham (THCS Tân Xuân)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              title="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Configuration Toolbar */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200/80 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Number of groups selector */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-700">Số lượng nhóm:</span>
              <div className="flex items-center space-x-1">
                {[2, 3, 4, 5, 6, 8].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setNumGroups(num);
                    }}
                    className={`w-8 h-8 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      numGroups === num
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-slate-500 hidden md:inline">
                (~{Math.ceil(eligibleCount / numGroups)} HS/nhóm)
              </span>
            </div>

            {/* Balancing Mode */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-700">Phương thức chia:</span>
              <div className="inline-flex p-0.5 bg-slate-200/80 rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => setBalanceMode('gender')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    balanceMode === 'gender'
                      ? 'bg-white text-emerald-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Cân bằng tỷ lệ học sinh Nam và Nữ trong mỗi nhóm"
                >
                  ⚖️ Đều Nam - Nữ
                </button>
                <button
                  type="button"
                  onClick={() => setBalanceMode('score')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    balanceMode === 'score'
                      ? 'bg-white text-emerald-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Cân bằng điểm học tập thi đua (Đôi bạn cùng tiến)"
                >
                  📊 Đều học lực
                </button>
                <button
                  type="button"
                  onClick={() => setBalanceMode('random')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    balanceMode === 'random'
                      ? 'bg-white text-emerald-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Xáo trộn ngẫu nhiên hoàn toàn"
                >
                  🎲 Ngẫu nhiên
                </button>
              </div>
            </div>

            {/* Quick Action Buttons: Re-shuffle, Copy, Export */}
            <div className="flex items-center space-x-2 ml-auto">
              <button
                type="button"
                onClick={generateGroups}
                disabled={isShuffling}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
              >
                <Shuffle className={`w-3.5 h-3.5 ${isShuffling ? 'animate-spin' : ''}`} />
                <span>{isShuffling ? 'Đang chia...' : 'CHIA LẠI (XÁO TRỘN)'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyGroups}
                className="p-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                title="Sao chép danh sách chia nhóm để gửi Zalo hoặc trình chiếu"
              >
                {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={handleExportExcel}
                className="p-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                title="Xuất danh sách phân nhóm ra file Excel"
              >
                <Download className="w-4 h-4 text-blue-600" />
              </button>
            </div>
          </div>

          {/* Secondary Options */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-200/60 gap-3">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyPresent}
                  onChange={(e) => {
                    setOnlyPresent(e.target.checked);
                  }}
                  className="w-3.5 h-3.5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
                <span>Chỉ chia các em có mặt hôm nay ({eligibleCount}/45 em)</span>
              </label>

              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoAssignLeader}
                  onChange={(e) => {
                    setAutoAssignLeader(e.target.checked);
                    if (e.target.checked) {
                      setGroups((prev) =>
                        prev.map((g) => ({
                          ...g,
                          leaderId: g.members.length > 0 ? g.members[0].id : null,
                        }))
                      );
                    }
                  }}
                  className="w-3.5 h-3.5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
                <span>Tự động chỉ định Nhóm trưởng 👑</span>
              </label>
            </div>

            {/* Naming Style */}
            <div className="flex items-center space-x-2">
              <span className="text-slate-500">Tên gọi:</span>
              <select
                value={groupNamingTheme}
                onChange={(e) => {
                  const newTheme = e.target.value as 'numbers' | 'teams' | 'creative';
                  setGroupNamingTheme(newTheme);
                  const names = THEME_NAMES[newTheme];
                  setGroups((prev) =>
                    prev.map((g, i) => ({
                      ...g,
                      name: names[i] || `Nhóm ${i + 1}`,
                    }))
                  );
                }}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 cursor-pointer focus:outline-hidden"
              >
                <option value="creative">Tên chủ đề (Đoàn Kết, Sáng Tạo...)</option>
                <option value="teams">Tổ 1, Tổ 2, Tổ 3, Tổ 4...</option>
                <option value="numbers">Nhóm 1, Nhóm 2, Nhóm 3...</option>
              </select>
            </div>
          </div>
        </div>

        {/* Feedback Alert if reward was given */}
        {rewardFeedback && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{rewardFeedback}</span>
          </div>
        )}

        {/* Groups Grid Display */}
        <div className="p-6 overflow-y-auto flex-1">
          {groups.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold">Chưa có dữ liệu nhóm. Vui lòng bấm "CHIA LẠI".</p>
            </div>
          ) : (
            <div
              className={`grid gap-4 ${
                groups.length === 2
                  ? 'grid-cols-1 md:grid-cols-2'
                  : groups.length === 3
                  ? 'grid-cols-1 md:grid-cols-3'
                  : groups.length <= 4
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }`}
            >
              {groups.map((group, gIdx) => {
                const colorTheme = GROUP_COLORS[gIdx % GROUP_COLORS.length];
                const maleCount = group.members.filter((m) => m.gender === 'Nam').length;
                const femaleCount = group.members.filter((m) => m.gender === 'Nữ').length;
                const avgScore =
                  group.members.length > 0
                    ? Math.round(
                        group.members.reduce((acc, cur) => acc + cur.current_score, 0) / group.members.length
                      )
                    : 0;

                return (
                  <div
                    key={group.id}
                    className={`rounded-2xl border ${colorTheme.border} ${colorTheme.bg} p-4 shadow-xs flex flex-col justify-between transition-all hover:shadow-md`}
                  >
                    {/* Group Header */}
                    <div>
                      <div className="flex items-center justify-between border-b border-black/5 pb-2.5 mb-2.5">
                        <div>
                          <h3 className={`text-sm font-black ${colorTheme.text} flex items-center space-x-1.5`}>
                            <span>{group.name}</span>
                          </h3>
                          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                            {group.members.length} học sinh • {maleCount} Nam / {femaleCount} Nữ
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 text-[10px] font-extrabold text-white rounded-lg ${colorTheme.badge}`}>
                          ĐTB: {avgScore}đ
                        </span>
                      </div>

                      {/* Members List */}
                      <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                        {group.members.map((member, mIdx) => {
                          const isLeader = member.id === group.leaderId;
                          return (
                            <div
                              key={member.id}
                              className={`p-2 rounded-xl flex items-center justify-between text-xs transition-colors ${
                                isLeader
                                  ? 'bg-amber-100/80 border border-amber-300 font-bold text-slate-900 shadow-2xs'
                                  : 'bg-white/80 hover:bg-white border border-slate-200/60 text-slate-800'
                              }`}
                            >
                              <div className="flex items-center space-x-2 min-w-0">
                                <span className="text-[10px] text-slate-400 font-mono w-4">
                                  {mIdx + 1}.
                                </span>
                                <span
                                  className="truncate cursor-pointer hover:text-blue-700"
                                  onClick={() => onSelectStudentProfile?.(member)}
                                  title="Xem hồ sơ học sinh"
                                >
                                  {member.full_name}
                                </span>
                              </div>

                              <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                                <span
                                  className={`text-[9px] px-1 py-0.5 rounded font-bold ${
                                    member.gender === 'Nam'
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'bg-pink-100 text-pink-700'
                                  }`}
                                >
                                  {member.gender}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => handleToggleLeader(group.id, member.id)}
                                  className={`p-1 rounded-md transition-colors cursor-pointer ${
                                    isLeader
                                      ? 'text-amber-600 bg-amber-200 hover:bg-amber-300'
                                      : 'text-slate-300 hover:text-amber-500 hover:bg-amber-50'
                                  }`}
                                  title={isLeader ? 'Nhóm trưởng (Bấm để hủy)' : 'Đặt làm nhóm trưởng'}
                                >
                                  <Crown className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Group Bottom Quick Reward Action */}
                    <div className="mt-3 pt-2.5 border-t border-black/5">
                      <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">
                        Khen thưởng nhóm:
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            handleRewardGroup(group, 3, 'Hoàn thành thảo luận xuất sắc')
                          }
                          className="py-1 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shadow-2xs transition-colors cursor-pointer text-center"
                          title="Cộng 3 điểm thi đua cho tất cả thành viên nhóm này"
                        >
                          +3đ Thảo luận tốt
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleRewardGroup(group, 5, 'Báo cáo thuyết trình Giải Nhất')
                          }
                          className="py-1 px-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-[11px] font-black shadow-2xs transition-colors cursor-pointer text-center"
                          title="Cộng 5 điểm thi đua cho nhóm đạt Giải Nhất thuyết trình"
                        >
                          +5đ Thuyết trình 🏆
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <div>
            Biên chế: <span className="font-bold text-slate-800">Lớp 9/7</span> • Giáo viên chủ nhiệm:{' '}
            <span className="font-bold text-slate-800">Cô Hue Pham</span> ({data.settings.class.school_name || 'THCS Tân Xuân'})
          </div>

          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold cursor-pointer transition-colors"
            >
              Đóng lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
