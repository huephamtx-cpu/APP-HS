/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ClassroomProvider, useClassroom } from './context/ClassroomContext';
import { Header } from './components/Header';
import { Navigation, TabKey } from './components/Navigation';
import { StudentProfileModal } from './components/StudentProfileModal';
import { QuickBehaviorModal } from './components/QuickBehaviorModal';
import { ExcelImportModal } from './components/ExcelImportModal';
import { CertificateModal } from './components/CertificateModal';
import { RandomStudentModal } from './components/RandomStudentModal';

// Views
import { DashboardView } from './views/DashboardView';
import { StudentsView } from './views/StudentsView';
import { AttendanceView } from './views/AttendanceView';
import { BehaviorView } from './views/BehaviorView';
import { RewardsView } from './views/RewardsView';
import { ProgressView } from './views/ProgressView';
import { ParentsView } from './views/ParentsView';
import { AIAssistantView } from './views/AIAssistantView';
import { JournalView } from './views/JournalView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';
import { Student, BehaviorType } from './types';

const MainAppContent: React.FC = () => {
  const { data, isLoading } = useClassroom();
  const [currentTab, setCurrentTab] = useState<TabKey>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);
  const [profileInitialTab, setProfileInitialTab] = useState<'overview' | 'history' | 'ai_eval' | 'edit'>('overview');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  const [quickBehaviorStudent, setQuickBehaviorStudent] = useState<Student | null>(null);
  const [quickBehaviorType, setQuickBehaviorType] = useState<BehaviorType>('positive');
  const [isQuickBehaviorOpen, setIsQuickBehaviorOpen] = useState<boolean>(false);

  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [isRandomPickerOpen, setIsRandomPickerOpen] = useState<boolean>(false);

  const [parentContactStudent, setParentContactStudent] = useState<Student | null>(null);

  const [certificateData, setCertificateData] = useState<{
    isOpen: boolean;
    student: Student | null;
    title: string;
    reason: string;
    date: string;
  }>({
    isOpen: false,
    student: null,
    title: '',
    reason: '',
    date: '',
  });

  // Modal Handlers
  const handleOpenStudentProfile = (
    student: Student,
    initialTab: 'overview' | 'history' | 'ai_eval' | 'edit' = 'overview'
  ) => {
    setSelectedStudentForProfile(student);
    setProfileInitialTab(initialTab);
    setIsProfileModalOpen(true);
  };

  const handleOpenQuickBehavior = (student?: Student, type: BehaviorType = 'positive') => {
    setQuickBehaviorStudent(student || null);
    setQuickBehaviorType(type);
    setIsQuickBehaviorOpen(true);
  };

  const handleOpenParentContact = (student: Student) => {
    setParentContactStudent(student);
    setCurrentTab('parents');
  };

  const handleOpenCertificate = (student: Student, title: string, reason: string, date: string) => {
    setCertificateData({
      isOpen: true,
      student,
      title,
      reason,
      date,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center max-w-sm w-full space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto text-2xl animate-bounce">
            🎓
          </div>
          <h2 className="text-base font-extrabold text-slate-900">CLASS 9/7 MANAGER</h2>
          <p className="text-xs text-slate-500">Đang khởi động hệ thống quản lý lớp của Cô Hue Pham...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Application Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenImport={() => setIsImportModalOpen(true)}
        onOpenAIAssistant={() => setCurrentTab('ai_assistant')}
        onOpenRandomPicker={() => setIsRandomPickerOpen(true)}
      />

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />

        {/* Dynamic Main View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-5xl">
          {currentTab === 'dashboard' && (
            <DashboardView
              onNavigate={setCurrentTab}
              onSelectStudent={handleOpenStudentProfile}
              onOpenQuickBehavior={handleOpenQuickBehavior}
              onOpenQuickReward={() => setCurrentTab('rewards')}
              onOpenRandomPicker={() => setIsRandomPickerOpen(true)}
            />
          )}

          {currentTab === 'students' && (
            <StudentsView
              onSelectStudent={handleOpenStudentProfile}
              onEditStudent={(s) => handleOpenStudentProfile(s, 'edit')}
              onOpenImportModal={() => setIsImportModalOpen(true)}
              onOpenQuickBehavior={(s) => handleOpenQuickBehavior(s, 'positive')}
              onOpenRandomPicker={() => setIsRandomPickerOpen(true)}
              initialSearch={searchQuery}
            />
          )}

          {currentTab === 'attendance' && (
            <AttendanceView onSelectStudent={handleOpenStudentProfile} />
          )}

          {currentTab === 'behavior' && (
            <BehaviorView
              onOpenQuickBehavior={handleOpenQuickBehavior}
              onSelectStudent={handleOpenStudentProfile}
            />
          )}

          {currentTab === 'rewards' && (
            <RewardsView
              onSelectStudent={handleOpenStudentProfile}
              onOpenCertificate={handleOpenCertificate}
            />
          )}

          {currentTab === 'progress' && (
            <ProgressView
              onSelectStudent={handleOpenStudentProfile}
              onOpenParentContact={handleOpenParentContact}
            />
          )}

          {currentTab === 'parents' && (
            <ParentsView
              onSelectStudent={handleOpenStudentProfile}
              preSelectedStudent={parentContactStudent}
            />
          )}

          {currentTab === 'ai_assistant' && <AIAssistantView />}

          {currentTab === 'journal' && <JournalView />}

          {currentTab === 'reports' && <ReportsView />}

          {currentTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Modals */}
      {/* 1. Student Profile Modal */}
      <StudentProfileModal
        student={selectedStudentForProfile}
        isOpen={isProfileModalOpen}
        initialTab={profileInitialTab}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedStudentForProfile(null);
        }}
        onOpenQuickBehavior={(student) => {
          handleOpenQuickBehavior(student, 'positive');
        }}
        onOpenParentContact={(student) => {
          handleOpenParentContact(student);
        }}
      />

      {/* 2. Quick Behavior Modal */}
      <QuickBehaviorModal
        isOpen={isQuickBehaviorOpen}
        onClose={() => setIsQuickBehaviorOpen(false)}
        preSelectedStudent={quickBehaviorStudent}
        defaultType={quickBehaviorType}
      />

      {/* 3. Excel Import Modal */}
      <ExcelImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      {/* 4. Certificate Modal */}
      {certificateData.student && (
        <CertificateModal
          isOpen={certificateData.isOpen}
          onClose={() =>
            setCertificateData({
              isOpen: false,
              student: null,
              title: '',
              reason: '',
              date: '',
            })
          }
          student={certificateData.student}
          title={certificateData.title}
          reason={certificateData.reason}
          date={certificateData.date}
          teacherName={data.settings.class.teacher_name}
          className={data.settings.class.class_name}
          schoolName={data.settings.class.school_name}
          schoolYear={data.settings.class.school_year}
        />
      )}

      {/* 5. Random Student Picker Modal */}
      <RandomStudentModal
        isOpen={isRandomPickerOpen}
        onClose={() => setIsRandomPickerOpen(false)}
        onSelectStudentProfile={(s) => handleOpenStudentProfile(s, 'overview')}
        onOpenQuickBehavior={(s, type) => handleOpenQuickBehavior(s, type)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ClassroomProvider>
      <MainAppContent />
    </ClassroomProvider>
  );
}
