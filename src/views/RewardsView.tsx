import React, { useState } from 'react';
import { Award, Plus, Printer, Trash2, Search, Sparkles, CheckCircle2 } from 'lucide-react';
import { useClassroom } from '../context/ClassroomContext';
import { Student, MeritReward } from '../types';
import { getTodayDateString } from '../data/demoStudents';

interface RewardsViewProps {
  onSelectStudent: (student: Student) => void;
  onOpenCertificate: (student: Student, title: string, reason: string, date: string) => void;
}

export const RewardsView: React.FC<RewardsViewProps> = ({
  onSelectStudent,
  onOpenCertificate,
}) => {
  const { data, addReward, deleteReward } = useClassroom();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // Form state
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [title, setTitle] = useState<string>('Học tập tốt');
  const [content, setContent] = useState<string>('');
  const [customReason, setCustomReason] = useState<string>('');

  const REWARD_CATEGORIES = [
    'Học tập tốt',
    'Tiến bộ vượt bậc',
    'Nề nếp tốt',
    'Chuyên cần tốt',
    'Tích cực hoạt động phong trào',
    'Giúp bạn cùng tiến',
    'Thành tích đặc biệt',
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;

    addReward({
      student_id: selectedStudentId,
      date: getTodayDateString(),
      title,
      content: content || `Được Cô Hue Pham biểu dương danh hiệu: ${title}`,
      granted_by: 'Cô Hue Pham (GVCN Lớp 9/7)',
    });

    setShowAddForm(false);
    setContent('');
  };

  const filteredRewards = data.rewards.filter((rw) => {
    const student = data.students.find((s) => s.id === rw.student_id);
    return (
      (student && student.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      rw.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rw.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-800">
              TUYÊN DƯƠNG & KHEN THƯỞNG
            </span>
            <span className="text-xs text-slate-500">• Lớp 9/7 • GVCN: Cô Hue Pham</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">Sổ Khen Thưởng & Giấy Tuyên Dương</h2>
          <p className="text-xs text-slate-500">
            Tuyên dương các thành tích học tập và rèn luyện, tự động cấp Giấy khen điện tử có thể in của Cô Hue Pham.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (data.students.length > 0 && !selectedStudentId) {
              setSelectedStudentId(data.students[0].id);
            }
            setShowAddForm(true);
          }}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-xs shadow-xs transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Thêm Khen Thưởng Mới</span>
        </button>
      </div>

      {/* Add Reward Form (collapsible) */}
      {showAddForm && (
        <div className="bg-amber-50/50 border border-amber-200 p-6 rounded-3xl animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Ghi nhận Khen thưởng học sinh Lớp 9/7</span>
            </h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
            >
              Đóng form
            </button>
          </div>

          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Học sinh được khen thưởng:</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                  required
                >
                  {data.students.map((s) => (
                    <option key={s.id} value={s.id}>
                      #{s.stt} - {s.full_name} ({s.student_code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Danh mục khen thưởng:</label>
                <select
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                >
                  {REWARD_CATEGORIES.map((cat, i) => (
                    <option key={i} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nội dung / Lý do tuyên dương:</label>
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="VD: Đạt điểm 10 môn Toán, gương mẫu hỗ trợ bạn học tập..."
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                required
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-xs cursor-pointer"
              >
                Lưu và Tạo bản ghi khen thưởng
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rewards List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo học sinh hoặc danh hiệu..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-blue-500"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Tổng số: <span className="font-bold text-amber-700">{filteredRewards.length} lượt khen thưởng</span>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredRewards.map((rw) => {
            const student = data.students.find((s) => s.id === rw.student_id);

            return (
              <div
                key={rw.id}
                className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-700 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span
                        className="font-bold text-slate-900 text-sm hover:text-blue-700 cursor-pointer"
                        onClick={() => student && onSelectStudent(student)}
                      >
                        {student?.full_name || 'Học sinh'}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">({student?.student_code})</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        {rw.title}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1 leading-relaxed">{rw.content}</p>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">
                      {rw.date} • Cấp bởi {rw.granted_by}
                    </div>
                  </div>
                </div>

                {/* Certificate & Delete Actions */}
                <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (student) {
                        onOpenCertificate(student, rw.title, rw.content, rw.date);
                      }
                    }}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>In Giấy Khen</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteReward(rw.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Xóa bản ghi"
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
  );
};
