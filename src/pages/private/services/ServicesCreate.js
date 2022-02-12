import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ServicesCreate = () => {

    const { state } = useLocation();

    useEffect(() => {
        console.log(state);
    }, [state]);

    return (
        <div>
            <h1>Yo soy Crear servicio</h1>
        </div>
    )
}
export default ServicesCreate;