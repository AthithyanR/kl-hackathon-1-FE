export function getFromLs(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setToLs(key, value) {
  return localStorage.setItem(key, JSON.stringify(value));
}

export function flushLs() {
  return localStorage.clear();
}

export function generateQS(obj) {
  return `?${new URLSearchParams({ ...obj }).toString()}`;
}

export function dropDownFilterLogic(value, selected, item) {
  return !selected
    && (item.label.toLowerCase().includes(value.toLowerCase().trim())
      || item.description.toLowerCase().includes(value.toLowerCase().trim()));
}
