import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Positions = () => {

    const { state } = useLocation();

    useEffect(() => {
        console.log(state);
    }, [state])

    return (
        <div>
            <h1>Yo soy Cargos</h1>
        </div>
    )
}
export default Positions;