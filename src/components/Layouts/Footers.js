const Footer = () => {
    var d = new Date();
    return (
        <div className="footer">
            <div className="copyright">
                <p>
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
