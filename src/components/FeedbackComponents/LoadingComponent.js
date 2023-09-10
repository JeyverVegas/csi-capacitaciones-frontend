import { useEffect, useState } from "react";

const LoadingComponent = ({ message, show, secondMessage = '' }) => {

    const [dots, setDots] = useState("");

    useEffect(() => {
        let id;

        if (show) {
            id = setInterval(() => {
                setDots((oldDots) => oldDots.length < 3 ? oldDots + "." : "");
            }, 500);
        }

        return () => {
            if (id) clearInterval(id);
        }
    }, [show]);

    return (
        show ?
            <div className="vw-100 vh-100 d-flex position-fixed" style={{ zIndex: 99, background: 'rgba(255,255,255, .5)' }}>
                <div className="m-auto">
                    <div className="spinner">
                        <div className="double-bounce1 bg-primary"></div>
                        <div className="double-bounce2 bg-primary"></div>
                    </div>
                    <h1 className="text-center text-muted text-2xl">{message}{dots}</h1>
                    {
                        secondMessage &&
                        <p className="text-center" style={{ fontSize: '16px' }}>
                            {secondMessage}
                        </p>
                    }
                </div>
            </div>
            :
            null
    )
}

export default LoadingComponent;