import React, { useState, useEffect } from 'react';
import { X, Star, AlertTriangle, Check, User } from 'lucide-react';
import { Student, BehaviorType } from '../types';
import { useClassroom } from '../context/ClassroomContext';
import { getTodayDateString } from '../data/demoStudents';

interface QuickBehaviorModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedStudent?: Student | null;
  defaultType?: BehaviorType;
}

export const QuickBehaviorModal: React.FC<QuickBehaviorModalProps> = ({
  isOpen,
  onClose,
  preSelectedStudent,
  defaultType = 'positive',
}) => {
  const { data, addBehaviorRecord } = useClassroom();

  const [studentId, setStudentId] = useState<string>('');
  const [type, setType] = useState<BehaviorType>(defaultType);
  const [category, setCategory] = useState<string>('');
  const [points, setPoints] = useState<number>(2);
  const [description, setDescription] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (preSelectedStudent) {
      setStudentId(preSelectedStudent.id);
    } else if (data.students.length > 0 && !studentId) {
      setStudentId(data.students[0].id);
    }
    setType(defaultType);
  }, [preSelectedStudent, defaultType, data.students]);

  const POSITIVE_PRESETS = [
    { category: 'Phát biểu', points: 2, label: '⭐ Phát biểu xây dựng bài (+2đ)' },
    { category: 'Hoàn thành nhiệm vụ', points: 2, label: '⭐ Hoàn thành nhiệm vụ tốt (+2đ)' },
    { category: 'Giúp đỡ bạn', points: 2, label: '⭐ Giúp đỡ bạn cùng tiến (+2đ)' },
    { category: 'Có ý thức tốt', points: 2, label: '⭐ Có ý thức tổ chức nề nếp tốt (+2đ)' },
    { category: 'Trực nhật tốt', points: 2, label: '⭐ Trực nhật, vệ sinh lớp sạch sẽ (+2đ)' },
    { category: 'Tích cực hoạt động', points: 3, label: '⭐ Tích cực tham gia hoạt động phong trào (+3đ)' },
    { category: 'Thành tích nổi bật', points: 5, label: '⭐ Thành tích học tập/rèn luyện nổi bật (+5đ)' },
  ];

  const VIOLATION_PRESETS = [
    { category: 'Đi học trễ', points: -3, label: '⚠️ Đi học trễ sau 07:15 (-3đ)' },
    { category: 'Không làm bài', points: -3, label: '⚠️ Không chuẩn bị/làm bài tập (-3đ)' },
    { category: 'Quên sách/vở', points: -2, label: '⚠️ Quên mang sách/vở, đồ dùng (-2đ)' },
    { category: 'Mất trật tự', points: -2, label: '⚠️ Mất trật tự trong giờ học (-2đ)' },
    { category: 'Không đúng đồng phục', points: -2, label: '⚠️ Sai quy định đồng phục/phù hiệu (-2đ)' },
    { category: 'Không thực hiện nhiệm vụ', points: -2, label: '⚠️ Không thực hiện nhiệm vụ được giao (-2đ)' },
    { category: 'Sử dụng ĐT sai QĐ', points: -2, label: '⚠️ Sử dụng điện thoại không đúng quy định (-2đ)' },
    { category: 'Vi phạm nội quy', points: -5, label: '⚠️ Vi phạm nội quy trường/lớp (-5đ)' },
    { category: 'Vi phạm nghiêm trọng', points: -10, label: '⚠️ Vi phạm nghiêm trọng (-10đ)' },
  ];

  if (!isOpen) return null;

  const handleSelectPreset = (preset: { category: string; points: number; label: string }) => {
    setCategory(preset.category);
    setPoints(preset.points);
    setDescription(preset.label.replace(/^[⭐⚠️]\s*/, ''));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) return;

    addBehaviorRecord({
      student_id: studentId,
      date: getTodayDateString(),
      type,
      category: category || (type === 'positive' ? 'Khen ngợi nề nếp' : 'Nhắc nhở nề nếp'),
      description: description || (type === 'positive' ? 'Ghi nhận hành vi tích cực' : 'Cần nhắc nhở rèn luyện'),
      points,
      note,
      recorded_by: 'Cô Hue Pham',
    });

    onClose();
  };

  const filteredStudents = data.students.filter((s) =>
    s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.student_code.includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-xl ${type === 'positive' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
              {type === 'positive' ? <Star className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Ghi nhận Nề nếp & Thi đua</h3>
              <p className="text-xs text-slate-500">Quy trình 1-2 chạm tự động cộng/trừ điểm thi đua</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 1. Chọn Học sinh */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              1. Chọn học sinh lớp 9/7:
            </label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-blue-500"
              required
            >
              {data.students.map((s) => (
                <option key={s.id} value={s.id}>
                  #{s.stt} - {s.full_name} ({s.student_code})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Chọn loại: Tích cực / Cần nhắc nhở */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              2. Phân loại hành vi:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setType('positive');
                  setPoints(2);
                  setCategory('');
                  setDescription('');
                }}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 border transition-all cursor-pointer ${
                  type === 'positive'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Star className="w-4 h-4" />
                <span>⭐ Tích cực (+Điểm)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setType('violation');
                  setPoints(-3);
                  setCategory('');
                  setDescription('');
                }}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 border transition-all cursor-pointer ${
                  type === 'violation'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>⚠️ Cần nhắc nhở (-Điểm)</span>
              </button>
            </div>
          </div>

          {/* 3. Danh sách hành vi mẫu (1 chạm) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              3. Chọn nhanh hành vi chuẩn:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
              {(type === 'positive' ? POSITIVE_PRESETS : VIOLATION_PRESETS).map((preset, idx) => {
                const isSelected = category === preset.category;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`text-left p-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? type === 'positive'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold'
                          : 'bg-rose-100 text-rose-900 border border-rose-300 font-bold'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-100'
                    }`}
                  >
                    <span className="truncate pr-1">{preset.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Tùy chỉnh chi tiết (nếu muốn) */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Mô tả hành vi cụ thể:</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="VD: Làm bài tập toán xuất sắc, ..."
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Điểm cộng/trừ:</label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-center text-slate-900"
                required
              />
            </div>
          </div>

          {/* Ghi chú thêm */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Ghi chú của GVCN (Tùy chọn):</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Đã nhắc nhở riêng, phụ huynh đã liên lạc..."
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition-all cursor-pointer ${
                type === 'positive' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              Lưu bản ghi ngay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
