import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, CheckCircle, Star, MessageSquare, FileText } from 'lucide-react';
import { useApp } from '../../lib/context.js';
import Badge from '../../components/Badge.jsx';

export default function ReviewSubmission() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { submissions, assignments, gradeSubmission } = useApp();
  const submission = submissions.find(s => s.id === id);
  const assignment = submission ? assignments.find(a => a.id === submission.assignmentId) : null;
  const [grade, setGrade] = useState(submission?.grade?.toString() || '');
  const [feedback, setFeedback] = useState(submission?.feedback || '');
  const [submitted, setSubmitted] = useState(submission?.status === 'graded');
  const [error, setError] = useState('');

  if (!submission || !assignment) return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h3 style={{ color: '#64748b' }}>Submission not found</h3>
      <button onClick={() => navigate('/teacher/submissions')} style={{ marginTop: '1rem', padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Back</button>
    </div>
  );

  const handleGrade = (e) => {
    e.preventDefault();
    const g = parseInt(grade);
    if (isNaN(g) || g < 0 || g > 100) { setError('Grade must be a number between 0 and 100.'); return; }
    gradeSubmission(submission.id, g, feedback);
    setSubmitted(true);
    setError('');
  };

  const gradeNum = parseInt(grade);
  const gradeColor = !isNaN(gradeNum) ? gradeNum >= 90 ? '#10b981' : gradeNum >= 70 ? '#3b82f6' : gradeNum >= 50 ? '#f59e0b' : '#ef4444' : '#94a3b8';

  return (
    <div>
      <button onClick={() => navigate('/teacher/submissions')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, marginBottom: '1.5rem', padding: '6px 0' }}><ArrowLeft size={16} /> Back to Submissions</button>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div><h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#1e293b' }}>{assignment.title}</h2><p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>{assignment.courseName}</p></div>
              <Badge status={submission.status} />
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#374151', lineHeight: 1.7, background: '#f8fafc', borderRadius: '10px', padding: '1rem', border: '1px solid #f1f5f9' }}>{assignment.description}</p>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Student Submission</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1rem' }}>{submission.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>{submission.studentName}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{submission.studentEmail}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>Submitted: {new Date(submission.submittedAt).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</div>
              </div>
            </div>
            {submission.fileName && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={18} color="white" /></div>
                  <div><div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1e293b' }}>{submission.fileName}</div><div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{submission.fileSize}</div></div>
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', border: 'none', color: 'white', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}><Download size={15} /> Download</button>
              </div>
            )}
          </div>
          {!submitted ? (
            <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}><Star size={18} color="#f59e0b" /> Grade & Feedback</h3>
              <form onSubmit={handleGrade}>
                {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '1rem', fontSize: '0.85rem', color: '#dc2626' }}>{error}</div>}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Grade (0–100)</label>
                  <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                    <input type="number" min="0" max="100" value={grade} onChange={e => setGrade(e.target.value)} placeholder="Enter grade..." style={{ width: '100%', padding: '12px 60px 12px 16px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 700, color: gradeColor, background: '#fafafa', outline: 'none', boxSizing: 'border-box' }} />
                    <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', fontWeight: 700, color: '#94a3b8' }}>/ 100</span>
                  </div>
                  {!isNaN(gradeNum) && grade !== '' && (
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '6px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}><div style={{ height: '100%', width: `${gradeNum}%`, background: `linear-gradient(90deg, ${gradeColor}, ${gradeColor}cc)`, borderRadius: '999px', transition: 'width 0.3s' }} /></div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: gradeColor }}>{gradeNum >= 90 ? 'A' : gradeNum >= 80 ? 'B' : gradeNum >= 70 ? 'C' : gradeNum >= 60 ? 'D' : 'F'}</span>
                    </div>
                  )}
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><MessageSquare size={14} color="#3b82f6" /> Feedback</label>
                  <textarea value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Write constructive feedback for the student..." rows={5} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.9rem', color: '#1e293b', background: '#fafafa', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                </div>
                <button type="submit" style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>Submit Grade</button>
              </form>
            </div>
          ) : (
            <div style={{ background: 'linear-gradient(135deg, #ecfdf5, #f0fdf4)', borderRadius: '16px', padding: '1.5rem', border: '1px solid #d1fae5', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <CheckCircle size={40} color="#10b981" />
              <div>
                <h3 style={{ margin: 0, color: '#065f46', fontWeight: 700 }}>Grade Submitted!</h3>
                <p style={{ margin: '4px 0 0', color: '#047857', fontSize: '0.875rem' }}>{submission.studentName} received a grade of {submission.grade || grade}%</p>
                {(submission.feedback || feedback) && <p style={{ margin: '8px 0 0', fontSize: '0.85rem', color: '#374151', fontStyle: 'italic' }}>"{submission.feedback || feedback}"</p>}
              </div>
            </div>
          )}
        </div>
        <div style={{ position: 'sticky', top: '80px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>Submission Info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div><div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assignment</div><div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', marginTop: '3px' }}>{assignment.title}</div></div>
              <div style={{ height: '1px', background: '#f1f5f9' }} />
              <div><div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Course</div><div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', marginTop: '3px' }}>{assignment.courseName}</div></div>
              <div style={{ height: '1px', background: '#f1f5f9' }} />
              <div><div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Due Date</div><div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', marginTop: '3px' }}>{new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div></div>
              <div style={{ height: '1px', background: '#f1f5f9' }} />
              <div><div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</div><div style={{ marginTop: '6px' }}><Badge status={submission.status} /></div></div>
              {submission.grade !== undefined && (<><div style={{ height: '1px', background: '#f1f5f9' }} /><div style={{ background: 'linear-gradient(135deg, #f5f3ff, #eff6ff)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}><div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#7c3aed' }}>{submission.grade}%</div><div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Final Grade</div></div></>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
