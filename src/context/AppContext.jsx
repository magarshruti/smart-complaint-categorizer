import { createContext, useContext, useReducer } from 'react';
import { seedComplaints, seedFeedPosts } from '../data/seedData';
import { classifyPriority } from '../utils/prioritize';

const AppContext = createContext();

const initialState = {
  user: null, // { role: 'admin' | 'student', name: string }
  complaints: seedComplaints,
  feedPosts: seedFeedPosts,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };

    case 'LOGOUT':
      return { ...state, user: null };

    case 'ADD_COMPLAINT': {
      const newComplaint = {
        ...action.payload,
        id: Date.now().toString(),
        status: 'open',
        createdAt: new Date().toISOString(),
        aiPrioritized: true,
        priority: classifyPriority(action.payload.description, action.payload.subCategory),
        resolution: null,
      };
      return { ...state, complaints: [newComplaint, ...state.complaints] };
    }

    case 'UPDATE_STATUS': {
      return {
        ...state,
        complaints: state.complaints.map(c =>
          c.id === action.payload.id ? { ...c, status: action.payload.status } : c
        )
      };
    }

    case 'RESOLVE_COMPLAINT': {
      const { id, description, image } = action.payload;
      const complaint = state.complaints.find(c => c.id === id);

      const newPost = {
        id: `f-${Date.now()}`,
        complaintId: id,
        title: complaint?.title || 'Resolved Issue',
        description,
        area: complaint?.area || '',
        image: image || null,
        resolvedAt: new Date().toISOString(),
        resolvedBy: 'Admin - Maintenance Dept.',
        likes: 0,
        likedByUser: false,
        comments: [],
      };

      return {
        ...state,
        complaints: state.complaints.map(c =>
          c.id === id ? { ...c, status: 'resolved', resolution: { description, image } } : c
        ),
        feedPosts: [newPost, ...state.feedPosts],
      };
    }

    case 'RESUBMIT_COMPLAINT': {
      return {
        ...state,
        complaints: state.complaints.map(c =>
          c.id === action.payload.id
            ? { ...c, priority: 'high', status: 'open', createdAt: new Date().toISOString(), aiPrioritized: true }
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
