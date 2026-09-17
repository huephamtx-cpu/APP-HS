import React, { useState } from 'react';
import {
  HeartHandshake,
  Phone,
  MessageSquare,
  Sparkles,
  Search,
  Copy,
  Check,
  Send,
  User,
  History,
  Clock,
} from 'lucide-react';
import { useClassroom } from '../context/ClassroomContext';
import { Student } from '../types';
import { getTodayDateString } from '../data/demoStudents';

interface ParentsViewProps {
  onSelectStudent: (student: Student) => void;
  preSelectedStudent?: Student | null;
}

export const ParentsView: React.FC<ParentsViewProps> = ({
  onSelectStudent,
  preSelectedStudent,
}) => {
  const { data, addParentContact } = useClassroom();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'composer' | 'history'>('composer');

  // Composer Form
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    preSelectedStudent?.id || (data.students.length > 0 ? data.students[0].id : '')
  );
  const [messageType, setMessageType] = useState<string>('Đi trễ');
  const [customDraft, setCustomDraft] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [aiGenerating, setAiGenerating] = useState<boolean>(false);

  const selectedStudent = data.students.find((s) => s.id === selectedStudentId);

  const MESSAGE_PRESETS = [
    {
      type: 'Nhắc đi học đúng giờ',
      template: (name: string) =>
        `Dạ kính chào Quý Phụ huynh em ${name}, Cô Hue Pham - GVCN Lớp 9/7 xin gửi lời chào đến gia đình. Tuần này em ${name} có 2 lần đến lớp sau 07:15. Do năm nay là năm cuối cấp lớp 9 với nhiều kiến thức trọng tâm đầu giờ, Cô kính mong gia đình nhắc nhở và tạo điều kiện để em đến lớp đúng giờ từ 07:00 - 07:10 để ổn định học tập thật tốt ạ. Cô cảm ơn gia đình!`,
    },
    {
      type: 'Khen ngợi học sinh',
      template: (name: string) =>
        `Kính gửi Quý Phụ huynh em ${name}, Cô Hue Pham - GVCN Lớp 9/7 rất vui mừng được chia sẻ cùng gia đình: Tuần này em ${name} học tập rất tích cực, xung phong phát biểu và có nhiều điểm cộng thi đua. Cô rất biểu dương tinh thần cố gắng của em và kính chúc gia đình luôn dồi dào sức khỏe ạ!`,
    },
    {
      type: 'Nhắc làm bài tập',
      template: (name: string) =>
        `Dạ chào Quý Phụ huynh em ${name}, Cô Hue Pham - GVCN Lớp 9/7 xin phép trao đổi nhanh cùng gia đình: Trong các tiết học vừa qua, em ${name} chưa hoàn thành đầy đủ bài tập về nhà. Kính nhờ gia đình phối hợp nhắc nhở em chuẩn bị bài chu đáo trước khi đến lớp để theo kịp chương trình lớp 9 ạ. Cô cảm ơn Phụ huynh nhiều!`,
    },
    {
      type: 'Trao đổi nề nếp',
      template: (name: string) =>
        `Kính chào Quý Phụ huynh em ${name}, Cô Hue Pham - GVCN Lớp 9/7 xin gửi lời chào đến gia đình. Hôm nay trong giờ học em ${name} còn chưa tập trung và còn nói chuyện riêng. Cô đã nhắc nhở em và rất mong gia đình cùng phối hợp nhắc nhở thêm để em rèn luyện tác phong học tập nghiêm túc hơn ạ. Trân trọng cảm ơn gia đình!`,
    },
    {
      type: 'Mời phụ huynh trao đổi',
      template: (name: string) =>
        `Kính gửi Quý Phụ huynh em ${name}, Cô Hue Pham - GVCN Lớp 9/7 trân trọng kính mời Phụ huynh sắp xếp thời gian đến trường hoặc trao đổi qua điện thoại vào chiều thứ Sáu lúc 16:30 để Cô trò chuyện thêm về tình hình học tập và nề nếp của em trong học kỳ này ạ. Kính chúc gia đình nhiều sức khỏe!`,
    },
  ];

  const handleApplyPreset = (preset: { type: string; template: (n: string) => string }) => {
    setMessageType(preset.type);
    if (selectedStudent) {
      setCustomDraft(preset.template(selectedStudent.full_name));
    }
  };

  const handleAiDraft = async () => {
    if (!selectedStudent) return;
    setAiGenerating(true);
    try {
      const res = await fetch('/api/ai/parent-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: selectedStudent.full_name,
          parentName: selectedStudent.mother_name || selectedStudent.father_name || 'Quý Phụ huynh',
          issueType: messageType,
          specificContext: `Học sinh lớp 9/7. Giáo viên chủ nhiệm: Cô Hue Pham.`,
        }),
      });
      const json = await res.json();
      if (json.message) {
        setCustomDraft(json.message);
      }
    } catch (err: any) {
      setCustomDraft('Lỗi khi gọi AI: ' + err.message);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(customDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToHistory = () => {
    if (!selectedStudent || !customDraft) return;

    addParentContact({
      student_id: selectedStudent.id,
      date: getTodayDateString(),
      contact_person: selectedStudent.mother_name || selectedStudent.father_name || 'Phụ huynh',
      phone: selectedStudent.mother_phone || selectedStudent.father_phone || '',
      channel: 'Zalo / Tin nhắn',
      content: customDraft,
      result: 'Đã gửi trao đổi phụ huynh',
    });

    alert('Đã lưu vào Nhật ký trao đổi phụ huynh!');
  };

  const filteredDirectory = data.students.filter((s) => {
    return (
      s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.student_code.includes(searchTerm) ||
      (s.mother_name && s.mother_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.father_name && s.father_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-800">
              PHỤ HUYNH LỚP 9/7
            </span>
            <span className="text-xs text-slate-500">• 45 Phụ huynh học sinh</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">Sổ Phụ Huynh & Soạn Tin Nhắn Nhanh</h2>
          <p className="text-xs text-slate-500">
            Danh bạ liên lạc 45 gia đình, công cụ soạn tin sư phạm lịch sự và lưu lịch sử liên lạc.
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('composer')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeSubTab === 'composer' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-600'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Soạn tin nhắn nhanh & AI</span>
        </button>

        <button
          onClick={() => setActiveSubTab('directory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeSubTab === 'directory' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-600'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Danh bạ 45 Phụ huynh</span>
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeSubTab === 'history' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-600'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Lịch sử trao đổi ({data.parent_contacts.length})</span>
        </button>
      </div>

      {/* Tab 1: Message Composer */}
      {activeSubTab === 'composer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 5 cols: Student Selection & Template Presets */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  1. Chọn học sinh cần trao đổi:
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => {
                    setSelectedStudentId(e.target.value);
                    const stu = data.students.find((s) => s.id === e.target.value);
                    if (stu) {
                      setCustomDraft(MESSAGE_PRESETS[0].template(stu.full_name));
                    }
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                >
                  {data.students.map((s) => (
                    <option key={s.id} value={s.id}>
                      #{s.stt} - {s.full_name} ({s.student_code})
                    </option>
                  ))}
                </select>
              </div>

              {selectedStudent && (
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-slate-700 space-y-1">
                  <div className="font-bold text-blue-900">Thông tin người nhận:</div>
                  <div>Mẹ: <span className="font-semibold text-slate-900">{selectedStudent.mother_name || 'Chưa có'}</span> ({selectedStudent.mother_phone})</div>
                  <div>Bố: <span className="font-semibold text-slate-900">{selectedStudent.father_name || 'Chưa có'}</span> ({selectedStudent.father_phone})</div>
                  <div className="text-[11px] text-slate-500 truncate">Địa chỉ: {selectedStudent.address}</div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  2. Chọn mẫu tin nhắn thường dùng (1-chạm):
                </label>
                <div className="space-y-1.5">
                  {MESSAGE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                        messageType === preset.type
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-100'
                      }`}
                    >
                      <span>💬 {preset.type}</span>
                      <span className="text-[10px] opacity-75">Áp dụng →</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleAiDraft}
                  disabled={aiGenerating}
                  className="w-full py-2.5 px-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{aiGenerating ? 'AI đang soạn tin...' : '🤖 AI soạn tin nhắn theo tình hình thực tế'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right 7 cols: Editor & Actions */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col h-full">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Nội dung tin nhắn (Cô có thể tùy chỉnh trước khi gửi):
                </h3>
                <span className="text-[11px] text-slate-400">
                  {customDraft.length} ký tự
                </span>
              </div>

              <textarea
                rows={10}
                value={customDraft}
                onChange={(e) => setCustomDraft(e.target.value)}
                placeholder="Chọn một mẫu ở cột bên trái hoặc bấm 'AI soạn tin nhắn' để tự động tạo nội dung..."
                className="w-full flex-1 p-4 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-blue-500 leading-relaxed font-sans"
              />

              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleSaveToHistory}
                  disabled={!customDraft}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  💾 Lưu vào Lịch sử trao đổi
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!customDraft}
                  className={`inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Đã sao chép tin nhắn!' : 'Sao chép để gửi Zalo / SMS'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Directory */}
      {activeSubTab === 'directory' && (
        <div className="space-y-4">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="relative w-full max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm học sinh hoặc tên phụ huynh..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-blue-500"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Hiển thị: {filteredDirectory.length}/45 phụ huynh
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredDirectory.map((s, idx) => (
              <div
                key={s.id}
                className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 transition-all text-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-slate-400 font-bold">#{s.stt || idx + 1}</span>
                    <span className="font-bold text-slate-900 text-sm">{s.full_name}</span>
                  </div>

                  <div className="space-y-1 mt-2 text-slate-600">
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <span className="text-slate-400 block text-[10px]">MẸ HỌC SINH:</span>
                      <div className="font-bold text-slate-800">{s.mother_name || 'Chưa cập nhật'}</div>
                      <div className="font-mono text-blue-600 font-bold">{s.mother_phone || '—'}</div>
                    </div>

                    <div className="p-2 bg-slate-50 rounded-xl mt-1">
                      <span className="text-slate-400 block text-[10px]">BỐ HỌC SINH:</span>
                      <div className="font-bold text-slate-800">{s.father_name || 'Chưa cập nhật'}</div>
                      <div className="font-mono text-blue-600 font-bold">{s.father_phone || '—'}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStudentId(s.id);
                      setActiveSubTab('composer');
                      setCustomDraft(MESSAGE_PRESETS[0].template(s.full_name));
                    }}
                    className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                  >
                    💬 Soạn tin nhắn →
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectStudent(s)}
                    className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                  >
                    Hồ sơ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: History */}
      {activeSubTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 font-bold text-xs text-slate-700">
            Nhật ký các lần trao đổi phụ huynh ({data.parent_contacts.length})
          </div>

          <div className="divide-y divide-slate-100">
            {data.parent_contacts.map((c) => {
              const student = data.students.find((s) => s.id === c.student_id);

              return (
                <div key={c.id} className="p-4 hover:bg-slate-50 transition-colors text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900">{student?.full_name || 'Học sinh'}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-semibold text-slate-700">Liên hệ: {c.contact_person}</span>
                      <span className="font-mono text-blue-600">({c.phone})</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">{c.date}</span>
                  </div>

                  <p className="text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed font-sans">
                    {c.content}
                  </p>

                  <div className="mt-2 text-[11px] text-emerald-700 font-semibold flex items-center space-x-1">
                    <span>Kết quả: {c.result}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
