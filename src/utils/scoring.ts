import { Student, AttendanceRecord, BehaviorRecord, MeritReward, CompetitionSettings, AlertLevel } from '../types';

export interface StudentStats {
  student: Student;
  attendanceRate: number;
  totalDays: number;
  presentDays: number;
  excusedAbsence: number;
  unexcusedAbsence: number;
  lateCount: number;
  positiveBehaviors: number;
  violationBehaviors: number;
  bonusPoints: number;
  penaltyPoints: number;
  meritCount: number;
  currentWeeklyScore: number;
  rating: 'Xuất sắc' | 'Tốt' | 'Khá' | 'Cần cố gắng' | 'Cần hỗ trợ';
  rank: number;
  alertLevel: AlertLevel;
  alertReason?: string;
  progressTrend: 'improving' | 'stable' | 'declining';
  weeklyScoresHistory: { week: string; score: number }[];
}

export function calculateStudentStats(
  student: Student,
  attendanceList: AttendanceRecord[],
  behaviorList: BehaviorRecord[],
  rewardList: MeritReward[],
  competitionSettings: CompetitionSettings
): StudentStats {
  // 1. Attendance calculations
  const studentAttendance = attendanceList.filter((a) => a.student_id === student.id);
  const totalDays = studentAttendance.length || 1;
  const presentDays = studentAttendance.filter((a) => a.status === 'present').length;
  const excusedAbsence = studentAttendance.filter((a) => a.status === 'excused').length;
  const unexcusedAbsence = studentAttendance.filter((a) => a.status === 'unexcused').length;
  const lateCount = studentAttendance.filter((a) => a.status === 'late').length;

  const attendanceRate = totalDays > 0 ? Math.round(((presentDays + lateCount * 0.5) / totalDays) * 100) : 100;

  // 2. Behavior calculations
  const studentBehaviors = behaviorList.filter((b) => b.student_id === student.id);
  let bonusPoints = 0;
  let penaltyPoints = 0;
  let positiveBehaviors = 0;
  let violationBehaviors = 0;

  studentBehaviors.forEach((b) => {
    if (b.type === 'positive') {
      positiveBehaviors++;
      bonusPoints += Math.abs(b.points);
    } else {
      violationBehaviors++;
      penaltyPoints += Math.abs(b.points);
    }
  });

  // 3. Merits
  const studentRewards = rewardList.filter((r) => r.student_id === student.id);
  const meritCount = studentRewards.length;
  // Merit gives extra bonus
  bonusPoints += meritCount * 5;

  // 4. Base Weekly Score calculation
  // Start from base 100, add bonus, minus penalty, minus late penalty if not in behaviors
  const rawScore = competitionSettings.base_weekly_points + bonusPoints - penaltyPoints - (unexcusedAbsence * 5) - (excusedAbsence * 1);
  const currentWeeklyScore = Math.max(0, Math.min(100, rawScore));

  // 5. Rating
  const th = competitionSettings.rating_thresholds;
  let rating: StudentStats['rating'] = 'Cần hỗ trợ';
  if (currentWeeklyScore >= th.excellent) {
    rating = 'Xuất sắc';
  } else if (currentWeeklyScore >= th.good) {
    rating = 'Tốt';
  } else if (currentWeeklyScore >= th.fair) {
    rating = 'Khá';
  } else if (currentWeeklyScore >= th.needs_effort) {
    rating = 'Cần cố gắng';
  }

  // 6. Alert Level detection
  let alertLevel: AlertLevel = 'normal';
  let alertReason = '';
  let progressTrend: StudentStats['progressTrend'] = 'stable';

  if (unexcusedAbsence >= 2 || violationBehaviors >= 3 || lateCount >= 3 || currentWeeklyScore < 60) {
    alertLevel = 'high_priority';
    if (unexcusedAbsence >= 2) alertReason = 'Vắng không phép từ 2 buổi trở lên';
    else if (violationBehaviors >= 3) alertReason = 'Vi phạm nề nếp lặp lại trong tuần';
    else if (lateCount >= 3) alertReason = 'Đi trễ từ 3 lần trở lên';
    else alertReason = 'Điểm thi đua giảm sâu, cần hỗ trợ kịp thời';
    progressTrend = 'declining';
  } else if (unexcusedAbsence === 1 || lateCount >= 2 || violationBehaviors >= 1 || currentWeeklyScore < 75) {
    alertLevel = 'need_monitoring';
    if (lateCount >= 2) alertReason = 'Có dấu hiệu đi trễ nhiều lần';
    else if (violationBehaviors >= 1) alertReason = 'Có vi phạm nề nếp cần nhắc nhở';
    else alertReason = 'Có xu hướng dao động điểm số';
    progressTrend = 'declining';
  } else if (meritCount > 0 || positiveBehaviors >= 2 || currentWeeklyScore >= 95) {
    alertLevel = 'positive_progress';
    alertReason = 'Có tiến bộ rõ rệt và thành tích nổi bật';
    progressTrend = 'improving';
  }

  // Sample weekly scores history (Week 1 to Week 4)
  const baseH = Math.min(100, Math.max(45, currentWeeklyScore - (bonusPoints - penaltyPoints)));
  const weeklyScoresHistory = [
    { week: 'Tuần 1', score: Math.min(100, Math.max(50, baseH - 4)) },
    { week: 'Tuần 2', score: Math.min(100, Math.max(50, baseH - 2)) },
    { week: 'Tuần 3', score: Math.min(100, Math.max(50, baseH + 1)) },
    { week: 'Tuần 4', score: currentWeeklyScore },
  ];

  return {
    student,
    attendanceRate,
    totalDays,
    presentDays,
    excusedAbsence,
    unexcusedAbsence,
    lateCount,
    positiveBehaviors,
    violationBehaviors,
    bonusPoints,
    penaltyPoints,
    meritCount,
    currentWeeklyScore,
    rating,
    rank: 1, // calculated in batch
    alertLevel,
    alertReason,
    progressTrend,
    weeklyScoresHistory,
  };
}

export function calculateClassStats(
  students: Student[],
  attendanceList: AttendanceRecord[],
  behaviorList: BehaviorRecord[],
  rewardList: MeritReward[],
  competitionSettings: CompetitionSettings
): {
  studentStatsList: StudentStats[];
  totalStudents: number;
  presentToday: number;
  excusedToday: number;
  unexcusedToday: number;
  lateToday: number;
  averageScore: number;
  totalMerits: number;
  highPriorityAlerts: StudentStats[];
  needMonitoringAlerts: StudentStats[];
  positiveProgressList: StudentStats[];
  topStudents: StudentStats[];
} {
  const statsList = students.map((s) =>
    calculateStudentStats(s, attendanceList, behaviorList, rewardList, competitionSettings)
  );

  // Sort descending by score to assign ranks
  statsList.sort((a, b) => b.currentWeeklyScore - a.currentWeeklyScore);
  statsList.forEach((s, idx) => {
    s.rank = idx + 1;
  });

  const totalStudents = students.length;
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendanceList.filter((a) => a.date === today);

  const presentToday = todayAttendance.filter((a) => a.status === 'present').length;
  const excusedToday = todayAttendance.filter((a) => a.status === 'excused').length;
  const unexcusedToday = todayAttendance.filter((a) => a.status === 'unexcused').length;
  const lateToday = todayAttendance.filter((a) => a.status === 'late').length;

  const totalScore = statsList.reduce((acc, curr) => acc + curr.currentWeeklyScore, 0);
  const averageScore = totalStudents > 0 ? Number((totalScore / totalStudents).toFixed(1)) : 0;

  const totalMerits = rewardList.length;

  const highPriorityAlerts = statsList.filter((s) => s.alertLevel === 'high_priority');
  const needMonitoringAlerts = statsList.filter((s) => s.alertLevel === 'need_monitoring');
  const positiveProgressList = statsList.filter((s) => s.alertLevel === 'positive_progress');

  const topStudents = statsList.slice(0, 5);

  return {
    studentStatsList: statsList,
    totalStudents,
    presentToday,
    excusedToday,
    unexcusedToday,
    lateToday,
    averageScore,
    totalMerits,
    highPriorityAlerts,
    needMonitoringAlerts,
    positiveProgressList,
    topStudents,
  };
}
