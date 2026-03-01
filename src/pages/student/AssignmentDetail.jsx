import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Download, Upload, FileText, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../../lib/context.js';
import Badge from '../../components/Badge.jsx';

function timeLeft(dueDate) {
  const diff = new Date(dueDate).getTime() - Date.now();
  if (diff < 0) return { text: 'Overdue', urgent: true };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return { text: `${days} days ${hours} hours`, urgent: days <= 1 };
  return { text: `${hours} hours`, urgent: true };
}

export default function AssignmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, assignments, submissions, submitAssignment } = useApp();
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [dragging, setDragging] = useState(false);

  const assignment = assignments.find(a => a.id === id);
  const submission = submissions.find(s => s.assignmentId === id && s.studentId === currentUser.id);

  if (!assignment) return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h3 style={{ color: '#64748b' }}>Assignment not found</h3>
      <button onClick={() => navigate('/student/assignments')} style={{ marginTop: '1rem', padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Back</button>
    </div>
  );

  const tl = timeLeft(assignment.dueDate);
  const isSubmitted = !!submission || submitted;

  const handleSubmit = () => {
    if (!selectedFile) return;
    const fileSize = selectedFile.size > 1024 * 1024 ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(selectedFile.size / 1024)} KB`;
    submitAssignment(assignment.id, selectedFile.name, fileSize);
    setSubmitted(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };

  return (
    <div>
      <button onClick={() => navigate('/student/assignments')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, marginBottom: '1.5rem', padding: '6px 0' }}>
        <ArrowLeft size={16} /> Back to Assignments
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' }}>
        <div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb', marginBottom: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', flex: 1 }}>{assignment.title}</h1>
              <Badge status={isSubmitted ? (submission?.status || 'submitted') : 'active'} />
            </div>
            <p style={{ margin: '0 0 12px', fontSize: '0.85rem', color: '#64748b' }}>{assignment.courseName}</p>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#374151', lineHeight: 1.7 }}>{assignment.description}</p>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb', marginBottom: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h2 style={{ margin: '0 0 12px', fontSize: '1rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}><Info size={18} color="#3b82f6" /> Instructions</h2>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#374151', lineHeight: 1.8, background: '#f8fafc', borderRadius: '10px', padding: '1rem', border: '1px solid #f1f5f9' }}>{assignment.instructions}</p>
          </div>
          {assignment.attachments.length > 0 && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb', marginBottom: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <h2 style={{ margin: '0 0 12px', fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Attached Resources</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {assignment.attachments.map(att => (
                  <div key={att.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={16} color="white" /></div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1e293b' }}>{att.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{att.size}</div>
                      </div>
                    </div>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', background: 'white', border: '1px solid #e5e7eb', color: '#3b82f6', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}><Download size={14} /> Download</button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!isSubmitted && assignment.status === 'active' && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <h2 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}><Upload size={18} color="#3b82f6" /> Submit Your Work</h2>
              <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop}
                style={{ border: `2px dashed ${dragging ? '#3b82f6' : selectedFile ? '#10b981' : '#d1d5db'}`, borderRadius: '12px', padding: '2.5rem', textAlign: 'center', cursor: 'pointer', background: dragging ? '#eff6ff' : selectedFile ? '#ecfdf5' : '#fafafa', transition: 'all 0.2s' }}
                onClick={() => document.getElementById('file-upload')?.click()}>
                <input id="file-upload" type="file" accept=".pdf,.doc,.docx,.zip,.rar" style={{ display: 'none' }} onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
                {selectedFile ? (
                  <>
                    <CheckCircle size={36} color="#10b981" style={{ marginBottom: '10px' }} />
                    <p style={{ margin: 0, fontWeight: 600, color: '#1e293b' }}>{selectedFile.name}</p>
                    <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b' }}>{selectedFile.size > 1024 * 1024 ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(selectedFile.size / 1024)} KB`}</p>
                    <p style={{ margin: '8px 0 0', fontSize: '0.8rem', color: '#10b981' }}>Click to change file</p>
                  </>
                ) : (
                  <>
                    <Upload size={36} color="#94a3b8" style={{ marginBottom: '10px' }} />
                    <p style={{ margin: 0, fontWeight: 600, color: '#374151' }}>Drop your file here or click to browse</p>
                    <p style={{ margin: '6px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>PDF, DOC, DOCX, ZIP, RAR — Max 50MB</p>
                  </>
                )}
              </div>
              <button onClick={handleSubmit} disabled={!selectedFile} style={{ width: '100%', marginTop: '1rem', padding: '13px', background: selectedFile ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : '#e5e7eb', border: 'none', borderRadius: '10px', color: selectedFile ? 'white' : '#94a3b8', fontWeight: 700, fontSize: '0.95rem', cursor: selectedFile ? 'pointer' : 'not-allowed', boxShadow: selectedFile ? '0 4px 12px rgba(99,102,241,0.3)' : 'none', transition: 'all 0.2s' }}>Submit Assignment</button>
            </div>
          )}
          {isSubmitted && (
            <div style={{ background: 'linear-gradient(135deg, #ecfdf5, #f0fdf4)', borderRadius: '16px', padding: '1.5rem', border: '1px solid #d1fae5', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <CheckCircle size={40} color="#10b981" />
              <div>
                <h3 style={{ margin: 0, color: '#065f46', fontWeight: 700 }}>Assignment Submitted!</h3>
                <p style={{ margin: '4px 0 0', color: '#047857', fontSize: '0.875rem' }}>{submission?.fileName || selectedFile?.name} · Submitted {submission ? new Date(submission.submittedAt).toLocaleDateString() : 'just now'}</p>
                {submission?.status === 'graded' && <p style={{ margin: '8px 0 0', fontWeight: 700, color: '#065f46' }}>Grade: {submission.grade}%</p>}
              </div>
            </div>
          )}
        </div>
        <div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', position: 'sticky', top: '80px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>Assignment Info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <Calendar size={16} color="#3b82f6" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deadline</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', marginTop: '2px' }}>{new Date(assignment.dueDate).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '1px' }}>{new Date(assignment.dueDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>
              <div style={{ height: '1px', background: '#f1f5f9' }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <Clock size={16} color={tl.urgent ? '#ef4444' : '#f59e0b'} style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time Remaining</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: tl.urgent ? '#ef4444' : '#f59e0b', marginTop: '2px' }}>{tl.text}</div>
                </div>
              </div>
              <div style={{ height: '1px', background: '#f1f5f9' }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <AlertCircle size={16} color="#8b5cf6" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</div>
                  <div style={{ marginTop: '4px' }}><Badge status={isSubmitted ? (submission?.status || 'submitted') : 'pending'} /></div>
                </div>
              </div>
              {submission?.grade !== undefined && (
                <>
                  <div style={{ height: '1px', background: '#f1f5f9' }} />
                  <div style={{ background: 'linear-gradient(135deg, #f5f3ff, #eff6ff)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#7c3aed' }}>{submission.grade}%</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Your Grade</div>
                    {submission.feedback && <p style={{ margin: '10px 0 0', fontSize: '0.8rem', color: '#374151', textAlign: 'left', lineHeight: 1.6, background: 'white', borderRadius: '8px', padding: '8px', border: '1px solid #e9d5ff' }}>"{submission.feedback}"</p>}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
