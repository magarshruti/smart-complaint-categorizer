import { createContext, useContext, useReducer, useCallback } from 'react';
import { seedComplaints, seedFeedPosts } from '../data/seedData';
import { analyzeComplaint } from '../utils/prioritize';

const AppContext = createContext();

const initialState = {
  user: null, // { role: 'admin' | 'student', name: string }
  complaints: seedComplaints,
  feedPosts: seedFeedPosts,
  notifications: [], // toast notifications
  satisfactionRatings: [4, 5, 3, 4, 5, 4, 3, 5, 4, 4], // seed ratings
};

let notifId = 0;

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };

    case 'LOGOUT':
      return { ...state, user: null };

    case 'ADD_COMPLAINT': {
      const { description, area, subCategory } = action.payload;
      const analysis = analyzeComplaint(description, area, subCategory);

      const now = new Date().toISOString();
      const newComplaint = {
        ...action.payload,
        id: Date.now().toString(),
        status: 'open',
        createdAt: now,
        aiPrioritized: true,
        priority: analysis.priority,
        category: analysis.category,
        department: analysis.department,
        isUrgent: analysis.urgency.urgent,
        statusHistory: [{ status: 'open', time: now }],
        resolution: null,
      };

      // Simulated email notification
      const emailNotif = {
        id: ++notifId,
        type: 'email',
        title: `📧 Email sent to ${analysis.department.name}`,
        message: `Complaint "${newComplaint.title}" routed to ${analysis.department.email}`,
        time: now,
        category: analysis.category,
        department: analysis.department,
      };

      return {
        ...state,
        complaints: [newComplaint, ...state.complaints],
        notifications: [emailNotif, ...state.notifications],
      };
    }

    case 'UPDATE_STATUS': {
      const now = new Date().toISOString();
      return {
        ...state,
        complaints: state.complaints.map(c =>
          c.id === action.payload.id
            ? {
                ...c,
                status: action.payload.status,
                statusHistory: [...(c.statusHistory || []), { status: action.payload.status, time: now }],
              }
            : c
        )
      };
    }

    case 'RESOLVE_COMPLAINT': {
      const { id, description, image } = action.payload;
      const complaint = state.complaints.find(c => c.id === id);
      const now = new Date().toISOString();

      const newPost = {
        id: `f-${Date.now()}`,
        complaintId: id,
        title: complaint?.title || 'Resolved Issue',
        description,
        area: complaint?.area || '',
        category: complaint?.category || 'General',
        department: complaint?.department?.name || 'General Administration',
        image: image || null,
        resolvedAt: now,
        resolvedBy: `Admin - ${complaint?.department?.name || 'Maintenance Dept.'}`,
        likes: 0,
        likedByUser: false,
        comments: [],
      };

      return {
        ...state,
        complaints: state.complaints.map(c =>
          c.id === id
            ? {
                ...c,
                status: 'resolved',
                resolution: { description, image },
                statusHistory: [...(c.statusHistory || []), { status: 'resolved', time: now }],
              }
            : c
        ),
        feedPosts: [newPost, ...state.feedPosts],
      };
    }

    case 'RESUBMIT_COMPLAINT': {
      const now = new Date().toISOString();
      return {
        ...state,
        complaints: state.complaints.map(c =>
          c.id === action.payload.id
            ? {
                ...c,
                priority: 'high',
                isUrgent: true,
                status: 'open',
                createdAt: now,
                aiPrioritized: true,
                statusHistory: [...(c.statusHistory || []), { status: 're-submitted', time: now }, { status: 'open', time: now }],
              }
            : c
        )
      };
    }

    case 'TOGGLE_LIKE': {
      return {
        ...state,
        feedPosts: state.feedPosts.map(p =>
          p.id === action.payload.id
            ? {
                ...p,
                likedByUser: !p.likedByUser,
                likes: p.likedByUser ? p.likes - 1 : p.likes + 1
              }
            : p
        )
      };
    }

    case 'ADD_COMMENT': {
      const newComment = {
        id: `c-${Date.now()}`,
        user: state.user?.name || 'Student',
        text: action.payload.text,
        time: new Date().toISOString(),
      };
      return {
        ...state,
        feedPosts: state.feedPosts.map(p =>
          p.id === action.payload.postId
            ? { ...p, comments: [...p.comments, newComment] }
            : p
        )
      };
    }

    case 'ADD_NOTIFICATION': {
      return {
        ...state,
        notifications: [{ ...action.payload, id: ++notifId }, ...state.notifications],
      };
    }

    case 'DISMISS_NOTIFICATION': {
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload.id),
      };
    }

    case 'ADD_SATISFACTION_RATING': {
      return {
        ...state,
        satisfactionRatings: [...state.satisfactionRatings, action.payload.rating],
      };
    }

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
