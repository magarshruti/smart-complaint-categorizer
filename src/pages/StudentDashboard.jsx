import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import FeedPost from '../components/FeedPost.jsx';
import ComplaintCard from '../components/ComplaintCard.jsx';
import Modal from '../components/Modal.jsx';
import ComplaintForm from '../components/ComplaintForm.jsx';
import { useApp } from '../context/AppContext.jsx';
import { checkEscalation } from '../utils/prioritize';
import './StudentDashboard.css';

export default function StudentDashboard() {
  const { state } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');

  const myComplaints = state.complaints.filter(
    c => c.studentName === state.user?.name && c.status !== 'resolved'
  );

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
              <p className="student-subtitle">View resolutions, raise complaints, and engage</p>
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
              {myComplaints.length > 0 && (
                <span className="tab-count">{myComplaints.length}</span>
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

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Raise a Complaint"
        size="lg"
      >
        <ComplaintForm onClose={() => setShowForm(false)} />
      </Modal>
    </div>
  );
}
