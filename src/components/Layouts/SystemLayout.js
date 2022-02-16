import { Alert } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { useFeedBack } from "../../context/FeedBackContext";
import { useTheme } from "../../context/ThemeContext";
import alertEmojis from "../../util/AlertsEmojis";
import Footer from "./Footers";
import Nav from "./Nav";

const SystemLayout = () => {

    const { menuToggle } = useTheme();
    const { customAlert, setCustomAlert } = useFeedBack();
    const pagePath = false;

    return (
        <div
            id={`${!pagePath ? "main-wrapper" : ""}`}
            className={`${!pagePath ? "show" : "vh-100"}  ${menuToggle ? "menu-toggle" : ""}`}
        >
            {!pagePath && <Nav />}

            <div className={`${!pagePath ? "content-body" : ""}`}>
                <div
                    className={`${!pagePath ? "container-fluid" : ""}`}
                    style={{ minHeight: window.screen.height - 60 }}
                >
                    {
                        customAlert?.show ?
                            <Alert
                                variant={customAlert?.severity}
                                className="alert-dismissible fade show d-flex align-items-center justify-content-between"
                            >
                                <div>
                                    {alertEmojis[customAlert?.severity]}
                                    <strong>{customAlert?.title}</strong>
                                    <br />
                                    {customAlert?.message}
                                </div>
                                <button onClick={() => { setCustomAlert({}) }} title="Cerrar" className={`btn btn-${customAlert?.severity}`}>X</button>
                            </Alert>
                            :
                            null
                    }
                    <Outlet />
                </div>
            </div>
            {!pagePath && <Footer />}
        </div>
    )
}

export default SystemLayout;