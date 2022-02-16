import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Login from "../pages/public/Login";
import ForgotPassword from '../pages/public/ForgotPassword';
import SystemLayout from '../components/Layouts/SystemLayout';
import NonRequireAuth from '../components/Auth/NonRequireAuth';
import RequireAuth from '../components/Auth/RequireAuth';
import MenuLinks from '../util/MenuLinks';
import { useEffect } from 'react';
import { useFeedBack } from '../context/FeedBackContext';

const RoutesLinks = () => {

    const location = useLocation();

    const { customAlert } = useFeedBack();

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [location, customAlert]);

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/iniciar-sesion" />} />
            <Route path="/iniciar-sesion" element={<NonRequireAuth><Login /></NonRequireAuth>} />
            <Route path="/recuperar-contraseña" element={<NonRequireAuth><ForgotPassword /></NonRequireAuth>} />

            <Route element={<SystemLayout />}>
                {
                    MenuLinks?.map((menuLink, i) => {
                        if (menuLink?.children) {
                            return [...menuLink?.children];
                        } else {
                            return menuLink
                        }
                    }).flat().map((menuLink, i) => {
                        return (
                            menuLink?.component ?
                                <Route key={i} path={menuLink?.path} element={<RequireAuth screenPermission={menuLink?.permissions}>{menuLink?.component}</RequireAuth>} />
                                :
                                null
                        )
                    })
                }
            </Route>
            <Route path='*' element={<div>No extiste esta ruta.</div>} />
        </Routes>
    )
}

export default RoutesLinks;