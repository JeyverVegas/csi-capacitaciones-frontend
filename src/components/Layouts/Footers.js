import { useTheme } from "../../context/ThemeContext";

const Footer = () => {

    const { darkMode } = useTheme();

    var d = new Date();
    return (
        <div className="footer" style={{ background: darkMode ? '#171622' : '' }}>
            <div className="copyright">
                <p style={{ color: darkMode ? 'white' : '' }}>
                    © Todos los Derechos Reservados. {" "}
                    <a href="https://www.csiltda.cl/" target="_blank" rel="noreferrer">
                        www.csiltda.cl
                    </a>{" "}
                    {d.getFullYear()}
                </p>
            </div>
        </div>
    );
};

export default Footer;
