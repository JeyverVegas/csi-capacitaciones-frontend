import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PositionsCreate = () => {

    const { state } = useLocation();

    useEffect(() => {
        console.log(state);
    }, [state])

    return (
        <div>
            <h1>Yo soy Crear Cargo</h1>
        </div>
    )
}
export default PositionsCreate;