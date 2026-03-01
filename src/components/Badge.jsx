const configs = {
  active: { bg: '#dcfce7', color: '#16a34a', border: '#bbf7d0', dot: '#16a34a' },
  closed: { bg: '#f1f5f9', color: '#64748b', border: '#e2e8f0', dot: '#94a3b8' },
  pending: { bg: '#fef3c7', color: '#d97706', border: '#fde68a', dot: '#f59e0b' },
  submitted: { bg: '#dbeafe', color: '#2563eb', border: '#bfdbfe', dot: '#3b82f6' },
  graded: { bg: '#f3e8ff', color: '#7c3aed', border: '#e9d5ff', dot: '#8b5cf6' },
};

export default function Badge({ status, label }) {
  const cfg = configs[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
      borderRadius: '20px', padding: '3px 10px', fontSize: '0.75rem', fontWeight: 600,
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
      {label || status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
