export default function StatCard({ label, value, icon, color, bgColor, borderColor, trend }) {
  return (
    <div style={{
      background: 'white', borderRadius: '14px', padding: '1.25rem 1.5rem',
      border: `1px solid ${borderColor}`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      display: 'flex', alignItems: 'center', gap: '1rem',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; }}
    >
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1e293b', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px', fontWeight: 500 }}>{label}</div>
        {trend && <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '2px', fontWeight: 500 }}>{trend}</div>}
      </div>
    </div>
  );
}
