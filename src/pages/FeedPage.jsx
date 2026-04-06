import { motion } from 'framer-motion';
import Navbar from '../components/Navbar.jsx';
import FeedPost from '../components/FeedPost.jsx';
import { useApp } from '../context/AppContext.jsx';
import './FeedPage.css';

export default function FeedPage() {
  const { state } = useApp();

  return (
    <div className="feed-page">
      <Navbar />
      <main className="feed-main">
        <div className="feed-container">
          <motion.div
            className="feed-header"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="feed-title">Resolution Feed</h1>
            <p className="feed-subtitle">
              See how campus complaints are being resolved — transparency in action
            </p>
          </motion.div>

          <div className="feed-list">
            {state.feedPosts.length > 0 ? (
              state.feedPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                >
                  <FeedPost post={post} />
                </motion.div>
              ))
            ) : (
              <div className="feed-empty">
                <p>No resolved complaints yet</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
