import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

type Variant = 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'cyan';
type TrendType = 'up' | 'down' | 'neutral';

interface Props {
  label: string;
  labelFa?: string;
  value: string | number;
  sub?: string;
  variant?: Variant;
  icon?: ReactNode;
  dark?: boolean;
  tooltip?: string;
  trend?: TrendType;
  trendPercent?: number;
}

const COLORS: Record<Variant, { top: string; val: string; bg: string; border: string }> = {
  blue:   { top: 'linear-gradient(90deg,#3b82f6,#06b6d4)', val: '#60a5fa', bg: 'rgba(59,130,246,0.07)',  border: 'rgba(59,130,246,0.2)' },
  green:  { top: 'linear-gradient(90deg,#10b981,#2dd4bf)', val: '#34d399', bg: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.2)' },
  red:    { top: 'linear-gradient(90deg,#ef4444,#f97316)', val: '#f87171', bg: 'rgba(239,68,68,0.07)',   border: 'rgba(239,68,68,0.2)'  },
  orange: { top: 'linear-gradient(90deg,#f59e0b,#ef4444)', val: '#fbbf24', bg: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.2)' },
  purple: { top: 'linear-gradient(90deg,#8b5cf6,#ec4899)', val: '#a78bfa', bg: 'rgba(139,92,246,0.07)', border: 'rgba(139,92,246,0.2)' },
  cyan:   { top: 'linear-gradient(90deg,#06b6d4,#3b82f6)', val: '#22d3ee', bg: 'rgba(6,182,212,0.07)',  border: 'rgba(6,182,212,0.2)'  },
};

export function KpiCard({ label, labelFa, value, sub, variant = 'blue', icon, dark = true, tooltip, trend, trendPercent }: Props) {
  const c = COLORS[variant];
  const bg     = dark ? `rgba(255,255,255,0.04)` : 'rgba(255,255,255,0.65)';
  const border = `1px solid ${c.border}`;
  const txt2   = dark ? '#64748b' : '#6b7a96';
  
  const trendColor = trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : 'transparent';
  const trendBg = trend === 'up' ? 'rgba(16,185,129,0.1)' : trend === 'down' ? 'rgba(239,68,68,0.1)' : 'transparent';

  return (
    <div
      title={tooltip}
      style={{
        position: 'relative',
        background: bg,
        border,
        borderRadius: 14,
        padding: '14px 16px',
        overflow: 'hidden',
        transition: 'transform 0.25s, box-shadow 0.25s',
        cursor: 'default',
        backdropFilter: 'blur(12px)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 10px 28px rgba(0,0,0,0.35)`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      {/* Top accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, borderRadius: '14px 14px 0 0', background: c.top }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'Vazir','Vazirmatn',sans-serif", fontSize: 10, color: txt2, fontWeight: 500,
            marginBottom: 8, lineHeight: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              {label}
              {labelFa && <div style={{ fontSize: 9 }}>{labelFa}</div>}
            </div>
            {trend && trend !== 'neutral' && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 2,
                padding: '2px 6px', borderRadius: 6,
                background: trendBg,
                color: trendColor,
                fontFamily: "'Inter',sans-serif",
                fontSize: 8, fontWeight: 700,
              }}>
                {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {trendPercent !== undefined && <span>{trendPercent > 0 ? '+' : ''}{trendPercent.toFixed(1)}%</span>}
              </div>
            )}
          </div>
          <div style={{
            fontFamily: "'Inter',sans-serif", fontWeight: 900,
            fontSize: 'clamp(16px,2vw,26px)', color: c.val, lineHeight: 1, marginBottom: 4,
          }}>
            {value}
          </div>
          {sub && <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 9, color: txt2 }}>{sub}</div>}
        </div>
        {icon && (
          <div style={{ opacity: 0.35, fontSize: 24, color: c.val }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
