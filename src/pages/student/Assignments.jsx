import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Clock, CheckCircle, Filter } from 'lucide-react';
import { useApp } from '../../lib/context.js';
import Badge from '../../components/Badge.jsx';

function timeLeft(dueDate) {
  const diff = new Date(dueDate).getTime() - Date.now();
  if (diff < 0) return { text: 'Overdue', urgent: true };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return { text: `${days}d ${hours}h left`, urgent: days <= 1 };
  return { text: `${hours}h left`, urgent: true };
}

export default function StudentAssignments() {
  const { currentUser, courses, assignments, submissions } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const myCourseIds = courses.filter(c => c.enrolledStudents.includes(currentUser.id)).map(c => c.id);
  const myAssignments = assignments.filter(a => myCourseIds.includes(a.courseId));
  const mySubmissions = submissions.filter(s => s.studentId === currentUser.id);
  const submittedIds = mySubmissions.map(s => s.assignmentId);
  const pending = myAssignments.filter(a => !submittedIds.includes(a.id) && a.status === 'active');
  const submitted = myAssignments.filter(a => submittedIds.includes(a.id));
  const filtered = filter === 'pending' ? pending : filter === 'submitted' ? submitted : myAssignments;
  const getSubmission = (assignmentId) => mySubmissions.find(s => s.assignmentId === assignmentId);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Assignments</h1>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>All your course assignments in one place</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#3b82f6' }}>{myAssignments.length}</div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500, marginTop: '4px' }}>Total</div>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', border: '1px solid #fde68a', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f59e0b' }}>{pending.length}</div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500, marginTop: '4px' }}>Pending</div>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', border: '1px solid #d1fae5', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#10b981' }}>{submitted.length}</div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500, marginTop: '4px' }}>Submitted</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
        <Filter size={16} color="#94a3b8" style={{ alignSelf: 'center' }} />
        {['all', 'pending', 'submitted'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '7px 16px', borderRadius: '20px', background: filter === f ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'white', color: filter === f ? 'white' : '#64748b', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', border: filter === f ? '2px solid transparent' : '1px solid #e5e7eb', boxShadow: filter === f ? '0 2px 8px rgba(99,102,241,0.3)' : '0 1px 3px rgba(0,0,0,0.08)', transition: 'all 0.2s' }}>
            {f === 'all' ? 'All' : f === 'pending' ? `Pending (${pending.length})` : `Submitted (${submitted.length})`}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
          <ClipboardList size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
          <h3 style={{ color: '#64748b', margin: 0 }}>No assignments found</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(a => {
            const sub = getSubmission(a.id);
            const tl = timeLeft(a.dueDate);
            return (
              <div key={a.id} style={{ background: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '1.25rem', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0, background: sub ? (sub.status === 'graded' ? 'linear-gradient(135deg, #8b5cf6, #a855f7)' : 'linear-gradient(135deg, #10b981, #059669)') : 'linear-gradient(135deg, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {sub ? <CheckCircle size={22} color="white" /> : <ClipboardList size={22} color="white" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>{a.title}</h3>
                    <Badge status={sub ? sub.status : (a.status === 'active' ? 'pending' : 'closed')} />
                  </div>
                  <p style={{ margin: '0 0 8px', fontSize: '0.8rem', color: '#64748b' }}>{a.courseName}</p>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#374151', lineHeight: 1.5 }}>{a.description}</p>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> Due: {new Date(a.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    {!sub && <span style={{ fontSize: '0.75rem', fontWeight: 600, color: tl.urgent ? '#ef4444' : '#f59e0b' }}>{tl.text}</span>}
                  </div>
                </div>
                <div style={{ flexShrink: 0 }}>
                  {!sub && a.status === 'active' ? (
                    <button onClick={() => navigate(`/student/assignments/${a.id}`)} style={{ padding: '9px 18px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', color: 'white', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }}>Submit</button>
                  ) : (
                    <button onClick={() => navigate(`/student/assignments/${a.id}`)} style={{ padding: '9px 18px', borderRadius: '10px', background: 'white', border: '1px solid #e5e7eb', color: '#64748b', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>View</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
