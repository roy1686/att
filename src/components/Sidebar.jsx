import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, BookOpen, CreditCard, X } from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/courses', label: 'Courses', icon: BookOpen },
  { path: '/students', label: 'Students', icon: Users },
  { path: '/attendance', label: 'Attendance', icon: UserCheck },
  { path: '/fees', label: 'Fees', icon: CreditCard },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div>
            <h2 style={{ fontSize: '1.2rem' }}>GIST Computer Education</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>By Pravat Kumar Hota</p>
          </div>
          <button className="close-sidebar-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
