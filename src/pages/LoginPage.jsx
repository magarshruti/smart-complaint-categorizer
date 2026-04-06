import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, GraduationCap, ArrowRight, Sparkles, User, Lock, LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import './LoginPage.css';

const USERS = {
  admin: [
    { name: 'Dr. Rajesh Kumar', password: 'admin123' },
    { name: 'Prof. Sunita Verma', password: 'admin456' },
  ],
  student: [
    { name: 'Aarav Mehta', password: 'student123' },
    { name: 'Rahul Sharma', password: 'student456' },
    { name: 'Priya Patel', password: 'student789' },
    { name: 'Sneha Reddy', password: 'student101' },
  ],
};

export default function LoginPage() {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both name and password');
      return;
    }

    const users = USERS[selectedRole] || [];
    const found = users.find(
      u => u.name.toLowerCase() === username.trim().toLowerCase() && u.password === password
    );

    if (!found) {
      setError('Invalid name or password. Try the credentials shown below.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      dispatch({ type: 'SET_USER', payload: { role: selectedRole, name: found.name } });
      navigate(selectedRole === 'admin' ? '/admin' : '/student');
    }, 500);
  };

  const handleBack = () => {
    setSelectedRole(null);
    setUsername('');
    setPassword('');
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-bg-shapes">
        <div className="shape shape-1" />
        <div className="shape shape-2" />
        <div className="shape shape-3" />
        <div className="shape shape-4" />
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
          <p className="login-subtitle">AI-Powered Campus Complaint Management</p>
          <div className="login-tags">
            <div className="login-ai-tag">
              <Sparkles size={13} />
              <span>AI Prioritization</span>
            </div>
            <div className="login-ai-tag tag-green">
              <Shield size={13} />
              <span>Auto Department Routing</span>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!selectedRole ? (
            /* ── Role Selection ── */
            <motion.div
              key="role-select"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="roles-heading">Choose Your Role</h2>
              <div className="roles-grid">
                <motion.button
                  className="role-card role-admin"
                  onClick={() => setSelectedRole('admin')}
                  whileHover={{ y: -4, boxShadow: '0 16px 32px rgba(37,99,235,0.12)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="role-icon-wrap admin-icon">
                    <Shield size={26} />
                  </div>
                  <div className="role-text">
                    <h3 className="role-name">Administrator</h3>
                    <p className="role-desc">Manage, resolve, and analyze complaints</p>
                  </div>
                  <div className="role-arrow"><ArrowRight size={18} /></div>
                </motion.button>

                <motion.button
                  className="role-card role-student"
                  onClick={() => setSelectedRole('student')}
                  whileHover={{ y: -4, boxShadow: '0 16px 32px rgba(34,197,94,0.12)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="role-icon-wrap student-icon">
                    <GraduationCap size={26} />
                  </div>
                  <div className="role-text">
                    <h3 className="role-name">Student</h3>
                    <p className="role-desc">Raise complaints, track status, engage</p>
                  </div>
                  <div className="role-arrow"><ArrowRight size={18} /></div>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            /* ── Login Form ── */
            <motion.div
              key="login-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <button className="back-btn" onClick={handleBack}>
                ← Back to role selection
              </button>

              <div className="form-role-badge">
                <div className={`role-icon-sm ${selectedRole === 'admin' ? 'admin-icon' : 'student-icon'}`}>
                  {selectedRole === 'admin' ? <Shield size={16} /> : <GraduationCap size={16} />}
                </div>
                <span>Sign in as <strong>{selectedRole === 'admin' ? 'Administrator' : 'Student'}</strong></span>
              </div>

              <form className="login-form" onSubmit={handleLogin}>
                <div className="input-group">
                  <label className="input-label">
                    <User size={14} /> Full Name
                  </label>
                  <input
                    id="login-name"
                    type="text"
                    className="input-field"
                    placeholder={selectedRole === 'admin' ? 'e.g. Dr. Rajesh Kumar' : 'e.g. Aarav Mehta'}
                    value={username}
                    onChange={e => { setUsername(e.target.value); setError(''); }}
                    autoFocus
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">
                    <Lock size={14} /> Password
                  </label>
                  <div className="input-password-wrap">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      className="input-field"
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError(''); }}
                    />
                    <button
                      type="button"
                      className="toggle-pw"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    className="login-error"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle size={14} /> {error}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  className="login-submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <span className="login-loading">Signing in...</span>
                  ) : (
                    <><LogIn size={18} /> Sign In</>
                  )}
                </motion.button>
              </form>

              {/* Demo credentials hint */}
              <div className="demo-creds">
                <span className="demo-label">Demo Credentials</span>
                <div className="demo-list">
                  {USERS[selectedRole].map((u, i) => (
                    <button
                      key={i}
                      className="demo-item"
                      onClick={() => { setUsername(u.name); setPassword(u.password); setError(''); }}
                    >
                      <span className="demo-name">{u.name}</span>
                      <span className="demo-pw">{u.password}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="login-footer-text">
          A transparent system for faster campus resolutions
        </p>
      </motion.div>
    </div>
  );
}
