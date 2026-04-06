import { useApp } from '../context/AppContext.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, GraduationCap, LogOut, LayoutDashboard, Newspaper } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = state.user?.role === 'admin';
  const basePath = isAdmin ? '/admin' : '/student';

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="navbar-inner">
        <div className="navbar-left">
          <div className="navbar-logo">
            <div className="logo-icon">
              <Shield size={20} />
            </div>
            <h1 className="navbar-title">Smart Complaint Analyser</h1>
          </div>
          <div className="navbar-links">
            <button
              className={`nav-link ${location.pathname === basePath ? 'active' : ''}`}
              onClick={() => navigate(basePath)}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </button>
            <button
              className={`nav-link ${location.pathname.includes('/feed') ? 'active' : ''}`}
              onClick={() => navigate(`${basePath}/feed`)}
            >
              <Newspaper size={16} />
              Feed
            </button>
          </div>
        </div>
        <div className="navbar-right">
          <div className="user-info">
            <div className="user-avatar">
              {isAdmin ? <Shield size={16} /> : <GraduationCap size={16} />}
            </div>
            <div className="user-details">
              <span className="user-name">{state.user?.name}</span>
              <span className={`user-role role-${state.user?.role}`}>
                {isAdmin ? 'Administrator' : 'Student'}
              </span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
