import { NavLink } from 'react-router-dom';
import CassiopeiaLogo from './CassiopeiaLogo';
import NatalChartNavIcon from './NatalChartNavIcon';

const navItems = [
  { path: '/', icon: 'home', label: 'Ana Sayfa' },
  { path: '/fallar', icon: null, label: 'Fallar' },
  { path: '/kesfet', icon: 'explore', label: 'Keşfet' },
  { path: '/astroloji', icon: 'natal', label: 'Astroloji' },
  { path: '/profil', icon: 'person', label: 'Profil' },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          {({ isActive }) => (
            <>
              {item.icon === null ? (
                /* Fallar: Cassiopeia Logo */
                <div style={{ height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', filter: isActive ? 'drop-shadow(0 0 6px rgba(220,220,255,0.9)) drop-shadow(0 0 12px rgba(200,200,255,0.5))' : 'none' }}>
                  <CassiopeiaLogo
                    size={28}
                    color={isActive ? '#e8e8ff' : 'var(--text-muted)'}
                    isLoading={false}
                  />
                </div>
              ) : item.icon === 'natal' ? (
                /* Astroloji: Natal Chart (Doğum Haritası) SVG İkonu */
                <div style={{
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  filter: isActive
                    ? 'drop-shadow(0 0 5px rgba(170,140,255,0.8)) drop-shadow(0 0 10px rgba(140,110,255,0.4))'
                    : 'none',
                  transition: 'filter 0.3s ease',
                }}>
                  <NatalChartNavIcon
                    size={24}
                    color={isActive ? '#c8b8ff' : 'var(--text-muted)'}
                  />
                </div>
              ) : (
                /* Diğerleri: Material Symbol */
                <span className="material-symbols-outlined">{item.icon}</span>
              )}
              <span className="bottom-nav-label">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}