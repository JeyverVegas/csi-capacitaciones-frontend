import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import SystemInfo from "../../util/SystemInfo";
import loginbg from "../../images/pic1.png";
import useAxios from "../../hooks/useAxios";
import { useFeedBack } from "../../context/FeedBackContext";
import { useAuth } from "../../context/AuthContext";

const Login = () => {

    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    const { setLoading, setCustomToast } = useFeedBack();

    const { setAuthInfo } = useAuth();

    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const [rememberMe, setRememberMe] = useState(false);

    const [{ data: loginData, loading: loadingLogin }, login] = useAxios({ url: '/auth/login', method: 'post' }, { manual: true, useCache: false });

    const [{ data: loginWithTokenData, loading: loadingLoginWithToken }, loginWithToken] = useAxios({ url: '/auth/login/from-token', method: 'post' }, { manual: true, useCache: false });

    useEffect(() => {
        if (searchParams?.get('message')) {
            const message = searchParams?.get('message');
            setCustomToast({ message, severity: 'danger', show: true, position: 'top-right' });
        }

        const token = searchParams.get('token');
        if (token) {
            loginWithToken({ data: { token } });
        }
    }, [searchParams])

    useEffect(() => {
        setLoading({ message: 'Iniciando sesión', show: loadingLogin || loadingLoginWithToken });
    }, [loadingLogin, loadingLoginWithToken]);

    useEffect(() => {
        if (loginData) {
            setAuthInfo({ user: loginData?.data, token: loginData?.token });
            navigate('/dashboard', { replace: true });
        }
        if (loginWithTokenData) {
            setAuthInfo({ user: loginWithTokenData.data, token: loginWithTokenData.token });
            navigate('/dashboard', { replace: true });
        }
    }, [loginData, loginWithTokenData])

    const handleChange = (e) => {
        setCredentials((oldCredentials) => {
            return {
                ...oldCredentials,
                [e.target.name]: e.target.value
            }
        })
    }

    const onLogin = (e) => {
        e.preventDefault();
        login({
            data: {
                ...credentials
            }
        });
    }
    return (
        <div className="authincation d-flex flex-column flex-lg-row flex-column-fluid">
            <div className="login-aside text-center  d-flex flex-column flex-row-auto">
                <div className="d-flex flex-column-auto flex-column pt-lg-40 pt-15">
                    <div className="text-center mb-4 pt-5">
                        <img src={SystemInfo?.logo} alt="" />
                    </div>
                    <h3 className="mb-2">{SystemInfo?.name}</h3>
                    <p>{SystemInfo?.description}</p>
                </div>
                <div className="aside-image" style={{ backgroundImage: `url(${loginbg})` }}></div>
            </div>
            <div className="container flex-row-fluid d-flex flex-column justify-content-center position-relative overflow-hidden p-7 mx-auto">
                <div className="d-flex justify-content-center h-100 align-items-center">
                    <div className="authincation-content style-2">
                        <div className="row no-gutters">
                            <div className="col-xl-12 tab-content">
                                <div id="sign-in" className="auth-form   form-validation">
                                    <form onSubmit={onLogin} className="form-validate">
                                        <h3 className="text-center mb-4 text-black">Iniciar Sesión</h3>
                                        <div className="form-group mb-3">
                                            <label className="mb-1" htmlFor="val-email"><strong>Email</strong></label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={credentials?.email}
                                                onChange={handleChange}
                                                name="email"
                                                placeholder="Ingresa tu correo electronico"
                                            />
                                            {/* {errors.email && <div className="text-danger fs-12">{errors.email}</div>} */}
                                        </div>
                                        <div className="form-group mb-3">
                                            <label className="mb-1"><strong>Contraseña</strong></label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                name="password"
                                                value={credentials?.password}
                                                placeholder="Ingresa tu contraseña"
                                                onChange={handleChange}
                                            />
                                            {/*                       {errors.password && <div className="text-danger fs-12">{errors.password}</div>} */}
                                        </div>
                                        {/* <div className="form-row d-flex justify-content-between mt-4">
                                            <div className="form-group">
                                                <div className="custom-control custom-checkbox ml-1">
                                                    <input type="checkbox" checked={rememberMe} onChange={() => { setRememberMe((oldRememberMe) => !oldRememberMe) }} className="form-check-input" id="basic_checkbox_1" />
                                                    <label className="form-check-label" htmlFor="basic_checkbox_1">Recuerdame</label>
                                                </div>
                                            </div>
                                        </div> */}
                                        <div className='text-center my-4'>
                                            <Link className="text-center" to='/recuperar-contrasena'>¿Olvidastes tu contraseña?</Link>
                                        </div>
                                        <div className="text-center form-group mb-3">
                                            <button type="submit" className="btn btn-primary btn-block">
                                                Iniciar Sesión
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;