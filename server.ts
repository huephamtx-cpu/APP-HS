import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));

// Initialize Gemini SDK with telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Database file storage
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'classroom_db.json');

const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'CLASS 9/7 MANAGER – CÔ HUE PHAM',
    timestamp: new Date().toISOString(),
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Load classroom data
app.get('/api/data', (req, res) => {
  try {
    ensureDataDir();
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(content);
      return res.json({ success: true, data });
    }
    return res.json({ success: true, data: null });
  } catch (err: any) {
    console.error('Error reading DB:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Save classroom data
app.post('/api/data', (req, res) => {
  try {
    ensureDataDir();
    fs.writeFileSync(DB_FILE, JSON.stringify(req.body, null, 2), 'utf-8');
    res.json({ success: true, message: 'Dữ liệu đã được lưu thành công trên hệ thống.' });
  } catch (err: any) {
    console.error('Error saving DB:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// AI Chatbot Assistant Endpoint
const handleAiChat = async (req: express.Request, res: express.Response) => {
  try {
    const { message, classroomContext, contextData } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Nội dung câu hỏi không được để trống.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        reply: `[Chế độ Phân tích Cục bộ] Hệ thống ghi nhận câu hỏi: "${message}". Hiện tại chưa cấu hình khóa API Gemini trong Cài đặt > Secrets, nhưng dữ liệu lớp 9/7 của Cô Hue Pham vẫn hoạt động ổn định và sẵn sàng cho các nghiệp vụ chủ nhiệm.`,
        source: 'local_fallback',
      });
    }

    const systemInstruction = `Bạn là Trợ lý AI thông minh chuyên biệt đồng hành cùng Cô Hue Pham - Giáo viên Chủ nhiệm Lớp 9/7 Năm học 2026–2027 (sĩ số: 45 học sinh).
Trường học: THCS Tân Xuân.
NGUYÊN TẮC QUAN TRỌNG:
1. Bạn PHẢI trả lời hoàn toàn dựa trên dữ liệu thực tế được cung cấp trong phần CONTEXT dưới đây. TUYỆT ĐỐI KHÔNG tự bịa tên học sinh, không bịa điểm thi đua, không bịa lịch sử vi phạm hay hoàn cảnh gia đình.
2. Nếu dữ liệu chưa có hoặc không đủ, hãy trả lời thẳng thắn: "Dữ liệu hiện tại chưa ghi nhận trường hợp này..."
3. Phân định rõ ràng:
   - DỮ LIỆU THỰC TẾ (FACT): Những gì đã ghi trong sổ điểm danh, sổ nề nếp, sổ khen thưởng.
   - GỢI Ý / ĐỀ XUẤT (SUGGESTION): Biện pháp sư phạm, cách trao đổi nhẹ nhàng với phụ huynh và học sinh.
4. Không đưa ra chẩn đoán tâm lý hoặc gán nhãn tiêu cực (tuyệt đối không dùng từ như 'hư hỏng', 'cá biệt'). Chỉ dùng từ ngữ chuẩn mực sư phạm: 'cần theo dõi thêm', 'có dấu hiệu sa sút', 'nên trao đổi với phụ huynh', 'có xu hướng tiến bộ'.
5. Ngôn ngữ: Tiếng Việt sư phạm chuẩn mực, kính trọng, lịch sự, tôn vinh vai trò của Cô Hue Pham.`;

    const contextStr = classroomContext || (contextData ? JSON.stringify(contextData, null, 2) : 'Chưa có thông tin cập nhật');
    const contents = `CONTEXT DỮ LIỆU LỚP 9/7 HIỆN TẠI:\n${contextStr}\n\nCÂU HỎI CỦA CÔ HUE PHAM:\n${message}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    const reply = response.text || 'Không nhận được phản hồi từ AI.';
    res.json({ reply, source: 'gemini' });
  } catch (err: any) {
    console.error('Gemini assistant error:', err);
    res.status(500).json({ error: err.message || 'Lỗi khi kết nối với AI' });
  }
};

app.post('/api/ai/assistant', handleAiChat);
app.post('/api/ai/chat', handleAiChat);

// AI Student Evaluation Generation
app.post('/api/ai/student-comment', async (req, res) => {
  try {
    const { studentName, period, stats, tone } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // High-quality local rule-based comment generator
      let comment = '';
      if (stats.merits > 0 && stats.violations === 0 && stats.attendanceRate >= 95) {
        comment = `Em ${studentName} có ý thức học tập và rèn luyện rất tốt, luôn chấp hành nghiêm túc nề nếp lớp 9/7. Chuyên cần ổn định và tích cực tham gia các phong trào thi đua. Cần tiếp tục phát huy trong thời gian tới.`;
      } else if (stats.violations > 0 || stats.lateCount >= 2) {
        comment = `Em ${studentName} có nhiều nỗ lực trong học tập, tuy nhiên cần khắc phục tình trạng đi học đúng giờ và chuẩn bị bài chu đáo hơn. GVCN sẽ phối hợp chặt chẽ với gia đình để động viên em tiến bộ.`;
      } else {
        comment = `Em ${studentName} duy trì nề nếp tương đối tốt, hòa đồng cùng tập thể lớp 9/7. Đề nghị em chủ động hơn trong phát biểu xây dựng bài và rèn luyện tính tự giác.`;
      }
      return res.json({ comment, source: 'rule_based' });
    }

    const systemInstruction = `Bạn là cố vấn sư phạm hỗ trợ Cô Hue Pham viết lời nhận xét học bạ, sổ liên lạc định kỳ cho học sinh Lớp 9/7 (Năm học 2026–2027).
Yêu cầu:
- Tôn trọng sự thật dựa trên số liệu được cung cấp (chuyên cần, điểm trừ, điểm cộng, khen thưởng).
- Tone giọng: ${tone || 'Khích lệ'} (ví dụ: Tích cực, Khích lệ, Trung tính, Trang trọng, hoặc Ngắn gọn).
- Lời văn xúc tích, chuẩn mực tiếng Việt sư phạm Việt Nam, giàu tính giáo dục và mang tính xây dựng.`;

    const prompt = `Hãy soạn một đoạn nhận xét học sinh:
- Họ và tên: ${studentName}
- Giai đoạn: ${period}
- Thống kê thực tế:
  + Tỷ lệ chuyên cần: ${stats.attendanceRate}%
  + Số buổi vắng: ${stats.absenceCount} (Có phép: ${stats.excusedAbsence}, Không phép: ${stats.unexcusedAbsence})
  + Số lần đi trễ: ${stats.lateCount}
  + Điểm thi đua trung bình: ${stats.avgScore}
  + Khen thưởng: ${stats.merits} lần
  + Vi phạm nề nếp: ${stats.violations} lần (Chi tiết: ${stats.violationDetails || 'Không có'})
- Giọng văn mong muốn: ${tone}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.4,
      },
    });

    res.json({ comment: response.text || '', source: 'gemini' });
  } catch (err: any) {
    console.error('Student comment generation error:', err);
    res.status(500).json({ error: err.message });
  }
});

// AI Weekly / Monthly Summary
app.post('/api/ai/period-summary', async (req, res) => {
  try {
    const { periodTitle, classSummary } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        strengths: 'Chuyên cần toàn lớp duy trì ở mức cao. Đa số học sinh chấp hành tốt đồng phục và tác phong lớp học 9/7.',
        issues: 'Vẫn còn một số học sinh đi học sát giờ hoặc trễ 5-10 phút; một vài em quên chuẩn bị dụng cụ học tập.',
        recommendations: 'Tăng cường nhắc nhở 15 phút đầu giờ; liên hệ với phụ huynh các học sinh đi trễ để phối hợp theo dõi.',
        source: 'local_fallback',
      });
    }

    const prompt = `Phân tích tình hình Lớp 9/7 của Cô Hue Pham cho giai đoạn: ${periodTitle}.
Dữ liệu thực tế:
${JSON.stringify(classSummary, null, 2)}

Hãy xuất kết quả gồm 3 phần rõ ràng:
1. 🌟 Điểm mạnh nổi bật (Strengths)
2. ⚠️ Vấn đề tồn tại cần lưu ý (Issues)
3. 🎯 Đề xuất giải pháp trọng tâm tuần tới (Action Plan)
Văn phong sư phạm, ngắn gọn, chuẩn xác.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Bạn là chuyên gia cố vấn quản lý lớp học THCS Việt Nam.',
        temperature: 0.3,
      },
    });

    res.json({ summaryText: response.text, source: 'gemini' });
  } catch (err: any) {
    console.error('Period summary error:', err);
    res.status(500).json({ error: err.message });
  }
});

// AI Parent Message Drafting
app.post('/api/ai/parent-message', async (req, res) => {
  try {
    const { studentName, parentName, relationship, purpose, details } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        message: `Kính gửi ${relationship || 'Phụ huynh'} em ${studentName}, Cô Hue Pham (GVCN lớp 9/7) xin phép trao đổi về việc ${purpose}: ${details}. Rất mong gia đình cùng phối hợp nhắc nhở và đồng hành cùng em. Trân trọng cảm ơn!`,
        source: 'rule_based',
      });
    }

    const prompt = `Hãy soạn một tin nhắn Zalo/SMS lịch sự, trang trọng và chuẩn mực từ Cô Hue Pham (GVCN Lớp 9/7) gửi đến phụ huynh:
- Phụ huynh: ${parentName || 'Quý Phụ huynh'} (${relationship || 'Phụ huynh'})
- Học sinh: ${studentName}
- Mục đích tin nhắn: ${purpose} (ví dụ: Nhắc đi học đúng giờ, Nhắc nhở bài tập, Khen ngợi thành tích, Trao đổi nề nếp, Mời phụ huynh trao đổi)
- Chi tiết cụ thể: ${details}
Yêu cầu:
- Tinh tế, thân thiện, mang tính cộng tác xây dựng giữa nhà trường và gia đình, có lời chào và lời cảm ơn trân trọng.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Bạn là trợ lý truyền thông học đường chuẩn mực của GVCN.',
        temperature: 0.4,
      },
    });

    res.json({ message: response.text, source: 'gemini' });
  } catch (err: any) {
    console.error('Parent message error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CLASS 9/7 MANAGER Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
