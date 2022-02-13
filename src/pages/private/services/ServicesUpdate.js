import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ServicesUpdate = () => {

    const { state } = useLocation();

    useEffect(() => {
        console.log(state);
    }, [state]);

    return (
        <div>
            <h1>Yo soy Actualizar servicio</h1>
        </div>
    )
}
export default ServicesUpdate;