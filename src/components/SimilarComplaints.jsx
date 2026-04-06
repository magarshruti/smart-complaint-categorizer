import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, ChevronDown, ChevronUp, CheckCircle, Layers } from 'lucide-react';
import { findSimilarComplaints, getGroupSummary } from '../utils/similarity';
import './SimilarComplaints.css';

export default function SimilarComplaints({ complaints, onResolveGroup }) {
  const [expandedGroup, setExpandedGroup] = useState(null);
  const groups = findSimilarComplaints(complaints);

  if (groups.length === 0) return null;

  return (
    <motion.div
      className="similar-section"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="similar-header">
        <div className="similar-header-left">
          <Link2 size={16} />
          <h3 className="similar-title">Similar Complaints Auto-Linked</h3>
        </div>
        <span className="similar-count">{groups.length} group{groups.length > 1 ? 's' : ''} detected</span>
      </div>

      <div className="similar-groups">
        {groups.map((group) => (
          <div key={group.id} className={`similar-group group-${group.priority}`}>
            <button
              className="group-header"
              onClick={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}
            >
              <div className="group-header-left">
                <div className="group-icon">
                  <Layers size={16} />
                </div>
                <div className="group-info">
                  <span className="group-count-badge">{group.count} complaints linked</span>
                  <span className="group-summary">{getGroupSummary(group)}</span>
                </div>
              </div>
              <div className="group-header-right">
                {onResolveGroup && (
                  <button
                    className="btn btn-primary btn-sm group-resolve-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onResolveGroup(group);
                    }}
                  >
                    <CheckCircle size={14} /> Resolve All
                  </button>
                )}
                {expandedGroup === group.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </button>

            <AnimatePresence>
              {expandedGroup === group.id && (
                <motion.div
                  className="group-expanded"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="group-complaints">
                    {group.linkedComplaints.map((c, i) => (
                      <div key={c.id} className="linked-complaint">
                        <div className="linked-num">{i + 1}</div>
                        <div className="linked-info">
                          <span className="linked-title">{c.title}</span>
                          <span className="linked-meta">
                            by {c.studentName} · {c.area}
                            {c.priority === 'high' && <span className="linked-priority-high"> · 🔴 High</span>}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="group-footer">
                    <span className="group-footer-text">
                      💡 One resolution will solve all {group.count} linked complaints
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
