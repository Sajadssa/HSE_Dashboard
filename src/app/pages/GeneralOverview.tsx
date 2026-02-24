import { useDashboard } from '../context/DashboardContext';
import { KpiCard } from '../components/KpiCard';
import { Users, Clock, Shield, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

function fmt(n: number) { return n.toLocaleString(); }

function calculateTrend(current: number, previous: number): { trend: 'up' | 'down' | 'neutral'; percent: number } {
  if (previous === 0) return { trend: 'neutral', percent: 0 };
  const change = ((current - previous) / previous) * 100;
  return {
    trend: change > 0.5 ? 'up' : change < -0.5 ? 'down' : 'neutral',
    percent: change,
  };
}

export function GeneralOverview() {
  const { metrics: m, monthly, darkMode } = useDashboard();

  const txt1   = darkMode ? '#e2e8f0' : '#0f1e35';
  const txt2   = darkMode ? '#64748b' : '#4a6080';
  const cardBg = darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)';
  const border = darkMode ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.1)';

  const TP = m.OP + m.SP + m.CP + m.CV;
  const MaxBar = Math.max(m.OP, m.SP, m.CP, m.CV === 0 ? 1 : m.CV, 1);
  const barH = (v: number) => Math.min(Math.round((v / MaxBar) * 150), 150);
  const pct  = (v: number) => TP === 0 ? '0.0' : ((v / TP) * 100).toFixed(1);

  // Calculate trends using monthly data
  const getPrevValue = (key: keyof typeof m, currentVal: number): number => {
    if (monthly.length < 2) return currentVal;
    const prev = monthly[monthly.length - 2];
    return prev[key as keyof typeof prev] as number || currentVal;
  };

  const opTrend = calculateTrend(m.OP, getPrevValue('OP', m.OP));
  const spTrend = calculateTrend(m.SP, getPrevValue('SP', m.SP));
  const cpTrend = calculateTrend(m.CP, getPrevValue('CP', m.CP));
  const cvTrend = calculateTrend(m.CV, getPrevValue('CV', m.CV));
  const tpTrend = calculateTrend(TP, m.OP + m.SP + m.CP + m.CV);
  const tmhTrend = calculateTrend(m.TMH, getPrevValue('TMH', m.TMH));

  return (
    <div>
      {/* Section title */}
      <div style={{
        fontFamily: "'Vazir','Vazirmatn',sans-serif", fontSize: 11, fontWeight: 700,
        color: txt2, textTransform: 'uppercase', letterSpacing: '0.8px',
        marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8,
      }}>
        📊 General Overview — نمای کلی
        <div style={{ flex: 1, height: 1, background: border }} />
      </div>

      {/* KPI row with trends */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 10, marginBottom: 16,
      }}>
        <KpiCard label="Office Personnel" labelFa="کارکنان اداری"
          value={fmt(m.OP)} sub="Personnel" variant="blue" dark={darkMode}
          icon={<Users size={22}/>} tooltip="تعداد کارکنان اداری"
          trend={opTrend.trend} trendPercent={opTrend.percent} />
        <KpiCard label="Site Personnel" labelFa="کارکنان سایت"
          value={fmt(m.SP)} sub="Personnel" variant="cyan" dark={darkMode}
          icon={<Users size={22}/>} tooltip="تعداد کارکنان سایت"
          trend={spTrend.trend} trendPercent={spTrend.percent} />
        <KpiCard label="Contractor" labelFa="کارکنان پیمانکار"
          value={fmt(m.CP)} sub="Personnel" variant="purple" dark={darkMode}
          icon={<Users size={22}/>} tooltip="کارکنان پیمانکاران"
          trend={cpTrend.trend} trendPercent={cpTrend.percent} />
        <KpiCard label="Client / Visitor" labelFa="بازدیدکننده/کارفرما"
          value={fmt(m.CV)} sub="Personnel" variant="orange" dark={darkMode}
          icon={<Users size={22}/>} tooltip="بازدیدکنندگان و کارفرما"
          trend={cvTrend.trend} trendPercent={cvTrend.percent} />
        <KpiCard label="Total Personnel" labelFa="کل نیروی انسانی"
          value={fmt(TP)} sub="Total" variant="green" dark={darkMode}
          icon={<TrendingUp size={22}/>} tooltip="مجموع کل نیروی انسانی"
          trend={tpTrend.trend} trendPercent={tpTrend.percent} />
        <KpiCard label="Total Man-Hours" labelFa="نفر-ساعت کاری"
          value={fmt(m.TMH)} sub="Man-Hours (Period)" variant="blue" dark={darkMode}
          icon={<Clock size={22}/>} tooltip="مجموع نفر-ساعت دوره انتخابی"
          trend={tmhTrend.trend} trendPercent={tmhTrend.percent} />
        <KpiCard label="LTI Free Days" labelFa="روزهای بدون LTI"
          value={fmt(m.LTID)} sub="Since Sep 23, 2023" variant="green" dark={darkMode}
          icon={<Shield size={22}/>} tooltip="روزهای بدون حادثه LTI"
          trend="up" />
        <KpiCard label="LTI Free MH (Cum.)" labelFa="نفر-ساعت بدون LTI"
          value={fmt(m.CombMH)} sub="Cumulative" variant="cyan" dark={darkMode}
          icon={<Clock size={22}/>} tooltip="کل نفر-ساعت بدون LTI (تجمعی)"
          trend="up" />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginBottom: 16 }}>
        {/* Modern Personnel Distribution Donut Chart */}
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 14, overflow: 'hidden', backdropFilter: 'blur(12px)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '13px 16px',
            borderBottom: `1px solid ${border}`, fontWeight: 700, fontSize: 13, color: txt1,
            fontFamily: "'Inter',sans-serif",
          }}>
            <span>👥</span>
            <span>Personnel Distribution — توزیع نیروی انسانی</span>
          </div>
          <div style={{ padding: 16 }}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Office', value: m.OP, fill: '#3b82f6' },
                    { name: 'Site', value: m.SP, fill: '#8b5cf6' },
                    { name: 'Contractor', value: m.CP, fill: '#f59e0b' },
                    { name: 'Client/Visitor', value: m.CV, fill: '#10b981' },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  <Cell fill="#3b82f6" />
                  <Cell fill="#8b5cf6" />
                  <Cell fill="#f59e0b" />
                  <Cell fill="#10b981" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: darkMode ? '#0f1a2e' : '#fff',
                    border: `1px solid ${border}`,
                    borderRadius: 8,
                    fontSize: 11,
                    fontFamily: "'Orbitron',monospace",
                  }}
                  formatter={(value: number) => [fmt(value), 'Count']}
                  labelStyle={{ color: txt1, fontWeight: 700 }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ paddingTop: 12, fontFamily: "'Inter',sans-serif" }}
                  formatter={(value) => <span style={{ fontSize: 10, color: txt2 }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Summary below chart */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8, marginTop: 8 }}>
              {[
                { label: 'Office', val: fmt(m.OP), pct: pct(m.OP), color: '#3b82f6' },
                { label: 'Site', val: fmt(m.SP), pct: pct(m.SP), color: '#8b5cf6' },
                { label: 'Contractor', val: fmt(m.CP), pct: pct(m.CP), color: '#f59e0b' },
                { label: 'Visitor', val: fmt(m.CV), pct: pct(m.CV), color: '#10b981' },
              ].map(item => (
                <div key={item.label} style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${item.color}33`,
                  borderRadius: 8, padding: '8px 10px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 9, color: txt2, marginBottom: 3 }}>
                    {item.label}
                  </div>
                  <div style={{ fontFamily: "'Orbitron',monospace", fontWeight: 800, fontSize: 13, color: item.color, marginBottom: 2 }}>
                    {item.val}
                  </div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 8, color: txt2 }}>
                    {item.pct}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LTI Free status */}
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 14, overflow: 'hidden', backdropFilter: 'blur(12px)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '13px 16px',
            borderBottom: `1px solid ${border}`, fontWeight: 700, fontSize: 13, color: txt1,
            fontFamily: "'Inter',sans-serif",
          }}>
            <span>🏆</span> LTI Free Status
          </div>
          <div style={{ padding: 16, textAlign: 'center' }}>
            <div style={{ position: 'relative', width: 130, height: 130, margin: '0 auto 14px' }}>
              <svg viewBox="0 0 130 130" width="130" height="130">
                <defs>
                  <linearGradient id="gLTI" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981"/>
                    <stop offset="100%" stopColor="#06b6d4"/>
                  </linearGradient>
                </defs>
                <circle cx="65" cy="65" r="55" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="11"/>
                <circle cx="65" cy="65" r="55" fill="none" stroke="url(#gLTI)" strokeWidth="11"
                  strokeDasharray="345.4" strokeDashoffset="0" strokeLinecap="round"
                  transform="rotate(-90 65 65)"
                  style={{ filter: 'drop-shadow(0 0 10px rgba(16,185,129,0.7))' }}
                />
              </svg>
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)', textAlign: 'center',
              }}>
                <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 28, fontWeight: 900, color: '#10b981' }}>
                  {fmt(m.LTID)}
                </div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 8, color: txt2 }}>DAYS</div>
              </div>
            </div>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: 20, padding: '4px 12px', marginBottom: 14,
            }}>
              <span style={{ fontSize: 10, color: '#10b981', fontWeight: 700, fontFamily: "'Inter',sans-serif" }}>✅ LTI FREE OPERATION</span>
            </div>

            <div style={{ fontFamily: "'Vazirmatn',sans-serif", fontSize: 10, color: txt2, lineHeight: 2, textAlign: 'right', direction: 'rtl' }}>
              <div>📅 شروع: ۲۳ سپتامبر ۲۰۲۳</div>
              <div>⏱️ نفر-ساعت: <b style={{ color: '#06b6d4' }}>{fmt(m.CombMH)}</b></div>
              <div>📊 نفر-ساعت دوره: <b style={{ color: '#60a5fa' }}>{fmt(m.TMH)}</b></div>
            </div>

            <div style={{
              marginTop: 10, padding: 9,
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: 9,
            }}>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 9, color: txt2 }}>Cumulative Man-Hours</div>
              <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 18, fontWeight: 900, color: '#10b981' }}>
                {fmt(m.CombMH)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info bar */}
      <div style={{
        background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)',
        borderRadius: 12, padding: '10px 16px',
        display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center',
      }}>
        <span style={{ fontFamily: "'Vazirmatn',sans-serif", fontSize: 10, color: txt2 }}>
          📅 بازه نمایش — Display Period:
        </span>
        {['All Time','Year','Season','Month','Last Week'].map(l => (
          <span key={l} style={{
            background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)',
            borderRadius: 20, padding: '2px 10px',
            fontFamily: "'Inter',sans-serif", fontSize: 9, fontWeight: 600, color: '#60a5fa',
          }}>{l}</span>
        ))}
        <span style={{ fontFamily: "'Vazirmatn',sans-serif", fontSize: 9, color: txt2, marginRight: 'auto' }}>
          * از فیلتر تاریخ بالا برای فیلتر دینامیک استفاده کنید
        </span>
      </div>
    </div>
  );
}
