import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  BookOpen,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import { useClassroom } from '../context/ClassroomContext';
import { getTodayDateString } from '../data/demoStudents';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AIAssistantView: React.FC = () => {
  const { data, classStats } = useClassroom();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Xin chào Cô Hue Pham! Em là **AI Trợ lý Chủ nhiệm Lớp 9/7** (Năm học 2026–2027).

Em đã nắm toàn bộ dữ liệu thực tế hiện tại của 45 học sinh lớp mình (chuyên cần, điểm thi đua, nề nếp và các trường hợp cần lưu ý).

Cô có thể hỏi em bất cứ điều gì hoặc bấm nhanh các câu hỏi gợi ý bên dưới để em hỗ trợ Cô ngay nhé!`,
      timestamp: 'Vừa xong',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const QUICK_PROMPTS = [
    'Hôm nay lớp có vấn đề gì?',
    'Những học sinh nào cần quan tâm tuần này?',
    'Ai tiến bộ nhất trong tuần?',
    'Ai có chuyên cần thấp nhất?',
    'Ai đi trễ nhiều nhất?',
    'Tạo báo cáo tuần tổng hợp cho Ban Giám hiệu.',
    'Gợi ý cách trao đổi nhẹ nhàng với phụ huynh học sinh hay đi trễ.',
  ];

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputText('');
    setIsLoading(true);

    try {
      // Build lightweight context snapshot of class
      const contextData = {
        totalStudents: data.students.length,
        todayAttendance: {
          present: classStats.presentToday,
          excused: classStats.excusedToday,
          unexcused: classStats.unexcusedToday,
          late: classStats.lateToday,
        },
        highPriorityStudents: classStats.highPriorityAlerts.map((s) => ({
          name: s.student.full_name,
          reason: s.alertReason,
          score: s.currentWeeklyScore,
        })),
        needMonitoringStudents: classStats.needMonitoringAlerts.map((s) => ({
          name: s.student.full_name,
          reason: s.alertReason,
          score: s.currentWeeklyScore,
        })),
        topStudents: classStats.topStudents.map((s) => ({
          name: s.student.full_name,
          score: s.currentWeeklyScore,
          merits: s.meritCount,
        })),
        recentBehaviors: data.behaviors.slice(0, 10).map((b) => {
          const s = data.students.find((stu) => stu.id === b.student_id);
          return `${b.date}: ${s?.full_name} - ${b.category} (${b.points > 0 ? '+' : ''}${b.points}đ)`;
        }),
      };

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          contextData,
        }),
      });

      const json = await res.json();
      const replyText = json.reply || 'Xin lỗi Cô, em gặp sự cố khi phân tích. Cô vui lòng thử lại nhé!';

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: `Đã xảy ra lỗi kết nối: ${err.message}. Em sẽ hỗ trợ Cô ngay khi mạng ổn định lại.`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    if (confirm('Cô có chắc muốn xóa lịch sử trò chuyện này?')) {
      setMessages([
        {
          id: `init-${Date.now()}`,
          sender: 'ai',
          text: 'Lịch sử trò chuyện đã được làm mới. Cô cần em hỗ trợ phân tích thông tin gì của Lớp 9/7 ạ?',
          timestamp: 'Vừa xong',
        },
      ]);
    }
  };

  return (
    <div className="space-y-4 pb-12 h-[calc(100vh-8.5rem)] flex flex-col">
      {/* Top Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-extrabold text-slate-900">AI Trợ lý Chủ nhiệm Lớp 9/7</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                Gemini 2.5
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Đồng hành cùng Cô Hue Pham: Phân tích dữ liệu thực tế, tư vấn sư phạm và soạn báo cáo.
            </p>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          title="Làm mới cuộc trò chuyện"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Chat Stream Container */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-6 overflow-y-auto space-y-4 flex flex-col">
        <div className="flex-1 space-y-4">
          {messages.map((m) => {
            const isAI = m.sender === 'ai';
            return (
              <div
                key={m.id}
                className={`flex items-start space-x-3 ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                {isAI && (
                  <div className="w-8 h-8 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
                    🤖
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isAI
                      ? 'bg-slate-50 border border-slate-200 text-slate-800'
                      : 'bg-blue-600 text-white shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{m.text}</div>
                  <div
                    className={`mt-2 flex items-center justify-between text-[10px] ${
                      isAI ? 'text-slate-400' : 'text-blue-200'
                    }`}
                  >
                    <span>{m.timestamp}</span>
                    {isAI && (
                      <button
                        onClick={() => handleCopy(m.id, m.text)}
                        className="hover:text-blue-600 flex items-center space-x-1 cursor-pointer ml-4"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600">Đã sao chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {!isAI && (
                  <div className="w-8 h-8 rounded-xl bg-blue-700 text-white flex items-center justify-center text-xs shrink-0 font-bold">
                    HP
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-3 text-xs text-slate-500 italic bg-slate-50 p-3 rounded-2xl max-w-sm border border-slate-200">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
              <span>AI đang rà soát dữ liệu lớp 9/7 và tổng hợp phản hồi...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="pt-2 border-t border-slate-100 shrink-0">
          <div className="flex items-center space-x-1.5 text-[11px] font-bold text-slate-400 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Câu hỏi thường dùng (1-chạm):</span>
          </div>
          <div className="flex flex-wrap gap-1.5 overflow-x-auto max-h-24">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2 pt-2 shrink-0"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Hỏi AI về tình hình nề nếp, chuyên cần, gợi ý báo cáo..."
            className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
