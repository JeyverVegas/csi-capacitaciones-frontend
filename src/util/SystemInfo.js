import logo from "../images/logo.png";
import logoBlanco from "../images/logo-blanco.png";
import logoShort from "../images/logo-short.png";

const SystemInfo = {
    name: "Csi-Pedidos",
    description: "Sistema para el manejo de los pedidos.",
    logo: logo,
    logoBlanco: logoBlanco,
    logoShort: logoShort,
    host: 'http://pedidos.test',
    api: process.env.REACT_APP_API_URL,
    systemCode: 'sys-002',
}

export default SystemInfo;