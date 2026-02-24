import { ReactNode } from 'react';
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PolarRadiusAxis,
} from 'recharts';
import { useDashboard } from '../context/DashboardContext';
import { KpiCard } from '../components/KpiCard';

function fmt(n: number) { return n.toLocaleString(); }

export function Analysis() {
  const { metrics: m, monthly, darkMode } = useDashboard();

  const txt1   = darkMode ? '#e2e8f0' : '#0f1e35';
  const txt2   = darkMode ? '#64748b' : '#4a6080';
  const cardBg = darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)';
  const border = darkMode ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.1)';
  const gridC  = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.07)';

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

  const Card = ({ title, children }: { title: ReactNode; children: ReactNode }) => (
    <div style={{
      background: cardBg, border: `1px solid ${border}`,
      borderRadius: 14, overflow: 'hidden', backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '13px 16px',
        borderBottom: `1px solid ${border}`, fontWeight: 700, fontSize: 12, color: txt1,
        fontFamily: "'Inter',sans-serif",
      }}>
        {title}
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  );

  // Radar KPI data
  const radarData = [
    { subject: 'LTIFR', A: parseFloat(m.LTIFR) === 0 ? 100 : Math.max(0, 100 - parseFloat(m.LTIFR) * 100) },
    { subject: 'TRCFR', A: parseFloat(m.TRCFR) === 0 ? 100 : Math.max(0, 100 - parseFloat(m.TRCFR) * 100) },
    { subject: 'LTI Free', A: Math.min(100, (m.LTID / 900) * 100) },
    { subject: 'Proactive', A: Math.min(100, (m.LLBarPct)) },
    { subject: 'Training', A: Math.min(100, (m.HTR / 5000) * 100) },
    { subject: 'Near Miss', A: m.NM === 0 ? 100 : Math.max(0, 100 - m.NM * 10) },
  ];

  // Incident breakdown bar
  const incidentData = [
    { name: 'FAC',     val: m.FAC,   color: '#f59e0b' },
    { name: 'MTC',     val: m.MTC,   color: '#8b5cf6' },
    { name: 'RWC',     val: m.RWC,   color: '#f97316' },
    { name: 'NM',      val: m.NM,    color: '#06b6d4' },
    { name: 'UAC',     val: m.UAC,   color: '#ef4444' },
    { name: 'PD',      val: m.PD,    color: '#94a3b8' },
  ];

  // Monthly slice for charts - take last 12 months max
  const chartData = monthly.slice(-12);

  return (
    <div>
      <SectionTitle>📊 Safety Performance Analysis — تحلیل عملکرد ایمنی</SectionTitle>

      {/* KPI Performance Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 10, marginBottom: 20 }}>
        <KpiCard label="LTI Free Days"  value={fmt(m.LTID)} sub="Since Sep 23, 2023" variant="green"  dark={darkMode} />
        <KpiCard label="LTIFR"          value={m.LTIFR}     sub="per 200k man-hrs"   variant="blue"   dark={darkMode} />
        <KpiCard label="TRCFR"          value={m.TRCFR}     sub="per 200k man-hrs"   variant="purple" dark={darkMode} />
        <KpiCard label="LTSR"           value={m.LTSR}      sub="per 200k man-hrs"   variant="cyan"   dark={darkMode} />
        <KpiCard label="LTI Free MH"    value={fmt(m.CombMH)} sub="cumulative"        variant="green"  dark={darkMode} />
      </div>

      {/* Charts row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        {/* Manhours area chart */}
        <Card title={<><span>⏱️</span> Monthly Man-Hours Trend</>}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <defs>
                <linearGradient id="mhGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridC} />
              <XAxis dataKey="month" tick={{ fill: txt2, fontSize: 9 }} tickLine={false} />
              <YAxis tick={{ fill: txt2, fontSize: 9 }} tickLine={false} axisLine={false}
                tickFormatter={v => (v/1000).toFixed(0)+'k'} />
              <Tooltip
                contentStyle={{ background: darkMode ? '#0f1a2e' : '#fff', border: `1px solid ${border}`, borderRadius: 8, fontSize: 10 }}
                formatter={(v: number) => [fmt(v), 'Man-Hours']}
              />
              <Area type="monotone" dataKey="TMH" stroke="#3b82f6" fill="url(#mhGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Safety Radar */}
        <Card title={<><span>🎯</span> Safety Performance Radar</>}>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={gridC} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: txt2, fontSize: 9 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Score" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
              <Tooltip
                contentStyle={{ background: darkMode ? '#0f1a2e' : '#fff', border: `1px solid ${border}`, borderRadius: 8, fontSize: 10 }}
                formatter={(v: number) => [`${v.toFixed(1)}`, 'Score']}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginBottom: 14 }}>
        {/* Personnel monthly bar */}
        <Card title={<><span>👥</span> Monthly Personnel Average (Avg/day)</>}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridC} />
              <XAxis dataKey="month" tick={{ fill: txt2, fontSize: 9 }} tickLine={false} />
              <YAxis tick={{ fill: txt2, fontSize: 9 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: darkMode ? '#0f1a2e' : '#fff', border: `1px solid ${border}`, borderRadius: 8, fontSize: 10 }}
              />
              <Legend wrapperStyle={{ fontSize: 9 }} />
              <Bar dataKey="OP" name="Office"     fill="#3b82f6" radius={[3,3,0,0]} />
              <Bar dataKey="SP" name="Site"       fill="#8b5cf6" radius={[3,3,0,0]} />
              <Bar dataKey="CP" name="Contractor" fill="#f59e0b" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Incident breakdown */}
        <Card title={<><span>⚠️</span> Incident Breakdown</>}>
          {incidentData.map(item => (
            <div key={item.name} style={{ marginBottom: 9 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, color: txt2 }}>{item.name}</span>
                <span style={{ fontFamily: "'Orbitron',monospace", fontSize: 10, fontWeight: 700, color: item.color }}>
                  {fmt(item.val)}
                </span>
              </div>
              <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 3,
                  background: item.color,
                  width: `${Math.min(100, item.val === 0 ? 3 : (item.val / Math.max(...incidentData.map(d=>d.val||1))) * 100)}%`,
                  transition: 'width 1s ease',
                }} />
              </div>
            </div>
          ))}
        </Card>
      </div>

      <SectionTitle>⚖️ Leading vs Lagging Ratio — نسبت شاخص‌های پیشگیرانه به واکنشی</SectionTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <Card title={<><span>⚖️</span> Proactive vs Reactive Balance</>}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
            <div style={{
              flex: 1, textAlign: 'center', padding: 11,
              background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: 9,
            }}>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 9, color: '#10b981', fontWeight: 600, marginBottom: 3 }}>✅ Proactive Total</div>
              <div style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: 'clamp(24px,3.5vw,40px)', color: '#10b981' }}>
                {fmt(m.TotProac)}
              </div>
            </div>
            <div style={{ fontSize: 16, color: txt2 }}>vs</div>
            <div style={{
              flex: 1, textAlign: 'center', padding: 11,
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 9,
            }}>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 9, color: '#ef4444', fontWeight: 600, marginBottom: 3 }}>⚠️ Reactive Total</div>
              <div style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: 'clamp(24px,3.5vw,40px)', color: '#ef4444' }}>
                {fmt(m.TotReac)}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, color: txt2 }}>Safety Culture Ratio — نسبت فرهنگ ایمنی</div>
            <div style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: 'clamp(20px,3vw,32px)', color: '#06b6d4' }}>
              {m.LLRatio} : 1
            </div>
            <div style={{ fontFamily: "'Vazirmatn',sans-serif", fontSize: 9, color: txt2, margin: '5px 0 9px' }}>
              نسبت بالاتر = فرهنگ ایمنی قوی‌تر
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 4,
                background: 'linear-gradient(90deg,#10b981,#06b6d4)',
                width: `${m.LLBarPct}%`,
                transition: 'width 1.5s ease',
                boxShadow: '0 0 12px rgba(16,185,129,0.5)',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontFamily: "'Inter',sans-serif", fontSize: 8, color: txt2 }}>
              <span>0%</span><span>{m.LLBarPct}%</span><span>100%</span>
            </div>
          </div>
        </Card>

        {/* Heinrich pyramid */}
        <Card title={<><span>🔺</span> Safety Incident Pyramid — هرم ایمنی</>}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            {[
              { emoji: '💀', label: 'Fatality', val: m.Fat,  w: '10%',  bg: 'rgba(239,68,68,0.85)' },
              { emoji: '🚑', label: 'LTI',      val: m.LTI,  w: '22%',  bg: 'rgba(220,38,38,0.65)' },
              { emoji: '🏥', label: 'MTC',       val: m.MTC,  w: '36%',  bg: 'rgba(245,158,11,0.65)' },
              { emoji: '⛑️', label: 'RWC',       val: m.RWC,  w: '50%',  bg: 'rgba(234,179,8,0.55)' },
              { emoji: '🩹', label: 'FAC',       val: m.FAC,  w: '64%',  bg: 'rgba(34,197,94,0.55)' },
              { emoji: '⚡', label: 'Near Miss', val: m.NM,   w: '78%',  bg: 'rgba(59,130,246,0.5)' },
              { emoji: '👁️', label: 'Unsafe',   val: m.UAC,  w: '93%',  bg: 'rgba(139,92,246,0.4)' },
            ].map(p => (
              <div key={p.label} style={{
                width: p.w, borderRadius: 7,
                background: p.bg, padding: '5px 10px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                fontSize: 10, fontWeight: 600, color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)',
                cursor: 'default', transition: 'all 0.2s',
              }}>
                <span>{p.emoji} {p.label}</span>
                <span style={{ fontFamily: "'Orbitron',monospace" }}>{p.val}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 8, fontFamily: "'Inter',sans-serif", fontSize: 8, color: txt2 }}>
            Heinrich Safety Pyramid — 1:10:30:600 Rule
          </div>
        </Card>
      </div>

      {/* Environmental */}
      <SectionTitle>🌍 Environmental Metrics — شاخص‌های زیست‌محیطی</SectionTitle>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 9 }}>
        {[
          { label: '💧 Potable Water',     val: fmt(m.PW),         unit: 'Liter',  bg: 'rgba(6,182,212,0.08)',  border: 'rgba(6,182,212,0.2)',  color: '#06b6d4' },
          { label: '🏭 Oper. Water',        val: fmt(m.OW),         unit: 'Liter',  bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', color: '#3b82f6' },
          { label: '💧 Total Water',         val: fmt(m.TotalWater), unit: 'Liter',  bg: 'rgba(45,212,191,0.08)', border: 'rgba(45,212,191,0.2)', color: '#2dd4bf' },
          { label: '⛽ Gasoline',            val: fmt(m.GL),         unit: 'Liter',  bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', color: '#f59e0b' },
          { label: '⛽ Diesel',              val: fmt(m.DL),         unit: 'Liter',  bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', color: '#fbbf24' },
          { label: '🛢️ Other Fuel',         val: fmt(m.OFL),        unit: 'Liter',  bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', color: '#d97706' },
          { label: '⛽ Total Fuel',          val: fmt(m.TotalFuel),  unit: 'Liter',  bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)', color: '#f59e0b' },
          { label: '🔥 Natural Gas',         val: fmt(m.GM3),        unit: 'M³',     bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.2)',  color: '#ef4444' },
          { label: '🗑️ Solid Waste',        val: fmt(m.SW),         unit: 'Kg',     bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)', color: '#a78bfa' },
          { label: '💧 Waste Water',         val: fmt(m.WW),         unit: 'Liter',  bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)', color: '#8b5cf6' },
        ].map(e => (
          <div key={e.label} style={{
            background: e.bg, border: `1px solid ${e.border}`,
            borderRadius: 10, padding: 10, textAlign: 'center',
          }}>
            <div style={{ fontFamily: "'Vazirmatn',sans-serif", fontSize: 9, color: txt2, marginBottom: 5 }}>{e.label}</div>
            <div style={{ fontFamily: "'Orbitron',monospace", fontWeight: 800, fontSize: 15, color: e.color }}>{e.val}</div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 8, color: txt2, marginTop: 2 }}>{e.unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
}