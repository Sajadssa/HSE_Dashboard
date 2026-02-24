import { ReactNode } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { KpiCard } from '../components/KpiCard';
import { IndicatorCard } from '../components/IndicatorCard';

function fmt(n: number) { return n.toLocaleString(); }

function calculateTrend(current: number, previous: number): { trend: 'up' | 'down' | 'neutral'; percent: number } {
  if (previous === 0) return { trend: 'neutral', percent: 0 };
  const change = ((current - previous) / previous) * 100;
  return {
    trend: change > 0.5 ? 'up' : change < -0.5 ? 'down' : 'neutral',
    percent: change,
  };
}

export function ProactiveIndicators() {
  const { metrics: m, monthly, darkMode } = useDashboard();

  const txt1   = darkMode ? '#e2e8f0' : '#0f1e35';
  const txt2   = darkMode ? '#64748b' : '#4a6080';
  const cardBg = darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)';
  const border = darkMode ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.1)';

  const SectionTitle = ({ children }: { children: ReactNode }) => (
    <div style={{
      fontFamily: "'Vazirmatn',sans-serif", fontSize: 11, fontWeight: 700,
      color: txt2, textTransform: 'uppercase', letterSpacing: '0.8px',
      marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {children}
      <div style={{ flex: 1, height: 1, background: border }} />
    </div>
  );

  return (
    <div>
      <SectionTitle>🛡️ Leading Indicators — شاخص‌های پیشگیرانه</SectionTitle>

      {/* Big 3 cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 20 }}>
        {/* Stop Card */}
        <div style={{
          background: cardBg, border: `1px solid ${border}`,
          borderRadius: 14, overflow: 'hidden', backdropFilter: 'blur(12px)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px',
            borderBottom: `1px solid ${border}`, fontWeight: 700, fontSize: 12, color: txt1,
            fontFamily: "'Inter',sans-serif",
          }}>
            🏃 Stop / Smart Card
          </div>
          <div style={{ padding: 16, textAlign: 'center' }}>
            <div style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: 'clamp(32px,4.5vw,52px)', color: '#f59e0b' }}>
              {fmt(m.SC)}
            </div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 9, color: txt2, margin: '3px 0' }}>Current Period</div>
            <div style={{
              marginTop: 10, padding: 9,
              background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.22)',
              borderRadius: 9,
            }}>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 9, color: txt2 }}>Cumulative (incl. historical)</div>
              <div style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: 24, color: '#f59e0b' }}>
                {fmt(m.CombSC)}
              </div>
            </div>
          </div>
        </div>

        {/* HSE Training */}
        <div style={{
          background: cardBg, border: `1px solid ${border}`,
          borderRadius: 14, overflow: 'hidden', backdropFilter: 'blur(12px)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px',
            borderBottom: `1px solid ${border}`, fontWeight: 700, fontSize: 12, color: txt1,
            fontFamily: "'Inter',sans-serif",
          }}>
            📚 HSE Training (Man-hrs)
          </div>
          <div style={{ padding: 16, textAlign: 'center' }}>
            <div style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: 'clamp(32px,4.5vw,52px)', color: '#3b82f6' }}>
              {fmt(m.HTR)}
            </div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 9, color: txt2, margin: '3px 0' }}>Man-Hours This Period</div>
            <div style={{
              marginTop: 10, padding: 9,
              background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.22)',
              borderRadius: 9,
            }}>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 9, color: txt2 }}>Cumulative</div>
              <div style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: 24, color: '#3b82f6' }}>
                {fmt(m.CombHTR)}
              </div>
            </div>
          </div>
        </div>

        {/* PTW */}
        <div style={{
          background: cardBg, border: `1px solid ${border}`,
          borderRadius: 14, overflow: 'hidden', backdropFilter: 'blur(12px)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px',
            borderBottom: `1px solid ${border}`, fontWeight: 700, fontSize: 12, color: txt1,
            fontFamily: "'Inter',sans-serif",
          }}>
            📄 Permit to Work (PTW)
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', gap: 7 }}>
              {[
                { label: '❄️ Cold Work', val: m.PTWC, color: '#06b6d4' },
                { label: '🔥 Hot Work',  val: m.PTWH, color: '#ef4444' },
                { label: '⚡ HNF Work',  val: m.PNHF, color: '#f59e0b' },
              ].map(p => (
                <div key={p.label} style={{
                  flex: 1, background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                  border: `1px solid ${border}`, borderRadius: 9, padding: 9, textAlign: 'center',
                }}>
                  <div style={{ fontFamily: "'Vazirmatn',sans-serif", fontSize: 8, color: txt2, marginBottom: 3 }}>{p.label}</div>
                  <div style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: 18, color: p.color }}>
                    {fmt(p.val)}
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              textAlign: 'center', marginTop: 9, padding: 9,
              background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.22)',
              borderRadius: 9,
            }}>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 9, color: txt2 }}>Total PTW</div>
              <div style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: 26, color: '#a78bfa' }}>
                {fmt(m.PTWTot)}
              </div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 9, color: txt2 }}>
                Cumul: {fmt(m.CombPTW)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SectionTitle>🤝 Safety Activities — فعالیت‌های ایمنی</SectionTitle>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(105px, 1fr))',
        gap: 9, marginBottom: 20,
      }}>
        <IndicatorCard icon="🗣️" label="Pre-Job Safety Mtg" value={fmt(m.PJSM)} status="info" dark={darkMode} tooltip="جلسه ایمنی قبل از شروع کار" />
        <IndicatorCard icon="📢" label="HSE Meeting"       value={fmt(m.HSEM)} status="info" dark={darkMode} tooltip="جلسات کمیته HSE" />
        <IndicatorCard icon="🎓" label="HSE Induction"     value={fmt(m.HSEI)} status="info" dark={darkMode} tooltip="آموزش آشنایی اولیه HSE" />
        <IndicatorCard icon="🔧" label="Toolbox Meeting"   value={fmt(m.TBM)}  status="info" dark={darkMode} tooltip="جلسه جعبه ابزار" />
        <IndicatorCard icon="🚒" label="Emergency Drill"   value={fmt(m.Drl)}  status="info" dark={darkMode} tooltip="مانور اضطراری" />
        <IndicatorCard icon="🔍" label="Inspection"        value={fmt(m.Ins)}  status="info" dark={darkMode} tooltip="بازرسی HSE" />
        <IndicatorCard icon="✅" label="Audit"             value={fmt(m.Aud)}  status="info" dark={darkMode} tooltip="ممیزی داخلی/خارجی" />
        <IndicatorCard icon="🩺" label="Pre-Employ Medical" value={fmt(m.PreM)} status="info" dark={darkMode} tooltip="معاینات پزشکی بدو استخدام" />
        <IndicatorCard icon="💊" label="Periodical Medical" value={fmt(m.PerM)} status="info" dark={darkMode} tooltip="معاینات پزشکی دوره‌ای" />
      </div>

      <SectionTitle>📊 Cumulative Proactive Summary — خلاصه تجمعی</SectionTitle>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 10 }}>
        <KpiCard label="Stop Card (Cumul.)"     value={fmt(m.CombSC)}   sub="incl. 539 historical" variant="orange" dark={darkMode}
          trend="up" />
        <KpiCard label="Training MH (Cumul.)"   value={fmt(m.CombHTR)}  sub="incl. 3,471 historical" variant="blue" dark={darkMode}
          trend={calculateTrend(m.HTR, m.CombHTR > 0 ? m.CombHTR / 24 : 0).trend} />
        <KpiCard label="HSE Meeting (Cumul.)"   value={fmt(m.CombHSEM)} sub="incl. 58 historical" variant="cyan" dark={darkMode}
          trend="up" />
        <KpiCard label="PTW Total (Cumul.)"     value={fmt(m.CombPTW)}  sub="incl. 3,992 historical" variant="purple" dark={darkMode}
          trend="up" />
        <KpiCard label="Audit (Cumul.)"         value={fmt(m.CombAud)}  sub="incl. 3 historical" variant="green" dark={darkMode}
          trend="up" />
        <KpiCard label="Drill (Cumul.)"         value={fmt(m.CombDrl)}  sub="incl. 38 historical" variant="green" dark={darkMode}
          trend="up" />
      </div>
    </div>
  );
}