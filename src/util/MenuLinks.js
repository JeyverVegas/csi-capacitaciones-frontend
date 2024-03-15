import Dashboard from "../pages/private/Dashboard";
import SystemInfo from "./SystemInfo";
import { AiOutlineDashboard, AiOutlineIssuesClose } from "react-icons/ai";
import { MdAccountTree } from "react-icons/md";

import Powerbis from "../pages/private/power-bis/Powerbis";
import PowerbisCreate from "../pages/private/power-bis/PowerbisCreate";
import PowerbisEdit from "../pages/private/power-bis/PowerbisEdit";
import PowerBiDetail from "../pages/private/power-bis/PowerBiDetail";
import PowerbiViews from "../pages/private/powerbi-views/PowerbiViews";
import PowerBiViewsColumns from "../components/CustomTable/Columns/PowerBiViewsColumns";
import PowerBiViewsFilters from "../components/FiltersComponents/PowerBiViewsFilters";
import ModuleIndexPage from "../components/ModuleIndexPage";

const createLink = (
    title,
    hidden,
    Component,
    Icon,
    path,
    permissions,
    Columns,
    FiltersComponent,
    endPoint,
    GlobalActionsComponent,
    ModuleActionsComponent,
    children
) => ({ title, hidden, Component, Icon, path, permissions, Columns, FiltersComponent, endPoint, GlobalActionsComponent, ModuleActionsComponent, children });

const { systemCode } = SystemInfo;

export const mainPermissions = {
    dashboard: [`${systemCode}-view-dashboard`,],
    powerBi: [`${systemCode}-view-power-bi`, `${systemCode}-create-power-bi`, `${systemCode}-update-power-bi`, `${systemCode}-delete-power-bi`],
    powerBiViews: [`${systemCode}-view-power-bi`, `${systemCode}-delete-power-bi`],
}

const MenuLinks = [
    createLink('Dashboard', null, Dashboard, AiOutlineDashboard, '/dashboard', null, null, null, null, null, null, null),

    createLink('Power Bi', null, Powerbis, MdAccountTree, '/power-bi/listar', mainPermissions?.powerBi?.[0]),
    createLink('Editar', true, PowerbisEdit, null, '/power-bi/:id', mainPermissions?.powerBi?.[0]),
    createLink('Crear', true, PowerbisCreate, null, '/power-bi/crear', mainPermissions?.powerBi?.[1]),
    createLink('Detalle', true, PowerBiDetail, null, '/powerbi/detalle/:id', null),

    createLink('Ingresos Bi', null, ModuleIndexPage, AiOutlineDashboard, '/ingresos-power-bi', mainPermissions?.[0], PowerBiViewsColumns, PowerBiViewsFilters, '/power-bi-views'),
];

export default MenuLinks;