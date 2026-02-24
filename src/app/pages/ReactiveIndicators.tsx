import { ReactNode } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { KpiCard } from '../components/KpiCard';
import { IndicatorCard } from '../components/IndicatorCard';

function fmt(n: number) { return n.toLocaleString(); }
function fmtR(s: string) { return s; }

function calculateTrend(current: number, previous: number): { trend: 'up' | 'down' | 'neutral'; percent: number } {
  if (previous === 0 && current === 0) return { trend: 'neutral', percent: 0 };
  if (previous === 0) return { trend: 'up', percent: 100 };
  const change = ((current - previous) / previous) * 100;
  return {
    trend: change > 5 ? 'up' : change < -5 ? 'down' : 'neutral',
    percent: change,
  };
}

export function ReactiveIndicators() {
  const { metrics: m, monthly, darkMode } = useDashboard();

  const txt1   = darkMode ? '#e2e8f0' : '#0f1e35';
  const txt2   = darkMode ? '#64748b' : '#4a6080';
  const cardBg = darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)';
  const border = darkMode ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.1)';

  const indSt = (v: number, type: 'danger' | 'warn') =>
    v === 0 ? 'zero' : type;

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
      <SectionTitle>🔴 Lagging Indicators — شاخص‌های واکنشی</SectionTitle>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(105px, 1fr))',
        gap: 9, marginBottom: 20,
      }}>
        <IndicatorCard icon="💀" label="Fatality" value={m.Fat}
          status={indSt(m.Fat,'danger')} dark={darkMode} tooltip="تعداد فوتی" />
        <IndicatorCard icon="🚑" label="Lost Time Injury" value={m.LTI}
          status={indSt(m.LTI,'danger')} dark={darkMode} tooltip="آسیب با از دست دادن زمان کاری" />
        <IndicatorCard icon="🏥" label="Medical Treatment" value={m.MTC}
          status={indSt(m.MTC,'warn')} dark={darkMode} tooltip="موارد درمان پزشکی" />
        <IndicatorCard icon="⛑️" label="Restricted Work" value={m.RWC}
          status={indSt(m.RWC,'warn')} dark={darkMode} tooltip="موارد کار محدود" />
        <IndicatorCard icon="🩹" label="First Aid Case" value={m.FAC}
          status={indSt(m.FAC,'warn')} dark={darkMode} tooltip="موارد کمک اولیه" />
        <IndicatorCard icon="🦠" label="Occupational Illness" value={m.OI}
          status={indSt(m.OI,'warn')} dark={darkMode} tooltip="بیماری شغلی" />
        <IndicatorCard icon="🚗" label="Land Transport Acc." value={m.LTA}
          status={indSt(m.LTA,'danger')} dark={darkMode} tooltip="تصادف حمل‌ونقل زمینی" />
        <IndicatorCard icon="✈️" label="Air Transport Acc." value={m.ATA}
          status={indSt(m.ATA,'danger')} dark={darkMode} tooltip="تصادف هوایی" />
        <IndicatorCard icon="🔥" label="Fire" value={m.FireN}
          status={indSt(m.FireN,'danger')} dark={darkMode} tooltip="آتش‌سوزی" />
        <IndicatorCard icon="💥" label="Property Damage" value={m.PD}
          status={indSt(m.PD,'warn')} dark={darkMode} tooltip="خسارت به اموال" />
        <IndicatorCard icon="⚡" label="Near Miss" value={m.NM}
          status={indSt(m.NM,'warn')} dark={darkMode} tooltip="رویداد قریب‌الوقوع" />
        <IndicatorCard icon="👥" label="Third Party Acc." value={m.TPA}
          status={indSt(m.TPA,'warn')} dark={darkMode} tooltip="حادثه طرف ثالث" />
        <IndicatorCard icon="🌿" label="Environmental" value={m.EC}
          status={indSt(m.EC,'warn')} dark={darkMode} tooltip="موارد زیست‌محیطی" />
        <IndicatorCard icon="📅" label="Lost Work Days" value={m.LWD}
          status={m.LWD === 0 ? 'zero' : 'warn'} dark={darkMode} tooltip="روزهای کاری از دست رفته" />
        <IndicatorCard icon="📋" label="Total Recordable" value={m.TRC}
          status={m.TRC === 0 ? 'zero' : 'warn'} dark={darkMode} tooltip="مجموع موارد قابل ثبت" />
        <IndicatorCard icon="👁️" label="Unsafe Acts/Cond." value={m.UAC}
          status={m.UAC === 0 ? 'zero' : 'warn'} dark={darkMode} tooltip="اعمال و شرایط ناایمن" />
      </div>

      <SectionTitle>📊 Safety Performance Rates — نرخ‌های عملکرد ایمنی</SectionTitle>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { title: 'LTIFR', sub: 'LTI Frequency Rate', val: fmtR(m.LTIFR), desc: 'per 200,000 man-hours', badge: m.LTIFR === '0.0000' },
          { title: 'TRCFR', sub: 'Total Recordable Case FR', val: fmtR(m.TRCFR), desc: 'per 200,000 man-hours', badge: null },
          { title: 'LTSR',  sub: 'LTI Severity Rate', val: fmtR(m.LTSR), desc: 'per 200,000 man-hours', badge: null },
        ].map(r => (
          <div key={r.title} style={{
            background: cardBg, border: `1px solid ${border}`,
            borderRadius: 13, padding: 16, textAlign: 'center',
            backdropFilter: 'blur(12px)',
          }}>
            <div style={{ fontFamily: "'Vazirmatn',sans-serif", fontSize: 9, color: txt2, fontWeight: 600, marginBottom: 8 }}>
              {r.sub}
            </div>
            <div style={{
              fontFamily: "'Vazirmatn',sans-serif", fontWeight: 900,
              fontSize: 'clamp(18px,2vw,26px)', color: '#06b6d4',
            }}>
              {r.val}
            </div>
            <div style={{ fontFamily: "'Vazirmatn',sans-serif", fontSize: 9, color: txt2, marginTop: 4 }}>{r.desc}</div>
            {r.badge !== null && (
              <div style={{ marginTop: 9 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                  padding: '3px 10px', borderRadius: 20, fontSize: 9, fontWeight: 700,
                  background: r.badge ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                  color: r.badge ? '#10b981' : '#ef4444',
                  border: `1px solid ${r.badge ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                }}>
                  {r.badge ? '✅ Zero LTIFR' : '⚠️ Above Zero'}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <SectionTitle>📦 Cumulative Totals — مجموع تجمعی (شامل داده تاریخی)</SectionTitle>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 10 }}>
        <KpiCard label="LTI (Cumulative)" value={fmt(m.CombLTI)} sub="incl. historical" variant="blue" dark={darkMode}
          trend={m.CombLTI === 0 ? 'down' : 'neutral'} />
        <KpiCard label="FAC (Cumulative)" value={fmt(m.CombFAC)} sub="incl. historical" variant="orange" dark={darkMode}
          trend={m.CombFAC === 0 ? 'down' : 'neutral'} />
        <KpiCard label="MTC (Cumulative)" value={fmt(m.CombMTC)} sub="incl. historical" variant="purple" dark={darkMode}
          trend={m.CombMTC === 0 ? 'down' : 'neutral'} />
        <KpiCard label="Near Miss (Cumul.)" value={fmt(m.CombNM)} sub="incl. historical" variant="cyan" dark={darkMode}
          trend={calculateTrend(m.NM, m.CombNM > 0 ? m.CombNM / 12 : 0).trend} />
        <KpiCard label="LTI Free Days" value={fmt(m.LTID)} sub="Since Sep 23, 2023" variant="green" dark={darkMode}
          trend="up" />
        <KpiCard label="Man-Hours (Cumul.)" value={fmt(m.CombMH)} sub="cumulative" variant="blue" dark={darkMode}
          trend="up" />
      </div>
    </div>
  );
}