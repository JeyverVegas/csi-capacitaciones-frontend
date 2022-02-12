import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Services = () => {
    const { state } = useLocation();

    useEffect(() => {
        console.log(state);
    }, [state]);
    return (
        <div>
            <h1>Yo soy Services</h1>
        </div>
    )
}
export default Services;