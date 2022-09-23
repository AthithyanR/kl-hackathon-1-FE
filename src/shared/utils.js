/* eslint-disable guard-for-in */
/* eslint-disable no-unreachable-loop */
/* eslint-disable no-restricted-syntax */
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

export function isEmpty(o) {
  for (const key in o) {
    return false;
  }
  return true;
}

export function customLog(...values) {
  // eslint-disable-next-line no-console
  console.log(...values);
}

export function orderArrayBySample(arr, sampleArr) {
  const result = [];
  for (const sample of sampleArr) {
    for (const value of arr) {
      if (sample === value) {
        result.push(value);
      }
    }
  }
  return result;
}
