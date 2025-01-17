import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserHavePermission from "../../util/UserHavePermission";

const RequireAuth = ({ children, screenPermission }) => {

    const { user, permissions, isSuperAdmin } = useAuth();

    let location = useLocation();

    if (!user) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/iniciar-sesion" state={{ from: location }} replace />;
    }

    if (!UserHavePermission(screenPermission)) {
        return (
            <div>
                <h3>No tienes Permisos.</h3>
            </div>
        )
    }

    return children;




}

export default RequireAuth;