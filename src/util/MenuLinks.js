import Dashboard from "../pages/private/Dashboard";
import SystemInfo from "./SystemInfo";
import { AiOutlineDashboard, AiOutlineIssuesClose } from "react-icons/ai";
import { MdAccountTree } from "react-icons/md";

import Powerbis from "../pages/private/power-bis/Powerbis";
import PowerbisCreate from "../pages/private/power-bis/PowerbisCreate";
import PowerbisEdit from "../pages/private/power-bis/PowerbisEdit";

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
    dashboard: [`${systemCode}-view-dashboard`,],
    powerBi: [`${systemCode}-view-power-bi`, `${systemCode}-create-power-bi`, `${systemCode}-update-power-bi`, `${systemCode}-delete-power-bi`],
}

const MenuLinks = [
    createLink('Dashboard', null, <Dashboard />, AiOutlineDashboard, '/dashboard', null),

    createLink('Power Bi', null, null, MdAccountTree, '/power-bi', null, [
        createLink('Listar', null, <Powerbis />, null, '/power-bi/listar', null),
        createLink('Editar', true, <PowerbisEdit />, null, '/power-bi/:id', null),
        createLink('Crear', null, <PowerbisCreate />, null, '/power-bi/crear', null),
    ])
];

export default MenuLinks;