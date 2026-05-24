export function setJsonStorage(name: string, value: any) {
  try {
    const json = JSON.stringify(value);
    localStorage.setItem(name, json);
  } catch (e) {
    // ignore
  }
}

export function getJsonStorage<T = any>(name: string): T | null {
  try {
    const raw = localStorage.getItem(name);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (e) {
    return null;
  }
}

export function removeStorage(name: string) {
  try { localStorage.removeItem(name); } catch (e) { }
}
