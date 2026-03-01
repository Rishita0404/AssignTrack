import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit2, XCircle, ClipboardList, FileCheck, Users } from 'lucide-react';
import { useApp } from '../../lib/context.js';
import Badge from '../../components/Badge.jsx';

export default function TeacherAssignments() {
  const { currentUser, assignments, submissions, closeAssignment } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const myAssignments = assignments.filter(a => a.teacherId === currentUser.id);
  const filtered = filter === 'all' ? myAssignments : myAssignments.filter(a => a.status === filter);
  const getSubCount = (aId) => submissions.filter(s => s.assignmentId === aId).length;
  const getPendingCount = (aId) => submissions.filter(s => s.assignmentId === aId && s.status === 'submitted').length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Assignments</h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>Create and manage your course assignments</p>
        </div>
        <button onClick={() => navigate('/teacher/assignments/create')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', color: 'white', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
          <Plus size={16} /> Create Assignment
        </button>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
        {['all', 'active', 'closed'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '7px 16px', borderRadius: '20px', background: filter === f ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'white', color: filter === f ? 'white' : '#64748b', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', border: filter === f ? 'none' : '1px solid #e5e7eb', boxShadow: filter === f ? '0 2px 8px rgba(99,102,241,0.3)' : '0 1px 3px rgba(0,0,0,0.08)', transition: 'all 0.2s' }}>
            {f === 'all' ? `All (${myAssignments.length})` : f === 'active' ? `Active (${myAssignments.filter(a => a.status === 'active').length})` : `Closed (${myAssignments.filter(a => a.status === 'closed').length})`}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
          <ClipboardList size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
          <h3 style={{ color: '#64748b', margin: 0 }}>No assignments found</h3>
          <button onClick={() => navigate('/teacher/assignments/create')} style={{ marginTop: '1rem', padding: '10px 20px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Create First Assignment</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(a => {
            const subCount = getSubCount(a.id);
            const pendingCount = getPendingCount(a.id);
            return (
              <div key={a.id} style={{ background: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0, background: a.status === 'active' ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ClipboardList size={22} color={a.status === 'active' ? 'white' : '#94a3b8'} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>{a.title}</h3>
                    <Badge status={a.status} />
                  </div>
                  <p style={{ margin: '0 0 8px', fontSize: '0.8rem', color: '#64748b' }}>{a.courseName}</p>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Due: {new Date(a.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={12} /> {subCount} submissions</span>
                    {pendingCount > 0 && <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}><FileCheck size={12} /> {pendingCount} pending review</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button onClick={() => navigate(`/teacher/submissions?assignment=${a.id}`)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', borderRadius: '8px', background: 'white', border: '1px solid #e5e7eb', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}><Eye size={14} /> View</button>
                  <button onClick={() => navigate(`/teacher/assignments/edit/${a.id}`)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', borderRadius: '8px', background: 'white', border: '1px solid #dbeafe', color: '#3b82f6', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}><Edit2 size={14} /> Edit</button>
                  {a.status === 'active' && <button onClick={() => closeAssignment(a.id)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', borderRadius: '8px', background: 'white', border: '1px solid #fecaca', color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}><XCircle size={14} /> Close</button>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
