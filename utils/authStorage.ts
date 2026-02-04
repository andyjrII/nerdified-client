/**
 * Simple localStorage-based auth and profile cache.
 * Replaces LocalBase for auth tokens and cached user profiles (SSR-safe).
 */

const KEYS = {
  AUTH_STUDENT: "nerdified_auth_student",
  AUTH_TUTOR: "nerdified_auth_tutor",
  AUTH_ADMIN: "nerdified_auth_admin",
  PROFILE_STUDENT: "nerdified_profile_student",
  PROFILE_TUTOR: "nerdified_profile_tutor",
  PROFILE_ADMIN: "nerdified_profile_admin",
} as const;

function safeGet<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function safeSet(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function safeRemove(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

// --- Auth (email + accessToken) ---

export type AuthStudent = { email: string; accessToken: string };
export type AuthTutor = { email: string; accessToken: string };
export type AuthAdmin = { email: string; accessToken: string; role?: string };

export function getAuthStudent(): AuthStudent | null {
  return safeGet<AuthStudent>(KEYS.AUTH_STUDENT);
}

export function setAuthStudent(data: AuthStudent): void {
  safeSet(KEYS.AUTH_STUDENT, data);
}

export function clearAuthStudent(): void {
  safeRemove(KEYS.AUTH_STUDENT);
}

export function getAuthTutor(): AuthTutor | null {
  return safeGet<AuthTutor>(KEYS.AUTH_TUTOR);
}

export function setAuthTutor(data: AuthTutor): void {
  safeSet(KEYS.AUTH_TUTOR, data);
}

export function clearAuthTutor(): void {
  safeRemove(KEYS.AUTH_TUTOR);
}

export function getAuthAdmin(): AuthAdmin | null {
  return safeGet<AuthAdmin>(KEYS.AUTH_ADMIN);
}

export function setAuthAdmin(data: AuthAdmin): void {
  safeSet(KEYS.AUTH_ADMIN, data);
}

export function clearAuthAdmin(): void {
  safeRemove(KEYS.AUTH_ADMIN);
}

// --- Profile cache (single object per role; overwritten on each set) ---

export function getStudentProfile(): Record<string, unknown> | null {
  return safeGet<Record<string, unknown>>(KEYS.PROFILE_STUDENT);
}

export function setStudentProfile(data: Record<string, unknown>): void {
  safeSet(KEYS.PROFILE_STUDENT, data);
}

export function clearStudentProfile(): void {
  safeRemove(KEYS.PROFILE_STUDENT);
}

export function getTutorProfile(): Record<string, unknown> | null {
  return safeGet<Record<string, unknown>>(KEYS.PROFILE_TUTOR);
}

export function setTutorProfile(data: Record<string, unknown>): void {
  safeSet(KEYS.PROFILE_TUTOR, data);
}

export function clearTutorProfile(): void {
  safeRemove(KEYS.PROFILE_TUTOR);
}

export function getAdminProfile(): Record<string, unknown> | null {
  return safeGet<Record<string, unknown>>(KEYS.PROFILE_ADMIN);
}

export function setAdminProfile(data: Record<string, unknown>): void {
  safeSet(KEYS.PROFILE_ADMIN, data);
}

export function clearAdminProfile(): void {
  safeRemove(KEYS.PROFILE_ADMIN);
}
