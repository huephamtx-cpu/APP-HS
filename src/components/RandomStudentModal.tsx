import React, { useState, useEffect, useRef } from 'react';
import {
  Dice5,
  X,
  Sparkles,
  Award,
  AlertTriangle,
  RotateCcw,
  Volume2,
  VolumeX,
  User,
  CheckCircle2,
  Users,
  ShieldCheck,
  Star,
  ExternalLink,
} from 'lucide-react';
import { useClassroom } from '../context/ClassroomContext';
import { Student } from '../types';
import { getTodayDateString } from '../data/demoStudents';

interface RandomStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStudentProfile?: (student: Student) => void;
  onOpenQuickBehavior?: (student: Student, type: 'positive' | 'violation') => void;
}

export const RandomStudentModal: React.FC<RandomStudentModalProps> = ({
  isOpen,
  onClose,
  onSelectStudentProfile,
  onOpenQuickBehavior,
}) => {
  const { data, selectedDate, addBehaviorRecord, saveDataNow } = useClassroom();

  const [filterMode, setFilterMode] = useState<'all' | 'present' | 'male' | 'female'>('all');
  const [excludeAlreadyCalled, setExcludeAlreadyCalled] = useState<boolean>(true);
  const [calledStudentIds, setCalledStudentIds] = useState<string[]>([]);

  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [displayStudent, setDisplayStudent] = useState<Student | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  const [actionFeedback, setActionFeedback] = useState<string>('');

  const rollingIntervalRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize or resume audio context
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Play gentle tick sound during roll
  const playTickSound = () => {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520 + Math.random() * 120, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio might be blocked by browser policy until user gesture
    }
  };

  // Play celebration chord when student is chosen
  const playWinSound = () => {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.45);
      });
    } catch {
      // Audio gracefully ignored
    }
  };

  // Determine attendance for students
  const getEligibleStudents = (): Student[] => {
    let list = [...data.students];

    // Filter by presence if requested
    if (filterMode === 'present') {
      const todayAttendance = data.attendance.filter((a) => a.date === selectedDate);
      const absentIds = new Set(
        todayAttendance
          .filter((a) => a.status === 'excused' || a.status === 'unexcused')
          .map((a) => a.student_id)
      );
      list = list.filter((s) => !absentIds.has(s.id));
    } else if (filterMode === 'male') {
      list = list.filter((s) => s.gender === 'Nam');
    } else if (filterMode === 'female') {
      list = list.filter((s) => s.gender === 'Nữ');
    }

    // Filter already called if toggle is on
    if (excludeAlreadyCalled && calledStudentIds.length > 0) {
      const remaining = list.filter((s) => !calledStudentIds.includes(s.id));
      if (remaining.length > 0) {
        list = remaining;
      }
    }

    return list;
  };

  // Start rolling sequence
  const startRoll = () => {
    const candidates = getEligibleStudents();
    if (candidates.length === 0) {
      alert('Không còn học sinh nào phù hợp với bộ lọc hiện tại!');
      return;
    }

    setIsRolling(true);
    setSelectedStudent(null);
    setActionFeedback('');

    // Pre-calculate winner randomly
    const winnerIndex = Math.floor(Math.random() * candidates.length);
    const chosen = candidates[winnerIndex];

    let currentIdx = 0;
    let speed = 40;
    let elapsed = 0;
    const totalDuration = 2200; // 2.2 seconds roll

    const step = () => {
      currentIdx = (currentIdx + 1) % candidates.length;
      setDisplayStudent(candidates[currentIdx]);
      playTickSound();
      elapsed += speed;

      // Gradual deceleration
      if (elapsed > totalDuration * 0.6) {
        speed = Math.floor(speed * 1.15);
      }

      if (elapsed < totalDuration) {
        rollingIntervalRef.current = window.setTimeout(step, speed);
      } else {
        // Complete roll
        setDisplayStudent(chosen);
        setSelectedStudent(chosen);
        setIsRolling(false);
        playWinSound();

        // Mark as called
        setCalledStudentIds((prev) => (prev.includes(chosen.id) ? prev : [...prev, chosen.id]));
      }
    };

    rollingIntervalRef.current = window.setTimeout(step, speed);
  };

  // Instant roll (skip animation if teacher is in a rush)
  const instantRoll = () => {
    const candidates = getEligibleStudents();
    if (candidates.length === 0) {
      alert('Không còn học sinh nào phù hợp với bộ lọc hiện tại!');
      return;
    }
    if (rollingIntervalRef.current) {
      clearTimeout(rollingIntervalRef.current);
    }
    const winnerIndex = Math.floor(Math.random() * candidates.length);
    const chosen = candidates[winnerIndex];
    setDisplayStudent(chosen);
    setSelectedStudent(chosen);
    setIsRolling(false);
    playWinSound();
    setCalledStudentIds((prev) => (prev.includes(chosen.id) ? prev : [...prev, chosen.id]));
  };

  // Clear history of called students
  const handleResetCalledHistory = () => {
    setCalledStudentIds([]);
    setActionFeedback('Đã đặt lại danh sách học sinh đã gọi!');
    setTimeout(() => setActionFeedback(''), 2000);
  };

  // Clean up timer on unmount or close
  useEffect(() => {
    return () => {
      if (rollingIntervalRef.current) {
        clearTimeout(rollingIntervalRef.current);
      }
    };
  }, []);

  // Quick point awarding
  const handleQuickAddPoints = async (points: number, category: string, label: string) => {
    if (!selectedStudent) return;
    addBehaviorRecord({
      student_id: selectedStudent.id,
      date: getTodayDateString(),
      type: points > 0 ? 'positive' : 'violation',
      category,
      description: label,
      points,
      note: 'Ghi nhận qua Vòng quay gọi tên ngẫu nhiên',
      recorded_by: 'Cô Hue Pham',
    });
    await saveDataNow();
    setActionFeedback(
      `Đã ${points > 0 ? 'cộng' : 'trừ'} ${Math.abs(points)} điểm cho em ${selectedStudent.full_name}!`
    );
    setTimeout(() => setActionFeedback(''), 3000);
  };

  if (!isOpen) return null;

  const eligibleCandidates = getEligibleStudents();

  // Find attendance status of selected student
  const selectedStudentAttendance = selectedStudent
    ? data.attendance.find((a) => a.student_id === selectedStudent.id && a.date === selectedDate)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-linear-to-r from-purple-700 via-indigo-700 to-blue-700 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Dice5 className="w-6 h-6 text-amber-300 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-black tracking-tight text-white uppercase">
                  Gọi Tên Ngẫu Nhiên
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-amber-400 text-slate-950 rounded-full">
                  Lớp 9/7
                </span>
              </div>
              <p className="text-[11px] text-purple-100">
                Gọi học sinh phát biểu & trả lời bài cũ – Cô Hue Pham (THCS Tân Xuân)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              title={isSoundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
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

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Filter Toolbar */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>Danh sách ứng viên ({eligibleCandidates.length} em sẵn sàng):</span>
              </span>

              {calledStudentIds.length > 0 && (
                <button
                  type="button"
                  onClick={handleResetCalledHistory}
                  className="text-[11px] text-purple-700 hover:text-purple-900 font-bold flex items-center space-x-1 cursor-pointer"
                  title="Xóa danh sách đã gọi để quay lại từ đầu"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Làm mới lượt gọi ({calledStudentIds.length} đã gọi)</span>
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                  filterMode === 'all'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Tất cả (45 HS)
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('present')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                  filterMode === 'present'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Có mặt hôm nay
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('male')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                  filterMode === 'male'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Chỉ gọi Nam
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('female')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                  filterMode === 'female'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Chỉ gọi Nữ
              </button>
            </div>

            {/* Avoid repeats toggle */}
            <div className="flex items-center space-x-2 pt-1">
              <input
                id="no-repeats"
                type="checkbox"
                checked={excludeAlreadyCalled}
                onChange={(e) => setExcludeAlreadyCalled(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded-md border-slate-300 focus:ring-purple-500 cursor-pointer"
              />
              <label htmlFor="no-repeats" className="text-xs text-slate-600 font-medium cursor-pointer">
                Không gọi lặp lại học sinh đã được gọi trong tiết học hôm nay
              </label>
            </div>
          </div>

          {/* Feedback banner if any action happened */}
          {actionFeedback && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionFeedback}</span>
            </div>
          )}

          {/* Wheel / Spotlight Stage */}
          <div className="relative p-6 sm:p-8 rounded-3xl bg-linear-to-b from-slate-900 via-indigo-950 to-slate-900 text-white text-center shadow-xl border border-indigo-500/20 overflow-hidden min-h-[220px] flex flex-col items-center justify-center">
            {/* Background Glow */}
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Rolling state */}
            {isRolling && displayStudent && (
              <div className="space-y-3 animate-pulse">
                <div className="inline-block px-3 py-1 bg-amber-400 text-slate-950 rounded-full text-xs font-black uppercase tracking-wider">
                  Đang quay số ngẫu nhiên...
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-wide transition-all transform scale-105">
                  {displayStudent.full_name}
                </div>
                <div className="text-xs text-purple-200 font-medium font-mono">
                  {displayStudent.student_code} • {displayStudent.gender} • Lớp 9/7
                </div>
              </div>
            )}

            {/* Winner / Selected state */}
            {!isRolling && selectedStudent && (
              <div className="space-y-4 w-full animate-in zoom-in-95 duration-200">
                <div className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-500 text-slate-950 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Chúc mừng học sinh được chọn!</span>
                </div>

                <div>
                  <div className="text-xs text-purple-300 font-mono font-semibold">
                    STT #{data.students.findIndex((s) => s.id === selectedStudent.id) + 1} • {selectedStudent.student_code}
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1 text-shadow-sm">
                    {selectedStudent.full_name}
                  </h3>
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-white/10 text-white border border-white/15">
                      {selectedStudent.gender}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-white/10 text-white border border-white/15">
                      Tổ {selectedStudent.team || 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      Điểm tuần: {selectedStudent.current_score}đ
                    </span>
                    {selectedStudentAttendance && (
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                          selectedStudentAttendance.status === 'present'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : selectedStudentAttendance.status === 'late'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {selectedStudentAttendance.status === 'present'
                          ? 'Đang có mặt'
                          : selectedStudentAttendance.status === 'late'
                          ? 'Đi trễ'
                          : 'Vắng'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick actions for chosen student */}
                <div className="pt-2 border-t border-white/10 w-full">
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider font-bold mb-2">
                    Ghi nhận kết quả trả lời:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleQuickAddPoints(
                          2,
                          'Phát biểu xây dựng bài',
                          'Phát biểu xây dựng bài tích cực (+2đ)'
                        )
                      }
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-300" />
                      <span>+2đ Phát biểu tốt</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleQuickAddPoints(
                          5,
                          'Trả lời bài cũ xuất sắc',
                          'Thuộc bài & Trả lời bài cũ xuất sắc (+5đ)'
                        )
                      }
                      className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-xs transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>+5đ Xuất sắc</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleQuickAddPoints(
                          -2,
                          'Chưa thuộc bài',
                          'Chưa thuộc bài cũ / chưa chuẩn bị bài (-2đ)'
                        )
                      }
                      className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>-2đ Chưa thuộc bài</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-center space-x-3 mt-3 pt-2 border-t border-white/5 text-xs">
                    {onSelectStudentProfile && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectStudentProfile(selectedStudent);
                          onClose();
                        }}
                        className="text-purple-300 hover:text-white underline font-semibold flex items-center space-x-1 cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Xem hồ sơ học sinh</span>
                      </button>
                    )}

                    {onOpenQuickBehavior && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenQuickBehavior(selectedStudent, 'positive');
                          onClose();
                        }}
                        className="text-indigo-300 hover:text-white underline font-semibold flex items-center space-x-1 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Ghi nề nếp tùy chỉnh</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Idle state before first roll */}
            {!isRolling && !selectedStudent && (
              <div className="space-y-3 py-4">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto text-3xl shadow-inner border border-white/20">
                  🎲
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Sẵn sàng gọi tên ngẫu nhiên</h4>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto mt-1">
                    Hệ thống sẽ lựa chọn ngẫu nhiên, công bằng 1 học sinh trong sĩ số 45 em của Lớp 9/7.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <button
              type="button"
              disabled={isRolling || eligibleCandidates.length === 0}
              onClick={startRoll}
              className="w-full sm:flex-1 py-3 px-6 bg-linear-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 text-white rounded-2xl text-sm font-black shadow-lg shadow-purple-500/25 transition-all transform active:scale-98 cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Dice5 className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
              <span>{isRolling ? 'ĐANG QUAY SỐ...' : selectedStudent ? '🎲 QUAY TIẾP (GỌI EM KHÁC)' : '🎲 BẮT ĐẦU GỌI TÊN NGẪU NHIÊN'}</span>
            </button>

            <button
              type="button"
              disabled={isRolling || eligibleCandidates.length === 0}
              onClick={instantRoll}
              className="w-full sm:w-auto py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
              title="Chọn ngay lập tức không cần đợi hiệu ứng quay số"
            >
              Chọn nhanh (1s)
            </button>
          </div>

          {/* List of already called students this session */}
          {calledStudentIds.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
                <span>Học sinh đã được gọi trong tiết này ({calledStudentIds.length} em):</span>
                <span className="text-[11px] text-purple-700">{Math.round((calledStudentIds.length / 45) * 100)}% lớp</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                {calledStudentIds.map((id) => {
                  const student = data.students.find((s) => s.id === id);
                  if (!student) return null;
                  return (
                    <span
                      key={id}
                      className="px-2 py-1 bg-white border border-purple-200 text-purple-900 rounded-lg text-[11px] font-medium flex items-center space-x-1"
                    >
                      <span>✓</span>
                      <span>{student.full_name}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
