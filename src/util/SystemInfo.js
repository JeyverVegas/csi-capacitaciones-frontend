import logo from "../images/logo.png";
import logoBlanco from "../images/logo-blanco.png";
import logoShort from "../images/logo-short.png";
import env from "./env";

const SystemInfo = {
    name: "Csi-Pedidos",
    description: "Sistema para el manejo de los pedidos.",
    logo: logo,
    logoBlanco: logoBlanco,
    logoShort: logoShort,
    host: env('HOST_URL'),
    api: env('API_URL'),
    usersApi: env('USERS_API_URL'),
    systemCode: 'sys-002',
    AUTO_SAVE_KEY: `sys-002-order_create`
}

export default SystemInfo;