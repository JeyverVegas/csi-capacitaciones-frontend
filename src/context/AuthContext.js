import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, setAuth, deleteAuth } from "../helpers/auth";
import SystemInfo from "../util/SystemInfo";

const AuthContext = createContext({ user: null, token: null, setAuthInfo: null, permissions: [] });


const lsItem = getAuth();
const defaultData = lsItem ? { ...JSON.parse(lsItem), setAuthInfo: null } : { user: null, token: null, setAuthInfo: null };

export const AuthProvider = ({ children }) => {

  const [authInfo, setAuthInfo] = useState(defaultData);

  const getPermissionName = () => {
    return authInfo?.user?.role?.permissionsByModule?.reduce((result, module) => [...result, ...module.permissions.map(p => p.name)], [])
  }

  useEffect(() => {
    if (authInfo) {
      setAuth(JSON.stringify(authInfo));

    } else {
      deleteAuth();
    }
  }, [authInfo]);

  return <AuthContext.Provider value={{
    user: authInfo.user,
    isSuperAdmin: authInfo.user?.role?.name === `${SystemInfo?.systemCode}-super-admin`,
    token: authInfo.token,
    permissions: getPermissionName(),
    isAuthenticated: authInfo.isAuthenticated,
    setAuthInfo
  }}>
    {children}
  </AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
