import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, MapPin, Clock, Send } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { getTimeAgo } from '../utils/prioritize';
import './FeedPost.css';

export default function FeedPost({ post }) {
  const { state, dispatch } = useApp();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleLike = () => {
    dispatch({ type: 'TOGGLE_LIKE', payload: { id: post.id } });
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    dispatch({ type: 'ADD_COMMENT', payload: { postId: post.id, text: commentText.trim() } });
    setCommentText('');
  };

  return (
    <motion.article
      className="feed-post"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="post-header">
        <div className="post-avatar">
          <span>🛠️</span>
        </div>
        <div className="post-author-info">
          <span className="post-author">{post.resolvedBy}</span>
          <span className="post-time">
            <Clock size={12} /> {getTimeAgo(post.resolvedAt)}
          </span>
        </div>
        <span className="post-resolved-badge">✅ Resolved</span>
      </div>

      <h3 className="post-title">{post.title}</h3>
      <p className="post-desc">{post.description}</p>

      {post.image && (
        <div className="post-image-wrap">
          <img src={post.image} alt={post.title} className="post-image" />
        </div>
      )}

      <div className="post-location">
        <MapPin size={14} />
        <span>{post.area}</span>
      </div>

      <div className="post-engagement">
        <motion.button
          className={`engage-btn like-btn ${post.likedByUser ? 'liked' : ''}`}
          onClick={handleLike}
          whileTap={{ scale: 0.9 }}
        >
          <Heart size={18} fill={post.likedByUser ? '#ef4444' : 'none'} />
          <span>{post.likes}</span>
        </motion.button>
        <button
          className="engage-btn comment-btn"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle size={18} />
          <span>{post.comments.length}</span>
        </button>
      </div>

      {showComments && (
        <motion.div
          className="comments-section"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.25 }}
        >
          {post.comments.length > 0 && (
            <div className="comments-list">
              {post.comments.map(c => (
                <div key={c.id} className="comment-item">
                  <span className="comment-user">{c.user}</span>
                  <span className="comment-text">{c.text}</span>
                  <span className="comment-time">{getTimeAgo(c.time)}</span>
                </div>
              ))}
            </div>
          )}
          <form className="comment-form" onSubmit={handleComment}>
            <input
              type="text"
              className="comment-input"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit" className="comment-send" disabled={!commentText.trim()}>
              <Send size={16} />
            </button>
          </form>
        </motion.div>
      )}
    </motion.article>
  );
}
