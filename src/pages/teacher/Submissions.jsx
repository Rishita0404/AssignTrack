import { useNavigate, useSearchParams } from 'react-router-dom';
import { FileCheck, Download, Eye } from 'lucide-react';
import { useApp } from '../../lib/context.js';
import Badge from '../../components/Badge.jsx';

export default function TeacherSubmissions() {
  const { currentUser, assignments, submissions } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filterAssignment = searchParams.get('assignment');
  const myAssignments = assignments.filter(a => a.teacherId === currentUser.id);
  const mySubmissions = submissions.filter(s => myAssignments.find(a => a.id === s.assignmentId));
  const filtered = filterAssignment ? mySubmissions.filter(s => s.assignmentId === filterAssignment) : mySubmissions;
  const pendingCount = mySubmissions.filter(s => s.status === 'submitted').length;
  const gradedCount = mySubmissions.filter(s => s.status === 'graded').length;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Submissions</h1>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>Review and grade student submissions</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e5e7eb', textAlign: 'center' }}><div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#3b82f6' }}>{mySubmissions.length}</div><div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500, marginTop: '4px' }}>Total</div></div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', border: '1px solid #fde68a', textAlign: 'center' }}><div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f59e0b' }}>{pendingCount}</div><div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500, marginTop: '4px' }}>Pending Review</div></div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', border: '1px solid #d1fae5', textAlign: 'center' }}><div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#10b981' }}>{gradedCount}</div><div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500, marginTop: '4px' }}>Graded</div></div>
      </div>
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
          <FileCheck size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
          <h3 style={{ color: '#64748b', margin: 0 }}>No submissions yet</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Student submissions will appear here</p>
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#f8fafc' }}>{['Student', 'Assignment', 'Course', 'Submitted', 'File', 'Status', 'Actions'].map(h => (<th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap' }}>{h}</th>))}</tr></thead>
              <tbody>
                {filtered.map((sub, i) => (
                  <tr key={sub.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f8fafc' : 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>{sub.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                        <div><div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1e293b' }}>{sub.studentName}</div><div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{sub.studentEmail}</div></div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.875rem', fontWeight: 500, color: '#374151', maxWidth: '160px' }}><div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub.assignmentTitle}</div></td>
                    <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: '#64748b' }}>{sub.courseName}</td>
                    <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>{new Date(sub.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                    <td style={{ padding: '14px 16px' }}>{sub.fileName && (<div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ fontSize: '0.8rem', color: '#374151' }}>{sub.fileName}</span><button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', display: 'flex' }}><Download size={14} /></button></div>)}</td>
                    <td style={{ padding: '14px 16px' }}><Badge status={sub.status} /></td>
                    <td style={{ padding: '14px 16px' }}>
                      <button onClick={() => navigate(`/teacher/submissions/${sub.id}`)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', borderRadius: '8px', background: sub.status === 'submitted' ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'white', border: sub.status === 'submitted' ? 'none' : '1px solid #e5e7eb', color: sub.status === 'submitted' ? 'white' : '#64748b', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', boxShadow: sub.status === 'submitted' ? '0 2px 8px rgba(99,102,241,0.3)' : 'none', whiteSpace: 'nowrap' }}>
                        <Eye size={13} />{sub.status === 'submitted' ? 'Review' : 'View'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
