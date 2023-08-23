import Dashboard from "../pages/private/Dashboard";
import SystemInfo from "./SystemInfo";
import { AiOutlineDashboard, AiOutlineIssuesClose } from "react-icons/ai";
import { FaWpforms } from "react-icons/fa";
import { MdAccountTree } from "react-icons/md";

import { FiUser } from "react-icons/fi";
import AccountClassifications from "../pages/private/account-clasification/AccountClassifications";
import AccountClassificationsCreate from "../pages/private/account-clasification/AccountClassificationsCreate";
import AccountClassificationsEdit from "../pages/private/account-clasification/AccountClassificationsEdit";
import Accounts from "../pages/private/accounts/Accounts";
import AccountsCreate from "../pages/private/accounts/AccountsCreate";
import AccountsEdit from "../pages/private/accounts/AccountsEdit";
import CostCenters from "../pages/private/cost-centers/CostCenters";
import CostCentersEdit from "../pages/private/cost-centers/CostCentersEdit";
import CostCentersCreate from "../pages/private/cost-centers/CostCentersCreate";
import CostCenterManagement from "../pages/private/cost-centers/CostCenterManagement";
import Planifications from "../pages/private/planifications/Planifications";
import PlanificationsEdit from "../pages/private/planifications/PlanificationsEdit";
import PlanificationsCreate from "../pages/private/planifications/PlanificationsCreate";
import PlansDetail from "../pages/private/plans/PlansDetail";
import PlansManagement from "../pages/private/plans/PlansManagement";
import AddCostCentersStaff from "../pages/private/cost-centers/AddCostCentersStaff";
import AddCostCentersUf from "../pages/private/cost-centers/AddCostCentersUf";
import Instructions from "../pages/private/instructions/Instructions";
import AddCostCentersAccountValues from "../pages/private/cost-centers/AddCostCentersAccountValues";

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
    accountClassifications: [`${systemCode}-view-account-classifications`, `${systemCode}-create-account-classifications`, `${systemCode}-update-account-classifications`, `${systemCode}-delete-account-classifications`],
    accounts: [`${systemCode}-view-accounts`, `${systemCode}-create-accounts`, `${systemCode}-update-accounts`, `${systemCode}-delete-accounts`],
    costCenters: [`${systemCode}-view-cost-centers`, `${systemCode}-update-cost-centers`, `${systemCode}-delete-cost-centers`],
    planningProcesses: [`${systemCode}-view-planning-processes`, `${systemCode}-create-planning-processes`, `${systemCode}-update-planning-processes`, `${systemCode}-delete-planning-processes`],
    plans: [`${systemCode}-view-planning-processes`],
    planAccounts: [`${systemCode}-view-plan-accounts`, `${systemCode}-create-plan-accounts`, `${systemCode}-update-plan-accounts`, `${systemCode}-delete-plan-accounts`]
}

const MenuLinks = [
    createLink('Resumen', null, <Dashboard />, AiOutlineDashboard, '/dashboard', null),

    createLink('Gestionar centro de costo', true, <CostCenterManagement />, AiOutlineDashboard, '/gestionar-centro-de-costo/:id', null),

    createLink('Clasificación de cuentas', null, null, MdAccountTree, '/clasificacion-de-cuentas', null, [
        createLink('Listar', null, <AccountClassifications />, null, '/clasificacion-de-cuentas/listar', null),
        createLink('Editar', true, <AccountClassificationsEdit />, null, '/clasificacion-de-cuentas/:id', null),
        createLink('Crear', null, <AccountClassificationsCreate />, null, '/clasificacion-de-cuentas/crear', null),
    ]),

    createLink('Planificación de gastos', null, null, MdAccountTree, '/planificacion-de-gastos', null, [
        createLink('Listar', null, <Planifications />, null, '/planificacion-de-gastos/listar', null),
        createLink('Editar', true, <PlanificationsEdit />, null, '/planificacion-de-gastos/:id', null),
        createLink('Iniciar Proceso', null, <PlanificationsCreate />, null, '/planificacion-de-gastos/crear', null),
    ]),

    createLink('Cuentas', null, null, FaWpforms, '/cuentas', null, [
        createLink('Listar', null, <Accounts />, null, '/cuentas/listar', null),
        createLink('Editar', true, <AccountsEdit />, null, '/cuentas/:id', null),
        createLink('Crear', null, <AccountsCreate />, null, '/cuentas/crear', null),
    ]),

    createLink('Centros de costos', null, <CostCenters />, FaWpforms, '/centros-de-costos/listar', null),
    createLink('Agregar ingresos uf', true, <AddCostCentersUf />, null, '/centros-de-costos/agregar-ingresos-us', null),
    createLink('Agregar dotación', true, <AddCostCentersStaff />, null, '/centros-de-costos/agregar-dotacion', null),
    createLink('Cargar Remuneraciones', true, <AddCostCentersAccountValues />, null, '/centros-de-costos/cargar-remuneraciones', null),
    createLink('Editar', true, <CostCentersEdit />, null, '/centros-de-costos/:id', null),


    createLink('Instrucciones del sistema', null, <Instructions />, FaWpforms, '/instrucciones', null),
    createLink('Detalle del plan', true, <PlansDetail />, null, '/centros-de-costos/plans/:id', null),
    createLink('Gestionar Plan', true, <PlansManagement />, null, '/gestionar-centro-de-costo/:costCenterId/plans/:id', null),
];

export default MenuLinks;