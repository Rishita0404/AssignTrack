import { useNavigate } from 'react-router-dom';
import { Star, TrendingUp, Award, BookOpen } from 'lucide-react';
import { useApp } from '../../lib/context.js';

export default function StudentGrades() {
  const { currentUser, submissions } = useApp();
  const navigate = useNavigate();
  const myGraded = submissions.filter(s => s.studentId === currentUser.id && s.status === 'graded');
  const avgGrade = myGraded.length > 0 ? Math.round(myGraded.reduce((sum, s) => sum + (s.grade || 0), 0) / myGraded.length) : null;
  const getLetterGrade = (grade) => {
    if (grade >= 90) return { letter: 'A', color: '#10b981' };
    if (grade >= 80) return { letter: 'B', color: '#3b82f6' };
    if (grade >= 70) return { letter: 'C', color: '#f59e0b' };
    if (grade >= 60) return { letter: 'D', color: '#f97316' };
    return { letter: 'F', color: '#ef4444' };
  };
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Grades</h1>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>Your academic performance overview</p>
      </div>
      {myGraded.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #f5f3ff, #eff6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}><Star size={36} color="#8b5cf6" /></div>
          <h3 style={{ margin: '0 0 8px', color: '#374151', fontSize: '1.2rem' }}>No grades yet</h3>
          <p style={{ margin: '0 0 1.5rem', color: '#94a3b8', fontSize: '0.9rem', maxWidth: '320px', marginLeft: 'auto', marginRight: 'auto' }}>Submit your assignments and your teacher will review and grade them.</p>
          <button onClick={() => navigate('/student/assignments')} style={{ padding: '10px 24px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>View Assignments</button>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '14px', padding: '1.5rem', color: 'white', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}>
              <TrendingUp size={24} style={{ marginBottom: '10px', opacity: 0.9 }} />
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>{avgGrade}%</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: '4px' }}>Average Grade</div>
            </div>
            <div style={{ background: 'white', borderRadius: '14px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <Award size={24} color="#f59e0b" style={{ marginBottom: '10px' }} />
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1e293b' }}>{myGraded.length}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>Graded Assignments</div>
            </div>
            <div style={{ background: 'white', borderRadius: '14px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <BookOpen size={24} color="#10b981" style={{ marginBottom: '10px' }} />
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1e293b' }}>{avgGrade ? getLetterGrade(avgGrade).letter : '—'}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>Letter Grade</div>
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}><h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Grade Details</h3></div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#f8fafc' }}>{['Assignment', 'Course', 'Submitted', 'Grade', 'Feedback'].map(h => (<th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9' }}>{h}</th>))}</tr></thead>
                <tbody>
                  {myGraded.map((s, i) => {
                    const lg = getLetterGrade(s.grade || 0);
                    return (
                      <tr key={s.id} style={{ borderBottom: i < myGraded.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                        <td style={{ padding: '14px 16px', fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>{s.assignmentTitle}</td>
                        <td style={{ padding: '14px 16px', fontSize: '0.875rem', color: '#64748b' }}>{s.courseName}</td>
                        <td style={{ padding: '14px 16px', fontSize: '0.875rem', color: '#64748b' }}>{new Date(s.submittedAt).toLocaleDateString()}</td>
                        <td style={{ padding: '14px 16px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '1.1rem', fontWeight: 700, color: lg.color }}>{s.grade}%</span><span style={{ background: `${lg.color}15`, color: lg.color, borderRadius: '6px', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 700 }}>{lg.letter}</span></div></td>
                        <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: '#64748b', maxWidth: '200px' }}>{s.feedback ? <span style={{ fontStyle: 'italic' }}>"{s.feedback.slice(0, 80)}{s.feedback.length > 80 ? '...' : ''}"</span> : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
