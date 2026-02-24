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
  const { darkMode, toggleDarkMode, preset, setPreset, dateRange, setDateRange, snowEffectEnabled, toggleSnowEffect } = useDashboard();
  const [showCustom, setShowCustom] = useState(false);
  const [cStart, setCStart] = useState(toInputVal(DATA_START));
  const [cEnd,   setCEnd]   = useState(toInputVal(DATA_END));

  // Three-state toggle: Light -> Dark -> Snow -> Light
  const handleThreeStateToggle = () => {
    if (snowEffectEnabled) {
      // Snow → Light: disable snow and light mode
      toggleSnowEffect();
      if (darkMode) toggleDarkMode();
    } else if (darkMode) {
      // Dark → Snow: enable snow
      toggleSnowEffect();
    } else {
      // Light → Dark: enable dark mode
      toggleDarkMode();
    }
  };

  // Determine current state
  const getToggleState = () => {
    if (snowEffectEnabled) return 'snow';
    if (darkMode) return 'dark';
    return 'light';
  };

  const state = getToggleState();

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
      borderBottom: `2px solid ${darkMode ? 'rgba(59,130,246,0.3)' : 'rgba(37,99,235,0.3)'}`,
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
            background: 'linear-gradient(135deg,#2563eb,#0ea5e9,#10b981)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            margin: 0,
            textShadow: 'none',
          }}>
            HSE Dashboard
          </h1>
          <div style={{ fontFamily: "'Vazir','Vazirmatn',sans-serif", fontSize: 10, color: txt2, marginTop: 2 }}>
            Sepehr Pasargad E&P — N.I.O.C. &nbsp;|&nbsp; {todayStr}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* LTI Free */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(16,185,129,0.15)',
            border: '1px solid rgba(16,185,129,0.4)',
            borderRadius: 10, padding: '6px 12px',
            boxShadow: '0 0 12px rgba(16,185,129,0.25)',
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: '#10b981', fontWeight: 700 }}>
            LTI FREE
          </span>
          </div>
        </div>

        {/* Sliding Three-Position Rail Toggle (Light / Dark / Snow) */}
        <div
          role="switch"
          aria-checked={state !== 'light'}
          onClick={handleThreeStateToggle}
          title={state === 'light' ? 'Switch to Dark' : state === 'dark' ? 'Enable Snow' : 'Switch to Light'}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 0, borderRadius: 12,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer', transition: 'all 0.25s ease',
          }}
        >
          <div style={{ position: 'relative', width: 96, height: 36, borderRadius: 20, padding: 4, background: state === 'snow' ? 'linear-gradient(90deg,#2563eb22,#60a5fa22)' : state === 'dark' ? 'linear-gradient(90deg,#111827, #0b1220)' : 'linear-gradient(90deg,#e6f0ff,#eef7ff)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)' }}>
            {/* Track labels (visually subtle) */}
            <div style={{ position: 'absolute', left: 8, top: 6, fontSize: 10, color: state === 'light' ? '#0f1e35' : '#94a3b8' }} />
            <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 6, fontSize: 10, color: state === 'dark' ? '#e2e8f0' : '#94a3b8' }} />
            <div style={{ position: 'absolute', right: 8, top: 6, fontSize: 10, color: state === 'snow' ? '#e2e8f0' : '#94a3b8' }} />

            {/* Knob */}
            <div style={{
              position: 'absolute', top: 4, left: state === 'light' ? 6 : state === 'dark' ? 'calc(50% - 16px)' : 62,
              width: 28, height: 28, borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'left 320ms cubic-bezier(.2,.9,.2,1), background 220ms',
              background: state === 'snow' ? '#dff1ff' : state === 'dark' ? '#11182a' : '#ffffff',
              border: `1px solid ${state === 'snow' ? 'rgba(37,99,235,0.25)' : state === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
              boxShadow: state === 'dark' ? '0 6px 18px rgba(2,6,23,0.6)' : '0 6px 18px rgba(2,6,23,0.12)'
            }}>
              {state === 'light' && <Sun size={14} />}
              {state === 'dark' && <Moon size={14} />}
              {state === 'snow' && <span style={{ fontSize: 14 }}>❄️</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Date filter row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <CalendarRange size={15} color={darkMode ? '#3b82f6' : '#2563eb'} />
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: darkMode ? '#3b82f6' : '#2563eb', fontWeight: 700 }}>
            Date Filter:
          </span>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {PRESETS.map(p => (
            <button
              key={p.key}
              onClick={() => { setPreset(p.key); setShowCustom(false); }}
              style={{
                padding: '6px 14px', borderRadius: 22, cursor: 'pointer',
                fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600,
                transition: 'all 0.3s',
                ...(preset === p.key ? activePresetStyle : inactivePresetStyle(darkMode)),
              }}
              onMouseEnter={e => {
                if (preset !== p.key) {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.transform = 'translateY(0)';
              }}
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => setShowCustom(v => !v)}
            style={{
              padding: '6px 14px', borderRadius: 22, cursor: 'pointer',
              fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600,
              transition: 'all 0.3s',
              ...(preset === 'custom' ? activePresetStyle : inactivePresetStyle(darkMode)),
            }}
            onMouseEnter={e => {
              if (preset !== 'custom') {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.transform = 'translateY(0)';
            }}
          >
            📅 Custom
          </button>
        </div>

        {/* Active range display */}
        <div style={{
          marginLeft: 'auto',
          fontFamily: "'Orbitron',monospace",
          fontSize: 11,
          color: darkMode ? '#06b6d4' : '#0ea5e9',
          fontWeight: 600,
          background: darkMode ? 'rgba(6,182,212,0.1)' : 'rgba(14,165,233,0.15)',
          padding: '4px 10px',
          borderRadius: 8,
          border: `1px solid ${darkMode ? 'rgba(6,182,212,0.3)' : 'rgba(14,165,233,0.4)'}`,
        }}>
          {new Date(dateRange.start).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})} – {new Date(dateRange.end).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}
        </div>

        {showCustom && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input
                type="date" value={cStart}
                min={toInputVal(DATA_START)} max={toInputVal(DATA_END)}
                onChange={e => setCStart(e.target.value)}
                style={{
                  padding: '6px 10px', borderRadius: 8, border: `1.5px solid ${darkMode ? 'rgba(59,130,246,0.5)' : 'rgba(37,99,235,0.5)'}`,
                  background: darkMode ? 'rgba(59,130,246,0.08)' : 'rgba(37,99,235,0.08)',
                  color: txt1, fontSize: 12, fontFamily: "'Orbitron',monospace", fontWeight: 600,
                  outline: 'none', cursor: 'pointer', transition: 'all 0.2s',
                }}
                onFocus={e => {
                  (e.currentTarget as HTMLInputElement).style.borderColor = darkMode ? 'rgba(59,130,246,0.8)' : 'rgba(37,99,235,0.8)';
                  (e.currentTarget as HTMLInputElement).style.boxShadow = darkMode ? '0 0 8px rgba(59,130,246,0.3)' : '0 0 8px rgba(37,99,235,0.3)';
                }}
                onBlur={e => {
                  (e.currentTarget as HTMLInputElement).style.boxShadow = 'none';
                }}
              />
              <span style={{ color: txt2, fontSize: 11, fontWeight: 600 }}>until</span>
              <input
                type="date" value={cEnd}
                min={toInputVal(DATA_START)} max={toInputVal(DATA_END)}
                onChange={e => setCEnd(e.target.value)}
                style={{
                  padding: '6px 10px', borderRadius: 8, border: `1.5px solid ${darkMode ? 'rgba(59,130,246,0.5)' : 'rgba(37,99,235,0.5)'}`,
                  background: darkMode ? 'rgba(59,130,246,0.08)' : 'rgba(37,99,235,0.08)',
                  color: txt1, fontSize: 12, fontFamily: "'Orbitron',monospace", fontWeight: 600,
                  outline: 'none', cursor: 'pointer', transition: 'all 0.2s',
                }}
                onFocus={e => {
                  (e.currentTarget as HTMLInputElement).style.borderColor = darkMode ? 'rgba(59,130,246,0.8)' : 'rgba(37,99,235,0.8)';
                  (e.currentTarget as HTMLInputElement).style.boxShadow = darkMode ? '0 0 8px rgba(59,130,246,0.3)' : '0 0 8px rgba(37,99,235,0.3)';
                }}
                onBlur={e => {
                  (e.currentTarget as HTMLInputElement).style.boxShadow = 'none';
                }}
              />
            </div>
            <button
              onClick={() => {
                if (cStart && cEnd) {
                  setDateRange({ start: new Date(cStart), end: new Date(cEnd) });
                  setShowCustom(false);
                  setPreset('custom');
                }
              }}
              style={{
                padding: '6px 16px', borderRadius: 8,
                background: 'linear-gradient(135deg,#2563eb,#0ea5e9)',
                border: 'none', color: '#fff', fontSize: 11, fontWeight: 700,
                cursor: 'pointer', fontFamily: "'Inter',sans-serif",
                transition: 'all 0.3s',
                boxShadow: '0 2px 8px rgba(37,99,235,0.4)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.transform = 'translateY(-2px)';
                el.style.boxShadow = '0 4px 16px rgba(37,99,235,0.6)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = '0 2px 8px rgba(37,99,235,0.4)';
              }}
            >
              ✓ Apply
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
