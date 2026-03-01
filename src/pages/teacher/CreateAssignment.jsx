import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, AlertCircle, CheckCircle, Calendar, BookOpen } from 'lucide-react';
import { useApp } from '../../lib/context.js';

export default function CreateAssignment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, courses, assignments, createAssignment, updateAssignment } = useApp();
  const isEdit = !!id;
  const existing = isEdit ? assignments.find(a => a.id === id) : null;
  const myCourses = courses.filter(c => c.teacherId === currentUser.id);

  const [form, setForm] = useState({
    title: existing?.title || '',
    description: existing?.description || '',
    instructions: existing?.instructions || '',
    courseId: existing?.courseId || (myCourses[0]?.id || ''),
    courseName: existing?.courseName || (myCourses[0]?.name || ''),
    dueDate: existing?.dueDate ? new Date(existing.dueDate).toISOString().slice(0, 16) : '',
    status: existing?.status || 'active',
  });
  const [attachments, setAttachments] = useState(existing?.attachments || []);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (existing) {
      setForm({ title: existing.title, description: existing.description, instructions: existing.instructions, courseId: existing.courseId, courseName: existing.courseName, dueDate: new Date(existing.dueDate).toISOString().slice(0, 16), status: existing.status });
      setAttachments(existing.attachments);
    }
  }, [id]);

  const handleCourseChange = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    setForm(p => ({ ...p, courseId, courseName: course?.name || '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.courseId || !form.dueDate) { setError('Title, course, and due date are required.'); return; }
    if (isEdit && existing) {
      updateAssignment(existing.id, { ...form, dueDate: new Date(form.dueDate).toISOString(), attachments });
    } else {
      createAssignment({ ...form, dueDate: new Date(form.dueDate).toISOString(), attachments, status: 'active' });
    }
    setSuccess(true);
    setTimeout(() => navigate('/teacher/assignments'), 1200);
  };

  const addMockAttachment = () => {
    setAttachments(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), name: `resource_${prev.length + 1}.pdf`, size: `${Math.floor(Math.random() * 900 + 100)} KB`, type: 'pdf' }]);
  };

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.9rem', color: '#1e293b', background: '#fafafa', outline: 'none', boxSizing: 'border-box' };

  return (
    <div>
      <button onClick={() => navigate('/teacher/assignments')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, marginBottom: '1.5rem', padding: '6px 0' }}><ArrowLeft size={16} /> Back to Assignments</button>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{isEdit ? 'Edit Assignment' : 'Create New Assignment'}</h1>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>{isEdit ? 'Update assignment details and settings' : 'Fill in the details to create a new assignment'}</p>
      </div>
      {success && (<div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ecfdf5', border: '1px solid #d1fae5', borderRadius: '10px', padding: '12px 16px', marginBottom: '1.5rem' }}><CheckCircle size={18} color="#10b981" /><span style={{ fontSize: '0.875rem', color: '#065f46', fontWeight: 600 }}>Assignment {isEdit ? 'updated' : 'created'} successfully! Redirecting...</span></div>)}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && (<div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 16px' }}><AlertCircle size={16} color="#ef4444" /><span style={{ fontSize: '0.85rem', color: '#dc2626' }}>{error}</span></div>)}
            <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Assignment Details</h3>
              <div style={{ marginBottom: '1rem' }}><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Title *</label><input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Assignment title" style={inputStyle} /></div>
              <div style={{ marginBottom: '1rem' }}><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Description</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description..." rows={3} style={{ ...inputStyle, resize: 'vertical', padding: '10px 14px' }} /></div>
              <div><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Instructions</label><textarea value={form.instructions} onChange={e => setForm(p => ({ ...p, instructions: e.target.value }))} placeholder="Detailed instructions for students..." rows={5} style={{ ...inputStyle, resize: 'vertical', padding: '10px 14px' }} /></div>
            </div>
            <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>File Attachments</h3>
                <button type="button" onClick={addMockAttachment} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: 'white', border: '1px solid #dbeafe', borderRadius: '8px', color: '#3b82f6', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}><Plus size={14} /> Add File</button>
              </div>
              {attachments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', background: '#f8fafc', borderRadius: '10px', border: '2px dashed #e2e8f0' }}><p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem' }}>No attachments yet. Click "Add File" to attach resources.</p></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {attachments.map(att => (
                    <div key={att.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>{att.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{att.size}</span>
                        <button type="button" onClick={() => setAttachments(prev => prev.filter(a => a.id !== att.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex' }}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'sticky', top: '80px' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Settings</h3>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}><BookOpen size={14} color="#3b82f6" /> Course *</label>
                <select value={form.courseId} onChange={e => handleCourseChange(e.target.value)} style={{ ...inputStyle, padding: '10px 14px' }}>
                  {myCourses.length === 0 ? <option>No courses available</option> : myCourses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} color="#3b82f6" /> Due Date & Time *</label>
                <input type="datetime-local" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} style={inputStyle} />
              </div>
              <button type="submit" style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>{isEdit ? 'Update Assignment' : 'Publish Assignment'}</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
