import logo from "../images/logo.png";
import logoBlanco from "../images/logo-blanco.png";
import logoShort from "../images/logo-short.png";

const SystemInfo = {
    name: "Csi-Pedidos",
    description: "Sistema para el manejo de los pedidos.",
    logo: logo,
    logoBlanco: logoBlanco,
    logoShort: logoShort,
    host: 'http://csipedidos.test', //'http://csipedidos.csiltda.cl/'
    api: 'http://csipedidos.test/api',
    usersApi: 'http://csiusers.test/api',
    systemCode: 'sys-002',
    AUTO_SAVE_KEY: `sys-002-order_create`
}

export default SystemInfo;