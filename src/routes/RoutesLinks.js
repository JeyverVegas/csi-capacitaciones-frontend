import { Navigate, Route, Routes } from 'react-router-dom';
import Login from "../pages/public/Login";
import ForgotPassword from '../pages/public/ForgotPassword';
import SystemLayout from '../components/Layouts/SystemLayout';
import Dashboard from '../pages/private/Dashboard';
import NonRequireAuth from '../components/Auth/NonRequireAuth';
import RequireAuth from '../components/Auth/RequireAuth';
import Users from '../pages/private/users/Users';
import UsersCreate from '../pages/private/users/UsersCreate';
import Positions from '../pages/private/positions/Positions';
import PositionsCreate from '../pages/private/positions/PositionsCreate';
import Services from '../pages/private/services/Services';
import ServicesCreate from '../pages/private/services/ServicesCreate';
import { mainPermissions } from '../util/MenuLinks';
import Roles from '../pages/private/roles/Roles';
import RolesCreate from '../pages/private/roles/RolesCreate';

const RoutesLinks = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/iniciar-sesion" />} />
            <Route path="/iniciar-sesion" element={<NonRequireAuth><Login /></NonRequireAuth>} />
            <Route path="/recuperar-contraseña" element={<NonRequireAuth><ForgotPassword /></NonRequireAuth>} />

            <Route element={<SystemLayout />}>
                <Route path="/dashboard" element={<RequireAuth screenPermission={mainPermissions?.dashboard[0]}><Dashboard /></RequireAuth>} />

                {/*CARGOS*/}
                <Route path="/cargos" element={<RequireAuth screenPermission={mainPermissions?.positions[0]}><Positions /></RequireAuth>} />
                <Route path="/cargos/crear" element={<RequireAuth screenPermission={mainPermissions?.positions[1]}><PositionsCreate /></RequireAuth>} />

                {/*SERVICIOS*/}
                <Route path="/servicios" element={<RequireAuth screenPermission={mainPermissions?.services[0]}><Services /></RequireAuth>} />
                <Route path="/servicios/crear" element={<RequireAuth screenPermission={mainPermissions?.services[1]}><ServicesCreate /></RequireAuth>} />

                {/*ROLES*/}
                <Route path="/roles" element={<RequireAuth screenPermission={mainPermissions?.roles[0]}><Roles /></RequireAuth>} />
                <Route path="/roles/crear" element={<RequireAuth screenPermission={mainPermissions?.roles[1]}><RolesCreate /></RequireAuth>} />

                {/*USUARIOS*/}
                <Route path="/usuarios" element={<RequireAuth screenPermission={mainPermissions?.users[0]}><Users /></RequireAuth>} />
                <Route path="/usuarios/crear" element={<RequireAuth screenPermission={mainPermissions?.users[1]}><UsersCreate /></RequireAuth>} />
            </Route>
        </Routes>
    )
}

export default RoutesLinks;