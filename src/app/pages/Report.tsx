import { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { useDashboard } from '../context/DashboardContext';
import { LayoutDashboard, AlertTriangle, Shield, BarChart2, ExternalLink } from 'lucide-react';

function fmt(n: number) { return n.toLocaleString(); }

export function Report() {
  const { metrics: m, dateRange, darkMode } = useDashboard();
  const navigate = useNavigate();

  const txt1   = darkMode ? '#e2e8f0' : '#0f1e35';
  const txt2   = darkMode ? '#64748b' : '#4a6080';
  const cardBg = darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)';
  const border = darkMode ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.1)';

  const today  = new Date(2026, 1, 24);
  const todayStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const fromStr  = dateRange.start.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const toStr    = dateRange.end.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const SectionTitle = ({ children }: { children: ReactNode }) => (
    <div style={{
      fontFamily: "'Vazir','Vazirmatn',sans-serif", fontSize: 11, fontWeight: 700,
      color: txt2, textTransform: 'uppercase', letterSpacing: '0.8px',
      marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {children}
      <div style={{ flex: 1, height: 1, background: border }} />
    </div>
  );

  const TableCard = ({ title, children }: { title: ReactNode; children: ReactNode }) => (
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
      <div style={{ padding: 0, overflowX: 'auto' }}>
        {children}
      </div>
    </div>
  );

  const Tbl = ({ headers, rows }: { headers: string[]; rows: (string | ReactNode)[][] }) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} style={{
              background: 'rgba(59,130,246,0.1)', padding: '8px 14px',
              textAlign: 'left', fontWeight: 600, color: '#3b82f6',
              borderBottom: `1px solid ${border}`,
              fontFamily: "'Inter',sans-serif",
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} style={{ background: ri % 2 === 1 ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
            {row.map((cell, ci) => (
              <td key={ci} style={{
                padding: '8px 14px', borderBottom: `1px solid rgba(255,255,255,0.03)`, color: txt1,
                fontFamily: ci === 1 || ci === 2 ? "'Orbitron',monospace" : "'Vazirmatn',sans-serif",
                fontWeight: ci === 1 || ci === 2 ? 700 : 400,
                color: ci === 1 || ci === 2 ? '#06b6d4' : txt1,
              }}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  const Badge = ({ label, type }: { label: string; type: 'green'|'red'|'orange'|'blue' }) => {
    const colors = {
      green:  { bg: 'rgba(16,185,129,0.15)',  c: '#10b981', brd: 'rgba(16,185,129,0.3)'  },
      red:    { bg: 'rgba(239,68,68,0.15)',    c: '#ef4444', brd: 'rgba(239,68,68,0.3)'   },
      orange: { bg: 'rgba(245,158,11,0.15)',   c: '#f59e0b', brd: 'rgba(245,158,11,0.3)'  },
      blue:   { bg: 'rgba(59,130,246,0.15)',   c: '#3b82f6', brd: 'rgba(59,130,246,0.3)'  },
    };
    const s = colors[type];
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 3,
        padding: '2px 8px', borderRadius: 20, fontSize: 9, fontWeight: 700,
        background: s.bg, color: s.c, border: `1px solid ${s.brd}`,
        fontFamily: "'Inter',sans-serif",
      }}>
        {label}
      </span>
    );
  };

  // Quick nav links to other sections
  const QuickLinks = [
    { to: '/', label: 'General Overview', icon: LayoutDashboard, color: '#3b82f6', desc: 'Personnel & Man-Hours' },
    { to: '/reactive', label: 'Reactive Indicators', icon: AlertTriangle, color: '#ef4444', desc: 'Lagging KPIs & Rates' },
    { to: '/proactive', label: 'Proactive Indicators', icon: Shield, color: '#10b981', desc: 'Leading Activities & PTW' },
    { to: '/analysis', label: 'Analysis', icon: BarChart2, color: '#8b5cf6', desc: 'Charts, Pyramid & Environment' },
  ];

  return (
    <div>
      {/* Quick navigation links */}
      <SectionTitle>🔗 Quick Navigation — پیوندهای سریع</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12, marginBottom: 24 }}>
        {QuickLinks.map(link => {
          const Icon = link.icon;
          return (
            <button
              key={link.to}
              onClick={() => navigate(link.to)}
              style={{
                background: cardBg, border: `2px solid ${link.color}33`,
                borderRadius: 14, padding: '16px 18px',
                cursor: 'pointer', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 14,
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)', backdropFilter: 'blur(12px)',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.transform = 'translateY(-4px)';
                el.style.boxShadow = `0 12px 32px ${link.color}40`;
                el.style.borderColor = link.color + '77';
                el.style.background = cardBg;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = 'none';
                el.style.borderColor = link.color + '33';
              }}
            >
              {/* Animated background gradient */}
              <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(135deg, ${link.color}15, ${link.color}08)`,
                opacity: 0,
                transition: 'opacity 0.3s',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.opacity = '1';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.opacity = '0';
                }}
              />
              
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: `linear-gradient(135deg, ${link.color}25, ${link.color}10)`,
                border: `1.5px solid ${link.color}55`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s',
              }}>
                <Icon size={20} color={link.color} />
              </div>
              <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 700, color: txt1, marginBottom: 4 }}>
                  {link.label}
                </div>
                <div style={{ fontFamily: "'Vazirmatn',sans-serif", fontSize: 10, color: txt2 }}>
                  {link.desc}
                </div>
              </div>
              <ExternalLink size={16} color={link.color} style={{ flexShrink: 0, opacity: 0.7, transition: 'all 0.3s' }}
                onMouseEnter={e => {
                  (e.currentTarget as SVGElement).style.opacity = '1';
                  (e.currentTarget as SVGElement).style.transform = 'translateX(3px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as SVGElement).style.opacity = '0.7';
                  (e.currentTarget as SVGElement).style.transform = 'translateX(0)';
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Period info */}
      <div style={{
        background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)',
        borderRadius: 10, padding: '9px 14px', marginBottom: 20,
        display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center',
        fontFamily: "'Inter',sans-serif", fontSize: 10, color: txt2,
      }}>
        <span>📅 Report Period: <b style={{ color: '#3b82f6' }}>{fromStr} — {toStr}</b></span>
        <span>📋 Generated: <b style={{ color: '#06b6d4' }}>{todayStr}</b></span>
        <span>🏢 <b style={{ color: txt1 }}>Sepehr Pasargad Oil &amp; Gas Production — N.I.O.C.</b></span>
      </div>

      {/* Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        {/* Personnel Report */}
        <TableCard title={<><span>👥</span> Personnel Report — گزارش پرسنلی</>}>
          <Tbl
            headers={['Category', 'Count', 'Share', 'Status']}
            rows={[
              ['Office Personnel',    fmt(m.OP), `${m.OP+m.SP+m.CP+m.CV > 0 ? ((m.OP/(m.OP+m.SP+m.CP+m.CV))*100).toFixed(1) : '0.0'}%`, <Badge label="Office" type="blue" />],
              ['Site Personnel',      fmt(m.SP), `${m.OP+m.SP+m.CP+m.CV > 0 ? ((m.SP/(m.OP+m.SP+m.CP+m.CV))*100).toFixed(1) : '0.0'}%`, <Badge label="Site" type="blue" />],
              ['Contractor',          fmt(m.CP), `${m.OP+m.SP+m.CP+m.CV > 0 ? ((m.CP/(m.OP+m.SP+m.CP+m.CV))*100).toFixed(1) : '0.0'}%`, <Badge label="Contract" type="orange" />],
              ['Client / Visitor',    fmt(m.CV), `${m.OP+m.SP+m.CP+m.CV > 0 ? ((m.CV/(m.OP+m.SP+m.CP+m.CV))*100).toFixed(1) : '0.0'}%`, <Badge label="Client" type="green" />],
              ['Total Personnel',     fmt(m.OP+m.SP+m.CP+m.CV), '100%', '—'],
              ['Total Man-Hours',     fmt(m.TMH), 'man-hours', '—'],
              ['LTI Free Days',       fmt(m.LTID), 'since Sep 23 2023', '—'],
              ['LTI Free MH (Cum.)', fmt(m.CombMH), 'man-hours', '—'],
            ]}
          />
        </TableCard>

        {/* Reactive Report */}
        <TableCard title={<><span>⚠️</span> Reactive Report — گزارش شاخص‌های واکنشی</>}>
          <Tbl
            headers={['Indicator', 'Current', 'Status']}
            rows={[
              ['Fatality',              fmt(m.Fat),   <Badge label={m.Fat===0?'ZERO':'ALERT'}   type={m.Fat===0?'green':'red'} />],
              ['Lost Time Injury',      fmt(m.LTI),   <Badge label={m.LTI===0?'ZERO':'ALERT'}   type={m.LTI===0?'green':'red'} />],
              ['Medical Treatment',     fmt(m.MTC),   <Badge label={m.MTC===0?'ZERO':'WATCH'}   type={m.MTC===0?'green':'orange'} />],
              ['Restricted Work',       fmt(m.RWC),   <Badge label={m.RWC===0?'ZERO':'WATCH'}   type={m.RWC===0?'green':'orange'} />],
              ['First Aid Case',        fmt(m.FAC),   <Badge label="INFO" type="blue" />],
              ['Near Miss',             fmt(m.NM),    <Badge label="WATCH" type="orange" />],
              ['Environmental',         fmt(m.EC),    <Badge label={m.EC===0?'ZERO':'ALERT'}    type={m.EC===0?'green':'red'} />],
              ['Fire',                  fmt(m.FireN), <Badge label={m.FireN===0?'ZERO':'ALERT'} type={m.FireN===0?'green':'red'} />],
              ['Land Transport Acc.',   fmt(m.LTA),   <Badge label={m.LTA===0?'ZERO':'ALERT'}   type={m.LTA===0?'green':'red'} />],
              ['LTIFR',                 m.LTIFR,      <Badge label="RATE" type="blue" />],
              ['TRCFR',                 m.TRCFR,      <Badge label="RATE" type="blue" />],
              ['LTSR',                  m.LTSR,       <Badge label="RATE" type="blue" />],
            ]}
          />
        </TableCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        {/* Proactive Report */}
        <TableCard title={<><span>🛡️</span> Proactive Report — گزارش شاخص‌های پیشگیرانه</>}>
          <Tbl
            headers={['Indicator', 'Current', 'Cumulative']}
            rows={[
              ['Stop / Smart Card',     fmt(m.SC),      fmt(m.CombSC)],
              ['HSE Training (MH)',     fmt(m.HTR),     fmt(m.CombHTR)],
              ['Pre-Job Safety Mtg',    fmt(m.PJSM),    '—'],
              ['HSE Meeting',           fmt(m.HSEM),    fmt(m.CombHSEM)],
              ['HSE Induction',         fmt(m.HSEI),    '—'],
              ['Toolbox Meeting',       fmt(m.TBM),     '—'],
              ['Emergency Drill',       fmt(m.Drl),     fmt(m.CombDrl)],
              ['Inspection',            fmt(m.Ins),     '—'],
              ['Audit',                 fmt(m.Aud),     fmt(m.CombAud)],
              ['PTW (Cold/Hot/HNF)',    fmt(m.PTWTot),  fmt(m.CombPTW)],
              ['Pre-Employment Med.',   fmt(m.PreM),    '—'],
              ['Periodical Medical',    fmt(m.PerM),    '—'],
            ]}
          />
        </TableCard>

        {/* Environmental Report */}
        <TableCard title={<><span>🌍</span> Environmental Report — گزارش زیست‌محیطی</>}>
          <Tbl
            headers={['Parameter', 'Value', 'Unit']}
            rows={[
              ['💧 Potable Water',   fmt(m.PW),         'Liter'],
              ['🏭 Operation Water', fmt(m.OW),         'Liter'],
              ['💧 Total Water',      fmt(m.TotalWater), 'Liter'],
              ['⛽ Gasoline',         fmt(m.GL),         'Liter'],
              ['⛽ Diesel',           fmt(m.DL),         'Liter'],
              ['🛢️ Other Fuel',      fmt(m.OFL),        'Liter'],
              ['⛽ Total Fuel',       fmt(m.TotalFuel),  'Liter'],
              ['🔥 Natural Gas',      fmt(m.GM3),        'M³'],
              ['🗑️ Solid Waste',     fmt(m.SW),         'Kg'],
              ['💧 Waste Water',      fmt(m.WW),         'Liter'],
            ]}
          />
          <div style={{
            margin: 12, padding: 10,
            background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.18)',
            borderRadius: 8, textAlign: 'center',
            fontFamily: "'Vazirmatn',sans-serif", fontSize: 10, color: txt2,
          }}>
            📅 Report Date: <b style={{ color: '#06b6d4' }}>{todayStr}</b><br/>
            © 2025 Sepehr Pasargad Oil &amp; Gas Production — All Rights Reserved
          </div>
        </TableCard>
      </div>
    </div>
  );
}