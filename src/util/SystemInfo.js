import logo from "../assets/images/logo.png";
import logoBlanco from "../assets/images/logo-blanco.png";
import logoShort from "../assets/images/logo-short.png";
import env from "./env";

const SystemInfo = {
    name: env('SYSTEM_NAME'),
    description: env('SYSTEM_DESCRIPTION'),
    logo: logo,
    logoBlanco: logoBlanco,
    logoShort: logoShort,
    host: env('HOST_URL'),
    api: env('API_URL'),
    usersApi: env('USERS_API_URL'),
    systemCode: env('SYSTEM_CODE'),
    authKey: env('AUTH_KEY')
}

export default SystemInfo;