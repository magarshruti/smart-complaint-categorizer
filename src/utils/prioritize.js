// AI-based priority classifier (keyword heuristic)
const HIGH_KEYWORDS = [
  'water', 'electricity', 'fire', 'flood', 'leak', 'power', 'outage',
  'sewage', 'gas', 'emergency', 'danger', 'broken pipe', 'short circuit',
  'no water', 'no electricity', 'sparking', 'smoke'
];

const MEDIUM_KEYWORDS = [
  'cleanliness', 'dirty', 'pest', 'insect', 'cockroach', 'rat',
  'furniture', 'broken', 'fan', 'light', 'ac', 'air conditioner',
  'wifi', 'internet', 'slow', 'noise', 'smell', 'drainage'
];

export function classifyPriority(text, subCategory = '') {
  const combined = `${text} ${subCategory}`.toLowerCase();

  for (const kw of HIGH_KEYWORDS) {
    if (combined.includes(kw)) return 'high';
  }
  for (const kw of MEDIUM_KEYWORDS) {
    if (combined.includes(kw)) return 'medium';
  }
  return 'low';
}

export function checkEscalation(complaint) {
  if (complaint.status === 'resolved') return null;

  const now = new Date();
  const created = new Date(complaint.createdAt);
  const hoursElapsed = (now - created) / (1000 * 60 * 60);

  if (hoursElapsed >= 48) {
    return {
      escalated: true,
      message: 'Action Required within 2–3 days',
      canResubmit: true
    };
  }
  return null;
}

export function getTimeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
