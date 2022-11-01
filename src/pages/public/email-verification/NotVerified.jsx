import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";
import SystemInfo from "../../../util/SystemInfo";

const NotVerified = () => {

    const navigate = useNavigate();

    const { user, setAuthInfo } = useAuth();

    const { pathname } = useLocation();

    const { setCustomToast } = useFeedBack();

    const [{ data: resendVerificationEmailData, loading: resendVerificationEmailLoading }, resendVerificationEmail] = useAxios({
        url: '/email/verification-notification',
        method: 'POST',
    }, { manual: true });

    useEffect(() => {
        if (resendVerificationEmailData) {
            setCustomToast({ message: 'Correo enviado con éxito!', severity: 'success', show: true, position: 'top-right' });
        }
    }, [resendVerificationEmailData])

    const handleButtonClick = (e) => {
        e?.preventDefault();
        resendVerificationEmail();
    }

    const handleLogOut = () => {
        setAuthInfo?.(false);
        navigate('/iniciar-sesion', { replace: true });
    }

    return (
        <div className="authincation h-100 p-meddle">
            <div className="container" style={{ height: "100vh !important" }}>
                <div style={{ display: 'flex', width: "100%", height: '100%' }}>
                    <div className="authincation-content" style={{ margin: 'auto', width: '50%' }}>
                        <div className="row no-gutters" >
                            <div className="col-xl-12">
                                <div className="auth-form">
                                    <div className="text-center mb-3">
                                        <Link to="/iniciar-sesion">
                                            <img src={SystemInfo?.logo} alt="logo" />
                                        </Link>
                                    </div>
                                    <h1 className="text-center mb-4 ">Email no verificado</h1>
                                    {
                                        !user ?
                                            <div className="text-center">
                                                Debes iniciar sesión para verificar tu correo electrónico.
                                                <br />
                                                <br />
                                                <Link to="/iniciar-sesion" className="btn btn-primary btn-block" state={{ from: pathname, }}>Iniciar sesión</Link>
                                            </div>
                                            :
                                            <form onSubmit={handleButtonClick}>
                                                <div className="mb-2">Antes de empezar debes verificar tu correo electrónico haciendo click en el link que se te ha enviado a tu buzón. Si no has recibido el correo, con gusto te lo enviaremos nuevamente.</div>
                                                <br />
                                                <div className="row justify-content-center align-items-center">
                                                    <div className="col-md-12 my-4">
                                                        <button
                                                            className="btn btn-primary btn-block"
                                                            disabled={resendVerificationEmailLoading}
                                                        >
                                                            {
                                                                resendVerificationEmailLoading ?
                                                                    'Cargando'
                                                                    :
                                                                    'Reenviar correo de verificación'
                                                            }
                                                        </button>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <Link className="btn btn-success" to={'/dashboard'}>
                                                            Ya estoy verificado
                                                        </Link>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <button
                                                            onClick={handleLogOut}
                                                            className="btn btn-danger"
                                                            disabled={resendVerificationEmailLoading}
                                                        >
                                                            Cerrar Sesión e intentar mas tarde.
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotVerified;