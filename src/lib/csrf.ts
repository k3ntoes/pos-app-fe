export const CSRF_HEADER_NAME = "X-CSRF-Token";
export const CSRF_COOKIE_NAME = "pos_csrf";

export function getCsrfTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${CSRF_COOKIE_NAME}=([^;]+)`));
  return match ? decodeURIComponent(match[2] ?? "") : null;
}

export function getCsrfTokenFromMeta(): string | null {
  if (typeof document === "undefined") return null;
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta ? meta.getAttribute("content") : null;
}

export function getCsrfToken(): string | null {
  return getCsrfTokenFromCookie() || getCsrfTokenFromMeta() || null;
}

export function setCsrfToken(token: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${CSRF_COOKIE_NAME}=${encodeURIComponent(token)}; path=/`;
}

export function clearCsrfToken(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${CSRF_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}
