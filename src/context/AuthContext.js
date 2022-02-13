import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, setAuth, deleteAuth } from "../helpers/auth";

const AuthContext = createContext({ user: null, token: null, setAuthInfo: null, permissions: [] });


const lsItem = getAuth();
const defaultData = lsItem ? { ...JSON.parse(lsItem), setAuthInfo: null } : { user: null, token: null, setAuthInfo: null };

export const AuthProvider = ({ children }) => {

  const [authInfo, setAuthInfo] = useState(defaultData);

  useEffect(() => {
    if (authInfo) {
      setAuth(JSON.stringify(authInfo));
    } else {
      deleteAuth();
    }
  }, [authInfo]);

  return <AuthContext.Provider value={{
    user: authInfo.user,
    token: authInfo.token,
    permissions: authInfo?.user?.permissions?.map((permission) => permission?.name),
    isAuthenticated: authInfo.isAuthenticated,
    setAuthInfo
  }}>
    {children}
  </AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
