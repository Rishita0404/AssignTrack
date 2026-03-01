import { useState } from 'react';
import { BookOpen, Users, ClipboardList, Plus, X } from 'lucide-react';
import { useApp } from '../../lib/context.js';

const COLORS = ['blue', 'purple', 'green', 'orange', 'red'];
const colorMap = {
  blue: { bg: 'linear-gradient(135deg, #3b82f6, #6366f1)', border: '#dbeafe', accent: '#eff6ff' },
  purple: { bg: 'linear-gradient(135deg, #8b5cf6, #a855f7)', border: '#e9d5ff', accent: '#f5f3ff' },
  green: { bg: 'linear-gradient(135deg, #10b981, #059669)', border: '#d1fae5', accent: '#ecfdf5' },
  orange: { bg: 'linear-gradient(135deg, #f59e0b, #f97316)', border: '#fde68a', accent: '#fffbeb' },
  red: { bg: 'linear-gradient(135deg, #ef4444, #dc2626)', border: '#fecaca', accent: '#fef2f2' },
};

export default function TeacherCourses() {
  const { currentUser, courses, assignments, createCourse } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', description: '', color: 'blue' });
  const [error, setError] = useState('');
  const myCourses = courses.filter(c => c.teacherId === currentUser.id);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.name || !form.code) { setError('Name and code are required.'); return; }
    createCourse(form);
    setShowModal(false);
    setForm({ name: '', code: '', description: '', color: 'blue' });
    setError('');
  };

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.9rem', color: '#1e293b', background: '#fafafa', outline: 'none', boxSizing: 'border-box' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>My Courses</h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>Manage your courses and enrolled students</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', color: 'white', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
          <Plus size={16} /> Create New Course
        </button>
      </div>
      {myCourses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
          <BookOpen size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
          <h3 style={{ color: '#64748b', margin: 0 }}>No courses yet</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Create your first course to get started</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {myCourses.map(course => {
            const colors = colorMap[course.color] || colorMap.blue;
            const active = assignments.filter(a => a.courseId === course.id && a.status === 'active').length;
            return (
              <div key={course.id} style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; }}>
                <div style={{ height: '8px', background: colors.bg }} />
                <div style={{ padding: '1.25rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', background: colors.accent, padding: '2px 8px', borderRadius: '20px', border: `1px solid ${colors.border}` }}>{course.code}</span>
                  <h3 style={{ margin: '8px 0 4px', fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>{course.name}</h3>
                  <p style={{ margin: '0 0 14px', fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>{course.description}</p>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748b' }}><Users size={14} color="#3b82f6" /><span>{course.enrolledStudents.length} students</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748b' }}><ClipboardList size={14} color="#8b5cf6" /><span>{active} active</span></div>
                  </div>
                  <button style={{ width: '100%', padding: '9px', background: colors.bg, border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>Manage Course</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, color: 'white', fontSize: '1.1rem', fontWeight: 700 }}>Create New Course</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'white', display: 'flex' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate} style={{ padding: '1.5rem' }}>
              {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '1rem', fontSize: '0.85rem', color: '#dc2626' }}>{error}</div>}
              <div style={{ marginBottom: '1rem' }}><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Course Name *</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Introduction to Computer Science" style={inputStyle} /></div>
              <div style={{ marginBottom: '1rem' }}><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Course Code *</label><input value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value }))} placeholder="e.g. CS101" style={inputStyle} /></div>
              <div style={{ marginBottom: '1rem' }}><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Description</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief course description..." rows={3} style={{ ...inputStyle, resize: 'vertical', padding: '10px 14px' }} /></div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Course Color</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {COLORS.map(color => <button key={color} type="button" onClick={() => setForm(p => ({ ...p, color }))} style={{ width: '32px', height: '32px', borderRadius: '50%', background: colorMap[color].bg, border: form.color === color ? '3px solid #1e293b' : '3px solid transparent', cursor: 'pointer', transition: 'border 0.2s' }} />)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '11px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '10px', color: '#64748b', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: '11px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>Create Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
