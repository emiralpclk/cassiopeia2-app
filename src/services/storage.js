import localforage from 'localforage';

/**
 * Storage CRUD operations for Cassiopeia
 * History and CurrentFortune moved to IndexedDB via localforage
 */

const KEYS = {
  API_KEY: 'cassiopeia_api_key',
  USER_PROFILE: 'cassiopeia_user_profile', // Legacy
  PROFILES: 'cassiopeia_profiles',
  ACTIVE_PROFILE_ID: 'cassiopeia_active_profile_id',
  HISTORY: 'cassiopeia_history',
  ONBOARDING_DONE: 'cassiopeia_onboarding_done',
  CURRENT_FORTUNE: 'cassiopeia_current_fortune',
  TEST_MODE: 'cassiopeia_test_mode',
  LIFETIME_STATS: 'cassiopeia_lifetime_stats',
};

// Configure localforage
localforage.config({
  name: 'Cassiopeia',
  storeName: 'cassiopeia_store',
  description: 'Storage for Cassiopeia fortunes and history'
});

// Auto-run migration
export async function migrateStorage() {
  try {
    // 1. History & Fortune Migration
    const oldHistory = localStorage.getItem(KEYS.HISTORY);
    if (oldHistory) {
      await localforage.setItem(KEYS.HISTORY, JSON.parse(oldHistory));
      localStorage.removeItem(KEYS.HISTORY);
    }

    const oldFortune = localStorage.getItem(KEYS.CURRENT_FORTUNE);
    if (oldFortune) {
      await localforage.setItem(KEYS.CURRENT_FORTUNE, JSON.parse(oldFortune));
      localStorage.removeItem(KEYS.CURRENT_FORTUNE);
    }

    // 2. Multi-Profile Migration
    const legacyProfile = localStorage.getItem(KEYS.USER_PROFILE);
    const existingProfiles = localStorage.getItem(KEYS.PROFILES);

    if (legacyProfile && !existingProfiles) {
      const parsedLegacy = JSON.parse(legacyProfile);
      const mainProfile = {
        ...parsedLegacy,
        id: 'main',
        name: 'Ana Hesap',
        isMain: true
      };
      localStorage.setItem(KEYS.PROFILES, JSON.stringify([mainProfile]));
      localStorage.setItem(KEYS.ACTIVE_PROFILE_ID, 'main');
      // Keep legacy for safety but mark it
      console.log('User profile migrated to Multi-Profile system');
    }
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

// Synced storage for small items
// API Key
export function getApiKey() {
  try { return localStorage.getItem(KEYS.API_KEY) || ''; } catch { return ''; }
}

export function setApiKey(key) {
  try { localStorage.setItem(KEYS.API_KEY, key); } catch {}
}

// Multi-Profile Storage
export function getProfiles() {
  try {
    const data = localStorage.getItem(KEYS.PROFILES);
    const profiles = data ? JSON.parse(data) : [];
    
    // Self-healing: Remove duplicate IDs if they exist
    const unique = [];
    const seen = new Set();
    for (const p of profiles) {
      if (!seen.has(p.id)) {
        unique.push(p);
        seen.add(p.id);
      }
    }
    
    if (unique.length !== profiles.length) {
      setProfiles(unique);
    }
    
    return unique;
  } catch {
    return [];
  }
}

export function setProfiles(profiles) {
  try {
    // Ensure uniqueness before saving
    const unique = Array.from(new Map(profiles.map(p => [p.id, p])).values());
    localStorage.setItem(KEYS.PROFILES, JSON.stringify(unique));
  } catch (err) {
    console.error('Error saving profiles:', err);
  }
}

export function getActiveProfileId() {
  try { return localStorage.getItem(KEYS.ACTIVE_PROFILE_ID) || 'main'; } catch { return 'main'; }
}

export function setActiveProfileId(id) {
  try { localStorage.setItem(KEYS.ACTIVE_PROFILE_ID, id); } catch {}
}

// Legacy support (to be phased out)
export function getUserProfile() {
  try {
    const activeId = getActiveProfileId();
    const profiles = getProfiles();
    return profiles.find(p => p.id === activeId) || profiles[0] || null;
  } catch { return null; }
}

// Onboarding
export function isOnboardingDone() {
  try { return localStorage.getItem(KEYS.ONBOARDING_DONE) === 'true'; } catch { return false; }
}

export function setOnboardingDone() {
  try { localStorage.setItem(KEYS.ONBOARDING_DONE, 'true'); } catch {}
}

// Test Mode (Mock API) - Environment aware
export function getTestMode() {
  // Always false in production for safety
  if (import.meta.env.PROD) return false;
  
  try { return localStorage.getItem(KEYS.TEST_MODE) === 'true'; } catch { return false; }
}

export function setTestMode(val) {
  // No-op in production
  if (import.meta.env.PROD) return;
  
  try { localStorage.setItem(KEYS.TEST_MODE, val ? 'true' : 'false'); } catch {}
}

// Async Storage for History and Current Fortune 
export async function getHistory() {
  try {
    const data = await localforage.getItem(KEYS.HISTORY);
    return data || [];
  } catch {
    return [];
  }
}

export async function addToHistory(entry) {
  try {
    const history = await getHistory();
    history.unshift({
      ...entry,
      id: entry.id || Date.now().toString(),
      date: entry.date || new Date().toISOString(),
    });
    // Strict limit: Only keep the last 5 entries as requested
    if (history.length > 5) {
      history.length = 5;
    }
    await localforage.setItem(KEYS.HISTORY, history);
  } catch (e) {
    console.error('addToHistory error:', e);
  }
}

export async function getHistoryById(id) {
  try {
    const history = await getHistory();
    return history.find((h) => h.id === id) || null;
  } catch { return null; }
}

export async function deleteHistoryItem(id) {
  try {
    const history = await getHistory();
    const newHistory = history.filter((h) => h.id !== id);
    await localforage.setItem(KEYS.HISTORY, newHistory);
  } catch {}
}

export async function clearHistory() {
  try {
    await localforage.removeItem(KEYS.HISTORY);
  } catch {}
}

// Current Fortune (Session Persistence)
export async function saveCurrentFortune(fortune) {
  try {
    await localforage.setItem(KEYS.CURRENT_FORTUNE, fortune);
  } catch {}
}

export async function getCurrentFortune() {
  try {
    const data = await localforage.getItem(KEYS.CURRENT_FORTUNE);
    return data || null;
  } catch { return null; }
}

export async function clearCurrentFortune() {
  try {
    await localforage.removeItem(KEYS.CURRENT_FORTUNE);
  } catch {}
}

// Lifetime Statistics
export async function getLifetimeStats() {
  try {
    const data = await localforage.getItem(KEYS.LIFETIME_STATS);
    if (!data || data.total === 0) {
      // Seed from existing history
      const history = await getHistory();
      if (history && history.length > 0) {
        const seedStats = {
          total: history.length,
          coffee: history.filter(h => h.type === 'coffee').length,
          tarot: history.filter(h => h.type === 'tarot').length
        };
        await localforage.setItem(KEYS.LIFETIME_STATS, seedStats);
        return seedStats;
      }
    }
    return data || { total: 0, coffee: 0, tarot: 0 };
  } catch { return { total: 0, coffee: 0, tarot: 0 }; }
}

export async function incrementLifetimeStats(type) {
  try {
    const stats = await getLifetimeStats();
    stats.total += 1;
    if (type === 'coffee') stats.coffee += 1;
    if (type === 'tarot') stats.tarot += 1;
    await localforage.setItem(KEYS.LIFETIME_STATS, stats);
    return stats;
  } catch (e) {
    return { total: 0, coffee: 0, tarot: 0 };
  }
}

export async function clearAllData() {
  try {
    localStorage.clear();
    await localforage.clear();
  } catch {}
}