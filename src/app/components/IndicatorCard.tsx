interface Props {
  icon: string;
  label: string;
  value: number | string;
  status?: 'zero' | 'warn' | 'danger' | 'info';
  dark?: boolean;
  tooltip?: string;
}

const STATUS_COLORS = {
  zero:   '#10b981',
  warn:   '#f59e0b',
  danger: '#ef4444',
  info:   '#3b82f6',
};

export function IndicatorCard({ icon, label, value, status = 'zero', dark = true, tooltip }: Props) {
  const color  = STATUS_COLORS[status];
  const bg     = dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.6)';
  const border = dark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.1)';
  const txt2   = dark ? '#64748b' : '#6b7a96';

  return (
    <div
      title={tooltip}
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 11, padding: '11px 10px',
        textAlign: 'center', backdropFilter: 'blur(10px)',
        transition: 'all 0.25s', cursor: 'default',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLDivElement).style.borderColor = color + '55';
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 6px 20px rgba(0,0,0,0.25)`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.borderColor = border;
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      <div style={{ fontSize: 20, marginBottom: 5 }}>{icon}</div>
      <div style={{
        fontFamily: "'Vazir','Vazirmatn',sans-serif", fontSize: 9, color: txt2,
        marginBottom: 5, fontWeight: 500, lineHeight: 1.3,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: 18, color,
        textShadow: `0 0 10px ${color}55`,
      }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </div>
  );
}
