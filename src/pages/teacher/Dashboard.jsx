import { useNavigate } from 'react-router-dom';
import { BookOpen, ClipboardList, FileCheck, Star, ChevronRight, TrendingUp } from 'lucide-react';
import { useApp } from '../../lib/context.js';
import StatCard from '../../components/StatCard.jsx';
import Badge from '../../components/Badge.jsx';

export default function TeacherDashboard() {
  const { currentUser, courses, assignments, submissions } = useApp();
  const navigate = useNavigate();
  const myCourses = courses.filter(c => c.teacherId === currentUser.id);
  const myAssignments = assignments.filter(a => a.teacherId === currentUser.id);
  const activeAssignments = myAssignments.filter(a => a.status === 'active');
  const allSubmissions = submissions.filter(s => myAssignments.find(a => a.id === s.assignmentId));
  const pendingSubs = allSubmissions.filter(s => s.status === 'submitted');
  const gradedSubs = allSubmissions.filter(s => s.status === 'graded');
  const gradingProgress = allSubmissions.length > 0 ? Math.round((gradedSubs.length / allSubmissions.length) * 100) : 0;

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #4f46e5 50%, #7c3aed 100%)', borderRadius: '16px', padding: '2rem', color: 'white', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(79,70,229,0.35)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', right: '120px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'relative' }}>
          <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 700 }}>Welcome, {currentUser?.name.split(' ').slice(0, 2).join(' ')}! 👩‍🏫</h1>
          <p style={{ margin: '8px 0 0', opacity: 0.85, fontSize: '0.95rem' }}>{pendingSubs.length > 0 ? `${pendingSubs.length} submission${pendingSubs.length > 1 ? 's' : ''} awaiting your review.` : 'All submissions have been reviewed. Great work!'}</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard label="Total Courses" value={myCourses.length} icon={<BookOpen size={22} />} color="#3b82f6" bgColor="#eff6ff" borderColor="#dbeafe" />
        <StatCard label="Active Assignments" value={activeAssignments.length} icon={<ClipboardList size={22} />} color="#8b5cf6" bgColor="#f5f3ff" borderColor="#e9d5ff" />
        <StatCard label="Pending Reviews" value={pendingSubs.length} icon={<FileCheck size={22} />} color="#f59e0b" bgColor="#fffbeb" borderColor="#fde68a" />
        <StatCard label="Graded" value={gradedSubs.length} icon={<Star size={22} />} color="#10b981" bgColor="#ecfdf5" borderColor="#d1fae5" />
      </div>
      <div style={{ background: 'white', borderRadius: '14px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}><TrendingUp size={18} color="#3b82f6" /> Grading Progress</h3>
            <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>{gradedSubs.length} of {allSubmissions.length} submissions graded</p>
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 700, color: '#3b82f6' }}>{gradingProgress}%</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {myCourses.slice(0, 3).map(course => {
            const courseAssignments = myAssignments.filter(a => a.courseId === course.id);
            const courseSubs = submissions.filter(s => courseAssignments.find(a => a.id === s.assignmentId));
            const courseGraded = courseSubs.filter(s => s.status === 'graded');
            const pct = courseSubs.length > 0 ? Math.round((courseGraded.length / courseSubs.length) * 100) : 0;
            return (
              <div key={course.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#374151' }}>{course.name}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>{pct}%</span>
                </div>
                <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', width: `${pct}%`, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ background: 'white', borderRadius: '14px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Recent Submissions</h3>
          <button onClick={() => navigate('/teacher/submissions')} style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>View all <ChevronRight size={14} /></button>
        </div>
        {allSubmissions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}><FileCheck size={32} style={{ marginBottom: '8px', color: '#cbd5e1' }} /><p style={{ margin: 0, fontSize: '0.9rem' }}>No submissions yet</p></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {allSubmissions.slice(0, 4).map(sub => (
              <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', background: '#fafafa', border: '1px solid #f1f5f9' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
                  {sub.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1e293b' }}>{sub.studentName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub.assignmentTitle}</div>
                </div>
                <Badge status={sub.status} />
                {sub.status === 'submitted' && (
                  <button onClick={() => navigate(`/teacher/submissions/${sub.id}`)} style={{ padding: '6px 12px', borderRadius: '8px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', color: 'white', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>Review</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
