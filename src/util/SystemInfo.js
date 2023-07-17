import logo from "../images/logo.png";
import logoBlanco from "../images/logo-blanco.png";
import logoShort from "../images/logo-short.png";
import env from "./env";

const SystemInfo = {
    name: "Planificación de gastos",
    description: "Sistema de planificación de gastos anual.",
    logo: logo,
    logoBlanco: logoBlanco,
    logoShort: logoShort,
    host: env('HOST_URL'),
    api: env('API_URL'),
    usersApi: env('USERS_API_URL'),
    systemCode: 'sys-009',
    authKey: 'csi-planificacion-auth'
}

export default SystemInfo;