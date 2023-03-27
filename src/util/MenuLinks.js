import Dashboard from "../pages/private/Dashboard";
import SystemInfo from "./SystemInfo";
import { AiOutlineDashboard } from "react-icons/ai";
import { FaWpforms } from "react-icons/fa";
import Forms from "../pages/private/forms/Forms";
import FormsEdit from "../pages/private/forms/FormsEdit";
import FormsCreate from "../pages/private/forms/FormsCreate";


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

    createLink('Formularios', null, null, FaWpforms, '/formularios-de-acreditacion', null, [
        createLink('Listar', null, <Forms />, AiOutlineDashboard, '/listar', null),
        createLink('Editar', true, <FormsEdit />, AiOutlineDashboard, '/:id', null),
        createLink('Crear', null, <FormsCreate />, AiOutlineDashboard, '/crear', null),
    ])

];

export default MenuLinks;