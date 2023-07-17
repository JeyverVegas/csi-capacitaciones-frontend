import Dashboard from "../pages/private/Dashboard";
import SystemInfo from "./SystemInfo";
import { AiOutlineDashboard, AiOutlineIssuesClose } from "react-icons/ai";
import { FaWpforms, FaUserSecret } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import AccountClassifications from "../pages/private/account-clasification/AccountClassifications";
import AccountClassificationsCreate from "../pages/private/account-clasification/AccountClassificationsCreate";
import AccountClassificationsEdit from "../pages/private/account-clasification/AccountClassificationsEdit";

const createLink = (
    title,
    hidden,
    component,
    Icon,
    path,
    permissions,
    children
) => ({ title, hidden, component, Icon, path, permissions, children });

const { systemCode } = SystemInfo;

export const mainPermissions = {
    dashboard: [`${systemCode}-view-dashboard`]
}

const MenuLinks = [
    createLink('DashBoard', null, <Dashboard />, AiOutlineDashboard, '/dashboard', null),

    createLink('Clasificación de cuentas', null, null, FaWpforms, '/clasificación-de-cuentas', null, [
        createLink('Listar', null, <AccountClassifications />, null, '/clasificación-de-cuentas/listar', null),
        createLink('Editar', true, <AccountClassificationsEdit />, null, '/clasificación-de-cuentas/:id', null),
        createLink('Crear', null, <AccountClassificationsCreate />, null, '/clasificación-de-cuentas/crear', null),
    ]),

    createLink('Mi Cuenta', null, null, FiUser, '/mi-cuenta', null, [
    ]),

];

export default MenuLinks;