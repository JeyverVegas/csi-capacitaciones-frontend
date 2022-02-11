import { Outlet } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import Footer from "./Footers";
import Nav from "./Nav";

const SystemLayout = () => {

    const { menuToggle } = useTheme();
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
                    <Outlet />
                </div>
            </div>
            {!pagePath && <Footer />}
        </div>
    )
}

export default SystemLayout;