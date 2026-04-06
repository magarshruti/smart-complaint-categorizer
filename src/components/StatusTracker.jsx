import { motion } from 'framer-motion';
import { Check, Circle } from 'lucide-react';
import { getStatusSteps, getTimeAgo } from '../utils/prioritize';
import './StatusTracker.css';

export default function StatusTracker({ complaint }) {
  const steps = getStatusSteps(complaint);

  return (
    <div className="status-tracker">
      <h4 className="tracker-title">Complaint Status Timeline</h4>
      <div className="tracker-steps">
        {steps.map((step, i) => (
          <motion.div
            key={step.key}
            className={`tracker-step ${step.done ? 'done' : 'pending'}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.25 }}
          >
            <div className="step-indicator">
              <div className={`step-dot ${step.done ? 'dot-done' : 'dot-pending'}`}>
                {step.done ? <Check size={12} /> : <Circle size={8} />}
              </div>
              {i < steps.length - 1 && (
                <div className={`step-line ${step.done ? 'line-done' : 'line-pending'}`} />
              )}
            </div>
            <div className="step-content">
              <span className="step-label">{step.label}</span>
              {step.time && step.done && (
                <span className="step-time">{getTimeAgo(step.time)}</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
