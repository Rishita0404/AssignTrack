import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppContext } from './lib/context.js';
import { useAppStore } from './lib/store.js';
import Layout from './components/Layout.jsx';
import Auth from './pages/Auth.jsx';

import StudentDashboard from './pages/student/Dashboard.jsx';
import StudentCourses from './pages/student/Courses.jsx';
import StudentAssignments from './pages/student/Assignments.jsx';
import AssignmentDetail from './pages/student/AssignmentDetail.jsx';
import StudentGrades from './pages/student/Grades.jsx';
import StudentSettings from './pages/student/Settings.jsx';

import TeacherDashboard from './pages/teacher/Dashboard.jsx';
import TeacherCourses from './pages/teacher/Courses.jsx';
import TeacherAssignments from './pages/teacher/Assignments.jsx';
import CreateAssignment from './pages/teacher/CreateAssignment.jsx';
import TeacherSubmissions from './pages/teacher/Submissions.jsx';
import ReviewSubmission from './pages/teacher/ReviewSubmission.jsx';
import TeacherGrades from './pages/teacher/Grades.jsx';
import TeacherSettings from './pages/teacher/Settings.jsx';

function ProtectedRoute({ children, role }) {
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('assigntrack_current_user') || 'null'); } catch { return null; }
  })();
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== role) return <Navigate to={user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'} replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const store = useAppStore();
  return (
    <AppContext.Provider value={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/student/*" element={
            <ProtectedRoute role="student">
              <Layout>
                <Routes>
                  <Route path="dashboard" element={<StudentDashboard />} />
                  <Route path="courses" element={<StudentCourses />} />
                  <Route path="assignments" element={<StudentAssignments />} />
                  <Route path="assignments/:id" element={<AssignmentDetail />} />
                  <Route path="grades" element={<StudentGrades />} />
                  <Route path="settings" element={<StudentSettings />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/teacher/*" element={
            <ProtectedRoute role="teacher">
              <Layout>
                <Routes>
                  <Route path="dashboard" element={<TeacherDashboard />} />
                  <Route path="courses" element={<TeacherCourses />} />
                  <Route path="assignments" element={<TeacherAssignments />} />
                  <Route path="assignments/create" element={<CreateAssignment />} />
                  <Route path="assignments/edit/:id" element={<CreateAssignment />} />
                  <Route path="submissions" element={<TeacherSubmissions />} />
                  <Route path="submissions/:id" element={<ReviewSubmission />} />
                  <Route path="grades" element={<TeacherGrades />} />
                  <Route path="settings" element={<TeacherSettings />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default AppRoutes;
