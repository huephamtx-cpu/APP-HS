import React, { useState } from 'react';
import {
  X,
  Phone,
  MapPin,
  Calendar,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Award,
  CheckCircle2,
  Clock,
  UserCheck,
  MessageSquare,
  BookOpen,
  Save,
  Edit3,
} from 'lucide-react';
import { Student } from '../types';
import { useClassroom } from '../context/ClassroomContext';
import { calculateStudentStats } from '../utils/scoring';

interface StudentProfileModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenQuickBehavior?: (student: Student) => void;
  onOpenParentContact?: (student: Student) => void;
  initialTab?: 'overview' | 'history' | 'ai_eval' | 'edit';
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  isOpen,
  onClose,
  onOpenQuickBehavior,
  onOpenParentContact,
  initialTab = 'overview',
}) => {
  const { data, updateStudent, saveDataNow } = useClassroom();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'ai_eval' | 'edit'>(initialTab);
  const [formData, setFormData] = useState<Student | null>(student);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');
  const [aiComment, setAiComment] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiTone, setAiTone] = useState<string>('Khích lệ');

  React.useEffect(() => {
    if (student) {
      setFormData({ ...student });
      setSaveSuccessMsg('');
    }
  }, [student]);

  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen || !student) return null;

  const handleSaveStudent = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData) return;
    setIsSaving(true);
    updateStudent(formData);
    await saveDataNow();
    setIsSaving(false);
    setSaveSuccessMsg('Đã lưu thay đổi hồ sơ học sinh thành công!');
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  const handleSaveAiComment = async () => {
    if (!formData || !aiComment.trim()) return;
    setIsSaving(true);
    const updatedNotes = formData.notes
      ? `${formData.notes}\n[AI Nhận xét]: ${aiComment}`
      : `[AI Nhận xét]: ${aiComment}`;
    const updated = { ...formData, notes: updatedNotes };
    setFormData(updated);
    updateStudent(updated);
    await saveDataNow();
    setIsSaving(false);
    setSaveSuccessMsg('Đã lưu nhận xét AI vào mục ghi chú học sinh!');
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  const stats = calculateStudentStats(
    student,
    data.attendance,
    data.behaviors,
    data.rewards,
    data.settings.competition
  );

  const studentAttendance = data.attendance
    .filter((a) => a.student_id === student.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const studentBehaviors = data.behaviors
    .filter((b) => b.student_id === student.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const studentRewards = data.rewards
    .filter((r) => r.student_id === student.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const studentContacts = data.parent_contacts
    .filter((c) => c.student_id === student.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const handleGenerateAiComment = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/student-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: student.full_name,
          period: 'Tháng 9 (Năm học 2026–2027)',
          stats: {
            attendanceRate: stats.attendanceRate,
            absenceCount: stats.excusedAbsence + stats.unexcusedAbsence,
            excusedAbsence: stats.excusedAbsence,
            unexcusedAbsence: stats.unexcusedAbsence,
            lateCount: stats.lateCount,
            avgScore: stats.currentWeeklyScore,
            merits: stats.meritCount,
            violations: stats.violationBehaviors,
            violationDetails: studentBehaviors.filter((b) => b.type === 'violation').map((b) => b.category).join(', '),
          },
          tone: aiTone,
        }),
      });
      const json = await res.json();
      setAiComment(json.comment || 'Chưa nhận được phản hồi từ AI.');
    } catch (e: any) {
      setAiComment('Lỗi khi gọi AI nhận xét: ' + e.message);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-4 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header with Student Banner */}
        <div className="bg-linear-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center text-2xl font-black text-white shadow-inner">
              {student.gender === 'Nữ' ? '👧' : '👦'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/40 text-blue-200 border border-blue-400/30">
                  STT: #{student.stt}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/40 text-indigo-200 border border-indigo-400/30">
                  Mã HS: {student.student_code}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  Lớp 9/7
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-white mt-1">{student.full_name}</h2>
              <p className="text-xs text-blue-200 flex items-center space-x-3 mt-1">
                <span>Giới tính: {student.gender}</span>
                <span>•</span>
                <span>Sinh: {student.date_of_birth}</span>
                <span>•</span>
                <span>Dân tộc: {student.ethnicity}</span>
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-2 mt-6 border-t border-white/15 pt-3">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              Tổng quan & Tiến bộ
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              Lịch sử nề nếp & Chuyên cần
            </button>
            <button
              onClick={() => setActiveTab('ai_eval')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'ai_eval'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-amber-200 hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Nhận xét học sinh</span>
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'edit'
                  ? 'bg-emerald-400 text-slate-950 shadow-xs'
                  : 'text-emerald-200 hover:bg-white/10'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Chỉnh sửa thông tin</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Score & Key Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Điểm thi đua tuần</div>
                  <div className="text-2xl font-black text-blue-700 mt-1">{stats.currentWeeklyScore}/100</div>
                  <div className="text-[11px] text-slate-600 font-semibold mt-0.5">
                    Xếp loại: <span className="text-blue-600">{stats.rating}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Tỷ lệ chuyên cần</div>
                  <div className="text-2xl font-black text-emerald-600 mt-1">{stats.attendanceRate}%</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Trễ: {stats.lateCount} | Vắng: {stats.excusedAbsence + stats.unexcusedAbsence}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Khen thưởng</div>
                  <div className="text-2xl font-black text-amber-600 mt-1">{stats.meritCount} lần</div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">+{stats.bonusPoints} điểm cộng</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Vi phạm nề nếp</div>
                  <div className="text-2xl font-black text-rose-600 mt-1">{stats.violationBehaviors} lần</div>
                  <div className="text-[11px] text-rose-600 font-semibold mt-0.5">-{stats.penaltyPoints} điểm trừ</div>
                </div>
              </div>

              {/* Progress History Chart (Visual Step Bars) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <h4 className="text-sm font-bold text-slate-800">Biểu đồ tiến bộ điểm thi đua theo tuần</h4>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">Tháng 9/2026</span>
                </div>
                <div className="grid grid-cols-4 gap-2 pt-2">
                  {stats.weeklyScoresHistory.map((item, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="text-xs font-bold text-blue-900 mb-1">{item.score}đ</div>
                      <div className="w-full bg-slate-200 h-20 rounded-xl flex items-end p-1">
                        <div
                          className={`w-full rounded-lg transition-all ${
                            item.score >= 90
                              ? 'bg-blue-600'
                              : item.score >= 80
                              ? 'bg-indigo-500'
                              : item.score >= 65
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ height: `${Math.max(20, item.score)}%` }}
                        ></div>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-600 mt-1.5">{item.week}</div>
                    </div>
                  ))}
                </div>
                {/* AI Trend Insight */}
                <div className="mt-4 p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-start space-x-2.5">
                  <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-blue-900 leading-relaxed">
                    <span className="font-bold">AI Nhận định xu hướng: </span>
                    {stats.progressTrend === 'improving'
                      ? 'Học sinh có xu hướng tiến bộ tích cực trong các tuần gần đây, chuyên cần ổn định và có thành tích ghi nhận.'
                      : stats.progressTrend === 'declining'
                      ? 'Học sinh có dấu hiệu cần theo dõi về chuyên cần hoặc nề nếp. Cô Hue Pham nên trao đổi phối hợp thêm với phụ huynh.'
                      : 'Học sinh duy trì nề nếp tương đối ổn định, hòa đồng cùng lớp.'}
                  </p>
                </div>
              </div>

              {/* Family & Contact Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-slate-600" />
                    <span>Thông tin gia đình & Liên hệ</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setActiveTab('edit')}
                    className="px-3 py-1 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold flex items-center space-x-1 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Chỉnh sửa thông tin</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <span className="text-slate-500 font-medium">Bố:</span>
                    <p className="font-bold text-slate-800 mt-0.5">{student.father_name || 'Chưa cập nhật'}</p>
                    <p className="text-blue-600 font-mono mt-1 font-semibold flex items-center space-x-1">
                      <span>SĐT: {student.father_phone || 'Chưa có'}</span>
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <span className="text-slate-500 font-medium">Mẹ (Liên hệ chính):</span>
                    <p className="font-bold text-slate-800 mt-0.5">{student.mother_name || 'Chưa cập nhật'}</p>
                    <p className="text-blue-600 font-mono mt-1 font-semibold flex items-center space-x-1">
                      <span>SĐT: {student.mother_phone || 'Chưa có'}</span>
                    </p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-600 flex items-start space-x-1.5 p-2 bg-white rounded-xl border border-slate-100">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <span>Địa chỉ: {student.address}</span>
                </div>
                {student.notes && (
                  <div className="mt-2 text-xs text-slate-600 p-2 bg-amber-50 rounded-xl border border-amber-200/60">
                    <span className="font-bold text-amber-800">Ghi chú riêng: </span>
                    {student.notes}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {/* Behaviors History */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Lịch sử ghi nhận nề nếp ({studentBehaviors.length})
                </h4>
                {studentBehaviors.length === 0 ? (
                  <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl">Chưa có bản ghi nề nếp nào.</p>
                ) : (
                  <div className="space-y-2">
                    {studentBehaviors.map((b) => (
                      <div
                        key={b.id}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                          b.type === 'positive'
                            ? 'bg-emerald-50/60 border-emerald-200'
                            : 'bg-rose-50/60 border-rose-200'
                        }`}
                      >
                        <div>
                          <span className="font-bold text-slate-900">{b.category}</span>
                          <p className="text-slate-600 mt-0.5">{b.description}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{b.date} • Ghi bởi {b.recorded_by}</span>
                        </div>
                        <span
                          className={`font-black text-sm px-2 py-0.5 rounded-lg ${
                            b.type === 'positive' ? 'text-emerald-700 bg-emerald-100' : 'text-rose-700 bg-rose-100'
                          }`}
                        >
                          {b.type === 'positive' ? `+${b.points}` : b.points}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Attendance History */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Điểm danh gần đây ({studentAttendance.length} buổi)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {studentAttendance.slice(0, 6).map((att) => (
                    <div key={att.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-slate-500 text-[11px]">{att.date}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            att.status === 'present'
                              ? 'bg-emerald-100 text-emerald-800'
                              : att.status === 'late'
                              ? 'bg-amber-100 text-amber-800'
                              : att.status === 'excused'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {att.status === 'present'
                            ? 'Có mặt'
                            : att.status === 'late'
                            ? 'Đi trễ'
                            : att.status === 'excused'
                            ? 'Vắng phép'
                            : 'Vắng KP'}
                        </span>
                      </div>
                      {att.note && <p className="text-[11px] text-slate-500 italic mt-1">{att.note}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Rewards */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Khen thưởng ({studentRewards.length})
                </h4>
                {studentRewards.length === 0 ? (
                  <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl">Chưa có khen thưởng nào.</p>
                ) : (
                  <div className="space-y-2">
                    {studentRewards.map((rw) => (
                      <div key={rw.id} className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-900">{rw.title}</span>
                          <span className="text-[10px] font-mono text-amber-700">{rw.date}</span>
                        </div>
                        <p className="text-slate-700 mt-1">{rw.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'ai_eval' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <h4 className="text-sm font-bold text-slate-800">
                      Tạo nhận xét học bạ / sổ liên lạc bằng AI
                    </h4>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs text-slate-500 font-medium">Giọng văn:</span>
                    <select
                      value={aiTone}
                      onChange={(e) => setAiTone(e.target.value)}
                      className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2 py-1 text-slate-700 focus:outline-hidden"
                    >
                      <option value="Khích lệ">Khích lệ</option>
                      <option value="Tích cực">Tích cực</option>
                      <option value="Trung tính">Trung tính</option>
                      <option value="Trang trọng">Trang trọng</option>
                      <option value="Ngắn gọn">Ngắn gọn</option>
                    </select>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Hệ thống AI sẽ tự động đọc dữ liệu thực tế (chuyên cần, điểm trừ, điểm cộng, nề nếp) của em{' '}
                  <span className="font-bold">{student.full_name}</span> và tạo đoạn nhận xét sư phạm chuẩn mực cho Cô Hue Pham.
                </p>

                <button
                  type="button"
                  onClick={handleGenerateAiComment}
                  disabled={aiLoading}
                  className="w-full py-2.5 px-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{aiLoading ? 'AI đang phân tích dữ liệu thực tế...' : 'Tạo lời nhận xét AI'}</span>
                </button>

                {aiComment && (
                  <div className="mt-4 p-4 bg-white border border-blue-200 rounded-xl text-xs text-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-blue-600 font-semibold">
                      <span>Lời nhận xét đề xuất (Cô có thể chỉnh sửa):</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(aiComment)}
                        className="text-blue-700 hover:underline cursor-pointer"
                      >
                        Sao chép
                      </button>
                    </div>
                    <textarea
                      rows={4}
                      value={aiComment}
                      onChange={(e) => setAiComment(e.target.value)}
                      className="w-full p-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-blue-500 leading-relaxed"
                    />
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-500">
                        Cô có thể chỉnh sửa lời nhận xét trên rồi bấm nút lưu vào hồ sơ.
                      </span>
                      <button
                        type="button"
                        onClick={handleSaveAiComment}
                        disabled={isSaving}
                        className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isSaving ? 'Đang lưu...' : 'Lưu vào hồ sơ học sinh'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'edit' && formData && (
            <form onSubmit={handleSaveStudent} className="space-y-6 animate-in fade-in duration-150">
              {/* Notification Banner */}
              {saveSuccessMsg && (
                <div className="flex items-center space-x-2 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {/* 1. Student Personal Information */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>1. Lý lịch học sinh</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Họ và tên học sinh <span className="text-rose-600">*</span>:
                    </label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Giới tính:</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Nam' | 'Nữ' })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-blue-500"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Ngày sinh (DD/MM/YYYY):</label>
                    <input
                      type="text"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                      placeholder="15/04/2011"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Dân tộc:</label>
                    <input
                      type="text"
                      value={formData.ethnicity}
                      onChange={(e) => setFormData({ ...formData, ethnicity: e.target.value })}
                      placeholder="Kinh"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Số điện thoại học sinh:</label>
                    <input
                      type="text"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="09..."
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Parents and Family Information */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>2. Thông tin phụ huynh & Gia đình</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Father */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">Thông tin Cha (Bố):</span>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Họ và tên Bố</label>
                      <input
                        type="text"
                        value={formData.father_name || ''}
                        onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                        placeholder="Nguyễn Văn A"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Số điện thoại Bố</label>
                      <input
                        type="text"
                        value={formData.father_phone || ''}
                        onChange={(e) => setFormData({ ...formData, father_phone: e.target.value })}
                        placeholder="0912..."
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-blue-700"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Nghề nghiệp Bố</label>
                      <input
                        type="text"
                        value={formData.father_job || ''}
                        onChange={(e) => setFormData({ ...formData, father_job: e.target.value })}
                        placeholder="Kỹ sư, Kinh doanh..."
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700"
                      />
                    </div>
                  </div>

                  {/* Mother */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">Thông tin Mẹ (Liên hệ chính):</span>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Họ và tên Mẹ</label>
                      <input
                        type="text"
                        value={formData.mother_name || ''}
                        onChange={(e) => setFormData({ ...formData, mother_name: e.target.value })}
                        placeholder="Trần Thị B"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Số điện thoại Mẹ</label>
                      <input
                        type="text"
                        value={formData.mother_phone || ''}
                        onChange={(e) => setFormData({ ...formData, mother_phone: e.target.value })}
                        placeholder="0988..."
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-blue-700"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Nghề nghiệp Mẹ</label>
                      <input
                        type="text"
                        value={formData.mother_job || ''}
                        onChange={(e) => setFormData({ ...formData, mother_job: e.target.value })}
                        placeholder="Giáo viên, Bác sĩ..."
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Địa chỉ thường trú / Chỗ ở hiện tại:
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Số nhà, đường, khu phố, phường/xã..."
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-blue-500"
                  />
                </div>
              </div>

              {/* 3. Teacher's Confidential Notes */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span>3. Ghi chú của Giáo viên Chủ nhiệm (Cô Hue Pham)</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  Lưu ý về tâm lý, năng khiếu, hoàn cảnh, tiến bộ hoặc biện pháp sư phạm cần áp dụng.
                </p>
                <textarea
                  rows={3}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Nhập ghi chú hoặc đánh giá nề nếp..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-blue-500 leading-relaxed"
                />
              </div>

              {/* Direct Save Button inside Edit View */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Sau khi chỉnh sửa, bấm nút bên dưới để cập nhật vào hệ thống.
                </span>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Đang lưu...' : 'LƯU THAY ĐỔI'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            {onOpenQuickBehavior && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenQuickBehavior(student);
                }}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                + Ghi nề nếp / Điểm thi đua
              </button>
            )}
            {onOpenParentContact && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenParentContact(student);
                }}
                className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                💬 Nhắn tin phụ huynh
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {activeTab === 'edit' ? (
              <button
                type="button"
                onClick={handleSaveStudent}
                disabled={isSaving}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Đang lưu...' : 'LƯU THAY ĐỔI'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className="px-4 py-2 bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 text-xs font-bold rounded-xl shadow-2xs flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                <span>Chỉnh sửa thông tin</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Đóng hồ sơ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
