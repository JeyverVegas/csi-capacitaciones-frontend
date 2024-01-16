import Dashboard from "../pages/private/Dashboard";
import SystemInfo from "./SystemInfo";
import { AiOutlineDashboard, AiOutlineIssuesClose } from "react-icons/ai";
import { MdAccountTree } from "react-icons/md";

import Powerbis from "../pages/private/power-bis/Powerbis";
import PowerbisCreate from "../pages/private/power-bis/PowerbisCreate";
import PowerbisEdit from "../pages/private/power-bis/PowerbisEdit";
import PowerBiDetail from "../pages/private/power-bis/PowerBiDetail";

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

    createLink('Power Bi', null, null, MdAccountTree, '/power-bi', mainPermissions?.powerBi, [
        createLink('Listar', null, <Powerbis />, null, '/power-bi/listar', mainPermissions?.powerBi?.[0]),
        createLink('Editar', true, <PowerbisEdit />, null, '/power-bi/:id', mainPermissions?.powerBi?.[0]),
        createLink('Crear', null, <PowerbisCreate />, null, '/power-bi/crear', mainPermissions?.powerBi?.[1]),
        createLink('Detalle', true, <PowerBiDetail />, null, '/powerbi/detalle/:id', null),
    ])
];

export default MenuLinks;