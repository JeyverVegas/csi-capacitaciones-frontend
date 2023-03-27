import { useAuth } from "../context/AuthContext";

const UserHavePermission = (menuPermissions) => {

    const { permissions, isSuperAdmin } = useAuth();

    if (isSuperAdmin) return true;

    return menuPermissions?.some?.(r => permissions?.indexOf(r) >= 0) ||
        !menuPermissions ||
        menuPermissions?.length === 0 ||
        permissions?.includes(menuPermissions);

}


export default UserHavePermission;