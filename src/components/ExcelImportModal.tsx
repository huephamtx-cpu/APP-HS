import React, { useState, useRef } from 'react';
import { X, UploadCloud, FileSpreadsheet, Download, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { useClassroom } from '../context/ClassroomContext';
import { parseExcelStudentFile, downloadStudentTemplate } from '../utils/excel';
import { Student } from '../types';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({ isOpen, onClose }) => {
  const { importStudents, loadDemoData } = useClassroom();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewStudents, setPreviewStudents] = useState<Student[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleFileSelected = async (file: File) => {
    setIsProcessing(true);
    setFileName(file.name);
    setWarnings([]);
    setSuccessMessage('');
    setPreviewStudents([]);

    try {
      const buffer = await file.arrayBuffer();
      const result = parseExcelStudentFile(buffer);

      setPreviewStudents(result.students);
      if (result.errors.length > 0) {
        setWarnings(result.errors);
      }
    } catch (err: any) {
      setWarnings(['Không thể đọc file Excel. Vui lòng kiểm tra định dạng .xlsx, .xls hoặc .csv: ' + err.message]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmImport = () => {
    if (previewStudents.length === 0) return;
    const res = importStudents(previewStudents);
    setSuccessMessage(res.message);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Import Danh sách 45 Học sinh Lớp 9/7</h3>
              <p className="text-xs text-slate-500">Tự động nhận diện cột và xác minh chuẩn 45/45 học sinh</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Action Row: Download Template / Use Demo */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-blue-50/70 border border-blue-200 rounded-2xl">
            <div className="flex items-center space-x-2 text-xs text-blue-900">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Chưa có file mẫu? Tải bảng Excel chuẩn hóa của Lớp 9/7:</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={downloadStudentTemplate}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải file Excel mẫu</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  loadDemoData();
                  onClose();
                }}
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <span>Nạp 45 HS Demo</span>
              </button>
            </div>
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/30 p-8 rounded-2xl text-center cursor-pointer transition-all"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
              accept=".xlsx,.xls,.csv"
              className="hidden"
            />
            <UploadCloud className="w-10 h-10 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">
              {fileName ? fileName : 'Kéo thả file Excel vào đây hoặc bấm để chọn'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Hỗ trợ định dạng .xlsx, .xls, .csv (Tự động nhận diện STT, Họ tên, Ngày sinh, Phụ huynh, SĐT...)
            </p>
          </div>

          {/* Warnings Banner if count != 45 */}
          {warnings.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-1 text-xs text-amber-900">
              <div className="flex items-center space-x-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Cảnh báo kiểm tra số lượng học sinh:</span>
              </div>
              {warnings.map((w, idx) => (
                <p key={idx} className="pl-5 leading-relaxed">
                  {w}
                </p>
              ))}
            </div>
          )}

          {/* Success message */}
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center space-x-2 text-xs text-emerald-900 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Preview Table */}
          {previewStudents.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Xem trước dữ liệu nhận diện được ({previewStudents.length} học sinh):</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-black ${
                    previewStudents.length === 45
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {previewStudents.length === 45 ? '✅ Đủ 45/45 HS' : `⚠️ ${previewStudents.length}/45 HS`}
                </span>
              </div>

              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 text-slate-600 sticky top-0 font-semibold">
                    <tr>
                      <th className="p-2 border-b border-slate-200 w-12 text-center">STT</th>
                      <th className="p-2 border-b border-slate-200">Họ và tên</th>
                      <th className="p-2 border-b border-slate-200">Giới tính</th>
                      <th className="p-2 border-b border-slate-200">Ngày sinh</th>
                      <th className="p-2 border-b border-slate-200">Phụ huynh (Bố / Mẹ)</th>
                      <th className="p-2 border-b border-slate-200">SĐT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewStudents.slice(0, 10).map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2 text-center font-mono text-slate-500">{s.stt || idx + 1}</td>
                        <td className="p-2 font-bold text-slate-800">{s.full_name}</td>
                        <td className="p-2 text-slate-600">{s.gender}</td>
                        <td className="p-2 text-slate-600 font-mono text-[11px]">{s.date_of_birth}</td>
                        <td className="p-2 text-slate-600">{s.mother_name || s.father_name || '—'}</td>
                        <td className="p-2 text-blue-600 font-mono text-[11px]">
                          {s.mother_phone || s.father_phone || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {previewStudents.length > 10 && (
                <p className="text-[11px] text-slate-400 italic text-right">
                  ... và {previewStudents.length - 10} học sinh khác
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl cursor-pointer"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleConfirmImport}
            disabled={previewStudents.length === 0 || isProcessing}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            Áp dụng danh sách vào Lớp 9/7
          </button>
        </div>
      </div>
    </div>
  );
};
