import { Outlet } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { SnowEffect } from '../components/SnowEffect';
import { useDashboard } from '../context/DashboardContext';

export function Layout() {
  const { darkMode } = useDashboard();

  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      background: darkMode
        ? 'linear-gradient(135deg,#07091f 0%,#0a1228 40%,#080e1e 100%)'
        : 'linear-gradient(135deg,#dce8f8 0%,#eaf0fc 100%)',
      color: darkMode ? '#e2e8f0' : '#0f1e35',
      transition: 'background 0.35s, color 0.35s',
    }}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Header />

        <main style={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
          padding: '20px 22px',
          scrollbarWidth: 'thin',
          scrollbarColor: darkMode ? '#1e3a5f #07091f' : '#94a3b8 #dce8f8',
        }}>
          <Outlet />
        </main>
      </div>

      <SnowEffect />
    </div>
  );
}
