import React, { useState, useEffect } from 'react';
import { Student, SecretMission, PointType, Teacher } from './types';
import { INITIAL_STUDENTS, INITIAL_MISSIONS, INITIAL_TEACHERS, SCHOOL_INFO } from './data/mockData';
import { calculateBadge, calculatePercentage } from './utils/badges';
import { Navbar, MainViewType } from './components/Navbar';
import { StudentCard } from './components/StudentCard';
import { StudentProfileModal } from './components/StudentProfileModal';
import { IdCardModal } from './components/IdCardModal';
import { AddPointsModal } from './components/AddPointsModal';
import { QrScannerModal } from './components/QrScannerModal';
import { SecretMissionsView } from './components/SecretMissionsView';
import { BadgeGuideView } from './components/BadgeGuideView';
import { AddStudentModal } from './components/AddStudentModal';
import { AuthPortal } from './components/AuthPortal';
import { StudentPortalView } from './components/StudentPortalView';
import { LeaderboardView } from './components/LeaderboardView';
import { TeacherAttributionView } from './components/TeacherAttributionView';
import { AdminTeachersDashboard } from './components/AdminTeachersDashboard';
import { CertificateModal } from './components/CertificateModal';
import { EditStudentModal } from './components/EditStudentModal';
import {
  safeLocalStorageGet,
  safeLocalStorageSet,
  saveToIndexedDB,
  loadFromIndexedDB
} from './utils/storage';
import {
  subscribeToStudents,
  subscribeToTeachers,
  subscribeToMissions,
  saveStudentToCloud,
  syncAllStudentsToCloud,
  deleteStudentFromCloud,
  saveTeacherToCloud,
  syncAllTeachersToCloud,
  deleteTeacherFromCloud,
  saveMissionToCloud,
  syncAllMissionsToCloud,
  deleteMissionFromCloud
} from './services/firebase';
import {
  Search,
  Filter,
  Users,
  Award,
  AlertTriangle,
  Sparkles,
  Crown,
  TrendingUp,
  Cpu,
  GraduationCap,
  UserPlus
} from 'lucide-react';

const STORAGE_KEY_STUDENTS = 'we_school_students_v2';
const STORAGE_KEY_MISSIONS = 'we_school_missions_v2';
const STORAGE_KEY_AUTH = 'we_school_auth_v1';
const STORAGE_KEY_TEACHERS = 'we_school_teachers_v3';

// Helper to ensure any old references to "بهاء وجيه" or outdated admin state migrate dynamically
const cleanTeacherData = (list: Teacher[]): Teacher[] => {
  return list.map((t) => {
    let avatar = t.avatar || '';
    if (avatar.includes('photo-1472099645785-5658abf4ff4e') || avatar.includes('unsplash.com')) {
      avatar = '';
    }
    if (t.id === 't-admin' || t.name.includes('بهاء وجيه') || t.name.includes('بهاء')) {
      return {
        ...t,
        id: 't-admin',
        name: t.name && !t.name.includes('بهاء') ? t.name : 'م. أبانوب وجيه (مدير المنظومة)',
        username: t.username || 'admin',
        role: 'admin',
        title: t.title || 'مهندس',
        avatar,
        subject: t.subject || 'الإدارة العامة والإشراف التكنولوجي',
        majorDepartment: t.majorDepartment || 'إدارة مدرسة WE للتكنولوجيا التطبيقية',
        phone: t.phone || '',
        email: t.email || '',
        status: 'active'
      };
    }
    return {
      ...t,
      avatar
    };
  });
};

// Filter out old static/mock missions
const cleanMissionData = (list: SecretMission[]): SecretMission[] => {
  return (list || []).filter((m) => m.id !== 'mission-001' && m.id !== 'mission-002');
};

export default function App() {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = safeLocalStorageGet<Student[]>(STORAGE_KEY_STUDENTS, INITIAL_STUDENTS);
    return saved && saved.length > 0 ? saved : INITIAL_STUDENTS;
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = safeLocalStorageGet<Teacher[]>(STORAGE_KEY_TEACHERS, INITIAL_TEACHERS);
    return cleanTeacherData(saved && saved.length > 0 ? saved : INITIAL_TEACHERS);
  });

  const [missions, setMissions] = useState<SecretMission[]>(() => {
    const saved = safeLocalStorageGet<SecretMission[]>(STORAGE_KEY_MISSIONS, []);
    return cleanMissionData(saved || []);
  });

  // Auth State: 'portal' | 'teacher' | 'student'
  // Anyone opening the app begins strictly at the Auth Portal to enter username/password or National ID
  const [authRole, setAuthRole] = useState<'portal' | 'teacher' | 'student'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.role && parsed.role !== 'portal') {
          if (parsed.role === 'teacher' && parsed.teacher) return 'teacher';
          if (parsed.role === 'student' && parsed.studentId) return 'student';
        }
      }
    } catch {}
    return 'portal';
  });

  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.role === 'teacher' && parsed.teacher) {
          if (parsed.teacher.name?.includes('بهاء') || parsed.teacher.id === 't-admin') {
            return {
              ...parsed.teacher,
              id: 't-admin',
              name: 'م. أبانوب وجيه (مدير المنظومة)',
              role: 'admin',
              title: 'مدير المنظومة والأدمن العام'
            };
          }
          return parsed.teacher;
        }
      }
    } catch {}
    return null;
  });

  const [currentStudentId, setCurrentStudentId] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.studentId) return parsed.studentId;
      }
    } catch {}
    return null;
  });

  const [activeView, setActiveView] = useState<MainViewType>('students');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [majorFilter, setMajorFilter] = useState<string>('all');
  const [badgeFilter, setBadgeFilter] = useState<string>('all');

  // Modal States
  const [profileStudent, setProfileStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [idCardStudent, setIdCardStudent] = useState<Student | null>(null);
  const [certificateStudent, setCertificateStudent] = useState<Student | null>(null);
  const [addPointsState, setAddPointsState] = useState<{
    student: Student;
    defaultType?: PointType;
  } | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState<boolean>(false);

  // Sync to localStorage + IndexedDB (Dual-Layer Resilience)
  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEY_STUDENTS, students);
    saveToIndexedDB('students', students).catch(console.error);
  }, [students]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEY_TEACHERS, teachers);
    saveToIndexedDB('teachers', teachers).catch(console.error);
  }, [teachers]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEY_MISSIONS, missions);
    saveToIndexedDB('missions', missions).catch(console.error);
  }, [missions]);

  // Real-time Central Cloud Sync (Firebase Firestore)
  useEffect(() => {
    let initialSyncCompleted = false;

    // 1. Subscribe to Students
    const unsubscribeStudents = subscribeToStudents(
      (cloudStudents) => {
        if (cloudStudents.length > 0) {
          setStudents(cloudStudents);
        } else if (!initialSyncCompleted && students.length > 0) {
          // If cloud is brand new but this machine has students, sync them up to the cloud!
          syncAllStudentsToCloud(students).catch(console.error);
        }
        initialSyncCompleted = true;
      },
      (err) => console.warn('Firestore students sync error:', err)
    );

    // 2. Subscribe to Teachers
    const unsubscribeTeachers = subscribeToTeachers(
      (cloudTeachers) => {
        if (cloudTeachers.length > 0) {
          const cleaned = cleanTeacherData(cloudTeachers);
          setTeachers(cleaned);
        }
      },
      (err) => console.warn('Firestore teachers sync error:', err)
    );

    // 3. Subscribe to Secret Missions
    const unsubscribeMissions = subscribeToMissions(
      (cloudMissions) => {
        const cleaned = cleanMissionData(cloudMissions);
        setMissions(cleaned);
        // Delete legacy demo missions if present in Firestore
        cloudMissions.forEach((m) => {
          if (m.id === 'mission-001' || m.id === 'mission-002') {
            deleteMissionFromCloud(m.id).catch(console.error);
          }
        });
      },
      (err) => console.warn('Firestore missions sync error:', err)
    );

    return () => {
      unsubscribeStudents();
      unsubscribeTeachers();
      unsubscribeMissions();
    };
  }, []);

  // Fallback recovery check from IndexedDB on startup if localStorage was empty
  useEffect(() => {
    async function restoreFromIdbFallback() {
      try {
        const idbStudents = await loadFromIndexedDB<Student[]>('students');
        if (idbStudents && idbStudents.length > 0 && students.length === 0) {
          setStudents(idbStudents);
        }
        const idbTeachers = await loadFromIndexedDB<Teacher[]>('teachers');
        if (idbTeachers && idbTeachers.length > 0 && teachers.length === 0) {
          setTeachers(cleanTeacherData(idbTeachers));
        }
        const idbMissions = await loadFromIndexedDB<SecretMission[]>('missions');
        if (idbMissions && idbMissions.length > 0 && missions.length === 0) {
          setMissions(cleanMissionData(idbMissions));
        }
      } catch (err) {
        console.error('IDB restore check:', err);
      }
    }
    restoreFromIdbFallback();
  }, []);

  // Ensure current active teacher profile stays in sync with teachers list
  useEffect(() => {
    if (currentTeacher) {
      const liveTeacher = teachers.find((t) => t.id === currentTeacher.id);
      if (liveTeacher && liveTeacher.name !== currentTeacher.name) {
        setCurrentTeacher(liveTeacher);
      }
    }
  }, [teachers, currentTeacher]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_AUTH,
        JSON.stringify({
          role: authRole,
          teacher: currentTeacher,
          studentId: currentStudentId
        })
      );
    } catch (e) {
      console.error(e);
    }
  }, [authRole, currentTeacher, currentStudentId]);

  // Check URL on load for direct student profile link (from QR scan)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const studentParam = params.get('student');
    if (studentParam) {
      const target = students.find(
        (s) => s.id === studentParam || s.code === studentParam || s.nationalId === studentParam
      );
      if (target) {
        if (authRole === 'student') {
          setCurrentStudentId(target.id);
        } else {
          setProfileStudent(target);
        }
      }
    }
  }, [students, authRole]);

  // Currently authenticated student
  const loggedInStudent = currentStudentId
    ? students.find((s) => s.id === currentStudentId) || students[0]
    : null;

  // Keep open modals in sync with updated student object
  const currentProfileStudent = profileStudent
    ? students.find((s) => s.id === profileStudent.id) || profileStudent
    : null;

  const currentIdCardStudent = idCardStudent
    ? students.find((s) => s.id === idCardStudent.id) || idCardStudent
    : null;

  const currentAddPointsStudent = addPointsState?.student
    ? students.find((s) => s.id === addPointsState.student.id) || addPointsState.student
    : null;

  // Login & Logout Handlers
  const handleTeacherLogin = (teacher: Teacher) => {
    setCurrentTeacher(teacher);
    setAuthRole('teacher');
    // Always land on the students page upon login, regardless of previous state
    setActiveView('students');
  };

  const handleStudentLogin = (student: Student) => {
    setCurrentStudentId(student.id);
    setAuthRole('student');
    setActiveView('students');
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    } catch {}
    setAuthRole('portal');
    setCurrentTeacher(null);
    setCurrentStudentId(null);
    setActiveView('students');
  };

  // Enforce strict Role-Based Access Control: Non-admins can NEVER view the admin dashboard
  useEffect(() => {
    if (authRole === 'teacher' && currentTeacher?.role !== 'admin' && activeView === 'admin') {
      setActiveView('students');
    }
  }, [authRole, currentTeacher?.role, activeView]);

  const handleViewChange = (view: MainViewType) => {
    // Only administrators can access the admin tab
    if (view === 'admin' && currentTeacher?.role !== 'admin') {
      setActiveView('students');
      return;
    }
    setActiveView(view);
  };

  // Add Points / Infraction Handler
  const handleAddPoint = (
    studentId: string,
    type: PointType,
    category: string,
    deltaPoints: number,
    note: string,
    teacherName: string
  ) => {
    const finalTeacherName = teacherName || currentTeacher?.name || 'معلم المادة التكنولوجية';
    let targetUpdatedStudent: Student | null = null;

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;

        const newPoints = Math.max(0, s.points + deltaPoints);
        const newTotalPos = type === 'positive' ? s.totalPositive + deltaPoints : s.totalPositive;
        const newTotalNeg = type === 'negative' ? s.totalNegative + Math.abs(deltaPoints) : s.totalNegative;
        const newPercentage = calculatePercentage(newPoints, s.targetPoints);
        const newBadge = calculateBadge(newPercentage);

        const newLog = {
          id: `log-${Date.now()}`,
          studentId: s.id,
          type,
          category,
          points: deltaPoints,
          note,
          teacherName: finalTeacherName,
          createdAt: new Date().toISOString()
        };

        const todayLabel = new Date().toLocaleDateString('ar-EG', {
          month: 'numeric',
          day: 'numeric'
        });

        const newHistoryPoint = {
          date: todayLabel,
          points: newPoints,
          percentage: newPercentage,
          behavioral:
            type === 'positive'
              ? Math.min(100, s.behavioralScore + 2)
              : Math.max(40, s.behavioralScore - 4),
          academic: s.academicScore,
          label: category.slice(0, 14)
        };

        const updatedStudent: Student = {
          ...s,
          points: newPoints,
          totalPositive: newTotalPos,
          totalNegative: newTotalNeg,
          percentage: newPercentage,
          badge: newBadge,
          behavioralScore: newHistoryPoint.behavioral,
          performanceHistory: [...s.performanceHistory, newHistoryPoint],
          logs: [newLog, ...s.logs]
        };

        targetUpdatedStudent = updatedStudent;
        return updatedStudent;
      })
    );

    if (targetUpdatedStudent) {
      saveStudentToCloud(targetUpdatedStudent).catch(console.error);
    }
  };

  // QR Scan Success Handler
  const handleScanSuccess = (studentId: string) => {
    const found = students.find(
      (s) =>
        s.id.toLowerCase() === studentId.toLowerCase() ||
        s.code === studentId ||
        s.nationalId === studentId
    );
    if (found) {
      setProfileStudent(found);
    } else {
      alert(`لم يتم العثور على طالب بالكود أو المعرف: ${studentId}`);
    }
  };

  // Secret Missions Handlers
  const handleAddMission = (newMission: SecretMission) => {
    setMissions((prev) => [newMission, ...prev]);
    saveMissionToCloud(newMission).catch(console.error);
  };

  const handleGradeSubmission = (
    missionId: string,
    studentId: string,
    status: 'approved' | 'rejected',
    feedback: string,
    awardedPoints: number
  ) => {
    let targetUpdatedMission: SecretMission | null = null;

    setMissions((prev) =>
      prev.map((m) => {
        if (m.id !== missionId) return m;
        const updated = {
          ...m,
          submissions: m.submissions.map((sub) => {
            if (sub.studentId !== studentId) return sub;
            return {
              ...sub,
              status,
              teacherFeedback: feedback,
              awardedPoints
            };
          })
        };
        targetUpdatedMission = updated;
        return updated;
      })
    );

    if (targetUpdatedMission) {
      saveMissionToCloud(targetUpdatedMission).catch(console.error);
    }

    if (status === 'approved') {
      handleAddPoint(
        studentId,
        'positive',
        'إنجاز سيكريت ميشن بامتياز',
        awardedPoints,
        `اعتماد تسليم المهمة السرية: ${missions.find((m) => m.id === missionId)?.title || ''}`,
        currentTeacher?.name || 'لجنة التقييم المدرسي'
      );

      setStudents((prev) =>
        prev.map((s) => {
          if (s.id === studentId) {
            const up = { ...s, secretMissionsCompleted: s.secretMissionsCompleted + 1 };
            saveStudentToCloud(up).catch(console.error);
            return up;
          }
          return s;
        })
      );
    }
  };

  const handleSimulateStudentQuiz = (
    missionId: string,
    studentId: string,
    score: number,
    answerText: string
  ) => {
    const student = students.find((s) => s.id === studentId);
    const mission = missions.find((m) => m.id === missionId);
    if (!student || !mission) return;

    let targetUpdatedMission: SecretMission | null = null;

    setMissions((prev) =>
      prev.map((m) => {
        if (m.id !== missionId) return m;
        const exists = m.submissions.some((sub) => sub.studentId === studentId);
        const newSub = {
          studentId: student.id,
          studentName: student.name,
          submittedAt: new Date().toISOString(),
          answerText,
          quizScore: score,
          status: 'approved' as const,
          teacherFeedback: 'إنجاز فوري ممتاز معتمد من المعلم!',
          awardedPoints: mission.pointsReward
        };

        const updated = {
          ...m,
          submissions: exists
            ? m.submissions.map((sub) => (sub.studentId === studentId ? newSub : sub))
            : [newSub, ...m.submissions]
        };
        targetUpdatedMission = updated;
        return updated;
      })
    );

    if (targetUpdatedMission) {
      saveMissionToCloud(targetUpdatedMission).catch(console.error);
    }

    // Directly award points to student
    handleAddPoint(
      studentId,
      'positive',
      'إنجاز سيكريت ميشن بامتياز',
      mission.pointsReward,
      `حل واجتياز المهمة: ${mission.title}`,
      currentTeacher?.name || 'معلم المادة التكنولوجية'
    );

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const up = { ...s, secretMissionsCompleted: s.secretMissionsCompleted + 1 };
          saveStudentToCloud(up).catch(console.error);
          return up;
        }
        return s;
      })
    );
  };

  // Student Management Handlers
  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    if (profileStudent?.id === updatedStudent.id) {
      setProfileStudent(updatedStudent);
    }
    if (idCardStudent?.id === updatedStudent.id) {
      setIdCardStudent(updatedStudent);
    }
    saveStudentToCloud(updatedStudent).catch(console.error);
    setEditingStudent(null);
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    if (profileStudent?.id === studentId) {
      setProfileStudent(null);
    }
    if (idCardStudent?.id === studentId) {
      setIdCardStudent(null);
    }
    deleteStudentFromCloud(studentId).catch(console.error);
    setEditingStudent(null);
  };

  // Teacher Management Handlers (Admin)
  const handleAddTeacher = (newTeacher: Teacher) => {
    setTeachers((prev) => [newTeacher, ...prev]);
    saveTeacherToCloud(newTeacher).catch(console.error);
  };

  const handleUpdateTeacher = (updatedTeacher: Teacher) => {
    const oldTeacher = teachers.find((t) => t.id === updatedTeacher.id);
    const oldName = oldTeacher?.name;

    setTeachers((prev) =>
      prev.map((t) => (t.id === updatedTeacher.id ? updatedTeacher : t))
    );
    saveTeacherToCloud(updatedTeacher).catch(console.error);

    if (currentTeacher?.id === updatedTeacher.id) {
      setCurrentTeacher(updatedTeacher);
      safeLocalStorageSet('we_school_current_teacher', updatedTeacher);
    }

    // Dynamic global propagation: update attribution logs and missions
    if (oldName && oldName !== updatedTeacher.name) {
      setStudents((prev) =>
        prev.map((student) => {
          const up = {
            ...student,
            logs: student.logs.map((log) =>
              log.teacherName === oldName
                ? { ...log, teacherName: updatedTeacher.name }
                : log
            )
          };
          saveStudentToCloud(up).catch(console.error);
          return up;
        })
      );

      setMissions((prev) =>
        prev.map((mission) => {
          const up = {
            ...mission,
            createdBy:
              mission.createdBy === oldName ? updatedTeacher.name : mission.createdBy
          };
          saveMissionToCloud(up).catch(console.error);
          return up;
        })
      );
    }
  };

  const handleDeleteTeacher = (teacherId: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== teacherId));
    deleteTeacherFromCloud(teacherId).catch(console.error);
  };

  const handleDeleteMission = (missionId: string) => {
    setMissions((prev) => prev.filter((m) => m.id !== missionId));
    deleteMissionFromCloud(missionId).catch(console.error);
  };

  const handleImpersonateTeacher = (teacher: Teacher) => {
    setCurrentTeacher(teacher);
    setActiveView('students');
  };

  const handleRestoreFullDatabase = (data: {
    students: Student[];
    teachers: Teacher[];
    missions: SecretMission[];
  }) => {
    if (data.students && Array.isArray(data.students)) {
      setStudents(data.students);
      syncAllStudentsToCloud(data.students).catch(console.error);
    }
    if (data.teachers && Array.isArray(data.teachers)) {
      const cleaned = cleanTeacherData(data.teachers);
      setTeachers(cleaned);
      syncAllTeachersToCloud(cleaned).catch(console.error);
      if (currentTeacher) {
        const matching = cleaned.find((t) => t.id === currentTeacher.id);
        if (matching) setCurrentTeacher(matching);
      }
    }
    if (data.missions && Array.isArray(data.missions)) {
      setMissions(data.missions);
      syncAllMissionsToCloud(data.missions).catch(console.error);
    }
  };

  const handleSeedSampleStudents = () => {
    setStudents(INITIAL_STUDENTS);
    syncAllStudentsToCloud(INITIAL_STUDENTS).catch(console.error);
  };

  // Filtered Students in Teacher Dashboard
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.includes(searchQuery) ||
      s.code.includes(searchQuery) ||
      s.nationalId.includes(searchQuery) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.major.includes(searchQuery);

    const matchesGrade = gradeFilter === 'all' || s.grade === gradeFilter;
    const matchesMajor = majorFilter === 'all' || s.major === majorFilter;
    const matchesBadge = badgeFilter === 'all' || s.badge === badgeFilter;

    return matchesSearch && matchesGrade && matchesMajor && matchesBadge;
  });

  // Analytics Stats
  const totalStudents = students.length;
  const averagePercentage = Math.round(
    students.reduce((acc, s) => acc + s.percentage, 0) / (totalStudents || 1)
  );
  const leadersCount = students.filter((s) => s.badge === 'leader').length;
  const needAttentionCount = students.filter(
    (s) => s.percentage < 30 || s.totalNegative >= 10
  ).length;

  // 1. CONDITIONAL VIEW: AUTH PORTAL (TEACHER OR STUDENT LOGIN)
  if (authRole === 'portal') {
    return (
      <AuthPortal
        students={students}
        teachers={teachers}
        onTeacherLogin={handleTeacherLogin}
        onStudentLogin={handleStudentLogin}
      />
    );
  }

  // 2. CONDITIONAL VIEW: STUDENT PORTAL (VIEWING THEIR PROFILE VIA NATIONAL ID)
  if (authRole === 'student' && loggedInStudent) {
    return (
      <StudentPortalView
        student={loggedInStudent}
        missions={missions}
        onLogout={handleLogout}
        onSubmitQuiz={handleSimulateStudentQuiz}
      />
    );
  }

  // 3. DEFAULT VIEW: TEACHER DASHBOARD
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 w-full overflow-x-hidden" dir="rtl">
      {/* Top Navbar with QR Scanner & Teacher Profile */}
      <Navbar
        activeView={activeView}
        onViewChange={handleViewChange}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenAddStudent={() => setIsAddStudentOpen(true)}
        missionsCount={missions.length}
        currentTeacher={currentTeacher}
        onLogout={handleLogout}
        onSwitchToStudentPortal={() => {
          handleLogout();
        }}
      />

      <main className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-5 sm:pt-6">
        {/* VIEW 1: STUDENTS DASHBOARD */}
        {activeView === 'students' && (
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-500">إجمالي طلاب المدرسة</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{totalStudents} طالب</div>
                  <div className="text-[11px] text-purple-700 font-semibold mt-0.5">
                    {SCHOOL_INFO.majors.length} تخصصات تكنولوجية
                  </div>
                </div>
                <div className="p-3 bg-purple-50 text-purple-700 rounded-2xl">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-500">متوسط إنجاز النقاط</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{averagePercentage}%</div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>معدل عام إيجابي</span>
                  </div>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl">
                  <Award className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-500">رتبة القائد التكنولوجي (90%+)</div>
                  <div className="text-2xl font-black text-amber-600 mt-1">{leadersCount} طلاب</div>
                  <div className="text-[11px] text-amber-700 font-semibold mt-0.5">
                    مستحقو دروع التميز السلوكي
                  </div>
                </div>
                <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl">
                  <Crown className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-500">حالات متابعة سلوكية</div>
                  <div className="text-2xl font-black text-rose-600 mt-1">{needAttentionCount} طلاب</div>
                  <div className="text-[11px] text-rose-700 font-semibold mt-0.5">
                    يحتاجون خطة تحفيز وتوجيه
                  </div>
                </div>
                <div className="p-3 bg-rose-50 text-rose-700 rounded-2xl">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Quick Banner for Teachers */}
            <div className="bg-linear-to-r from-purple-900 via-indigo-900 to-purple-950 text-white p-5 sm:p-6 rounded-3xl shadow-md border border-purple-400/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
                  <Sparkles className="w-6 h-6 text-cyan-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-white">
                      مرحباً {currentTeacher?.name} ({currentTeacher?.subject})
                    </h3>
                  </div>
                  <p className="text-xs text-purple-200 mt-0.5 leading-relaxed">
                    انقر على زر "مسح QR" لفحص كارنيه أي طالب فوراً، رصد النقاط والمخالفات، أو إنشاء
                    تحديات وسيكريت ميشن جديدة لطلابك.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsScannerOpen(true)}
                  className="px-5 py-2.5 bg-white text-purple-950 hover:bg-purple-50 text-xs font-black rounded-xl shadow-md transition-all hover:scale-105 active:scale-95"
                >
                  فتح كاميرا الفحص الآن
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                {/* Search */}
                <div className="sm:col-span-4 relative">
                  <input
                    type="text"
                    placeholder="ابحث بالاسم، الرقم القومي (307...)، الكود (10401)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 text-xs border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-slate-50/50"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                </div>

                {/* Grade Filter */}
                <div className="sm:col-span-3">
                  <select
                    value={gradeFilter}
                    onChange={(e) => setGradeFilter(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    <option value="all">كافة الصفوف الدراسية</option>
                    {SCHOOL_INFO.grades.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Major Filter */}
                <div className="sm:col-span-3">
                  <select
                    value={majorFilter}
                    onChange={(e) => setMajorFilter(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    <option value="all">كافة التخصصات التكنولوجية</option>
                    {SCHOOL_INFO.majors.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Badge Filter */}
                <div className="sm:col-span-2">
                  <select
                    value={badgeFilter}
                    onChange={(e) => setBadgeFilter(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    <option value="all">كافة الرتب والبادجات</option>
                    <option value="leader">👑 قائد تكنولوجي (90%+)</option>
                    <option value="pro">💎 محترف تقني (80-89%)</option>
                    <option value="advanced">🥇 متقدم (60-79%)</option>
                    <option value="good">🥈 جيد ومجتهد (30-59%)</option>
                    <option value="novice">🥉 مبتدئ (0-29%)</option>
                  </select>
                </div>
              </div>

              {/* Active Filter Chips */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>
                  عرض <strong>{filteredStudents.length}</strong> من أصل {students.length} طالب
                </span>
                {(searchQuery || gradeFilter !== 'all' || majorFilter !== 'all' || badgeFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setGradeFilter('all');
                      setMajorFilter('all');
                      setBadgeFilter('all');
                    }}
                    className="text-purple-700 hover:text-purple-900 font-bold"
                  >
                    إعادة ضبط الفلاتر
                  </button>
                )}
              </div>
            </div>

            {/* Students Grid */}
            {students.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-purple-200 shadow-xs">
                <div className="w-16 h-16 bg-purple-50 text-purple-700 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-purple-100">
                  <UserPlus className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-slate-900">قائمة الطلاب فارغة تماماً</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                  تمت إزالة كافة البيانات الوهمية بنجاح! يمكنك الآن البدء بإضافة طلابك الحقيقيين يدوياً، اختيار فصولهم (A1-A6، B1-B6، C1-C6)، وتخصصاتهم ورفع صورهم من جهازك.
                </p>
                <div className="mt-5">
                  <button
                    onClick={() => setIsAddStudentOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A154B] hover:bg-[#3B0764] text-white text-xs font-black rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>إضافة أول طالب وتوليد الـ ID الآن</span>
                  </button>
                </div>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-extrabold text-slate-800">لا يوجد طلاب يطابقون خيارات البحث</h3>
                <p className="text-xs text-slate-500 mt-1">
                  جرب تغيير كلمات البحث أو إعادة ضبط خيارات التصفية
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredStudents.map((student) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    onOpenProfile={(s) => setProfileStudent(s)}
                    onOpenIdCard={(s) => setIdCardStudent(s)}
                    onEditStudent={(s) => setEditingStudent(s)}
                    onOpenAddPoints={(s, type) =>
                      setAddPointsState({ student: s, defaultType: type })
                    }
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: LEADERBOARD & HONOR ROLL */}
        {activeView === 'leaderboard' && (
          <LeaderboardView
            students={students}
            onSelectStudent={(s) => setProfileStudent(s)}
          />
        )}

        {/* VIEW 3: TEACHER ATTRIBUTION & POINT AUDIT */}
        {activeView === 'attribution' && (
          <TeacherAttributionView
            students={students}
            teachers={teachers}
            onSelectStudent={(s) => setProfileStudent(s)}
            onOpenStudentProfile={(s) => setProfileStudent(s)}
            onOpenCertificate={(s) => setCertificateStudent(s)}
          />
        )}

        {/* VIEW 4: SECRET MISSIONS HUB */}
        {activeView === 'missions' && (
          <SecretMissionsView
            missions={missions}
            students={students}
            onAddMission={handleAddMission}
            onDeleteMission={handleDeleteMission}
            onGradeSubmission={handleGradeSubmission}
            onSimulateStudentQuiz={handleSimulateStudentQuiz}
          />
        )}

        {/* VIEW 5: BADGES GUIDE */}
        {activeView === 'badges' && <BadgeGuideView />}

        {/* VIEW 6: ADMIN TEACHERS DASHBOARD (STRICT ADMIN ACCESS ONLY) */}
        {activeView === 'admin' && currentTeacher?.role === 'admin' && (
          <AdminTeachersDashboard
            teachers={teachers}
            students={students}
            missions={missions}
            currentTeacher={currentTeacher}
            onAddTeacher={handleAddTeacher}
            onUpdateTeacher={handleUpdateTeacher}
            onDeleteTeacher={handleDeleteTeacher}
            onImpersonateTeacher={handleImpersonateTeacher}
            onRestoreFullDatabase={handleRestoreFullDatabase}
            onSeedSampleStudents={handleSeedSampleStudents}
          />
        )}
        {activeView === 'admin' && currentTeacher?.role !== 'admin' && (
          <div className="text-center py-16 bg-white rounded-3xl border border-rose-200 p-8 shadow-xs max-w-md mx-auto my-8">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 text-2xl font-black">
              🔒
            </div>
            <h3 className="text-base font-black text-slate-900 mb-2">
              منطقة محمية - خاصة بالإدارة العليا
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              عذراً، إدارة وتعديل حسابات المعلمين مقصورة حصراً على حساب مدير المنظومة (Super Admin).
            </p>
            <button
              onClick={() => setActiveView('students')}
              className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              العودة لقائمة الطلاب
            </button>
          </div>
        )}
      </main>

      {/* MODALS */}
      {currentProfileStudent && (
        <StudentProfileModal
          student={currentProfileStudent}
          isOpen={!!profileStudent}
          onClose={() => setProfileStudent(null)}
          missions={missions}
          onOpenAddPoints={(s, type) => setAddPointsState({ student: s, defaultType: type })}
          onOpenIdCard={(s) => setIdCardStudent(s)}
          onOpenCertificate={(s) => setCertificateStudent(s)}
          onEditStudent={(s) => setEditingStudent(s)}
        />
      )}

      {/* Edit Student Modal */}
      <EditStudentModal
        student={editingStudent}
        isOpen={!!editingStudent}
        onClose={() => setEditingStudent(null)}
        onSaveStudent={handleUpdateStudent}
        onDeleteStudent={handleDeleteStudent}
      />

      {/* Certificate Modal for Student Recognition */}
      <CertificateModal
        student={certificateStudent}
        isOpen={!!certificateStudent}
        onClose={() => setCertificateStudent(null)}
      />

      {currentIdCardStudent && (
        <IdCardModal
          student={currentIdCardStudent}
          isOpen={!!idCardStudent}
          onClose={() => setIdCardStudent(null)}
          onSimulateScan={(id) => {
            setIdCardStudent(null);
            handleScanSuccess(id);
          }}
        />
      )}

      {currentAddPointsStudent && (
        <AddPointsModal
          student={currentAddPointsStudent}
          isOpen={!!addPointsState}
          onClose={() => setAddPointsState(null)}
          onAddPoint={handleAddPoint}
        />
      )}

      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        students={students}
        onScanSuccess={handleScanSuccess}
      />

      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        existingCount={students.length}
        onAddStudent={(newStudent) => {
          setStudents((prev) => [newStudent, ...prev]);
          setProfileStudent(newStudent);
          saveStudentToCloud(newStudent).catch(console.error);
        }}
      />
    </div>
  );
}
