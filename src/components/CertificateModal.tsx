import React, { useRef } from 'react';
import { Award, Printer, X } from 'lucide-react';
import { Student } from '../types';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  title: string;
  reason: string;
  date: string;
  teacherName: string;
  className: string;
  schoolName: string;
  schoolYear: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  student,
  title,
  reason,
  date,
  teacherName,
  className,
  schoolName,
  schoolYear,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = () => {
    try {
      const d = new Date(date || Date.now());
      return `Ngày ${d.getDate()} tháng ${d.getMonth() + 1} năm ${d.getFullYear()}`;
    } catch {
      return date;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 print:hidden">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-800">Giấy Khen Thưởng & Tuyên Dương</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In Giấy Khen</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Body (Styled for Screen & Printing) */}
        <div ref={printRef} className="p-8 bg-amber-50/40 relative font-serif print:p-12 print:m-0">
          <div className="border-4 border-double border-amber-600/60 p-8 rounded-xl bg-white shadow-inner relative overflow-hidden">
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-2 left-2 text-amber-600/40 font-mono text-xl">❖</div>
            <div className="absolute top-2 right-2 text-amber-600/40 font-mono text-xl">❖</div>
            <div className="absolute bottom-2 left-2 text-amber-600/40 font-mono text-xl">❖</div>
            <div className="absolute bottom-2 right-2 text-amber-600/40 font-mono text-xl">❖</div>

            {/* Header */}
            <div className="text-center mb-6">
              <p className="text-xs uppercase tracking-widest font-sans font-bold text-slate-500 mb-1">
                {schoolName} • NĂM HỌC {schoolYear}
              </p>
              <p className="text-xs font-sans text-slate-600 font-medium">
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </p>
              <p className="text-[10px] font-sans tracking-wide text-slate-500 mb-4">
                Độc lập – Tự do – Hạnh phúc
              </p>
              <div className="w-24 h-0.5 bg-amber-600/40 mx-auto mb-6"></div>

              <h2 className="text-3xl font-extrabold text-amber-700 tracking-wider uppercase font-serif drop-shadow-xs">
                GIẤY TUYÊN DƯƠNG
              </h2>
              <p className="text-sm text-slate-600 italic mt-1 font-serif">
                Giáo viên Chủ nhiệm Lớp {className} trân trọng khen thưởng
              </p>
            </div>

            {/* Content */}
            <div className="text-center my-6 space-y-3">
              <p className="text-xs uppercase text-slate-500 font-sans tracking-wider">Trao tặng cho em:</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-sans">
                {student.full_name}
              </h1>
              <p className="text-sm text-slate-700 font-sans font-medium">
                Học sinh Lớp: <span className="font-bold text-blue-700">{className}</span> • Mã HS: <span className="font-mono">{student.student_code}</span>
              </p>
              <div className="max-w-md mx-auto py-2">
                <div className="inline-block px-4 py-1.5 bg-amber-100/70 border border-amber-300 text-amber-900 rounded-full text-sm font-semibold font-sans mb-2">
                  Danh hiệu: {title}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed italic font-serif">
                  &ldquo;{reason}&rdquo;
                </p>
              </div>
            </div>

            {/* Signatures */}
            <div className="mt-8 pt-6 border-t border-amber-200/60 flex items-center justify-between text-center font-sans">
              <div className="w-1/2">
                <p className="text-xs text-slate-500 italic mb-8">Ban Cán sự Lớp {className}</p>
                <p className="text-xs font-semibold text-slate-700">Lớp trưởng xác nhận</p>
              </div>
              <div className="w-1/2">
                <p className="text-xs text-slate-500 italic mb-1">{formattedDate()}</p>
                <p className="text-xs uppercase font-bold text-slate-700 mb-8">Giáo viên Chủ nhiệm</p>
                <p className="text-sm font-bold text-blue-900 tracking-wide underline decoration-blue-300">
                  {teacherName}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Đóng
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>In Giấy Tuyên Dương</span>
          </button>
        </div>
      </div>
    </div>
  );
};
