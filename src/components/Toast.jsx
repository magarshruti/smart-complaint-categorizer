import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Bell, CheckCircle, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import './Toast.css';

const iconMap = {
  email: Mail,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Bell,
};

export default function ToastContainer() {
  const { state, dispatch } = useApp();
  const toasts = state.notifications.slice(0, 3); // show max 3

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      dispatch({ type: 'DISMISS_NOTIFICATION', payload: { id: toasts[toasts.length - 1].id } });
    }, 6000);
    return () => clearTimeout(timer);
  }, [toasts, dispatch]);

  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = iconMap[t.type] || Bell;
          return (
            <motion.div
              key={t.id}
              className={`toast toast-${t.type || 'info'}`}
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="toast-icon">
                <Icon size={18} />
              </div>
              <div className="toast-body">
                <span className="toast-title">{t.title}</span>
                <span className="toast-msg">{t.message}</span>
              </div>
              <button
                className="toast-close"
                onClick={() => dispatch({ type: 'DISMISS_NOTIFICATION', payload: { id: t.id } })}
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
