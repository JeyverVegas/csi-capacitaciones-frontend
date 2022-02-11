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

const RoutesLinks = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/iniciar-sesion" />} />
            <Route path="/iniciar-sesion" element={<NonRequireAuth><Login /></NonRequireAuth>} />
            <Route path="/recuperar-contraseña" element={<NonRequireAuth><ForgotPassword /></NonRequireAuth>} />
            <Route element={<SystemLayout />}>
                <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />

                {/*CARGOS*/}
                <Route path="/cargos" element={<RequireAuth><Positions /></RequireAuth>} />
                <Route path="/cargos/crear" element={<RequireAuth><PositionsCreate /></RequireAuth>} />

                {/*SERVICIOS*/}
                <Route path="/servicios" element={<RequireAuth><Services /></RequireAuth>} />
                <Route path="/servicios/crear" element={<RequireAuth><ServicesCreate /></RequireAuth>} />

                {/*USUARIOS*/}
                <Route path="/usuarios" element={<RequireAuth><Users /></RequireAuth>} />
                <Route path="/usuarios/crear" element={<RequireAuth><UsersCreate /></RequireAuth>} />
            </Route>
        </Routes>
    )
}

export default RoutesLinks;