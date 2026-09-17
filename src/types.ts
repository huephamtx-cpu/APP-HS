export type AttendanceStatus = 'present' | 'excused' | 'unexcused' | 'late';

export type BehaviorType = 'positive' | 'violation';

export type AlertLevel = 'high_priority' | 'need_monitoring' | 'positive_progress' | 'normal';

export interface ParentInfo {
  parent_name: string;
  relationship: 'Bố' | 'Mẹ' | 'Người giám hộ' | string;
  phone: string;
  notes?: string;
}

export interface Student {
  id: string;
  student_code: string;
  stt: number;
  full_name: string;
  gender: 'Nam' | 'Nữ';
  date_of_birth: string;
  ethnicity: string;
  address: string;
  notes?: string;
  father_name?: string;
  father_phone?: string;
  mother_name?: string;
  mother_phone?: string;
  primary_contact?: 'father' | 'mother' | 'guardian';
  avatar?: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  note?: string;
  recorded_at: string;
}

export interface BehaviorRecord {
  id: string;
  student_id: string;
  date: string; // YYYY-MM-DD
  type: BehaviorType;
  category: string; // e.g., 'Phát biểu', 'Đi trễ', etc.
  description: string;
  points: number; // positive or negative
  note?: string;
  recorded_by: string;
}

export interface MeritReward {
  id: string;
  student_id: string;
  date: string;
  category: string; // 'Học tập tốt' | 'Tiến bộ vượt bậc' | etc.
  title: string;
  content: string;
  recorded_by: string;
  note?: string;
}

export interface ParentContactRecord {
  id: string;
  student_id: string;
  date: string;
  type: 'sms' | 'call' | 'in_person' | 'zalo';
  content: string;
  result: string;
  recorded_by: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  class_status: string;
  related_student_ids: string[];
  actions_taken: string;
  result: string;
  created_at: string;
}

export interface CompetitionSettings {
  base_weekly_points: number;
  criteria: {
    attendance: number; // 20
    discipline: number; // 20
    academic: number; // 30
    hygiene: number; // 10
    collective_activity: number; // 10
    collective_awareness: number; // 10
  };
  point_rules: {
    // positives
    speech: number; // +2
    good_task: number; // +2
    helping_friend: number; // +2
    active_participation: number; // +3
    outstanding_achievement: number; // +5
    // violations
    forget_books: number; // -2
    no_homework: number; // -3
    late_arrival: number; // -3
    disruptive: number; // -2
    uniform_violation: number; // -2
    rule_violation: number; // -5
    serious_violation: number; // -10
  };
  rating_thresholds: {
    excellent: number; // 90
    good: number; // 80
    fair: number; // 65
    needs_effort: number; // 50
  };
}

export interface ClassSettings {
  class_name: string;
  school_year: string;
  teacher_name: string;
  total_students: number;
  school_name: string;
  late_threshold_time: string; // e.g. "07:15"
}

export interface WeeklyScore {
  week: number;
  student_id: string;
  academic_score: number;
  attendance_score: number;
  discipline_score: number;
  activity_score: number;
  bonus_points: number;
  penalty_points: number;
  total_score: number;
  ranking?: number;
  rating?: 'Xuất sắc' | 'Tốt' | 'Khá' | 'Cần cố gắng' | 'Cần hỗ trợ';
}

export interface UserSession {
  user_id: string;
  username: string;
  name: string;
  role: 'teacher_head' | 'teacher_subject' | 'admin';
  title: string;
}

export interface ClassDataStore {
  is_demo_mode: boolean;
  students: Student[];
  attendance: AttendanceRecord[];
  behaviors: BehaviorRecord[];
  rewards: MeritReward[];
  parent_contacts: ParentContactRecord[];
  journal: JournalEntry[];
  settings: {
    class: ClassSettings;
    competition: CompetitionSettings;
  };
}
