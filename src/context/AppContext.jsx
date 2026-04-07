import { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  getApiKey, 
  getUserProfile, 
  getHistory, 
  setApiKey as saveApiKey, 
  addToHistory as saveToHistory, 
  saveCurrentFortune, 
  getCurrentFortune, 
  clearCurrentFortune, 
  migrateStorage, 
  clearHistory, 
  setTestMode, 
  getTestMode,
  getProfiles,
  setProfiles as saveProfiles,
  getActiveProfileId,
  setActiveProfileId as saveActiveId
} from '../services/storage';

const AppContext = createContext(null);
const AppDispatchContext = createContext(null);

const initialState = {
  apiKey: getApiKey(),
  profiles: getProfiles(),
  activeProfileId: getActiveProfileId(),
  editingProfileId: null, // Track which profile is being edited
  user: getUserProfile(), // Legally maintained for active profile compatibility
  currentFortune: {
    coffeeStep: 'intent',
    tarotStep: 'intent',
    intent: '',
    images: [], 
    coffeeResult: null,
    tarotResult: null,
    tabData: {}, // Detailed results cache
    selectedTarotCards: [],
    tarotIntent: '',
    ritualProgress: 0,
    synthesisResult: null,
    synthesisAnimated: false,
    detailsAnimated: false,
    shadowSymbolsAnimated: false,
    symbolsAnimated: false,
    coffeeAnimated: false,
    tarotAnimated: false,
  },
  history: [],
  showApiKeyModal: !getApiKey(),
  showOnboarding: !getUserProfile(), 
  isLoading: false,
  isHydrating: true, // App starts in hydrating state
  showWelcome: true, // Show splash screen on first mount
  isTestMode: getTestMode(), // Auto-detected from storage & environment
  error: null,
};

function appReducer(state, action) {
  if (!state) return initialState;

  switch (action.type) {
    case 'RESTORE_FORTUNE':
      if (!action.payload) return state;
      return { 
        ...state, 
        currentFortune: { 
          ...initialState.currentFortune, 
          ...action.payload,
          coffeeStep: action.payload.coffeeStep || action.payload.step || 'intent',
          tarotStep: action.payload.tarotStep || 'intent'
        } 
      };

    case 'SET_API_KEY':
      saveApiKey(action.payload);
      return { ...state, apiKey: action.payload, showApiKeyModal: false };

    case 'SET_USER': {
      const targetId = state.editingProfileId || state.activeProfileId;
      let updatedProfiles = state.profiles.map(p => 
        p.id === targetId ? { ...p, ...action.payload } : p
      );

      // Eğer profil listesi boşsa veya hedef profil bulunamadıysa → yeni profil olarak ekle
      const found = updatedProfiles.find(p => p.id === targetId);
      if (!found) {
        const newProfile = { id: 'main', isMain: true, ...action.payload };
        updatedProfiles = [newProfile];
        saveActiveId('main');
      }

      saveProfiles(updatedProfiles);
      const nextUser = updatedProfiles.find(p => p.id === (state.editingProfileId ? state.activeProfileId : targetId)) || updatedProfiles[0];

      return { 
        ...state, 
        profiles: updatedProfiles, 
        user: nextUser, 
        showOnboarding: false,
        editingProfileId: null
      };
    }

    case 'ADD_PROFILE': {
      const newProfiles = [...state.profiles, action.payload];
      saveProfiles(newProfiles);
      saveActiveId(action.payload.id);
      return { 
        ...state, 
        profiles: newProfiles, 
        activeProfileId: action.payload.id,
        user: action.payload,
        showOnboarding: false,
        editingProfileId: null
      };
    }

    case 'START_EDIT_PROFILE': {
      return { 
        ...state, 
        editingProfileId: action.payload, 
        showOnboarding: true 
      };
    }

    case 'STOP_EDIT_PROFILE': {
      return { 
        ...state, 
        editingProfileId: null, 
        showOnboarding: false 
      };
    }

    case 'SWITCH_PROFILE': {
//...
      const profile = state.profiles.find(p => p.id === action.payload) || state.profiles[0];
      saveActiveId(profile.id);
      return { 
        ...state, 
        activeProfileId: profile.id, 
        user: profile 
      };
    }

    case 'DELETE_PROFILE': {
      if (action.payload === 'main') return state; // Protection for main account
      const filtered = state.profiles.filter(p => p.id !== action.payload);
      saveProfiles(filtered);
      
      // If we deleted the active profile, switch back to main
      let nextId = state.activeProfileId;
      let nextUser = state.user;
      if (state.activeProfileId === action.payload) {
        nextId = 'main';
        nextUser = filtered.find(p => p.id === 'main') || filtered[0];
        saveActiveId('main');
      }
      
      return { ...state, profiles: filtered, activeProfileId: nextId, user: nextUser };
    }

    case 'TOGGLE_API_KEY_MODAL':
      return { ...state, showApiKeyModal: !state.showApiKeyModal };

    case 'TOGGLE_TEST_MODE':
      // Safety: Only allowed in development
      if (import.meta.env.PROD) return state;
      const nextTestMode = !state.isTestMode;
      setTestMode(nextTestMode);
      return { ...state, isTestMode: nextTestMode };

    case 'SHOW_API_KEY_MODAL':
      return { ...state, showApiKeyModal: action.payload };

    case 'SHOW_ONBOARDING':
      return { ...state, showOnboarding: action.payload };

    case 'SET_INTENT':
      return { 
        ...state, 
        currentFortune: { 
          ...state.currentFortune, 
          intent: action.payload, 
          coffeeStep: 'upload' 
        } 
      };

    case 'SET_IMAGES':
      return { 
        ...state, 
        currentFortune: { 
          ...state.currentFortune, 
          images: action.payload, 
          coffeeStep: 'analyzing' 
        } 
      };

    case 'SET_COFFEE_RESULT':
      return { 
        ...state, 
        currentFortune: { 
          ...state.currentFortune, 
          coffeeResult: action.payload, 
          coffeeStep: 'results' 
        }, 
        isLoading: false 
      };

    case 'SET_TAROT_INTENT':
      return { 
        ...state, 
        currentFortune: { 
          ...state.currentFortune, 
          tarotIntent: action.payload, 
          tarotStep: 'ritual' 
        } 
      };

    case 'SET_TAROT_STEP':
      return { 
        ...state, 
        currentFortune: { ...state.currentFortune, tarotStep: action.payload } 
      };

    case 'SET_TAROT_RESULT':
      return { 
        ...state, 
        currentFortune: { ...state.currentFortune, tarotResult: action.payload } 
      };

    case 'SET_COFFEE_STEP':
      return { 
        ...state, 
        currentFortune: { ...state.currentFortune, coffeeStep: action.payload } 
      };

    case 'SET_TAROT_RITUAL_PROGRESS':
      return { 
        ...state, 
        currentFortune: { ...state.currentFortune, ritualProgress: action.payload } 
      };

    case 'SET_TAROT_CARDS':
      return { 
        ...state, 
        currentFortune: { 
          ...state.currentFortune, 
          selectedTarotCards: action.payload, 
          tarotStep: 'results' 
        } 
      };

    case 'SET_TAB_DATA':
      return { 
        ...state, 
        currentFortune: { 
          ...state.currentFortune, 
          tabData: { ...state.currentFortune.tabData, ...action.payload } 
        } 
      };

    case 'GO_TO_BRIDGE':
      return { 
        ...state, 
        currentFortune: { ...state.currentFortune, coffeeStep: 'bridge' } 
      };

    case 'GO_BACK_TO_RESULTS':
      return { 
        ...state, 
        currentFortune: { ...state.currentFortune, coffeeStep: 'results' } 
      };

    case 'SET_TAROT_SYNTHESIS_CARDS':
      return { 
        ...state, 
        currentFortune: { 
          ...state.currentFortune, 
          selectedTarotCards: action.payload, 
          synthesisResult: null, // Clear old result to prevent ghost text
          coffeeStep: 'synthesis' 
        } 
      };

    case 'SET_SYNTHESIS_RESULT':
      return { 
        ...state, 
        currentFortune: { ...state.currentFortune, synthesisResult: action.payload }, 
        isLoading: false 
      };
    
    case 'MARK_COFFEE_ANIMATED':
      return { 
        ...state, 
        currentFortune: { ...state.currentFortune, coffeeAnimated: true } 
      };

    case 'MARK_SYNTHESIS_ANIMATED':
      return { 
        ...state, 
        currentFortune: { ...state.currentFortune, synthesisAnimated: true } 
      };

    case 'MARK_SYMBOLS_ANIMATED':
      return { 
        ...state, 
        currentFortune: { ...state.currentFortune, symbolsAnimated: true } 
      };

    case 'MARK_DETAILS_ANIMATED':
      return { 
        ...state, 
        currentFortune: { ...state.currentFortune, detailsAnimated: true } 
      };

    case 'MARK_TAROT_ANIMATED':
      return { 
        ...state, 
        currentFortune: { ...state.currentFortune, tarotAnimated: true } 
      };

    case 'RESET_FORTUNE':
      clearCurrentFortune();
      return { 
        ...state, 
        currentFortune: { ...initialState.currentFortune }, 
        isLoading: false, 
        error: null 
      };

    case 'SET_HISTORY':
      // Safety: Always slice to last 5 as it's our elite archive limit
      return { ...state, history: (action.payload || []).slice(0, 5) };

    case 'SET_LOADING':
      return { ...state, isLoading: !!action.payload };

    case 'SET_HYDRATING':
      return { ...state, isHydrating: !!action.payload };

    case 'HIDE_WELCOME':
      return { ...state, showWelcome: false };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    case 'CLEAR_HISTORY':
      clearHistory();
      return { ...state, history: [] };

    case 'SAVE_TO_HISTORY': {
      const type = action.payload?.type || 'coffee';
      const isCoffee = type === 'coffee';
      
      const historyEntry = {
        type,
        intent: isCoffee ? state.currentFortune.intent : (state.currentFortune.tarotIntent?.intent || 'Genel Niyet'),
        images: isCoffee ? state.currentFortune.images : [],
        coffeeResult: isCoffee ? state.currentFortune.coffeeResult : null,
        tarotCards: state.currentFortune.selectedTarotCards || [],
        synthesisResult: isCoffee ? state.currentFortune.synthesisResult : null,
        tarotResult: !isCoffee ? state.currentFortune.tarotResult : null,
        id: Date.now().toString(),
        date: new Date().toISOString()
      };
      
      saveToHistory(historyEntry); 
      const newHistory = [historyEntry, ...state.history].slice(0, 5);
      return { ...state, history: newHistory };
    }

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    let mounted = true;
    
    async function loadData() {
      try {
        await migrateStorage();

        const history = await getHistory();
        const savedFortune = await getCurrentFortune();
        
        if (!mounted) return;

        // Sync items are already in initialState, but we can re-verify if needed
        // Async items (history/fortune) need to be loaded here
        if (history && history.length) dispatch({ type: 'SET_HISTORY', payload: history.slice(0, 5) });
        if (savedFortune) dispatch({ type: 'RESTORE_FORTUNE', payload: savedFortune });
        
        // Modal logic
        const apiKey = getApiKey();
        const user = getUserProfile();
        if (!apiKey) dispatch({ type: 'SHOW_API_KEY_MODAL', payload: true });
        if (!user) dispatch({ type: 'SHOW_ONBOARDING', payload: true });
      } catch (err) {
        console.error('Initial load error:', err);
      } finally {
        if (mounted) dispatch({ type: 'SET_HYDRATING', payload: false });
      }
    }

    loadData();
    return () => { mounted = false; };
  }, []);

  // Persistence effect for current fortune
  useEffect(() => {
    if (state && state.currentFortune) {
      const { coffeeStep, tarotStep, intent } = state.currentFortune;
      if (coffeeStep !== 'intent' || tarotStep !== 'intent' || intent !== '') {
        saveCurrentFortune(state.currentFortune);
      }
    }
  }, [state.currentFortune]);

  return (
    <AppContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    console.error('useAppState must be used within AppProvider');
    return initialState; // Fallback to avoid immediate crash
  }
  return context;
}

export function useAppDispatch() {
  const context = useContext(AppDispatchContext);
  if (!context) {
    console.warn('useAppDispatch used outside provider');
    return () => {}; // Fallback no-op
  }
  return context;
}