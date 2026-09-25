// ============================================================
// localAuthService.ts — localStorage Auth (Firebase Fallback)
// Used automatically when Firebase Auth credentials are not set
// ============================================================

const USERS_KEY = "beautycafe_users";
const SESSION_KEY = "beautycafe_session";

function isClient(): boolean {
  return typeof window !== "undefined";
}

interface StoredUser {
  uid: string;
  email: string;
  displayName: string;
  passwordHash: string;
}

export interface LocalSession {
  uid: string;
  email: string;
  displayName: string;
}

/** Very simple password encoding for local demo use */
function encodePassword(password: string): string {
  if (!isClient()) return "";
  try {
    return btoa(encodeURIComponent(password + ":bc_local_salt_v1"));
  } catch {
    return password + "_encoded";
  }
}

function getUsers(): Record<string, StoredUser> {
  if (!isClient()) return {};
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, StoredUser>) : {};
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, StoredUser>): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("localAuthService: failed to save users", e);
  }
}

function persistSession(session: LocalSession | null): void {
  if (!isClient()) return;
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export const localAuthService = {
  /** Get the currently logged-in session */
  getCurrentSession(): LocalSession | null {
    if (!isClient()) return null;
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as LocalSession) : null;
    } catch {
      return null;
    }
  },

  /** Register a new user — throws "auth/email-already-in-use" if duplicate */
  createUser(email: string, password: string, displayName: string): string {
    if (!isClient()) throw new Error("Cannot create user on server");
    const users = getUsers();
    const key = email.toLowerCase().trim();
    if (users[key]) throw new Error("auth/email-already-in-use");
    const uid = `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    users[key] = { uid, email: key, displayName, passwordHash: encodePassword(password) };
    saveUsers(users);
    persistSession({ uid, email: key, displayName });
    return uid;
  },

  /** Sign in — throws "auth/invalid-credential" if wrong credentials */
  signIn(email: string, password: string): LocalSession {
    if (!isClient()) throw new Error("Cannot sign in on server");
    const users = getUsers();
    const key = email.toLowerCase().trim();
    const user = users[key];
    if (!user || user.passwordHash !== encodePassword(password)) {
      throw new Error("auth/invalid-credential");
    }
    const session: LocalSession = { uid: user.uid, email: user.email, displayName: user.displayName };
    persistSession(session);
    return session;
  },

  /** Sign out — clears session */
  signOut(): void {
    persistSession(null);
  },
};
