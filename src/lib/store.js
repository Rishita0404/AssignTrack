import { useState, useCallback } from 'react';
import { INITIAL_USERS, INITIAL_COURSES, INITIAL_ASSIGNMENTS, INITIAL_SUBMISSIONS } from './data.js';

const USERS_KEY = 'assigntrack_users';
const CURRENT_USER_KEY = 'assigntrack_current_user';
const COURSES_KEY = 'assigntrack_courses';
const ASSIGNMENTS_KEY = 'assigntrack_assignments';
const SUBMISSIONS_KEY = 'assigntrack_submissions';

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function generateId() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export function useAppStore() {
  const [currentUser, setCurrentUser] = useState(() => loadFromStorage(CURRENT_USER_KEY, null));
  const [users, setUsers] = useState(() => loadFromStorage(USERS_KEY, INITIAL_USERS));
  const [courses, setCourses] = useState(() => loadFromStorage(COURSES_KEY, INITIAL_COURSES));
  const [assignments, setAssignments] = useState(() => loadFromStorage(ASSIGNMENTS_KEY, INITIAL_ASSIGNMENTS));
  const [submissions, setSubmissions] = useState(() => loadFromStorage(SUBMISSIONS_KEY, INITIAL_SUBMISSIONS));

  const login = useCallback((email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return { success: false, error: 'Invalid email or password.' };
    const { password: _, ...userWithoutPassword } = user;
    setCurrentUser(userWithoutPassword);
    saveToStorage(CURRENT_USER_KEY, userWithoutPassword);
    return { success: true };
  }, [users]);

  const register = useCallback((name, email, password, role) => {
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered.' };
    }
    const newUser = { id: generateId(), name, email, password, role };
    const updated = [...users, newUser];
    setUsers(updated);
    saveToStorage(USERS_KEY, updated);
    const { password: _, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword);
    saveToStorage(CURRENT_USER_KEY, userWithoutPassword);
    return { success: true };
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  }, []);

  const createCourse = useCallback((data) => {
    if (!currentUser) return;
    const newCourse = {
      ...data,
      id: generateId(),
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      enrolledStudents: [],
      createdAt: new Date().toISOString(),
    };
    const updated = [...courses, newCourse];
    setCourses(updated);
    saveToStorage(COURSES_KEY, updated);
  }, [currentUser, courses]);

  const createAssignment = useCallback((data) => {
    if (!currentUser) return;
    const newAssignment = {
      ...data,
      id: generateId(),
      teacherId: currentUser.id,
      totalSubmissions: 0,
      pendingReviews: 0,
      createdAt: new Date().toISOString(),
    };
    const updated = [...assignments, newAssignment];
    setAssignments(updated);
    saveToStorage(ASSIGNMENTS_KEY, updated);
  }, [currentUser, assignments]);

  const updateAssignment = useCallback((id, data) => {
    const updated = assignments.map(a => a.id === id ? { ...a, ...data } : a);
    setAssignments(updated);
    saveToStorage(ASSIGNMENTS_KEY, updated);
  }, [assignments]);

  const closeAssignment = useCallback((id) => {
    const updated = assignments.map(a => a.id === id ? { ...a, status: 'closed' } : a);
    setAssignments(updated);
    saveToStorage(ASSIGNMENTS_KEY, updated);
  }, [assignments]);

  const submitAssignment = useCallback((assignmentId, fileName, fileSize) => {
    if (!currentUser) return;
    const assignment = assignments.find(a => a.id === assignmentId);
    if (!assignment) return;
    const existing = submissions.find(s => s.assignmentId === assignmentId && s.studentId === currentUser.id);
    if (existing) return;
    const newSub = {
      id: generateId(),
      assignmentId,
      assignmentTitle: assignment.title,
      courseId: assignment.courseId,
      courseName: assignment.courseName,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      fileName,
      fileSize,
    };
    const updatedSubs = [...submissions, newSub];
    setSubmissions(updatedSubs);
    saveToStorage(SUBMISSIONS_KEY, updatedSubs);
    const updatedAssignments = assignments.map(a =>
      a.id === assignmentId
        ? { ...a, totalSubmissions: a.totalSubmissions + 1, pendingReviews: a.pendingReviews + 1 }
        : a
    );
    setAssignments(updatedAssignments);
    saveToStorage(ASSIGNMENTS_KEY, updatedAssignments);
  }, [currentUser, assignments, submissions]);

  const gradeSubmission = useCallback((submissionId, grade, feedback) => {
    const sub = submissions.find(s => s.id === submissionId);
    if (!sub) return;
    const updatedSubs = submissions.map(s =>
      s.id === submissionId
        ? { ...s, grade, feedback, status: 'graded', gradedAt: new Date().toISOString() }
        : s
    );
    setSubmissions(updatedSubs);
    saveToStorage(SUBMISSIONS_KEY, updatedSubs);
    const updatedAssignments = assignments.map(a =>
      a.id === sub.assignmentId
        ? { ...a, pendingReviews: Math.max(0, a.pendingReviews - 1) }
        : a
    );
    setAssignments(updatedAssignments);
    saveToStorage(ASSIGNMENTS_KEY, updatedAssignments);
  }, [submissions, assignments]);

  const enrollInCourse = useCallback((courseId) => {
    if (!currentUser) return;
    const updated = courses.map(c =>
      c.id === courseId && !c.enrolledStudents.includes(currentUser.id)
        ? { ...c, enrolledStudents: [...c.enrolledStudents, currentUser.id] }
        : c
    );
    setCourses(updated);
    saveToStorage(COURSES_KEY, updated);
  }, [currentUser, courses]);

  return { currentUser, users, courses, assignments, submissions, login, register, logout, createCourse, createAssignment, updateAssignment, closeAssignment, submitAssignment, gradeSubmission, enrollInCourse };
}
