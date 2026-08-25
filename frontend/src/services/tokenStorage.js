const ACCESS_TOKEN_KEY = "shc_access_token";
const REFRESH_TOKEN_KEY = "shc_refresh_token";
const USER_KEY = "shc_user";

// Tokens live in localStorage when "remember me" is used, sessionStorage otherwise.
function storages() {
  return [localStorage, sessionStorage];
}

function read(key) {
  for (const storage of storages()) {
    const value = storage.getItem(key);
    if (value) return value;
  }
  return null;
}

export function getAccessToken() {
  return read(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return read(REFRESH_TOKEN_KEY);
}

export function getStoredUser() {
  const raw = read(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSession({ accessToken, refreshToken, user }, remember = true) {
  const storage = remember ? localStorage : sessionStorage;
  const other = remember ? sessionStorage : localStorage;
  [ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY].forEach((key) => other.removeItem(key));

  if (accessToken) storage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  if (user) storage.setItem(USER_KEY, JSON.stringify(user));
}

export function saveTokens({ accessToken, refreshToken }) {
  const storage = localStorage.getItem(ACCESS_TOKEN_KEY) ? localStorage : sessionStorage;
  if (accessToken) storage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function saveUser(user) {
  const storage = localStorage.getItem(ACCESS_TOKEN_KEY) ? localStorage : sessionStorage;
  storage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  storages().forEach((storage) => {
    [ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY].forEach((key) => storage.removeItem(key));
  });
}
