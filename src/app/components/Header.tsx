import { Sun, Moon, CalendarRange } from 'lucide-react';
import { useDashboard, Preset } from '../context/DashboardContext';
import { DATA_START, DATA_END } from '../data/mockData';
import { useState } from 'react';

const PRESETS: { key: Preset; label: string }[] = [
  { key: 'all',  label: 'All Time' },
  { key: '2026', label: '2026' },
  { key: '2025', label: '2025' },
  { key: '2024', label: '2024' },
  { key: '6m',   label: 'Last 6M' },
  { key: '1m',   label: 'Last Month' },
  { key: '7d',   label: 'Last Week' },
];

function toInputVal(d: Date) {
  return d.toISOString().split('T')[0];
}

export function Header() {
  const { darkMode, toggleDarkMode, preset, setPreset, dateRange, setDateRange } = useDashboard();
  const [showCustom, setShowCustom] = useState(false);
  const [cStart, setCStart] = useState(toInputVal(DATA_START));
  const [cEnd,   setCEnd]   = useState(toInputVal(DATA_END));

  const today = new Date(2026, 1, 24);
  const todayStr = today.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });

  const bg     = darkMode ? 'rgba(7,13,31,0.96)' : 'rgba(225,235,250,0.96)';
  const border = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)';
  const txt1   = darkMode ? '#e2e8f0' : '#0f1e35';
  const txt2   = darkMode ? '#64748b' : '#4a6080';

  const activePresetStyle = {
    background: 'linear-gradient(135deg,#2563eb,#0ea5e9)',
    color: '#fff',
    border: '1px solid transparent',
    boxShadow: '0 2px 10px rgba(37,99,235,0.4)',
  };
  const inactivePresetStyle = (dark: boolean) => ({
    background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
    color: dark ? '#94a3b8' : '#4a6080',
    border: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.1)',
  });

  return (
    <header style={{
      background: bg,
      borderBottom: `1px solid ${border}`,
      backdropFilter: 'blur(24px) saturate(180%)',
      padding: '0 20px',
      position: 'sticky', top: 0, zIndex: 200,
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0 8px', borderBottom: `1px solid ${border}` }}>
        <div style={{ flex: 1 }}>
          <h1 style={{
            fontFamily: "'Orbitron',monospace", fontWeight: 900,
            fontSize: 'clamp(14px,1.8vw,22px)', letterSpacing: 2,
            background: 'linear-gradient(135deg,#3b82f6,#06b6d4,#10b981)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            margin: 0,
          }}>
            HSE Dashboard
          </h1>
          <div style={{ fontFamily: "'Vazirmatn',sans-serif", fontSize: 10, color: txt2, marginTop: 2 }}>
            Sepehr Pasargad E&P — N.I.O.C. &nbsp;|&nbsp; {todayStr}
          </div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(16,185,129,0.1)',
          border: '1px solid rgba(16,185,129,0.25)',
          borderRadius: 8, padding: '4px 10px',
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, color: '#10b981', fontWeight: 600 }}>
            LTI FREE
          </span>
        </div>

        <button
          onClick={toggleDarkMode}
          style={{
            background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
            border: `1px solid ${border}`,
            borderRadius: 9, padding: '7px 10px',
            color: txt1, cursor: 'pointer', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', gap: 5,
            fontFamily: "'Inter',sans-serif", fontSize: 11,
          }}
        >
          {darkMode ? <Sun size={14} /> : <Moon size={14} />}
          <span>{darkMode ? 'Light' : 'Dark'}</span>
        </button>
      </div>

      {/* Date filter row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginLeft: 2 }}>
          <CalendarRange size={14} color={txt2} />
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, color: txt2, fontWeight: 600 }}>
            Filter:
          </span>
        </div>

        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {PRESETS.map(p => (
            <button
              key={p.key}
              onClick={() => { setPreset(p.key); setShowCustom(false); }}
              style={{
                padding: '4px 12px', borderRadius: 20, cursor: 'pointer',
                fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 600,
                transition: 'all 0.2s',
                ...(preset === p.key ? activePresetStyle : inactivePresetStyle(darkMode)),
              }}
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => setShowCustom(v => !v)}
            style={{
              padding: '4px 12px', borderRadius: 20, cursor: 'pointer',
              fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 600,
              transition: 'all 0.2s',
              ...(preset === 'custom' ? activePresetStyle : inactivePresetStyle(darkMode)),
            }}
          >
            Custom Range
          </button>
        </div>

        {/* Active range display */}
        <div style={{ marginRight: 'auto', fontFamily: "'Inter',sans-serif", fontSize: 10, color: txt2 }}>
          {new Date(dateRange.start).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}
          {' – '}
          {new Date(dateRange.end).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}
        </div>

        {showCustom && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="date" value={cStart}
              min={toInputVal(DATA_START)} max={toInputVal(DATA_END)}
              onChange={e => setCStart(e.target.value)}
              style={{
                padding: '4px 8px', borderRadius: 7, border: `1px solid ${border}`,
                background: darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
                color: txt1, fontSize: 11, fontFamily: "'Inter',sans-serif",
                outline: 'none', cursor: 'pointer',
              }}
            />
            <span style={{ color: txt2, fontSize: 10 }}>to</span>
            <input
              type="date" value={cEnd}
              min={toInputVal(DATA_START)} max={toInputVal(DATA_END)}
              onChange={e => setCEnd(e.target.value)}
              style={{
                padding: '4px 8px', borderRadius: 7, border: `1px solid ${border}`,
                background: darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
                color: txt1, fontSize: 11, fontFamily: "'Inter',sans-serif",
                outline: 'none', cursor: 'pointer',
              }}
            />
            <button
              onClick={() => {
                if (cStart && cEnd) {
                  setDateRange({ start: new Date(cStart), end: new Date(cEnd) });
                  setShowCustom(false);
                }
              }}
              style={{
                padding: '4px 14px', borderRadius: 7,
                background: 'linear-gradient(135deg,#2563eb,#0ea5e9)',
                border: 'none', color: '#fff', fontSize: 10, fontWeight: 700,
                cursor: 'pointer', fontFamily: "'Inter',sans-serif",
              }}
            >
              Apply
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
