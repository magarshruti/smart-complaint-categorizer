// ================================================================
// AI-based classification engine
// ================================================================

// ── Priority Keywords ──────────────────────────────────────────
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

const URGENT_KEYWORDS = [
  'fire', 'emergency', 'danger', 'sparking', 'smoke', 'flood',
  'sewage', 'short circuit', 'collapsed', 'gas leak', 'no water',
  'no electricity', 'health hazard', 'injury', 'accident'
];

// ── Category Keywords ──────────────────────────────────────────
const CATEGORY_RULES = [
  {
    category: 'Infrastructure',
    keywords: ['plumbing', 'pipe', 'water', 'tap', 'sewage', 'drainage',
      'elevator', 'parking', 'streetlight', 'road', 'building', 'wall',
      'roof', 'leak', 'flood', 'construction', 'door', 'window', 'gate',
      'broken furniture', 'chair', 'desk', 'bench']
  },
  {
    category: 'IT',
    keywords: ['wifi', 'wi-fi', 'internet', 'network', 'computer', 'laptop',
      'projector', 'server', 'software', 'printer', 'lan', 'website',
      'portal', 'login', 'password', 'connectivity', 'online']
  },
  {
    category: 'Hostel',
    keywords: ['hostel', 'room', 'roommate', 'warden', 'mess', 'laundry',
      'curfew', 'visitor', 'pest', 'cockroach', 'rat', 'insect',
      'cleanliness', 'dirty', 'bathroom', 'washroom', 'fan', 'bed']
  },
  {
    category: 'Academic',
    keywords: ['lecture', 'class', 'exam', 'professor', 'teacher', 'syllabus',
      'assignment', 'grade', 'marks', 'attendance', 'timetable', 'lab',
      'library', 'book', 'curriculum', 'course', 'semester']
  },
  {
    category: 'Faculty',
    keywords: ['faculty', 'professor', 'teacher', 'hod', 'dean',
      'staff', 'behavior', 'teaching', 'unfair', 'biased', 'harassment',
      'discrimination', 'rude']
  },
];

// ── Department Mapping ─────────────────────────────────────────
const DEPARTMENT_MAP = {
  'Infrastructure': { name: 'Infrastructure & Maintenance Dept.', email: 'infra@campus.edu', color: '#6366f1' },
  'IT':             { name: 'IT Services Dept.', email: 'it-support@campus.edu', color: '#0ea5e9' },
  'Hostel':         { name: 'Hostel Administration', email: 'hostel@campus.edu', color: '#f59e0b' },
  'Academic':       { name: 'Academic Affairs Dept.', email: 'academic@campus.edu', color: '#22c55e' },
  'Faculty':        { name: 'Faculty Relations Office', email: 'faculty-relations@campus.edu', color: '#ef4444' },
  'General':        { name: 'General Administration', email: 'admin@campus.edu', color: '#64748b' },
};

// ── Classify Priority ──────────────────────────────────────────
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

// ── Classify Category ──────────────────────────────────────────
export function classifyCategory(text, area = '', subCategory = '') {
  const combined = `${text} ${area} ${subCategory}`.toLowerCase();

  let bestMatch = { category: 'General', score: 0 };

  for (const rule of CATEGORY_RULES) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (combined.includes(kw)) score++;
    }
    if (score > bestMatch.score) {
      bestMatch = { category: rule.category, score };
    }
  }

  // Fallback: use area name to detect category
  if (bestMatch.score === 0) {
    const areaLower = area.toLowerCase();
    if (areaLower.includes('hostel')) return 'Hostel';
    if (areaLower.includes('academic') || areaLower.includes('library')) return 'Academic';
    if (areaLower.includes('canteen') || areaLower.includes('common') || areaLower.includes('sports')) return 'Infrastructure';
    return 'General';
  }

  return bestMatch.category;
}

// ── Get Department for Category ────────────────────────────────
export function getDepartment(category) {
  return DEPARTMENT_MAP[category] || DEPARTMENT_MAP['General'];
}

export function getAllDepartments() {
  return DEPARTMENT_MAP;
}

// ── Detect Urgency ─────────────────────────────────────────────
export function detectUrgency(text, subCategory = '') {
  const combined = `${text} ${subCategory}`.toLowerCase();
  for (const kw of URGENT_KEYWORDS) {
    if (combined.includes(kw)) {
      return { urgent: true, keyword: kw };
    }
  }
  return { urgent: false, keyword: null };
}

// ── Full AI Analysis (runs all classifiers at once) ────────────
export function analyzeComplaint(text, area = '', subCategory = '') {
  const priority = classifyPriority(text, subCategory);
  const category = classifyCategory(text, area, subCategory);
  const department = getDepartment(category);
  const urgency = detectUrgency(text, subCategory);

  return { priority, category, department, urgency };
}

// ── Escalation Check (48-hour rule) ────────────────────────────
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

// ── Status Timeline Helpers ────────────────────────────────────
export function getStatusSteps(complaint) {
  const steps = [
    { key: 'submitted', label: 'Submitted', done: true, time: complaint.createdAt },
    { key: 'classified', label: 'AI Classified', done: true, time: complaint.createdAt },
    { key: 'routed', label: `Routed to ${complaint.department?.name || 'Dept.'}`, done: true, time: complaint.createdAt },
    {
      key: 'in-progress',
      label: 'In Progress',
      done: complaint.status === 'in-progress' || complaint.status === 'resolved',
      time: complaint.statusHistory?.find(s => s.status === 'in-progress')?.time || null
    },
    {
      key: 'resolved',
      label: 'Resolved',
      done: complaint.status === 'resolved',
      time: complaint.statusHistory?.find(s => s.status === 'resolved')?.time || null
    },
  ];
  return steps;
}

// ── Time Ago ───────────────────────────────────────────────────
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
