import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import FeedPost from '../components/FeedPost.jsx';
import ComplaintCard from '../components/ComplaintCard.jsx';
import Modal from '../components/Modal.jsx';
import ComplaintForm from '../components/ComplaintForm.jsx';
import StatusTracker from '../components/StatusTracker.jsx';
import SatisfactionScore from '../components/SatisfactionScore.jsx';
import { useApp } from '../context/AppContext.jsx';
import './StudentDashboard.css';

export default function StudentDashboard() {
  const { state } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');
  const [trackingComplaint, setTrackingComplaint] = useState(null);

  const myComplaints = state.complaints.filter(
    c => c.studentName === state.user?.name
  );

  const activeComplaints = myComplaints.filter(c => c.status !== 'resolved');
  const resolvedComplaints = myComplaints.filter(c => c.status === 'resolved');

  return (
    <div className="student-dashboard">
      <Navbar />
      <main className="student-main">
        <div className="student-container">
          <motion.div
            className="student-header"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <h1 className="student-title">Student Dashboard</h1>
              <p className="student-subtitle">View resolutions, raise complaints, and track status</p>
            </div>
            <motion.button
              className="raise-btn"
              onClick={() => setShowForm(true)}
              whileHover={{ scale: 1.04, boxShadow: '0 8px 25px rgba(37,99,235,0.25)' }}
              whileTap={{ scale: 0.96 }}
            >
              <Plus size={18} />
              Raise Complaint
            </motion.button>
          </motion.div>

          <SatisfactionScore />

          <div className="student-tabs">
            <button
              className={`tab-btn ${activeTab === 'feed' ? 'active' : ''}`}
              onClick={() => setActiveTab('feed')}
            >
              Resolution Feed
            </button>
            <button
              className={`tab-btn ${activeTab === 'my' ? 'active' : ''}`}
              onClick={() => setActiveTab('my')}
            >
              My Complaints
              {activeComplaints.length > 0 && (
                <span className="tab-count">{activeComplaints.length}</span>
              )}
            </button>
          </div>

          {activeTab === 'feed' && (
            <div className="student-feed">
              {state.feedPosts.length > 0 ? (
                state.feedPosts.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.3 }}
                  >
                    <FeedPost post={post} />
                  </motion.div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No resolved complaints yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'my' && (
            <div className="student-complaints">
              {myComplaints.length > 0 ? (
                myComplaints.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.3 }}
                    onClick={() => setTrackingComplaint(c)}
                    style={{ cursor: 'pointer' }}
                  >
                    <ComplaintCard complaint={c} showActions={false} />
                  </motion.div>
                ))
              ) : (
                <div className="empty-state">
                  <Sparkles size={24} />
                  <p>You haven&apos;t raised any complaints yet</p>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
                    <Plus size={14} /> Raise Your First Complaint
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Complaint Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Raise a Complaint"
        size="lg"
      >
        <ComplaintForm onClose={() => setShowForm(false)} />
      </Modal>

      {/* Status Tracking Modal */}
      <Modal
        isOpen={!!trackingComplaint}
        onClose={() => setTrackingComplaint(null)}
        title="Complaint Status Tracking"
        size="md"
      >
        {trackingComplaint && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>{trackingComplaint.title}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--clr-text-secondary)' }}>{trackingComplaint.description}</p>
            </div>
            {trackingComplaint.category && (
              <div style={{ marginBottom: '12px', padding: '8px 12px', background: 'var(--clr-bg)', borderRadius: '8px', fontSize: '0.8rem' }}>
                <strong>Category:</strong> {trackingComplaint.category} &nbsp;|&nbsp;
                <strong>Routed to:</strong> {trackingComplaint.department?.name || 'General'}
              </div>
            )}
            <StatusTracker complaint={trackingComplaint} />
          </div>
        )}
      </Modal>
    </div>
  );
}
