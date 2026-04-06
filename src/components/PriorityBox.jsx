import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import './PriorityBox.css';

const config = {
  high: { emoji: '🔴', label: 'High Priority', className: 'pbox-high' },
  medium: { emoji: '🟡', label: 'Medium Priority', className: 'pbox-medium' },
  low: { emoji: '🟢', label: 'Low Priority', className: 'pbox-low' },
};

export default function PriorityBox({ priority, count, children }) {
  const [open, setOpen] = useState(true);
  const cfg = config[priority] || config.low;

  return (
    <motion.div
      className={`priority-box ${cfg.className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button className="pbox-header" onClick={() => setOpen(!open)}>
        <div className="pbox-left">
          <span className="pbox-emoji">{cfg.emoji}</span>
          <h2 className="pbox-title">{cfg.label}</h2>
          <span className="pbox-count">{count}</span>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="pbox-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="pbox-cards">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
