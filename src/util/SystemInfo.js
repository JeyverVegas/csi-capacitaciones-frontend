import logo from "../images/logo.png";
import logoBlanco from "../images/logo-blanco.png";
import logoShort from "../images/logo-short.png";
import env from "./env";

const SystemInfo = {
    name: "Control de Acreditaciones",
    description: "Sistema para el manejo de las acreditaciones.",
    logo: logo,
    logoBlanco: logoBlanco,
    logoShort: logoShort,
    host: env('HOST_URL'),
    api: env('API_URL'),
    usersApi: env('USERS_API_URL'),
    systemCode: 'sys-005',
    authKey: 'csi-acreditaciones-auth'
}

export default SystemInfo;