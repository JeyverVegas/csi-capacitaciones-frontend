import SystemInfo from "../util/SystemInfo";

export const setAuth = (authInfo) => {
  if (authInfo) {
    localStorage.setItem(SystemInfo.authKey, authInfo);
  }
};

export const clearAuth = () => {
  localStorage.removeItem(SystemInfo.authKey)
};

export const getAuth = () => {
  return localStorage.getItem(SystemInfo.authKey);
};

export const deleteAuth = () => {
  localStorage.removeItem(SystemInfo.authKey);
};
