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
import ImportCostCentersResponsibles from "../pages/private/cost-centers/ImportCostCentersResponsibles";

import ImportCostCentersAccountValues from "../pages/private/cost-centers/ImportCostCentersAccountValues";
import ImportCostCentersStaff from "../pages/private/cost-centers/ImportCostCentersStaff";
import ImportCostCentersUf from "../pages/private/cost-centers/ImportCostCentersUf";




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
    costCenters: [`${systemCode}-view-cost-centers`, `${systemCode}-update-cost-centers`],
    planningProcesses: [`${systemCode}-view-planning-processes`, `${systemCode}-create-planning-processes`, `${systemCode}-update-planning-processes`, `${systemCode}-delete-planning-processes`],
    instructions: [`${systemCode}-view-instructions`, `${systemCode}-update-instructions`]
}

const MenuLinks = [
    createLink('Resumen', null, <Dashboard />, AiOutlineDashboard, '/dashboard', null),
    createLink('Detalle del plan', true, <PlansDetail />, null, '/centros-de-costos/plans/:id', null),
    createLink('Gestionar Plan', true, <PlansManagement />, null, '/gestionar-centro-de-costo/:costCenterId/plans/:id', null),

    createLink('Gestionar centro de costo', true, <CostCenterManagement />, AiOutlineDashboard, '/gestionar-centro-de-costo/:id', null),

    createLink('Clasificación de cuentas', null, null, MdAccountTree, '/clasificacion-de-cuentas', mainPermissions?.accountClassifications, [
        createLink('Listar', null, <AccountClassifications />, null, '/clasificacion-de-cuentas/listar', mainPermissions?.accountClassifications?.[0]),
        createLink('Editar', true, <AccountClassificationsEdit />, null, '/clasificacion-de-cuentas/:id', mainPermissions?.accountClassifications?.[0]),
        createLink('Crear', null, <AccountClassificationsCreate />, null, '/clasificacion-de-cuentas/crear', mainPermissions?.accountClassifications?.[1]),
    ]),

    createLink('Planificación de gastos', null, null, MdAccountTree, '/planificacion-de-gastos', mainPermissions?.planningProcesses, [
        createLink('Listar', null, <Planifications />, null, '/planificacion-de-gastos/listar', mainPermissions?.planningProcesses?.[0]),
        createLink('Editar', true, <PlanificationsEdit />, null, '/planificacion-de-gastos/:id', mainPermissions?.planningProcesses?.[0]),
        createLink('Iniciar Proceso', null, <PlanificationsCreate />, null, '/planificacion-de-gastos/crear', mainPermissions?.planningProcesses?.[1]),
    ]),

    createLink('Cuentas', null, null, FaWpforms, '/cuentas', mainPermissions?.accounts, [
        createLink('Listar', null, <Accounts />, null, '/cuentas/listar', mainPermissions?.accounts?.[0]),
        createLink('Editar', true, <AccountsEdit />, null, '/cuentas/:id', mainPermissions?.accounts?.[0]),
        createLink('Crear', null, <AccountsCreate />, null, '/cuentas/crear', mainPermissions?.accounts?.[1]),
    ]),

    createLink('Centros de costos', null, <CostCenters />, FaWpforms, '/centros-de-costos/listar', mainPermissions?.costCenters?.[0]),
    createLink('Agregar ingresos uf', true, <AddCostCentersUf />, null, '/centros-de-costos/agregar-ingresos-us', mainPermissions?.costCenters?.[1]),
    createLink('Agregar dotación', true, <AddCostCentersStaff />, null, '/centros-de-costos/agregar-dotacion', mainPermissions?.costCenters?.[1]),
    createLink('Cargar Remuneraciones', true, <AddCostCentersAccountValues />, null, '/centros-de-costos/cargar-remuneraciones', mainPermissions?.costCenters?.[1]),


    createLink('Importar responsables', true, <ImportCostCentersResponsibles />, null, '/centros-de-costos/importar-responsables', mainPermissions?.costCenters?.[1]),
    createLink('Importar montos de cuentas', true, <ImportCostCentersAccountValues />, null, '/centros-de-costos/importar-montos-de-cuentas', mainPermissions?.costCenters?.[1]),
    createLink('Importar dotación por contrato', true, <ImportCostCentersStaff />, null, '/centros-de-costos/importar-dotacion', mainPermissions?.costCenters?.[1]),
    createLink('Importar ingresos UF', true, <ImportCostCentersUf />, null, '/centros-de-costos/importar-ingresos-uf', mainPermissions?.costCenters?.[1]),

    createLink('Editar', true, <CostCentersEdit />, null, '/centros-de-costos/:id', mainPermissions?.costCenters?.[1]),


    createLink('Consideraciones', null, <Instructions />, FaWpforms, '/instrucciones', mainPermissions?.instructions?.[0]),
];

export default MenuLinks;