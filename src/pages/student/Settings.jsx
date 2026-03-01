import { useState } from 'react';
import { User, Mail, Lock, Bell, Save, CheckCircle } from 'lucide-react';
import { useApp } from '../../lib/context.js';

export default function StudentSettings() {
  const { currentUser } = useApp();
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [email] = useState(currentUser?.email || '');
  const [notifications, setNotifications] = useState({ email: true, assignments: true, grades: true });

  const handleSave = (e) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 3000); };

  const inputStyle = { width: '100%', padding: '10px 14px 10px 42px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.9rem', color: '#1e293b', background: '#fafafa', outline: 'none', boxSizing: 'border-box' };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Settings</h1>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>Manage your account preferences</p>
      </div>
      {saved && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ecfdf5', border: '1px solid #d1fae5', borderRadius: '10px', padding: '12px 16px', marginBottom: '1.5rem' }}>
          <CheckCircle size={18} color="#10b981" />
          <span style={{ fontSize: '0.875rem', color: '#065f46', fontWeight: 600 }}>Settings saved successfully!</span>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h2 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Profile Information</h2>
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Full Name</label>
              <div style={{ position: 'relative' }}><User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} /><input type="text" value={name} onChange={e => setName(e.target.value)} style={inputStyle} /></div>
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Email Address</label>
              <div style={{ position: 'relative' }}><Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} /><input type="email" value={email} disabled style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }} /></div>
            </div>
            <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }}><Save size={16} /> Save Profile</button>
          </form>
        </div>
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h2 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Change Password</h2>
          <form onSubmit={handleSave}>
            {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
              <div key={label} style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>{label}</label>
                <div style={{ position: 'relative' }}><Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} /><input type="password" placeholder="••••••••" style={inputStyle} /></div>
              </div>
            ))}
            <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }}><Save size={16} /> Update Password</button>
          </form>
        </div>
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', gridColumn: '1 / -1' }}>
          <h2 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}><Bell size={18} color="#3b82f6" /> Notification Preferences</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[{ key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' }, { key: 'assignments', label: 'New Assignments', desc: 'Get notified when new assignments are posted' }, { key: 'grades', label: 'Grade Updates', desc: 'Get notified when your work is graded' }].map(({ key, label, desc }) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                <div><div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1e293b' }}>{label}</div><div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>{desc}</div></div>
                <button type="button" onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key] }))} style={{ width: '44px', height: '24px', borderRadius: '12px', background: notifications[key] ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : '#e5e7eb', border: 'none', cursor: 'pointer', position: 'relative', transition: 'all 0.2s' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', left: notifications[key] ? '23px' : '3px', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
