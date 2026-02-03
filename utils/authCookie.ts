/**
 * Frontend-domain auth session cookie.
 * When the API is on a different origin (e.g. Render), the backend's refresh_token
 * cookie is set for the API domain only, so Next.js middleware (running on the
 * frontend domain) never sees it. We set this cookie on the frontend domain after
 * login/signup so middleware can allow access to protected routes.
 */
const AUTH_SESSION_COOKIE = "auth_session";
const MAX_AGE_DAYS = 3;
const MAX_AGE_SECONDS = MAX_AGE_DAYS * 24 * 60 * 60;

export function setAuthSessionCookie(): void {
  if (typeof document === "undefined") return;
  const secure = typeof location !== "undefined" && location?.protocol === "https:";
  let cookie = `${AUTH_SESSION_COOKIE}=1; path=/; max-age=${MAX_AGE_SECONDS}; samesite=lax`;
  if (secure) cookie += "; secure";
  document.cookie = cookie;
}

export function clearAuthSessionCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_SESSION_COOKIE}=; path=/; max-age=0`;
}
