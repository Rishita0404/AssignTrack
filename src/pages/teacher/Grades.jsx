import { useState } from 'react';
import { Star, TrendingUp } from 'lucide-react';
import { useApp } from '../../lib/context.js';

export default function TeacherGrades() {
  const { currentUser, courses, assignments, submissions } = useApp();
  const [filterCourse, setFilterCourse] = useState('');
  const [filterAssignment, setFilterAssignment] = useState('');
  const myCourses = courses.filter(c => c.teacherId === currentUser.id);
  const myAssignments = assignments.filter(a => a.teacherId === currentUser.id);
  const gradedSubs = submissions.filter(s => s.status === 'graded' && myAssignments.find(a => a.id === s.assignmentId));
  const filteredAssignments = filterCourse ? myAssignments.filter(a => a.courseId === filterCourse) : myAssignments;
  const filtered = gradedSubs.filter(s => {
    if (filterCourse && s.courseId !== filterCourse) return false;
    if (filterAssignment && s.assignmentId !== filterAssignment) return false;
    return true;
  });
  const avgGrade = filtered.length > 0 ? Math.round(filtered.reduce((sum, s) => sum + (s.grade || 0), 0) / filtered.length) : null;
  const getLetterGrade = (grade) => {
    if (grade >= 90) return { letter: 'A', color: '#10b981' };
    if (grade >= 80) return { letter: 'B', color: '#3b82f6' };
    if (grade >= 70) return { letter: 'C', color: '#f59e0b' };
    if (grade >= 60) return { letter: 'D', color: '#f97316' };
    return { letter: 'F', color: '#ef4444' };
  };
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}><h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Grades Overview</h1><p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>View and manage all student grades</p></div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <select value={filterCourse} onChange={e => { setFilterCourse(e.target.value); setFilterAssignment(''); }} style={{ padding: '9px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', background: 'white', fontSize: '0.875rem', color: '#374151', outline: 'none', cursor: 'pointer' }}>
          <option value="">All Courses</option>
          {myCourses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={filterAssignment} onChange={e => setFilterAssignment(e.target.value)} style={{ padding: '9px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', background: 'white', fontSize: '0.875rem', color: '#374151', outline: 'none', cursor: 'pointer' }}>
          <option value="">All Assignments</option>
          {filteredAssignments.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
        </select>
        {(filterCourse || filterAssignment) && <button onClick={() => { setFilterCourse(''); setFilterAssignment(''); }} style={{ padding: '9px 14px', borderRadius: '10px', border: '1px solid #fecaca', background: '#fef2f2', color: '#ef4444', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Clear Filters</button>}
      </div>
      {filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '14px', padding: '1.25rem', color: 'white', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}><TrendingUp size={22} style={{ marginBottom: '8px', opacity: 0.9 }} /><div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{avgGrade}%</div><div style={{ fontSize: '0.8rem', opacity: 0.85 }}>Class Average</div></div>
          <div style={{ background: 'white', borderRadius: '14px', padding: '1.25rem', border: '1px solid #e5e7eb' }}><Star size={22} color="#f59e0b" style={{ marginBottom: '8px' }} /><div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b' }}>{filtered.length}</div><div style={{ fontSize: '0.8rem', color: '#64748b' }}>Graded Submissions</div></div>
          <div style={{ background: 'white', borderRadius: '14px', padding: '1.25rem', border: '1px solid #e5e7eb' }}><div style={{ fontSize: '1.8rem', fontWeight: 700, color: avgGrade ? getLetterGrade(avgGrade).color : '#94a3b8', marginBottom: '4px' }}>{avgGrade ? getLetterGrade(avgGrade).letter : '—'}</div><div style={{ fontSize: '0.8rem', color: '#64748b' }}>Average Letter Grade</div></div>
        </div>
      )}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb' }}><Star size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} /><h3 style={{ color: '#64748b', margin: 0 }}>No grades yet</h3><p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Grade student submissions to see results here</p></div>
      ) : (
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#f8fafc' }}>{['Student', 'Assignment', 'Course', 'Grade', 'Letter', 'Feedback', 'Graded On'].map(h => (<th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap' }}>{h}</th>))}</tr></thead>
              <tbody>
                {filtered.map((s, i) => {
                  const lg = getLetterGrade(s.grade || 0);
                  return (
                    <tr key={s.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                      <td style={{ padding: '14px 16px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.7rem', flexShrink: 0 }}>{s.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}</div><span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1e293b' }}>{s.studentName}</span></div></td>
                      <td style={{ padding: '14px 16px', fontSize: '0.875rem', color: '#374151', maxWidth: '140px' }}><div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.assignmentTitle}</div></td>
                      <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: '#64748b' }}>{s.courseName}</td>
                      <td style={{ padding: '14px 16px' }}><span style={{ fontSize: '1rem', fontWeight: 700, color: lg.color }}>{s.grade}%</span></td>
                      <td style={{ padding: '14px 16px' }}><span style={{ background: `${lg.color}15`, color: lg.color, borderRadius: '6px', padding: '3px 10px', fontSize: '0.8rem', fontWeight: 700 }}>{lg.letter}</span></td>
                      <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: '#64748b', maxWidth: '180px' }}>{s.feedback ? <span style={{ fontStyle: 'italic' }}>"{s.feedback.slice(0, 60)}{s.feedback.length > 60 ? '...' : ''}"</span> : '—'}</td>
                      <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>{s.gradedAt ? new Date(s.gradedAt).toLocaleDateString() : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
