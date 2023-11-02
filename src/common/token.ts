const tokenKey = "USER_TOKEN";

export function getToken() {
  return localStorage.getItem(tokenKey);
}

export function setToken(value: string) {
  return localStorage.setItem(tokenKey, value);
}

export function removeToken() {
  return localStorage.removeItem(tokenKey);
}
