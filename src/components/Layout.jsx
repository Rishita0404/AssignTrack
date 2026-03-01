import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { GraduationCap, LayoutDashboard, BookOpen, ClipboardList, Star, Settings, LogOut, Menu, X, Users, FileCheck } from 'lucide-react';
import { useApp } from '../lib/context.js';

const studentNav = [
  { label: 'Dashboard', path: '/student/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'My Courses', path: '/student/courses', icon: <BookOpen size={18} /> },
  { label: 'Assignments', path: '/student/assignments', icon: <ClipboardList size={18} /> },
  { label: 'Grades', path: '/student/grades', icon: <Star size={18} /> },
  { label: 'Settings', path: '/student/settings', icon: <Settings size={18} /> },
];

const teacherNav = [
  { label: 'Dashboard', path: '/teacher/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'My Courses', path: '/teacher/courses', icon: <BookOpen size={18} /> },
  { label: 'Assignments', path: '/teacher/assignments', icon: <ClipboardList size={18} /> },
  { label: 'Submissions', path: '/teacher/submissions', icon: <FileCheck size={18} /> },
  { label: 'Grades', path: '/teacher/grades', icon: <Star size={18} /> },
  { label: 'Settings', path: '/teacher/settings', icon: <Settings size={18} /> },
];

export default function Layout({ children }) {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = currentUser?.role === 'teacher' ? teacherNav : studentNav;

  const handleLogout = () => { logout(); navigate('/'); };

  const avatarInitials = currentUser?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f5f7fa' }}>
      <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }} className="mobile-menu-btn">
              {sidebarOpen ? <X size={22} color="#374151" /> : <Menu size={22} color="#374151" />}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap size={20} color="white" />
              </div>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', letterSpacing: '-0.02em' }}>
                Assign<span style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Track</span>
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>{currentUser?.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{currentUser?.email}</div>
            </div>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>
              {avatarInitials}
            </div>
            <button onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', color: '#64748b', fontSize: '0.85rem', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#64748b'; }}
            >
              <LogOut size={15} /><span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '0 1.5rem' }}>
        <aside style={{ width: '240px', flexShrink: 0, paddingTop: '1.5rem', paddingRight: '1.5rem' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map(item => (
              <NavLink key={item.path} to={item.path}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
                  borderRadius: '10px', textDecoration: 'none', fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 500, color: isActive ? '#3b82f6' : '#64748b',
                  background: isActive ? 'linear-gradient(135deg, #eff6ff, #f5f3ff)' : 'transparent',
                  border: isActive ? '1px solid #dbeafe' : '1px solid transparent', transition: 'all 0.2s',
                })}
                onMouseEnter={e => { const el = e.currentTarget; if (!el.getAttribute('aria-current')) { el.style.background = '#f8fafc'; el.style.color = '#374151'; } }}
                onMouseLeave={e => { const el = e.currentTarget; if (!el.getAttribute('aria-current')) { el.style.background = 'transparent'; el.style.color = '#64748b'; } }}
              >
                {item.icon}<span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <div style={{ marginTop: '2rem', padding: '1rem', borderRadius: '12px', background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)', border: '1px solid #dbeafe' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Users size={14} color="#3b82f6" />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</span>
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', textTransform: 'capitalize' }}>
              {currentUser?.role === 'teacher' ? '👩‍🏫 Teacher' : '🎓 Student'}
            </div>
          </div>
        </aside>
        <main style={{ flex: 1, paddingTop: '1.5rem', paddingBottom: '2rem', minWidth: 0 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
