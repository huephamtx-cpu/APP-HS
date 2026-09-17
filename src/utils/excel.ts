import * as XLSX from 'xlsx';
import { Student } from '../types';
import { StudentStats } from './scoring';

export interface ExcelImportResult {
  students: Student[];
  errors: string[];
  totalCount: number;
  isValidCount: boolean; // exact 45 students
}

export function parseExcelStudentFile(dataBuffer: ArrayBuffer): ExcelImportResult {
  const workbook = XLSX.read(dataBuffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });

  const students: Student[] = [];
  const errors: string[] = [];

  jsonData.forEach((row, index) => {
    // Find keys flexibly
    const rowKeys = Object.keys(row);
    const findKey = (candidates: string[]) => {
      return rowKeys.find((k) =>
        candidates.some((c) => k.toLowerCase().replace(/\s+/g, '').includes(c.toLowerCase().replace(/\s+/g, '')))
      );
    };

    const nameKey = findKey(['họ và tên', 'họ tên', 'tên học sinh', 'fullname', 'hoten', 'ten']);
    if (!nameKey || !String(row[nameKey]).trim()) {
      return; // Skip empty rows or header residues
    }

    const sttKey = findKey(['stt', 'số thứ tự', 'no', 'order']);
    const genderKey = findKey(['giới tính', 'gioitinh', 'gender', 'phái']);
    const dobKey = findKey(['ngày sinh', 'ngaysinh', 'dob', 'birth']);
    const ethnicKey = findKey(['dân tộc', 'dantoc', 'ethnicity']);
    const addressKey = findKey(['địa chỉ', 'diachi', 'address', 'hộ khẩu', 'thường trú']);
    const fatherNameKey = findKey(['họ tên cha', 'họ và tên bố', 'tên cha', 'bố', 'cha']);
    const fatherPhoneKey = findKey(['sđt cha', 'sđt bố', 'sdt cha', 'điện thoại cha', 'phone cha']);
    const motherNameKey = findKey(['họ tên mẹ', 'họ và tên mẹ', 'tên mẹ', 'mẹ']);
    const motherPhoneKey = findKey(['sđt mẹ', 'sdt mẹ', 'điện thoại mẹ', 'phone mẹ']);
    const noteKey = findKey(['ghi chú', 'ghichu', 'notes', 'note']);

    const stt = Number(row[sttKey || '']) || index + 1;
    const fullName = String(row[nameKey] || '').trim();
    const genderRaw = String(row[genderKey || ''] || '').trim().toLowerCase();
    const gender: 'Nam' | 'Nữ' = genderRaw === 'nữ' || genderRaw === 'female' || genderRaw === 'f' ? 'Nữ' : 'Nam';

    let dob = String(row[dobKey || ''] || '').trim();
    // Handle excel date serial if numeric
    if (typeof row[dobKey || ''] === 'number') {
      try {
        const dateObj = XLSX.SSF.parse_date_code(row[dobKey || '']);
        dob = `${dateObj.y}-${String(dateObj.m).padStart(2, '0')}-${String(dateObj.d).padStart(2, '0')}`;
      } catch {
        // keep dob
      }
    }

    const student: Student = {
      id: `hs-import-${index + 1}-${Date.now()}`,
      student_code: `907${String(stt).padStart(2, '0')}`,
      stt,
      full_name: fullName,
      gender,
      date_of_birth: dob || '2012-01-01',
      ethnicity: String(row[ethnicKey || ''] || 'Kinh').trim(),
      address: String(row[addressKey || ''] || 'TP. Hồ Chí Minh').trim(),
      father_name: String(row[fatherNameKey || ''] || '').trim(),
      father_phone: String(row[fatherPhoneKey || ''] || '').trim(),
      mother_name: String(row[motherNameKey || ''] || '').trim(),
      mother_phone: String(row[motherPhoneKey || ''] || '').trim(),
      notes: String(row[noteKey || ''] || '').trim(),
      primary_contact: 'mother',
    };

    students.push(student);
  });

  const totalCount = students.length;
  const isValidCount = totalCount === 45;

  if (!isValidCount) {
    errors.push(`Danh sách vừa nhập có ${totalCount} học sinh. Quy định lớp 9/7 là chính xác 45 học sinh.`);
  }

  return {
    students,
    errors,
    totalCount,
    isValidCount,
  };
}

export function downloadStudentTemplate() {
  const sampleHeaders = [
    {
      'STT': 1,
      'Mã HS': '90701',
      'Họ và tên': 'Nguyễn Tuấn Anh',
      'Giới tính': 'Nam',
      'Ngày sinh': '2012-03-15',
      'Dân tộc': 'Kinh',
      'Địa chỉ': '12 Nguyễn Trãi, P. Bến Thành, Q.1',
      'Họ tên cha': 'Nguyễn Văn Hùng',
      'SĐT cha': '0903124567',
      'Họ tên mẹ': 'Lê Thị Mai',
      'SĐT mẹ': '0918234567',
      'Ghi chú': 'Đoàn viên tích cực',
    },
    {
      'STT': 2,
      'Mã HS': '90702',
      'Họ và tên': 'Trần Thị Ngọc Ánh',
      'Giới tính': 'Nữ',
      'Ngày sinh': '2012-07-22',
      'Dân tộc': 'Kinh',
      'Địa chỉ': '45 Lê Duẩn, P. Bến Nghé, Q.1',
      'Họ tên cha': 'Trần Văn Hoàng',
      'SĐT cha': '0982334455',
      'Họ tên mẹ': 'Phạm Thu Hương',
      'SĐT mẹ': '0973445566',
      'Ghi chú': 'Lớp phó học tập',
    }
  ];

  const ws = XLSX.utils.json_to_sheet(sampleHeaders);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Mau_45_HocSinh_Lop9_7');
  XLSX.writeFile(wb, 'Mau_DanhSach_Lop9_7_CoHuePham.xlsx');
}

export function exportStudentsToExcel(students: Student[], fileName = 'Danh_Sach_Hoc_Sinh_Lop_9_7.xlsx') {
  const rows = students.map((s, idx) => ({
    'STT': s.stt || idx + 1,
    'Mã HS': s.student_code || `907${String(idx + 1).padStart(2, '0')}`,
    'Họ và tên': s.full_name,
    'Giới tính': s.gender,
    'Ngày sinh': s.date_of_birth,
    'Dân tộc': s.ethnicity,
    'Địa chỉ': s.address,
    'Họ tên cha': s.father_name || '',
    'SĐT cha': s.father_phone || '',
    'Họ tên mẹ': s.mother_name || '',
    'SĐT mẹ': s.mother_phone || '',
    'Ghi chú': s.notes || '',
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'DanhSach45HS');
  XLSX.writeFile(wb, fileName);
}

export function exportCompetitionReportToExcel(statsList: StudentStats[], fileName = 'Bang_Thi_Dua_Lop_9_7.xlsx') {
  const rows = statsList.map((s) => ({
    'Hạng': s.rank,
    'Mã HS': s.student.student_code,
    'Họ và tên': s.student.full_name,
    'Giới tính': s.student.gender,
    'Chuyên cần (%)': `${s.attendanceRate}%`,
    'Đi trễ (lần)': s.lateCount,
    'Vắng CP': s.excusedAbsence,
    'Vắng KP': s.unexcusedAbsence,
    'Hành vi tốt (+đ)': `+${s.bonusPoints}`,
    'Vi phạm (-đ)': `-${s.penaltyPoints}`,
    'Khen thưởng': s.meritCount,
    'Điểm thi đua': s.currentWeeklyScore,
    'Xếp loại': s.rating,
    'Cảnh báo/Ghi chú': s.alertReason || 'Bình thường',
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'ThiDuaLop9_7');
  XLSX.writeFile(wb, fileName);
}
