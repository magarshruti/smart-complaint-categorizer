import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import PriorityBox from '../components/PriorityBox.jsx';
import ComplaintCard from '../components/ComplaintCard.jsx';
import Modal from '../components/Modal.jsx';
import ResolveForm from '../components/ResolveForm.jsx';
import { useApp } from '../context/AppContext.jsx';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { state } = useApp();
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showResolveModal, setShowResolveModal] = useState(false);

  const active = state.complaints.filter(c => c.status !== 'resolved');

  const high = active.filter(c => c.priority === 'high');
  const medium = active.filter(c => c.priority === 'medium');
  const low = active.filter(c => c.priority === 'low');

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setShowResolveModal(true);
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
                Manage and resolve campus complaints
              </p>
            </div>
            <div className="dash-stats">
              <div className="stat-pill stat-total">
                <AlertCircle size={14} />
                <span>{active.length} Active</span>
              </div>
              <div className="stat-pill stat-ai">
                <Sparkles size={14} />
                <span>AI Prioritized</span>
              </div>
            </div>
          </motion.div>

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

      <Modal
        isOpen={showResolveModal}
        onClose={() => { setShowResolveModal(false); setSelectedComplaint(null); }}
        title="Resolve Complaint"
        size="md"
      >
        {selectedComplaint && (
          <ResolveForm
            complaint={selectedComplaint}
            onClose={() => { setShowResolveModal(false); setSelectedComplaint(null); }}
          />
        )}
      </Modal>
    </div>
  );
}
