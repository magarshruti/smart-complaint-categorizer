import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, GraduationCap, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import './LoginPage.css';

export default function LoginPage() {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const [hoveredRole, setHoveredRole] = useState(null);

  const selectRole = (role) => {
    const name = role === 'admin' ? 'Dr. Rajesh Kumar' : 'Aarav Mehta';
    dispatch({ type: 'SET_USER', payload: { role, name } });
    navigate(role === 'admin' ? '/admin' : '/student');
  };

  return (
    <div className="login-page">
      <div className="login-bg-shapes">
        <div className="shape shape-1" />
        <div className="shape shape-2" />
        <div className="shape shape-3" />
      </div>

      <motion.div
        className="login-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="login-header">
          <motion.div
            className="login-logo"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4, type: 'spring' }}
          >
            <Shield size={28} />
          </motion.div>
          <h1 className="login-title">Smart Complaint Analyser</h1>
          <p className="login-subtitle">
            AI-Powered Campus Complaint Management System
          </p>
          <div className="login-ai-tag">
            <Sparkles size={14} />
            <span>Powered by AI Prioritization</span>
          </div>
        </div>

        <div className="login-roles">
          <h2 className="roles-heading">Select Your Role</h2>
          <div className="roles-grid">
            <motion.button
              className={`role-card role-admin ${hoveredRole === 'admin' ? 'hovered' : ''}`}
              onClick={() => selectRole('admin')}
              onHoverStart={() => setHoveredRole('admin')}
              onHoverEnd={() => setHoveredRole(null)}
              whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(37,99,235,0.15)' }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="role-icon-wrap admin-icon">
                <Shield size={28} />
              </div>
              <h3 className="role-name">Administrator</h3>
              <p className="role-desc">Manage complaints, resolve issues, and view analytics</p>
              <div className="role-arrow">
                <ArrowRight size={18} />
              </div>
            </motion.button>

            <motion.button
              className={`role-card role-student ${hoveredRole === 'student' ? 'hovered' : ''}`}
              onClick={() => selectRole('student')}
              onHoverStart={() => setHoveredRole('student')}
              onHoverEnd={() => setHoveredRole(null)}
              whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(34,197,94,0.15)' }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="role-icon-wrap student-icon">
                <GraduationCap size={28} />
              </div>
              <h3 className="role-name">Student</h3>
              <p className="role-desc">Raise complaints, track status, and engage with feed</p>
              <div className="role-arrow">
                <ArrowRight size={18} />
              </div>
            </motion.button>
          </div>
        </div>

        <p className="login-footer-text">
          A transparent system for faster campus resolutions
        </p>
      </motion.div>
    </div>
  );
}
