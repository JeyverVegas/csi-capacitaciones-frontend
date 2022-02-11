import { Link } from "react-router-dom";
import SystemInfo from "../../util/SystemInfo";

const ForgotPassword = () => {

    const onSubmit = (e) => {
        e.preventDefault();
    };

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
                                    <h4 className="text-center mb-4 ">¿Olvidaste tu contraseña?</h4>
                                    <form onSubmit={onSubmit}>
                                        <div className="form-group my-4">
                                            <label className="">
                                                <strong>Email</strong>
                                            </label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="Ingresa tu direccion de correo electronico."
                                            />
                                        </div>
                                        <div className="text-center">
                                            <button
                                                type="submit"
                                                className="btn btn-primary btn-block"
                                            >
                                                Enviar
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

export default ForgotPassword;