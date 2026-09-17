import { Student, AttendanceRecord, BehaviorRecord, MeritReward, JournalEntry, ParentContactRecord, CompetitionSettings, ClassSettings } from '../types';

export const DEFAULT_CLASS_SETTINGS: ClassSettings = {
  class_name: '9/7',
  school_year: '2026–2027',
  teacher_name: 'Cô Hue Pham',
  total_students: 45,
  school_name: 'THCS Tân Xuân',
  late_threshold_time: '07:15',
};

export const DEFAULT_COMPETITION_SETTINGS: CompetitionSettings = {
  base_weekly_points: 100,
  criteria: {
    attendance: 20,
    discipline: 20,
    academic: 30,
    hygiene: 10,
    collective_activity: 10,
    collective_awareness: 10,
  },
  point_rules: {
    speech: 2,
    good_task: 2,
    helping_friend: 2,
    active_participation: 3,
    outstanding_achievement: 5,
    forget_books: -2,
    no_homework: -3,
    late_arrival: -3,
    disruptive: -2,
    uniform_violation: -2,
    rule_violation: -5,
    serious_violation: -10,
  },
  rating_thresholds: {
    excellent: 90,
    good: 80,
    fair: 65,
    needs_effort: 50,
  },
};

export const DEMO_45_STUDENTS: Student[] = [
  { stt: 1, id: 'hs-01', student_code: '90701', full_name: 'Nguyễn Tuấn Anh', gender: 'Nam', date_of_birth: '2012-03-15', ethnicity: 'Kinh', address: '12 Nguyễn Trãi, P. Bến Thành, Q.1', father_name: 'Nguyễn Văn Hùng', father_phone: '0903124567', mother_name: 'Lê Thị Mai', mother_phone: '0918234567', primary_contact: 'mother' },
  { stt: 2, id: 'hs-02', student_code: '90702', full_name: 'Trần Thị Ngọc Ánh', gender: 'Nữ', date_of_birth: '2012-07-22', ethnicity: 'Kinh', address: '45 Lê Duẩn, P. Bến Nghé, Q.1', father_name: 'Trần Văn Hoàng', father_phone: '0982334455', mother_name: 'Phạm Thu Hương', mother_phone: '0973445566', primary_contact: 'mother' },
  { stt: 3, id: 'hs-03', student_code: '90703', full_name: 'Lê Hoàng Bảo', gender: 'Nam', date_of_birth: '2012-01-10', ethnicity: 'Kinh', address: '88 Nam Kỳ Khởi Nghĩa, Q.1', father_name: 'Lê Trọng Nghĩa', father_phone: '0912345678', mother_name: 'Võ Thị Lệ', mother_phone: '0908765432', primary_contact: 'father' },
  { stt: 4, id: 'hs-04', student_code: '90704', full_name: 'Phạm Gia Bảo', gender: 'Nam', date_of_birth: '2012-09-05', ethnicity: 'Kinh', address: '102 Hai Bà Trưng, Q.1', father_name: 'Phạm Đức Thịnh', father_phone: '0934567890', mother_name: 'Đặng Ngọc Lan', mother_phone: '0945678901', primary_contact: 'mother' },
  { stt: 5, id: 'hs-05', student_code: '90705', full_name: 'Vũ Quốc Cường', gender: 'Nam', date_of_birth: '2012-11-18', ethnicity: 'Kinh', address: '15 Trần Hưng Đạo, P. Cô Giang, Q.1', father_name: 'Vũ Văn Long', father_phone: '0919888777', mother_name: 'Bùi Thị Hà', mother_phone: '0928777666', primary_contact: 'father' },
  { stt: 6, id: 'hs-06', student_code: '90706', full_name: 'Đặng Thu Cúc', gender: 'Nữ', date_of_birth: '2012-04-30', ethnicity: 'Kinh', address: '24 Pasteur, Q.1', father_name: 'Đặng Quốc Huy', father_phone: '0901234987', mother_name: 'Nguyễn Thị Hiền', mother_phone: '0911223344', primary_contact: 'mother' },
  { stt: 7, id: 'hs-07', student_code: '90707', full_name: 'Hoàng Minh Dũng', gender: 'Nam', date_of_birth: '2012-08-12', ethnicity: 'Tày', address: '56 Lý Tự Trọng, Q.1', father_name: 'Hoàng Văn Sáng', father_phone: '0988112233', mother_name: 'Ma Thị Hoa', mother_phone: '0977223344', primary_contact: 'father' },
  { stt: 8, id: 'hs-08', student_code: '90708', full_name: 'Bùi Tiến Dũng', gender: 'Nam', date_of_birth: '2012-02-14', ethnicity: 'Kinh', address: '77 Đinh Tiên Hoàng, Q.1', father_name: 'Bùi Quang Hải', father_phone: '0909445566', mother_name: 'Lê Ngọc Ánh', mother_phone: '0919556677', primary_contact: 'mother' },
  { stt: 9, id: 'hs-09', student_code: '90709', full_name: 'Ngô Mỹ Duyên', gender: 'Nữ', date_of_birth: '2012-06-08', ethnicity: 'Kinh', address: '33 Mạc Đĩnh Chi, Q.1', father_name: 'Ngô Thanh Tùng', father_phone: '0938123456', mother_name: 'Trần Bích Thủy', mother_phone: '0948234567', primary_contact: 'mother' },
  { stt: 10, id: 'hs-10', student_code: '90710', full_name: 'Dương Văn Đạt', gender: 'Nam', date_of_birth: '2012-10-25', ethnicity: 'Kinh', address: '91 Nguyễn Du, Q.1', father_name: 'Dương Đình Nghệ', father_phone: '0966332211', mother_name: 'Hoàng Kim Chi', mother_phone: '0977443322', primary_contact: 'father' },
  { stt: 11, id: 'hs-11', student_code: '90711', full_name: 'Đỗ Thị Hải Đường', gender: 'Nữ', date_of_birth: '2012-05-19', ethnicity: 'Kinh', address: '18 Nguyễn Thị Minh Khai, Q.1', father_name: 'Đỗ Minh Tuấn', father_phone: '0903998877', mother_name: 'Vũ Thị Loan', mother_phone: '0913887766', primary_contact: 'mother' },
  { stt: 12, id: 'hs-12', student_code: '90712', full_name: 'Lý Quốc Hào', gender: 'Nam', date_of_birth: '2012-12-03', ethnicity: 'Hoa', address: '64 Hàm Nghi, Q.1', father_name: 'Lý Văn Phước', father_phone: '0983111222', mother_name: 'Lâm Bích Ngọc', mother_phone: '0973222333', primary_contact: 'father' },
  { stt: 13, id: 'hs-13', student_code: '90713', full_name: 'Phan Thảo Hân', gender: 'Nữ', date_of_birth: '2012-01-28', ethnicity: 'Kinh', address: '120 Nguyễn Huệ, Q.1', father_name: 'Phan Nhật Minh', father_phone: '0902554433', mother_name: 'Trương Ngọc Mai', mother_phone: '0912665544', primary_contact: 'mother' },
  { stt: 14, id: 'hs-14', student_code: '90714', full_name: 'Hồ Gia Hưng', gender: 'Nam', date_of_birth: '2012-07-14', ethnicity: 'Kinh', address: '49 Tôn Đức Thắng, Q.1', father_name: 'Hồ Văn Trung', father_phone: '0937778899', mother_name: 'Đoàn Thị Thơm', mother_phone: '0947889900', primary_contact: 'father' },
  { stt: 15, id: 'hs-15', student_code: '90715', full_name: 'Võ Minh Khang', gender: 'Nam', date_of_birth: '2012-03-09', ethnicity: 'Kinh', address: '85 Nguyễn Thị Nghĩa, Q.1', father_name: 'Võ Tấn Phát', father_phone: '0981992288', mother_name: 'Nguyễn Thị Oanh', mother_phone: '0971882277', primary_contact: 'mother' },
  { stt: 16, id: 'hs-16', student_code: '90716', full_name: 'Nguyễn Mai Lan', gender: 'Nữ', date_of_birth: '2012-09-17', ethnicity: 'Kinh', address: '109 Lê Lai, Q.1', father_name: 'Nguyễn Thành Nam', father_phone: '0908123987', mother_name: 'Phan Diệu Linh', mother_phone: '0918234876', primary_contact: 'mother' },
  { stt: 17, id: 'hs-17', student_code: '90717', full_name: 'Lê Hoàng Long', gender: 'Nam', date_of_birth: '2012-04-11', ethnicity: 'Kinh', address: '22 Chu Mạnh Trinh, Q.1', father_name: 'Lê Bá Lộc', father_phone: '0933441122', mother_name: 'Trần Thị Thúy', mother_phone: '0944552233', primary_contact: 'father' },
  { stt: 18, id: 'hs-18', student_code: '90718', full_name: 'Trần Đức Lương', gender: 'Nam', date_of_birth: '2012-08-27', ethnicity: 'Kinh', address: '36 Nguyễn Bỉnh Khiêm, Q.1', father_name: 'Trần Văn Kiên', father_phone: '0967889900', mother_name: 'Lê Minh Hằng', mother_phone: '0978990011', primary_contact: 'mother' },
  { stt: 19, id: 'hs-19', student_code: '90719', full_name: 'Phạm Khánh Linh', gender: 'Nữ', date_of_birth: '2012-10-02', ethnicity: 'Kinh', address: '58 Đặng Dung, P. Tân Định, Q.1', father_name: 'Phạm Quốc Bảo', father_phone: '0915667788', mother_name: 'Ngô Thanh Thảo', mother_phone: '0905778899', primary_contact: 'mother' },
  { stt: 20, id: 'hs-20', student_code: '90720', full_name: 'Bùi Phương Linh', gender: 'Nữ', date_of_birth: '2012-02-20', ethnicity: 'Kinh', address: '71 Trần Quang Khải, Q.1', father_name: 'Bùi Đức Thắng', father_phone: '0984556677', mother_name: 'Đặng Mai Phương', mother_phone: '0974667788', primary_contact: 'mother' },
  { stt: 21, id: 'hs-21', student_code: '90721', full_name: 'Nguyễn Tấn Minh', gender: 'Nam', date_of_birth: '2012-06-16', ethnicity: 'Kinh', address: '93 Huỳnh Thúc Kháng, Q.1', father_name: 'Nguyễn Duy Cường', father_phone: '0902113355', mother_name: 'Lê Hồng Nhung', mother_phone: '0912224466', primary_contact: 'father' },
  { stt: 22, id: 'hs-22', student_code: '90722', full_name: 'Đinh Tuấn Nam', gender: 'Nam', date_of_birth: '2012-11-29', ethnicity: 'Mường', address: '14 Bùi Thị Xuân, Q.1', father_name: 'Đinh Văn Quý', father_phone: '0939001122', mother_name: 'Bùi Thị Dung', mother_phone: '0949112233', primary_contact: 'father' },
  { stt: 23, id: 'hs-23', student_code: '90723', full_name: 'Vũ Hoàng Ngân', gender: 'Nữ', date_of_birth: '2012-05-04', ethnicity: 'Kinh', address: '42 Nguyễn Cư Trinh, Q.1', father_name: 'Vũ Đình Toàn', father_phone: '0987334411', mother_name: 'Trần Bích Hạnh', mother_phone: '0977445522', primary_contact: 'mother' },
  { stt: 24, id: 'hs-24', student_code: '90724', full_name: 'Trương Yến Nhi', gender: 'Nữ', date_of_birth: '2012-12-15', ethnicity: 'Kinh', address: '67 Calmette, Q.1', father_name: 'Trương Công Định', father_phone: '0914889922', mother_name: 'Lý Kim Ngân', mother_phone: '0904990033', primary_contact: 'mother' },
  { stt: 25, id: 'hs-25', student_code: '90725', full_name: 'Lê Thanh Phong', gender: 'Nam', date_of_birth: '2012-01-08', ethnicity: 'Kinh', address: '89 Ký Con, Q.1', father_name: 'Lê Văn Khôi', father_phone: '0963224466', mother_name: 'Võ Thị Tuyết', mother_phone: '0973335577', primary_contact: 'father' },
  { stt: 26, id: 'hs-26', student_code: '90726', full_name: 'Nguyễn Hữu Phước', gender: 'Nam', date_of_birth: '2012-07-07', ethnicity: 'Kinh', address: '105 Phó Đức Chính, Q.1', father_name: 'Nguyễn Văn Đức', father_phone: '0906778811', mother_name: 'Hoàng Thị Trúc', mother_phone: '0916889922', primary_contact: 'father' },
  { stt: 27, id: 'hs-27', student_code: '90727', full_name: 'Phạm Như Quỳnh', gender: 'Nữ', date_of_birth: '2012-03-24', ethnicity: 'Kinh', address: '28 Trịnh Văn Cấn, Q.1', father_name: 'Phạm Văn Hậu', father_phone: '0982556699', mother_name: 'Đỗ Thị Hường', mother_phone: '0972667700', primary_contact: 'mother' },
  { stt: 28, id: 'hs-28', student_code: '90728', full_name: 'Trần Trọng Sang', gender: 'Nam', date_of_birth: '2012-08-01', ethnicity: 'Kinh', address: '51 Cô Bắc, Q.1', father_name: 'Trần Văn Dũng', father_phone: '0931223344', mother_name: 'Nguyễn Thị Thu', mother_phone: '0941334455', primary_contact: 'father' },
  { stt: 29, id: 'hs-29', student_code: '90729', full_name: 'Lâm Diệu Tâm', gender: 'Nữ', date_of_birth: '2012-10-14', ethnicity: 'Hoa', address: '73 Cô Giang, Q.1', father_name: 'Lâm Gia Phát', father_phone: '0907445588', mother_name: 'Vương Tuyết Mai', mother_phone: '0917556699', primary_contact: 'mother' },
  { stt: 30, id: 'hs-30', student_code: '90730', full_name: 'Đoàn Quang Thắng', gender: 'Nam', date_of_birth: '2012-04-18', ethnicity: 'Kinh', address: '11 Nguyễn Thái Học, Q.1', father_name: 'Đoàn Văn Phú', father_phone: '0989113377', mother_name: 'Bùi Thị Dung', mother_phone: '0979224488', primary_contact: 'father' },
  { stt: 31, id: 'hs-31', student_code: '90731', full_name: 'Ngô Thanh Thảo', gender: 'Nữ', date_of_birth: '2012-09-09', ethnicity: 'Kinh', address: '37 Đề Thám, Q.1', father_name: 'Ngô Văn Thịnh', father_phone: '0913557799', mother_name: 'Lê Thị Nga', mother_phone: '0903668800', primary_contact: 'mother' },
  { stt: 32, id: 'hs-32', student_code: '90732', full_name: 'Vũ Đức Thịnh', gender: 'Nam', date_of_birth: '2012-02-05', ethnicity: 'Kinh', address: '62 Bùi Viện, Q.1', father_name: 'Vũ Hữu Đạt', father_phone: '0964112255', mother_name: 'Trần Thị Sen', mother_phone: '0974223366', primary_contact: 'father' },
  { stt: 33, id: 'hs-33', student_code: '90733', full_name: 'Hoàng Bảo Trâm', gender: 'Nữ', date_of_birth: '2012-06-21', ethnicity: 'Kinh', address: '84 Phạm Ngũ Lão, Q.1', father_name: 'Hoàng Văn Khiêm', father_phone: '0905334477', mother_name: 'Nguyễn Thị Lụa', mother_phone: '0915445588', primary_contact: 'mother' },
  { stt: 34, id: 'hs-34', student_code: '90734', full_name: 'Đặng Quốc Trung', gender: 'Nam', date_of_birth: '2012-11-12', ethnicity: 'Kinh', address: '96 Cống Quỳnh, Q.1', father_name: 'Đặng Quốc Hùng', father_phone: '0986778822', mother_name: 'Phan Thị Yến', mother_phone: '0976889933', primary_contact: 'father' },
  { stt: 35, id: 'hs-35', student_code: '90735', full_name: 'Bùi Cẩm Tú', gender: 'Nữ', date_of_birth: '2012-05-27', ethnicity: 'Kinh', address: '19 Tôn Thất Tùng, Q.1', father_name: 'Bùi Văn Hào', father_phone: '0935889911', mother_name: 'Đỗ Thị Minh', mother_phone: '0945990022', primary_contact: 'mother' },
  { stt: 36, id: 'hs-36', student_code: '90736', full_name: 'Nguyễn Anh Tuấn', gender: 'Nam', date_of_birth: '2012-12-24', ethnicity: 'Kinh', address: '44 Sương Nguyệt Ánh, Q.1', father_name: 'Nguyễn Anh Dũng', father_phone: '0918113399', mother_name: 'Lê Thị Diệu', mother_phone: '0908224400', primary_contact: 'father' },
  { stt: 37, id: 'hs-37', student_code: '90737', full_name: 'Trần Thảo Uyên', gender: 'Nữ', date_of_birth: '2012-03-02', ethnicity: 'Kinh', address: '69 Nguyễn Thị Minh Khai, Q.1', father_name: 'Trần Quốc Tuấn', father_phone: '0961445588', mother_name: 'Võ Mai Trinh', mother_phone: '0971556699', primary_contact: 'mother' },
  { stt: 38, id: 'hs-38', student_code: '90738', full_name: 'Lê Hoàng Việt', gender: 'Nam', date_of_birth: '2012-07-19', ethnicity: 'Kinh', address: '82 Nguyễn Đình Chiểu, Q.1', father_name: 'Lê Văn Hiệp', father_phone: '0909667733', mother_name: 'Hoàng Bích Liên', mother_phone: '0919778844', primary_contact: 'father' },
  { stt: 39, id: 'hs-39', student_code: '90739', full_name: 'Phạm Tường Vy', gender: 'Nữ', date_of_birth: '2012-10-10', ethnicity: 'Kinh', address: '103 Điện Biên Phủ, Q.1', father_name: 'Phạm Hữu Tài', father_phone: '0983778844', mother_name: 'Đặng Thu Trang', mother_phone: '0973889955', primary_contact: 'mother' },
  { stt: 40, id: 'hs-40', student_code: '90740', full_name: 'Võ Minh Vũ', gender: 'Nam', date_of_birth: '2012-01-31', ethnicity: 'Kinh', address: '25 Mạc Thị Bưởi, Q.1', father_name: 'Võ Minh Quang', father_phone: '0932889944', mother_name: 'Nguyễn Kim Loan', mother_phone: '0942990055', primary_contact: 'father' },
  { stt: 41, id: 'hs-41', student_code: '90741', full_name: 'Nguyễn Hoàng Yến', gender: 'Nữ', date_of_birth: '2012-08-16', ethnicity: 'Kinh', address: '47 Đông Du, Q.1', father_name: 'Nguyễn Thế Sơn', father_phone: '0917223366', mother_name: 'Trần Bích Thảo', mother_phone: '0907334477', primary_contact: 'mother' },
  { stt: 42, id: 'hs-42', student_code: '90742', full_name: 'Dương Gia Huy', gender: 'Nam', date_of_birth: '2012-04-06', ethnicity: 'Kinh', address: '78 Ngô Đức Kế, Q.1', father_name: 'Dương Văn Toàn', father_phone: '0968334499', mother_name: 'Lê Thị Thu', mother_phone: '0978445500', primary_contact: 'father' },
  { stt: 43, id: 'hs-43', student_code: '90743', full_name: 'Trương Thùy Linh', gender: 'Nữ', date_of_birth: '2012-09-23', ethnicity: 'Kinh', address: '94 Thi Sách, Q.1', father_name: 'Trương Quốc Hùng', father_phone: '0904112288', mother_name: 'Bùi Thị Hà', mother_phone: '0914223399', primary_contact: 'mother' },
  { stt: 44, id: 'hs-44', student_code: '90744', full_name: 'Đặng Minh Khôi', gender: 'Nam', date_of_birth: '2012-02-11', ethnicity: 'Kinh', address: '16 Thái Văn Lung, Q.1', father_name: 'Đặng Ngọc Minh', father_phone: '0985223311', mother_name: 'Vũ Thị Thanh', mother_phone: '0975334422', primary_contact: 'father' },
  { stt: 45, id: 'hs-45', student_code: '90745', full_name: 'Lê Ngọc Bảo Trân', gender: 'Nữ', date_of_birth: '2012-06-30', ethnicity: 'Kinh', address: '38 Cao Bá Quát, Q.1', father_name: 'Lê Hữu Nghĩa', father_phone: '0937667722', mother_name: 'Nguyễn Mai Chi', mother_phone: '0947778833', primary_contact: 'mother' },
];

export const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const generateInitialAttendance = (dateStr: string): AttendanceRecord[] => {
  // Typical distribution for 45 students:
  // 42 present, 1 excused absence, 0 unexcused, 2 late
  return DEMO_45_STUDENTS.map((s, index) => {
    let status: AttendanceRecord['status'] = 'present';
    let note = '';
    if (index === 4) { // Vũ Quốc Cường
      status = 'late';
      note = 'Đến lớp 07:22 (kẹt xe)';
    } else if (index === 17) { // Trần Đức Lương
      status = 'late';
      note = 'Đến lớp 07:20';
    } else if (index === 9) { // Dương Văn Đạt
      status = 'excused';
      note = 'Phụ huynh xin phép qua điện thoại (bị sốt)';
    }
    return {
      id: `att-${dateStr}-${s.id}`,
      student_id: s.id,
      date: dateStr,
      status,
      note,
      recorded_at: `${dateStr} 07:15:00`,
    };
  });
};

export const INITIAL_BEHAVIORS: BehaviorRecord[] = [
  { id: 'bh-1', student_id: 'hs-01', date: getTodayDateString(), type: 'positive', category: 'Phát biểu', description: 'Tích cực phát biểu xây dựng bài môn Toán', points: 2, recorded_by: 'Cô Hue Pham' },
  { id: 'bh-2', student_id: 'hs-02', date: getTodayDateString(), type: 'positive', category: 'Hoàn thành nhiệm vụ', description: 'Hoàn thành xuất sắc nhiệm vụ nhóm trưởng Sinh học', points: 2, recorded_by: 'Cô Hue Pham' },
  { id: 'bh-3', student_id: 'hs-05', date: getTodayDateString(), type: 'violation', category: 'Đi học trễ', description: 'Đi học trễ sau 07:15', points: -3, recorded_by: 'Cô Hue Pham' },
  { id: 'bh-4', student_id: 'hs-12', date: getTodayDateString(), type: 'positive', category: 'Giúp đỡ bạn', description: 'Giúp bạn ôn tập bài 15 phút đầu giờ', points: 2, recorded_by: 'Cô Hue Pham' },
  { id: 'bh-5', student_id: 'hs-17', date: getTodayDateString(), type: 'violation', category: 'Đi học trễ', description: 'Đi học trễ 5 phút', points: -3, recorded_by: 'Cô Hue Pham' },
  { id: 'bh-6', student_id: 'hs-21', date: getTodayDateString(), type: 'violation', category: 'Quên sách/vở', description: 'Quên mang sách bài tập Ngữ văn', points: -2, recorded_by: 'Cô Hue Pham' },
  { id: 'bh-7', student_id: 'hs-45', date: getTodayDateString(), type: 'positive', category: 'Trực nhật tốt', description: 'Vệ sinh lớp học sạch sẽ, kê bàn ghế ngay ngắn', points: 2, recorded_by: 'Cô Hue Pham' },
];

export const INITIAL_REWARDS: MeritReward[] = [
  { id: 'rw-1', student_id: 'hs-02', date: '2026-09-08', category: 'Học tập tốt', title: 'Học sinh tiêu biểu tuần 1', content: 'Đạt điểm tối đa kiểm tra 15 phút Toán và Ngoại ngữ', recorded_by: 'Cô Hue Pham' },
  { id: 'rw-2', student_id: 'hs-13', date: '2026-09-07', category: 'Tiến bộ vượt bậc', title: 'Tiến bộ vượt bậc về chuyên cần', content: 'Khắc phục hoàn toàn thói quen đi trễ, luôn đúng giờ', recorded_by: 'Cô Hue Pham' },
  { id: 'rw-3', student_id: 'hs-33', date: '2026-09-05', category: 'Tích cực hoạt động', title: 'Giải Nhất thi cắm hoa chào mừng năm học mới', content: 'Đại diện lớp 9/7 đạt giải phong trào Đoàn Đội cấp trường', recorded_by: 'Cô Hue Pham' },
];

export const INITIAL_PARENT_CONTACTS: ParentContactRecord[] = [
  { id: 'pc-1', student_id: 'hs-05', date: getTodayDateString(), type: 'call', content: 'Thông báo em Cường đi trễ buổi sáng, nhắc nhở gia đình chuẩn bị giờ đi sớm hơn tránh kẹt xe.', result: 'Mẹ em tiếp thu và hứa sẽ đưa đón con sớm hơn.', recorded_by: 'Cô Hue Pham' },
  { id: 'pc-2', student_id: 'hs-09', date: '2026-09-08', type: 'sms', content: 'Xác nhận thông tin xin phép nghỉ ốm của em Đạt, dặn dò bài vở kiểm tra bù.', result: 'Phụ huynh cảm ơn cô và gửi giấy khám bác sĩ.', recorded_by: 'Cô Hue Pham' },
];

export const INITIAL_JOURNAL: JournalEntry[] = [
  {
    id: 'jn-1',
    date: getTodayDateString(),
    title: 'Nhật ký ngày học thứ 4 - Tuần 2',
    class_status: 'Nề nếp lớp nhìn chung ổn định. Sĩ số 44/45 (1 vắng có phép Đạt), 2 em đi trễ (Cường, Lương). Trong giờ Toán cô Hoa khen tổ 2 tập trung tốt.',
    content: 'Đã sinh hoạt 15 phút đầu giờ nhắc nhở giữ trật tự giờ giải lao và bảo quản tài sản phòng máy lạnh. Phát động phong trào Đôi bạn cùng tiến cho kỳ thi giữa kỳ.',
    related_student_ids: ['hs-05', 'hs-10', 'hs-18'],
    actions_taken: 'Nhắn tin cho mẹ Cường và Lương qua Zalo. Trao đổi với ban cán sự lớp phân công bạn kèm môn Anh cho Đạt khi bạn đi học lại.',
    result: 'Ban cán sự đã nhận nhiệm vụ, phụ huynh phản hồi hợp tác tích cực.',
    created_at: `${getTodayDateString()} 16:30:00`,
  },
];
