export function setJsonCookie(name: string, value: any, days = 365) {
  try {
    const json = encodeURIComponent(JSON.stringify(value));
    const maxAge = days * 24 * 60 * 60; // seconds
    document.cookie = `${name}=${json}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } catch (e) {
    // ignore
  }
}

export function getJsonCookie<T = any>(name: string): T | null {
  try {
    const raw = document.cookie.split('; ').find((c) => c.startsWith(name + '='));
    if (!raw) return null;
    const value = raw.split('=')[1];
    return JSON.parse(decodeURIComponent(value)) as T;
  } catch (e) {
    return null;
  }
}

export function removeCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}
