import { NavLink } from 'react-router';
import {
  LayoutDashboard, AlertTriangle, Shield, BarChart2,
  FileText, ChevronLeft, ChevronRight, Factory, Info,
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

const NAV = [
  { to: '/',          icon: LayoutDashboard, label: 'General Overview',     labelFa: 'نمای کلی'         },
  { to: '/reactive',  icon: AlertTriangle,   label: 'Reactive (Lagging)',    labelFa: 'شاخص‌های واکنشی'  },
  { to: '/proactive', icon: Shield,          label: 'Proactive (Leading)',   labelFa: 'شاخص‌های پیشگیرانه' },
  { to: '/analysis',  icon: BarChart2,       label: 'Analysis',              labelFa: 'تحلیل و آنالیز'   },
  { to: '/report',    icon: FileText,        label: 'Report',                labelFa: 'گزارش‌ها'          },
  { to: '/kpi-definition', icon: Info,       label: 'KPI Definition',        labelFa: 'توضیح شاخص‌ها'    },
];

export function Sidebar() {
  const { darkMode, sidebarOpen, toggleSidebar } = useDashboard();

  const bg      = darkMode ? 'linear-gradient(180deg,#0a0f1e,#0d1429)' : 'linear-gradient(180deg,#1a2f52,#1f3f63)';
  const border  = darkMode ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.12)';
  const txtMute = darkMode ? '#7fa3b8' : '#a8c1dc';
  const txtMain = darkMode ? '#d4e3f7' : '#f0f7ff';

  return (
    <aside
      style={{
        width: sidebarOpen ? 230 : 68,
        minWidth: sidebarOpen ? 230 : 68,
        background: bg,
        borderRight: `1px solid ${border}`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease, min-width 0.3s ease',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div style={{
        padding: sidebarOpen ? '20px 16px 16px' : '20px 10px 16px',
        borderBottom: `1px solid ${border}`,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        overflow: 'hidden',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          background: 'linear-gradient(135deg,#1d4ed8,#0ea5e9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 18px rgba(14,165,233,0.45)',
        }}>
          <Factory size={20} color="#fff" />
        </div>
        {sidebarOpen && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontFamily: "'Vazir','Vazirmatn',sans-serif", fontWeight: 700, fontSize: 12, color: txtMain, whiteSpace: 'nowrap' }}>
              Sepehr Pasargad
            </div>
            <div style={{ fontFamily: "'Vazir','Vazirmatn',sans-serif", fontSize: 9, color: txtMute, whiteSpace: 'nowrap' }}>
              Oil &amp; Gas Production
            </div>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV.map(({ to, icon: Icon, label, labelFa }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: sidebarOpen ? '10px 12px' : '10px',
              borderRadius: 10,
              textDecoration: 'none',
              background: isActive
                ? 'linear-gradient(135deg,rgba(37,99,235,0.35),rgba(6,182,212,0.18))'
                : 'transparent',
              border: isActive ? '1px solid rgba(37,99,235,0.4)' : '1px solid transparent',
              color: isActive ? '#60a5fa' : txtMute,
              transition: 'all 0.22s ease',
              cursor: 'pointer',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              boxShadow: isActive ? '0 2px 12px rgba(37,99,235,0.25)' : 'none',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={18} style={{ flexShrink: 0, color: isActive ? '#60a5fa' : txtMute }} />
                {sidebarOpen && (
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{
                      fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 600,
                      color: isActive ? '#e0eaff' : txtMain, whiteSpace: 'nowrap',
                    }}>
                      {label}
                    </div>
                    <div style={{
                      fontFamily: "'Vazirmatn',sans-serif", fontSize: 9,
                      color: isActive ? '#93c5fd' : txtMute, whiteSpace: 'nowrap',
                    }}>
                      {labelFa}
                    </div>
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse button */}
      <div style={{ padding: '12px 8px', borderTop: `1px solid ${border}` }}>
        <button
          onClick={toggleSidebar}
          style={{
            width: '100%', padding: '8px', borderRadius: 9,
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${border}`,
            color: txtMute, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.2s',
            fontFamily: "'Inter',sans-serif", fontSize: 11,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
        >
          {sidebarOpen ? <><ChevronLeft size={15} /> <span>Collapse</span></> : <ChevronRight size={15} />}
        </button>
      </div>
    </aside>
  );
}
