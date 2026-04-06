import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertCircle, Building2, Eye } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import PriorityBox from '../components/PriorityBox.jsx';
import ComplaintCard from '../components/ComplaintCard.jsx';
import Modal from '../components/Modal.jsx';
import ResolveForm from '../components/ResolveForm.jsx';
import StatusTracker from '../components/StatusTracker.jsx';
import SatisfactionScore from '../components/SatisfactionScore.jsx';
import SimilarComplaints from '../components/SimilarComplaints.jsx';
import { useApp } from '../context/AppContext.jsx';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { state } = useApp();
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailComplaint, setDetailComplaint] = useState(null);

  const active = state.complaints.filter(c => c.status !== 'resolved');

  const high = active.filter(c => c.priority === 'high');
  const medium = active.filter(c => c.priority === 'medium');
  const low = active.filter(c => c.priority === 'low');

  // Count by category
  const categoryCounts = {};
  active.forEach(c => {
    const cat = c.category || 'General';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setShowResolveModal(true);
  };

  const handleResolveGroup = (group) => {
    // In a real app we'd open a modal to enter a common resolution note
    // For MVP, auto-resolve all with a generic note
    const confirm = window.confirm(`Resolve all ${group.count} similar complaints in this group?`);
    if (!confirm) return;

    group.linkedComplaints.forEach(c => {
      dispatch({
        type: 'RESOLVE_COMPLAINT',
        payload: {
          id: c.id,
          description: `Batch resolved (Similar issue). Root cause addressed for ${group.count} related complaints.`,
          image: null
        }
      });
      // also throw a toast for each one or just one
    });
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        type: 'success',
        title: 'Batch Resolution Complete',
        message: `Successfully resolved ${group.count} similar complaints: ${group.subCategory}`
      }
    });
  };

  const handleViewTracking = (complaint) => {
    setDetailComplaint(complaint);
    setShowDetailsModal(true);
  };

  return (
    <div className="admin-dashboard">
      <Navbar />
      <main className="dash-main">
        <div className="dash-container">
          <motion.div
            className="dash-header"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <h1 className="dash-title">Admin Dashboard</h1>
              <p className="dash-subtitle">
                Manage and resolve campus complaints — AI auto-classifies &amp; routes
              </p>
            </div>
            <div className="dash-stats">
              <div className="stat-pill stat-total">
                <AlertCircle size={14} />
                <span>{active.length} Active</span>
              </div>
              <div className="stat-pill stat-ai">
                <Sparkles size={14} />
                <span>AI Classified</span>
              </div>
            </div>
          </motion.div>

          {/* Department routing summary */}
          <motion.div
            className="dept-summary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h3 className="dept-summary-title">
              <Building2 size={16} /> Department Routing Summary
            </h3>
            <div className="dept-chips">
              {Object.entries(categoryCounts).map(([cat, count]) => (
                <div key={cat} className="dept-chip">
                  <span className="dept-chip-name">{cat}</span>
                  <span className="dept-chip-count">{count}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <SatisfactionScore />
          <SimilarComplaints complaints={active} onResolveGroup={handleResolveGroup} />

          <div className="priority-sections">
            <PriorityBox priority="high" count={high.length}>
              <AnimatePresence>
                {high.length > 0 ? high.map(c => (
                  <ComplaintCard
                    key={c.id}
                    complaint={c}
                    showActions
                    onViewDetails={handleViewDetails}
                  />
                )) : (
                  <p className="empty-text">No high priority complaints 🎉</p>
                )}
              </AnimatePresence>
            </PriorityBox>

            <PriorityBox priority="medium" count={medium.length}>
              <AnimatePresence>
                {medium.length > 0 ? medium.map(c => (
                  <ComplaintCard
                    key={c.id}
                    complaint={c}
                    showActions
                    onViewDetails={handleViewDetails}
                  />
                )) : (
                  <p className="empty-text">No medium priority complaints</p>
                )}
              </AnimatePresence>
            </PriorityBox>

            <PriorityBox priority="low" count={low.length}>
              <AnimatePresence>
                {low.length > 0 ? low.map(c => (
                  <ComplaintCard
                    key={c.id}
                    complaint={c}
                    showActions
                    onViewDetails={handleViewDetails}
                  />
                )) : (
                  <p className="empty-text">No low priority complaints</p>
                )}
              </AnimatePresence>
            </PriorityBox>
          </div>
        </div>
      </main>

      {/* Resolve Modal */}
      <Modal
        isOpen={showResolveModal}
        onClose={() => { setShowResolveModal(false); setSelectedComplaint(null); }}
        title="Resolve Complaint"
        size="md"
      >
        {selectedComplaint && (
          <>
            <StatusTracker complaint={selectedComplaint} />
            <ResolveForm
              complaint={selectedComplaint}
              onClose={() => { setShowResolveModal(false); setSelectedComplaint(null); }}
            />
          </>
        )}
      </Modal>

      {/* Detail/Tracking Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => { setShowDetailsModal(false); setDetailComplaint(null); }}
        title="Complaint Details & Tracking"
        size="md"
      >
        {detailComplaint && (
          <StatusTracker complaint={detailComplaint} />
        )}
      </Modal>
    </div>
  );
}
