import { Link } from "react-router-dom";

const EmptyRoute = () => {
    return (
        <div className="authincation d-flex h-100 p-meddle">
            <div className="container m-auto h-100">
                <div className="row justify-content-center h-100 align-items-center ">
                    <div className="col-md-5">
                        <div className="form-input-content text-center error-page">
                            <h1 className="error-text font-weight-bold">404</h1>
                            <h4>
                                <i className="fa fa-exclamation-triangle text-warning" />{" "}
                                ¡La página que estabas buscando no se encuentra!
                            </h4>
                            <p>
                                Es posible que haya escrito mal la dirección o que la página se haya movido.
                            </p>
                            <div>
                                <Link className="btn btn-primary" to="/dashboard">
                                    Volver
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmptyRoute;