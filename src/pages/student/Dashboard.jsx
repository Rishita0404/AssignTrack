import { useNavigate } from 'react-router-dom';
import { ClipboardList, CheckCircle, Clock, TrendingUp, ChevronRight, BookOpen } from 'lucide-react';
import { useApp } from '../../lib/context.js';
import StatCard from '../../components/StatCard.jsx';

function timeLeft(dueDate) {
  const diff = new Date(dueDate).getTime() - Date.now();
  if (diff < 0) return 'Overdue';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}d ${hours}h left`;
  return `${hours}h left`;
}

export default function StudentDashboard() {
  const { currentUser, courses, assignments, submissions } = useApp();
  const navigate = useNavigate();

  const myCourses = courses.filter(c => c.enrolledStudents.includes(currentUser.id));
  const myCourseIds = myCourses.map(c => c.id);
  const myAssignments = assignments.filter(a => myCourseIds.includes(a.courseId) && a.status === 'active');
  const mySubmissions = submissions.filter(s => s.studentId === currentUser.id);
  const submittedIds = mySubmissions.map(s => s.assignmentId);
  const pending = myAssignments.filter(a => !submittedIds.includes(a.id));
  const submitted = mySubmissions.filter(s => s.status === 'submitted' || s.status === 'graded');
  const graded = mySubmissions.filter(s => s.status === 'graded');
  const avgGrade = graded.length > 0 ? Math.round(graded.reduce((sum, s) => sum + (s.grade || 0), 0) / graded.length) : null;
  const completionPct = myAssignments.length > 0 ? Math.round((submitted.length / (myAssignments.length + mySubmissions.filter(s => assignments.find(a => a.id === s.assignmentId)?.status === 'closed').length)) * 100) : 0;
  const recentGrades = mySubmissions.filter(s => s.status === 'graded').slice(0, 3);

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)', borderRadius: '16px', padding: '2rem', color: 'white', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(99,102,241,0.3)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', right: '80px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'relative' }}>
          <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 700 }}>Welcome back, {currentUser?.name.split(' ')[0]}! 👋</h1>
          <p style={{ margin: '8px 0 0', opacity: 0.85, fontSize: '0.95rem' }}>
            {pending.length > 0 ? `You have ${pending.length} pending assignment${pending.length > 1 ? 's' : ''} to complete.` : 'Great job! All assignments are submitted.'}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard label="Total Assignments" value={myAssignments.length} icon={<ClipboardList size={22} />} color="#3b82f6" bgColor="#eff6ff" borderColor="#dbeafe" />
        <StatCard label="Submitted" value={submitted.length} icon={<CheckCircle size={22} />} color="#10b981" bgColor="#ecfdf5" borderColor="#d1fae5" />
        <StatCard label="Pending" value={pending.length} icon={<Clock size={22} />} color="#f59e0b" bgColor="#fffbeb" borderColor="#fde68a" />
        <StatCard label="Average Grade" value={avgGrade ? `${avgGrade}%` : 'N/A'} icon={<TrendingUp size={22} />} color="#8b5cf6" bgColor="#f5f3ff" borderColor="#e9d5ff" />
      </div>

      <div style={{ background: 'white', borderRadius: '14px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Assignment Completion</h3>
            <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>{submitted.length} of {myAssignments.length} active assignments submitted</p>
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 700, color: '#3b82f6' }}>{completionPct}%</span>
        </div>
        <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', width: `${completionPct}%`, transition: 'width 0.5s ease' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ background: 'white', borderRadius: '14px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Pending Assignments</h3>
            <button onClick={() => navigate('/student/assignments')} style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>View all <ChevronRight size={14} /></button>
          </div>
          {pending.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
              <CheckCircle size={32} style={{ marginBottom: '8px', color: '#10b981' }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>All caught up!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pending.slice(0, 3).map(a => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: '10px', background: '#fafafa', border: '1px solid #f1f5f9' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{a.courseName}</div>
                    <div style={{ fontSize: '0.75rem', color: new Date(a.dueDate) < new Date() ? '#ef4444' : '#f59e0b', marginTop: '2px', fontWeight: 500 }}>{timeLeft(a.dueDate)}</div>
                  </div>
                  <button onClick={() => navigate(`/student/assignments/${a.id}`)} style={{ padding: '6px 12px', borderRadius: '8px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', color: 'white', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', flexShrink: 0, marginLeft: '10px' }}>Submit</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: 'white', borderRadius: '14px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Recent Grades</h3>
            <button onClick={() => navigate('/student/grades')} style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>View all <ChevronRight size={14} /></button>
          </div>
          {recentGrades.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
              <BookOpen size={32} style={{ marginBottom: '8px', color: '#cbd5e1' }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>No grades yet</p>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem' }}>Grades will appear here after review</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentGrades.map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: '10px', background: '#fafafa', border: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1e293b' }}>{s.assignmentTitle}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{s.courseName}</div>
                  </div>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: (s.grade || 0) >= 90 ? 'linear-gradient(135deg, #10b981, #059669)' : (s.grade || 0) >= 70 ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>
                    {s.grade}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
