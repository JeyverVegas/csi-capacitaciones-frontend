import { useEffect } from "react";
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import useAxios from "../../../hooks/useAxios";
import SystemInfo from "../../../util/SystemInfo";

const Verify = () => {

    const { pathname, search } = useLocation();

    const { user } = useAuth();

    const { id, hash } = useParams();

    const [searchParams] = useSearchParams();

    let verificationUrl = `${SystemInfo.api}/email/verify/${id}/${hash}?`;

    for (const [key, value] of searchParams.entries()) {
        verificationUrl = `${verificationUrl}${key}=${value}&`;
    }

    const [{ data: verificationData, error: verificationError, loading: verificationLoading }, verifyEmail] = useAxios({
        url: verificationUrl.substring(0, verificationUrl.length - 1)
    }, { manual: true });

    useEffect(() => {
        if (user) {
            verifyEmail();
        }
    }, [user]);

    return (
        <div className="authincation h-100 p-meddle">
            <div className="container" style={{ height: "100vh !important" }}>
                <div style={{ display: 'flex', width: "100%", height: '100%' }}>
                    <div className="authincation-content" style={{ margin: 'auto', width: '50%' }}>
                        <div className="row no-gutters" >
                            <div className="col-xl-12">
                                <div className="auth-form">
                                    <div className="text-center mb-3">
                                        <Link
                                            to="/iniciar-sesion">
                                            <img src={SystemInfo?.logo} alt="logo" />
                                        </Link>
                                    </div>

                                    {
                                        !user ?
                                            <div className="text-center">
                                                Debes iniciar sesión para verificar tu correo electrónico.
                                                <br />
                                                <br />
                                                <Link to="/iniciar-sesion" className="btn btn-primary btn-block" state={{ from: pathname, }}>Iniciar sesión</Link>
                                            </div>
                                            :
                                            verificationLoading ?
                                                <div className="text-center">
                                                    <h2>Cargando...</h2>
                                                </div>
                                                :
                                                <>
                                                    {verificationError && <div className="text-center">No se pudo verificar el correo electrónico</div>}
                                                    {verificationData && <div className="text-center">El correo ha sido verificado con éxito. <Link to="/dashboard" className="text-info">Ir al dashboard</Link></div>}
                                                </>
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

export default Verify;