export function getFromLs(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setToLs(key, value) {
  return localStorage.setItem(key, JSON.stringify(value));
}
