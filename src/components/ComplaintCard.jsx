import { motion } from 'framer-motion';
import { Clock, MapPin, Tag, AlertTriangle, Play, CheckCircle, RotateCcw, Sparkles } from 'lucide-react';
import { getTimeAgo, checkEscalation } from '../utils/prioritize';
import { useApp } from '../context/AppContext.jsx';
import './ComplaintCard.css';

const priorityConfig = {
  high: { label: 'High Priority', icon: '🔴', className: 'priority-high' },
  medium: { label: 'Medium Priority', icon: '🟡', className: 'priority-medium' },
  low: { label: 'Low Priority', icon: '🟢', className: 'priority-low' },
};

export default function ComplaintCard({ complaint, onViewDetails, showActions = false }) {
  const { dispatch } = useApp();
  const { state } = useApp();
  const cfg = priorityConfig[complaint.priority] || priorityConfig.low;
  const escalation = checkEscalation(complaint);
  const isAdmin = state.user?.role === 'admin';

  const handleMarkInProgress = (e) => {
    e.stopPropagation();
    dispatch({ type: 'UPDATE_STATUS', payload: { id: complaint.id, status: 'in-progress' } });
  };

  const handleResubmit = (e) => {
    e.stopPropagation();
    dispatch({ type: 'RESUBMIT_COMPLAINT', payload: { id: complaint.id } });
  };

  return (
    <motion.div
      className={`complaint-card ${cfg.className} ${complaint.priority === 'high' ? 'pulse-high' : ''}`}
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}
      transition={{ duration: 0.2 }}
      onClick={() => onViewDetails?.(complaint)}
    >
      <div className="card-top">
        <span className={`priority-badge ${cfg.className}`}>
          <span>{cfg.icon}</span> {cfg.label}
        </span>
        {complaint.aiPrioritized && (
          <span className="ai-badge">
            <Sparkles size={12} /> AI Prioritized
          </span>
        )}
      </div>

      <h3 className="card-title">{complaint.title}</h3>
      <p className="card-desc">{complaint.description.slice(0, 120)}...</p>

      <div className="card-meta">
        <span className="meta-item"><MapPin size={13} /> {complaint.area}</span>
        <span className="meta-item"><Tag size={13} /> {complaint.subCategory}</span>
        <span className="meta-item"><Clock size={13} /> {getTimeAgo(complaint.createdAt)}</span>
      </div>

      {complaint.status === 'in-progress' && (
        <div className="status-badge status-in-progress">
          <Play size={12} /> In Progress
        </div>
      )}

      {escalation && complaint.status !== 'resolved' && (
        <div className="escalation-warning">
          <AlertTriangle size={14} />
          <span>{escalation.message}</span>
        </div>
      )}

      {showActions && isAdmin && complaint.status !== 'resolved' && (
        <div className="card-actions">
          {complaint.status === 'open' && (
            <button className="btn btn-secondary btn-sm" onClick={handleMarkInProgress}>
              <Play size={14} /> Mark as In Progress
            </button>
          )}
          <button
            className="btn btn-primary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.(complaint);
            }}
          >
            <CheckCircle size={14} /> Resolve
          </button>
        </div>
      )}

      {escalation?.canResubmit && !isAdmin && complaint.status !== 'resolved' && (
        <div className="card-actions">
          <button className="btn btn-warning btn-sm" onClick={handleResubmit}>
            <RotateCcw size={14} /> Re-submit as High Priority
          </button>
        </div>
      )}

      <div className="card-student">
        <span>Submitted by {complaint.studentName}</span>
      </div>
    </motion.div>
  );
}
