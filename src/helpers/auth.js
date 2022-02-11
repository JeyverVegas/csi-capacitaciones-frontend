export const AUTH_KEY = 'csi-pedidos-auth';


export const setAuth = (authInfo) => {
  if (authInfo) {
    localStorage.setItem(AUTH_KEY, authInfo);
  }
};

export const clearAuth = () => {
  localStorage.removeItem(AUTH_KEY)
};

export const getAuth = () => {
  return localStorage.getItem(AUTH_KEY);
};

export const deleteAuth = () => {
  localStorage.removeItem(AUTH_KEY);
};
