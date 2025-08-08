// Simple MVP auth storage using Basic token
const KEY = 'mesthri_basic';

export function setBasicCredentials(phone, password) {
  // Basic <base64(phone:password)>
  const token = 'Basic ' + btoa(`${phone}:${password}`);
  localStorage.setItem(KEY, token);
}

export function clearCredentials() {
  localStorage.removeItem(KEY);
}

export function getAuthHeader() {
  const token = localStorage.getItem(KEY);
  return token ? { Authorization: token } : {};
}

export function isLoggedIn() {
  return !!localStorage.getItem(KEY);
}
