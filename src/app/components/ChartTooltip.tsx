import React from 'react';
import { useDashboard } from '../context/DashboardContext';

export function ChartTooltip(props: any) {
  const { active, payload, label } = props;
  const { darkMode } = useDashboard();
  if (!active || !payload || payload.length === 0) return null;

  const bg = darkMode ? '#071226' : '#ffffff';
  const border = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';
  const txt = darkMode ? '#e6eef8' : '#071226';

  return (
    <div style={{
      background: bg,
      border: `1px solid ${border}`,
      color: txt,
      padding: 10,
      borderRadius: 8,
      boxShadow: '0 6px 20px rgba(2,6,23,0.18)',
      minWidth: 120,
      fontFamily: "'Vazir','Vazirmatn',sans-serif",
      fontSize: 12,
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 6 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, background: p.color || '#999', borderRadius: 3 }} />
            <div style={{ color: txt, opacity: 0.9 }}>{p.name}</div>
          </div>
          <div style={{ fontFamily: "'Orbitron',monospace", fontWeight: 800 }}>{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</div>
        </div>
      ))}
    </div>
  );
}

export default ChartTooltip;
