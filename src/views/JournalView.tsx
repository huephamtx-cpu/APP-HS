import React, { useState } from 'react';
import { BookOpen, Plus, Search, Calendar, User, CheckCircle2, FileText } from 'lucide-react';
import { useClassroom } from '../context/ClassroomContext';
import { getTodayDateString } from '../data/demoStudents';

export const JournalView: React.FC = () => {
  const { data, addJournalEntry } = useClassroom();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // Form states
  const [title, setTitle] = useState<string>('');
  const [classSituation, setClassSituation] = useState<string>('');
  const [relatedStudents, setRelatedStudents] = useState<string>('');
  const [actionTaken, setActionTaken] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !classSituation.trim()) return;

    addJournalEntry({
      date: getTodayDateString(),
      title,
      class_situation: classSituation,
      related_students: relatedStudents
        ? relatedStudents.split(',').map((s) => s.trim())
        : [],
      action_taken: actionTaken,
      result: result || 'Đang theo dõi tiếp',
      teacher_name: 'Cô Hue Pham',
    });

    setShowAddForm(false);
    setTitle('');
    setClassSituation('');
    setRelatedStudents('');
    setActionTaken('');
    setResult('');
  };

  const filteredJournal = data.journal.filter((j) => {
    const matchSearch =
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.class_situation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.related_students.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-100 text-purple-800">
              NHẬT KÝ CHỦ NHIỆM
            </span>
            <span className="text-xs text-slate-500">• Cô Hue Pham • Lớp 9/7</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">Sổ Nhật Ký Giáo Viên Chủ Nhiệm</h2>
          <p className="text-xs text-slate-500">
            Ghi chép các sự việc nổi bật, học sinh cần lưu tâm, giải pháp sư phạm và tiến triển của lớp.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Ghi Nhật Ký Mới</span>
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-purple-50/50 border border-purple-200 p-6 rounded-3xl animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span>Ghi nhật ký chủ nhiệm hôm nay</span>
            </h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
            >
              Đóng form
            </button>
          </div>

          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề ghi chép:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Nhắc nhở nề nếp đầu tuần, Vấn đề chuẩn bị kiểm tra giữa kỳ..."
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tình hình lớp / Sự việc cụ thể:</label>
              <textarea
                rows={3}
                value={classSituation}
                onChange={(e) => setClassSituation(e.target.value)}
                placeholder="Mô tả cụ thể sự việc hoặc nề nếp sinh hoạt lớp..."
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Học sinh liên quan (cách nhau dấu phẩy):</label>
                <input
                  type="text"
                  value={relatedStudents}
                  onChange={(e) => setRelatedStudents(e.target.value)}
                  placeholder="VD: Nguyễn Tuấn Anh, Trần Thị B..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Biện pháp đã thực hiện:</label>
                <input
                  type="text"
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  placeholder="VD: Trò chuyện riêng, gọi điện trao đổi phụ huynh..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kết quả / Hướng theo dõi tiếp:</label>
              <input
                type="text"
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder="VD: Học sinh đã nhận lỗi và hứa khắc phục, gia đình cam kết phối hợp..."
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
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
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
              >
                Lưu vào Nhật ký
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search & List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm nhật ký, học sinh..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-blue-500"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Có <span className="font-bold text-purple-700">{filteredJournal.length} ghi chép nhật ký</span>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredJournal.map((entry) => (
            <div key={entry.id} className="p-5 hover:bg-slate-50 transition-colors text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-xl bg-purple-100 text-purple-800 font-bold">
                    {entry.date}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">{entry.title}</h3>
                </div>
                <span className="text-slate-400 text-[11px] font-mono">Ghi bởi: {entry.teacher_name}</span>
              </div>

              <p className="text-slate-700 leading-relaxed font-sans bg-slate-50 p-3 rounded-xl border border-slate-100">
                {entry.class_situation}
              </p>

              {entry.related_students.length > 0 && (
                <div className="flex items-center space-x-2 text-[11px]">
                  <span className="text-slate-400 font-medium">Học sinh liên quan:</span>
                  <div className="flex flex-wrap gap-1">
                    {entry.related_students.map((st, i) => (
                      <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-semibold">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                {entry.action_taken && (
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="font-bold text-slate-700 block">Biện pháp thực hiện:</span>
                    <span className="text-slate-600">{entry.action_taken}</span>
                  </div>
                )}
                {entry.result && (
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <span className="font-bold text-emerald-800 block">Kết quả ghi nhận:</span>
                    <span className="text-emerald-700">{entry.result}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
