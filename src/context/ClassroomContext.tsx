import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Student,
  AttendanceRecord,
  BehaviorRecord,
  MeritReward,
  ParentContactRecord,
  JournalEntry,
  ClassSettings,
  CompetitionSettings,
  ClassDataStore,
  UserSession,
  AttendanceStatus,
} from '../types';
import {
  DEMO_45_STUDENTS,
  DEFAULT_CLASS_SETTINGS,
  DEFAULT_COMPETITION_SETTINGS,
  INITIAL_BEHAVIORS,
  INITIAL_REWARDS,
  INITIAL_PARENT_CONTACTS,
  INITIAL_JOURNAL,
  generateInitialAttendance,
  getTodayDateString,
} from '../data/demoStudents';
import { calculateClassStats } from '../utils/scoring';

const STORAGE_KEY = 'class_9_7_manager_hue_pham_v1';

const DEFAULT_USER: UserSession = {
  user_id: 'gv-huepham',
  username: 'huephamtx',
  name: 'Cô Hue Pham',
  role: 'teacher_head',
  title: 'Giáo viên Chủ nhiệm Lớp 9/7',
};

interface ClassroomContextType {
  data: ClassDataStore;
  currentUser: UserSession;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  isLoading: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  // Computed stats
  classStats: ReturnType<typeof calculateClassStats>;
  // Actions
  loadDemoData: () => void;
  clearAllData: () => void;
  importStudents: (students: Student[]) => { success: boolean; message: string };
  markAllPresent: (date?: string) => void;
  updateAttendance: (studentId: string, status: AttendanceStatus, note?: string, date?: string) => void;
  addBehaviorRecord: (record: Omit<BehaviorRecord, 'id'>) => void;
  deleteBehaviorRecord: (id: string) => void;
  addReward: (reward: Omit<MeritReward, 'id'>) => void;
  deleteReward: (id: string) => void;
  addParentContact: (contact: Omit<ParentContactRecord, 'id'>) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  updateStudent: (student: Student) => void;
  updateClassSettings: (settings: Partial<ClassSettings>) => void;
  updateCompetitionSettings: (settings: Partial<CompetitionSettings>) => void;
  exportBackupJson: () => void;
  importBackupJson: (jsonStr: string) => boolean;
  saveDataNow: () => Promise<boolean>;
  // Security confirmation
  confirmAction: (message: string, onConfirm: () => void) => void;
}

const ClassroomContext = createContext<ClassroomContextType | undefined>(undefined);

export const ClassroomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [currentUser] = useState<UserSession>(DEFAULT_USER);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Confirmation Modal state helper
  const [confirmation, setConfirmation] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    message: '',
    onConfirm: () => {},
  });

  const confirmAction = useCallback((message: string, onConfirm: () => void) => {
    setConfirmation({
      isOpen: true,
      message,
      onConfirm,
    });
  }, []);

  const [data, setData] = useState<ClassDataStore>(() => {
    // Check localStorage first
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.settings?.class?.school_name === 'THCS Lê Quý Đôn') {
          parsed.settings.class.school_name = 'THCS Tân Xuân';
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch (e) {
      console.error('Error reading localStorage:', e);
    }
    // Default to initial loaded demo so teacher immediately experiences full features
    return {
      is_demo_mode: true,
      students: DEMO_45_STUDENTS,
      attendance: generateInitialAttendance(getTodayDateString()),
      behaviors: INITIAL_BEHAVIORS,
      rewards: INITIAL_REWARDS,
      parent_contacts: INITIAL_PARENT_CONTACTS,
      journal: INITIAL_JOURNAL,
      settings: {
        class: DEFAULT_CLASS_SETTINGS,
        competition: DEFAULT_COMPETITION_SETTINGS,
      },
    };
  });

  // Sync to server and localStorage on change
  const persistData = useCallback(async (updated: ClassDataStore) => {
    setData(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('localStorage save warning:', err);
    }

    setSaveStatus('saving');
    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Server sync error:', err);
      setSaveStatus('error');
    }
  }, []);

  const saveDataNow = useCallback(async (): Promise<boolean> => {
    setSaveStatus('saving');
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 3000);
        return true;
      }
      setSaveStatus('error');
      return false;
    } catch (err) {
      console.error('Manual save error:', err);
      setSaveStatus('error');
      return false;
    }
  }, [data]);

  // Initial load from server if available
  useEffect(() => {
    let isMounted = true;
    const fetchServerData = async () => {
      try {
        const res = await fetch('/api/data');
        const resJson = await res.json();
        if (isMounted && resJson.success && resJson.data && resJson.data.students?.length > 0) {
          if (resJson.data?.settings?.class?.school_name === 'THCS Lê Quý Đôn') {
            resJson.data.settings.class.school_name = 'THCS Tân Xuân';
          }
          setData(resJson.data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(resJson.data));
        }
      } catch (err) {
        console.warn('Could not load remote DB, using local cache:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchServerData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Computed class stats
  const classStats = useMemo(() => {
    return calculateClassStats(
      data.students,
      data.attendance,
      data.behaviors,
      data.rewards,
      data.settings.competition
    );
  }, [data]);

  // Actions
  const loadDemoData = useCallback(() => {
    const today = getTodayDateString();
    const demoData: ClassDataStore = {
      is_demo_mode: true,
      students: DEMO_45_STUDENTS,
      attendance: generateInitialAttendance(today),
      behaviors: INITIAL_BEHAVIORS,
      rewards: INITIAL_REWARDS,
      parent_contacts: INITIAL_PARENT_CONTACTS,
      journal: INITIAL_JOURNAL,
      settings: {
        class: DEFAULT_CLASS_SETTINGS,
        competition: DEFAULT_COMPETITION_SETTINGS,
      },
    };
    persistData(demoData);
  }, [persistData]);

  const clearAllData = useCallback(() => {
    confirmAction('Bạn có chắc chắn muốn xóa toàn bộ dữ liệu hiện tại để bắt đầu mới?', () => {
      const emptyData: ClassDataStore = {
        is_demo_mode: false,
        students: [],
        attendance: [],
        behaviors: [],
        rewards: [],
        parent_contacts: [],
        journal: [],
        settings: {
          class: DEFAULT_CLASS_SETTINGS,
          competition: DEFAULT_COMPETITION_SETTINGS,
        },
      };
      persistData(emptyData);
    });
  }, [confirmAction, persistData]);

  const importStudents = useCallback(
    (newStudents: Student[]) => {
      const count = newStudents.length;
      const updated: ClassDataStore = {
        ...data,
        is_demo_mode: false,
        students: newStudents,
      };
      persistData(updated);
      return {
        success: true,
        message:
          count === 45
            ? 'Đã nhập thành công 45/45 học sinh theo đúng quy chuẩn lớp 9/7!'
            : `Đã nhập danh sách ${count} học sinh (Lưu ý: Sĩ số chuẩn lớp 9/7 là 45 học sinh).`,
      };
    },
    [data, persistData]
  );

  // Quick Attendance: 1 click ALL PRESENT
  const markAllPresent = useCallback(
    (date = selectedDate) => {
      const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      // Filter out existing attendance for this date
      const otherAttendance = data.attendance.filter((a) => a.date !== date);
      const allPresentRecords: AttendanceRecord[] = data.students.map((s) => ({
        id: `att-${date}-${s.id}`,
        student_id: s.id,
        date,
        status: 'present',
        note: '',
        recorded_at: `${date} ${now}`,
      }));

      persistData({
        ...data,
        attendance: [...otherAttendance, ...allPresentRecords],
      });
    },
    [data, selectedDate, persistData]
  );

  const updateAttendance = useCallback(
    (studentId: string, status: AttendanceStatus, note = '', date = selectedDate) => {
      const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      const filtered = data.attendance.filter((a) => !(a.student_id === studentId && a.date === date));
      const newRecord: AttendanceRecord = {
        id: `att-${date}-${studentId}`,
        student_id: studentId,
        date,
        status,
        note,
        recorded_at: `${date} ${now}`,
      };

      persistData({
        ...data,
        attendance: [...filtered, newRecord],
      });
    },
    [data, selectedDate, persistData]
  );

  const addBehaviorRecord = useCallback(
    (record: Omit<BehaviorRecord, 'id'>) => {
      const newRecord: BehaviorRecord = {
        ...record,
        id: `bh-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      };
      persistData({
        ...data,
        behaviors: [newRecord, ...data.behaviors],
      });
    },
    [data, persistData]
  );

  const deleteBehaviorRecord = useCallback(
    (id: string) => {
      confirmAction('Bạn có chắc chắn muốn xóa bản ghi nề nếp này?', () => {
        persistData({
          ...data,
          behaviors: data.behaviors.filter((b) => b.id !== id),
        });
      });
    },
    [confirmAction, data, persistData]
  );

  const addReward = useCallback(
    (reward: Omit<MeritReward, 'id'>) => {
      const newReward: MeritReward = {
        ...reward,
        id: `rw-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      };
      persistData({
        ...data,
        rewards: [newReward, ...data.rewards],
      });
    },
    [data, persistData]
  );

  const deleteReward = useCallback(
    (id: string) => {
      confirmAction('Bạn có chắc chắn muốn xóa bản ghi khen thưởng này?', () => {
        persistData({
          ...data,
          rewards: data.rewards.filter((r) => r.id !== id),
        });
      });
    },
    [confirmAction, data, persistData]
  );

  const addParentContact = useCallback(
    (contact: Omit<ParentContactRecord, 'id'>) => {
      const newContact: ParentContactRecord = {
        ...contact,
        id: `pc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      };
      persistData({
        ...data,
        parent_contacts: [newContact, ...data.parent_contacts],
      });
    },
    [data, persistData]
  );

  const addJournalEntry = useCallback(
    (entry: Omit<JournalEntry, 'id'>) => {
      const newEntry: JournalEntry = {
        ...entry,
        id: `jn-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      };
      persistData({
        ...data,
        journal: [newEntry, ...data.journal],
      });
    },
    [data, persistData]
  );

  const updateStudent = useCallback(
    (updatedStudent: Student) => {
      persistData({
        ...data,
        students: data.students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)),
      });
    },
    [data, persistData]
  );

  const updateClassSettings = useCallback(
    (settings: Partial<ClassSettings>) => {
      persistData({
        ...data,
        settings: {
          ...data.settings,
          class: { ...data.settings.class, ...settings },
        },
      });
    },
    [data, persistData]
  );

  const updateCompetitionSettings = useCallback(
    (settings: Partial<CompetitionSettings>) => {
      persistData({
        ...data,
        settings: {
          ...data.settings,
          competition: { ...data.settings.competition, ...settings },
        },
      });
    },
    [data, persistData]
  );

  const exportBackupJson = useCallback(() => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Backup_Lop9_7_CoHuePham_${getTodayDateString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const importBackupJson = useCallback(
    (jsonStr: string): boolean => {
      try {
        const parsed = JSON.parse(jsonStr);
        if (parsed.students && parsed.settings) {
          persistData(parsed);
          return true;
        }
        return false;
      } catch (err) {
        console.error('Failed to import JSON backup:', err);
        return false;
      }
    },
    [persistData]
  );

  return (
    <ClassroomContext.Provider
      value={{
        data,
        currentUser,
        selectedDate,
        setSelectedDate,
        isLoading,
        saveStatus,
        classStats,
        loadDemoData,
        clearAllData,
        importStudents,
        markAllPresent,
        updateAttendance,
        addBehaviorRecord,
        deleteBehaviorRecord,
        addReward,
        deleteReward,
        addParentContact,
        addJournalEntry,
        updateStudent,
        updateClassSettings,
        updateCompetitionSettings,
        exportBackupJson,
        importBackupJson,
        saveDataNow,
        confirmAction,
      }}
    >
      {children}

      {/* Global Confirmation Dialog (Security requirement: "Bạn có chắc chắn muốn xóa dữ liệu này?") */}
      {confirmation.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center space-x-3 text-amber-600 mb-3">
              <span className="p-2 rounded-xl bg-amber-50">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </span>
              <h3 className="text-lg font-bold text-slate-900">Xác nhận thao tác</h3>
            </div>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              {confirmation.message}
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setConfirmation({ isOpen: false, message: '', onConfirm: () => {} })}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmation.onConfirm();
                  setConfirmation({ isOpen: false, message: '', onConfirm: () => {} });
                }}
                className="px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Đồng ý thực hiện
              </button>
            </div>
          </div>
        </div>
      )}
    </ClassroomContext.Provider>
  );
};

export const useClassroom = () => {
  const ctx = useContext(ClassroomContext);
  if (!ctx) {
    throw new Error('useClassroom must be used within ClassroomProvider');
  }
  return ctx;
};
