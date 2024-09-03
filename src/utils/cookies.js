import Cookies from 'js-cookie';
import crypto from 'crypto-js';

const TokenKey = 'Admin-Token';

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function generateToken(userName, password) {
  const salt = 'CATMUSK911';
  const data = `${userName}:${password}:${salt}`;
  const token = crypto.SHA256(data).toString(crypto.enc.Hex);
  return token;
}
