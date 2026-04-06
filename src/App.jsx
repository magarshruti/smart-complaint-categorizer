import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import FeedPage from './pages/FeedPage.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import ToastContainer from './components/Toast.jsx';
import './App.css';

function ProtectedRoute({ role, children }) {
  const { state } = useApp();
  if (!state.user) return <Navigate to="/" replace />;
  if (state.user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/feed" element={<ProtectedRoute role="admin"><FeedPage /></ProtectedRoute>} />
        <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/feed" element={<ProtectedRoute role="student"><FeedPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </>
  );
}
