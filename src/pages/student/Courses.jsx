import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, ClipboardList, AlertCircle, Plus } from 'lucide-react';
import { useApp } from '../../lib/context.js';

const colorMap = {
  blue: { bg: 'linear-gradient(135deg, #3b82f6, #6366f1)', border: '#dbeafe', accent: '#eff6ff' },
  purple: { bg: 'linear-gradient(135deg, #8b5cf6, #a855f7)', border: '#e9d5ff', accent: '#f5f3ff' },
  green: { bg: 'linear-gradient(135deg, #10b981, #059669)', border: '#d1fae5', accent: '#ecfdf5' },
  orange: { bg: 'linear-gradient(135deg, #f59e0b, #f97316)', border: '#fde68a', accent: '#fffbeb' },
  red: { bg: 'linear-gradient(135deg, #ef4444, #dc2626)', border: '#fecaca', accent: '#fef2f2' },
};

export default function StudentCourses() {
  const { currentUser, courses, assignments, submissions, enrollInCourse } = useApp();
  const navigate = useNavigate();
  const myCourses = courses.filter(c => c.enrolledStudents.includes(currentUser.id));
  const availableCourses = courses.filter(c => !c.enrolledStudents.includes(currentUser.id));

  const getCourseStats = (courseId) => {
    const active = assignments.filter(a => a.courseId === courseId && a.status === 'active');
    const mySubmissions = submissions.filter(s => s.studentId === currentUser.id && s.courseId === courseId);
    const pending = active.filter(a => !mySubmissions.find(s => s.assignmentId === a.id));
    return { active: active.length, pending: pending.length };
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>My Courses</h1>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>Courses you are currently enrolled in</p>
      </div>
      {myCourses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
          <BookOpen size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
          <h3 style={{ color: '#64748b', margin: 0 }}>No courses yet</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Enroll in a course below to get started</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          {myCourses.map(course => {
            const colors = colorMap[course.color] || colorMap.blue;
            const stats = getCourseStats(course.id);
            return (
              <div key={course.id} style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; }}>
                <div style={{ height: '6px', background: colors.bg }} />
                <div style={{ padding: '1.25rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', background: colors.accent, padding: '2px 8px', borderRadius: '20px', border: `1px solid ${colors.border}` }}>{course.code}</span>
                  <h3 style={{ margin: '8px 0 4px', fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>{course.name}</h3>
                  <p style={{ margin: '0 0 12px', fontSize: '0.8rem', color: '#64748b' }}>by {course.teacherName}</p>
                  <p style={{ margin: '0 0 16px', fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>{course.description}</p>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748b' }}><ClipboardList size={14} color="#3b82f6" /><span>{stats.active} active</span></div>
                    {stats.pending > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#ef4444', fontWeight: 600 }}><AlertCircle size={14} /><span>{stats.pending} pending</span></div>}
                  </div>
                  <button onClick={() => navigate('/student/assignments')} style={{ width: '100%', padding: '9px', background: colors.bg, border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>Enter Course</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {availableCourses.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={18} color="#3b82f6" /> Available Courses</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {availableCourses.map(course => {
              const colors = colorMap[course.color] || colorMap.blue;
              return (
                <div key={course.id} style={{ background: 'white', borderRadius: '16px', border: '1px dashed #d1d5db', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', opacity: 0.85 }}>
                  <div style={{ height: '6px', background: colors.bg, opacity: 0.5 }} />
                  <div style={{ padding: '1.25rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{course.code}</span>
                    <h3 style={{ margin: '8px 0 4px', fontSize: '1rem', fontWeight: 700, color: '#374151' }}>{course.name}</h3>
                    <p style={{ margin: '0 0 4px', fontSize: '0.8rem', color: '#94a3b8' }}>by {course.teacherName}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '16px' }}><Users size={14} /> {course.enrolledStudents.length} enrolled</div>
                    <button onClick={() => enrollInCourse(course.id)} style={{ width: '100%', padding: '9px', background: 'white', border: '2px solid #3b82f6', borderRadius: '10px', color: '#3b82f6', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>Enroll Now</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
