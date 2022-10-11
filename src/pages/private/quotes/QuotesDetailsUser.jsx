import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { mainPermissions } from "../../../util/MenuLinks";


const QuotesDetailsUser = () => {

    const { permissions } = useAuth();

    return (
        <div>
            <div className="text-end my-4">
                <Link to="/mis-cotizaciones" className="mx-4 btn btn-primary">
                    Volver Al listado
                </Link>
                {
                    permissions?.includes?.(mainPermissions?.quotes[1]) ?
                        <Link to="/cotizaciones/crear" className="mx-4 btn btn-primary">
                            Crear Nueva
                        </Link>
                        :
                        null
                }
            </div>
            <h1>
                Detalle de cotizacion
            </h1>
        </div >
    )
}

export default QuotesDetailsUser;