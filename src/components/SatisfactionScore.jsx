import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, ThumbsUp, ThumbsDown, Minus, BarChart3 } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import './SatisfactionScore.css';

export default function SatisfactionScore() {
  const { state, dispatch } = useApp();
  const [userRating, setUserRating] = useState(null);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // Calculate NPS from feed post engagement
  const npsData = useMemo(() => {
    const posts = state.feedPosts;
    if (posts.length === 0) return { score: 0, promoters: 0, detractors: 0, passives: 0, total: 0 };

    const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);
    const totalComments = posts.reduce((sum, p) => sum + p.comments.length, 0);
    const avgLikesPerPost = posts.length > 0 ? totalLikes / posts.length : 0;

    // Simulated NPS calculation based on engagement
    const resolved = state.complaints.filter(c => c.status === 'resolved').length;
    const total = state.complaints.length;
    const resolutionRate = total > 0 ? (resolved / total) * 100 : 0;

    // Derive NPS-like score: -100 to +100
    const engagementScore = Math.min(avgLikesPerPost * 4, 40);
    const commentScore = Math.min(totalComments * 3, 30);
    const resolutionScore = resolutionRate * 0.3;
    const rawNPS = Math.round(engagementScore + commentScore + resolutionScore - 20);
    const score = Math.max(-100, Math.min(100, rawNPS));

    // Simulate promoter/passive/detractor breakdown
    const promoters = Math.round(Math.max(0, score + 30) / 2);
    const detractors = Math.round(Math.max(0, 40 - score) / 3);
    const passives = 100 - promoters - detractors;

    // Add user ratings from context
    const ratings = state.satisfactionRatings || [];
    const avgRating = ratings.length > 0
      ? (ratings.reduce((s, r) => s + r, 0) / ratings.length).toFixed(1)
      : null;

    return { score, promoters, detractors, passives, total: posts.length, avgRating, totalLikes, totalComments, resolutionRate: resolutionRate.toFixed(0) };
  }, [state.feedPosts, state.complaints, state.satisfactionRatings]);

  const getScoreColor = (score) => {
    if (score >= 50) return '#22c55e';
    if (score >= 0) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return 'Excellent';
    if (score >= 50) return 'Great';
    if (score >= 30) return 'Good';
    if (score >= 0) return 'Okay';
    if (score >= -30) return 'Needs Work';
    return 'Critical';
  };

  const handleSubmitRating = (rating) => {
    setUserRating(rating);
    setSubmitted(true);
    dispatch({ type: 'ADD_SATISFACTION_RATING', payload: { rating } });
    setTimeout(() => setSubmitted(false), 3000);
  };

  const scoreColor = getScoreColor(npsData.score);

  return (
    <motion.div
      className="nps-section"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="nps-header">
        <div className="nps-header-left">
          <BarChart3 size={16} />
          <h3 className="nps-title">College Satisfaction Score</h3>
        </div>
        <span className="nps-badge" style={{ background: `${scoreColor}15`, color: scoreColor, borderColor: `${scoreColor}40` }}>
          {getScoreLabel(npsData.score)}
        </span>
      </div>

      <div className="nps-body">
        {/* Score Ring */}
        <div className="nps-score-wrap">
          <motion.div
            className="nps-score-ring"
            style={{ '--score-color': scoreColor }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <span className="nps-score-value">{npsData.score > 0 ? '+' : ''}{npsData.score}</span>
            <span className="nps-score-label">NPS Score</span>
          </motion.div>
        </div>

        {/* Breakdown */}
        <div className="nps-breakdown">
          <div className="nps-bar-group">
            <div className="nps-bar-row">
              <div className="nps-bar-label">
                <ThumbsUp size={12} />
                <span>Promoters</span>
              </div>
              <div className="nps-bar-track">
                <motion.div
                  className="nps-bar-fill bar-promoter"
                  initial={{ width: 0 }}
                  animate={{ width: `${npsData.promoters}%` }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                />
              </div>
              <span className="nps-bar-pct">{npsData.promoters}%</span>
            </div>
            <div className="nps-bar-row">
              <div className="nps-bar-label">
                <Minus size={12} />
                <span>Passives</span>
              </div>
              <div className="nps-bar-track">
                <motion.div
                  className="nps-bar-fill bar-passive"
                  initial={{ width: 0 }}
                  animate={{ width: `${npsData.passives}%` }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                />
              </div>
              <span className="nps-bar-pct">{npsData.passives}%</span>
            </div>
            <div className="nps-bar-row">
              <div className="nps-bar-label">
                <ThumbsDown size={12} />
                <span>Detractors</span>
              </div>
              <div className="nps-bar-track">
                <motion.div
                  className="nps-bar-fill bar-detractor"
                  initial={{ width: 0 }}
                  animate={{ width: `${npsData.detractors}%` }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                />
              </div>
              <span className="nps-bar-pct">{npsData.detractors}%</span>
            </div>
          </div>

          <div className="nps-stats">
            <div className="nps-stat">
              <span className="nps-stat-val">{npsData.totalLikes}</span>
              <span className="nps-stat-lbl">Total Likes</span>
            </div>
            <div className="nps-stat">
              <span className="nps-stat-val">{npsData.totalComments}</span>
              <span className="nps-stat-lbl">Comments</span>
            </div>
            <div className="nps-stat">
              <span className="nps-stat-val">{npsData.resolutionRate}%</span>
              <span className="nps-stat-lbl">Resolved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Student rating (only shown on student dashboard) */}
      {state.user?.role === 'student' && (
        <div className="nps-rate-section">
          <span className="nps-rate-label">Rate your campus experience:</span>
          <div className="nps-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                className={`star-btn ${(hoveredStar >= star || (userRating && userRating >= star)) ? 'star-active' : ''}`}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => handleSubmitRating(star)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                disabled={submitted}
              >
                <Star size={22} fill={(hoveredStar >= star || (userRating && userRating >= star)) ? '#f59e0b' : 'none'} />
              </motion.button>
            ))}
          </div>
          {submitted && (
            <motion.span
              className="rate-thanks"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ✅ Thanks for your feedback!
            </motion.span>
          )}
          {npsData.avgRating && (
            <span className="avg-rating">Average student rating: ⭐ {npsData.avgRating}/5</span>
          )}
        </div>
      )}
    </motion.div>
  );
}
