export function getFromLs(key) {
  return localStorage.getItem(key);
}

export function setToLs(key, value) {
  return localStorage.setItem(key, JSON.stringify(value));
}
