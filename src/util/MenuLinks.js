import Dashboard from "../pages/private/Dashboard";
import SystemInfo from "./SystemInfo";
import { AiOutlineDashboard, AiOutlineIssuesClose } from "react-icons/ai";
import { FaWpforms, FaUserSecret } from "react-icons/fa";
import Forms from "../pages/private/forms/Forms";
import FormsEdit from "../pages/private/forms/FormsEdit";
import FormsCreate from "../pages/private/forms/FormsCreate";
import { MdVerifiedUser } from "react-icons/md";
import AccreditationProcess from "../pages/private/accreditation-process/AccreditationProcess";
import AccreditationProcessEdit from "../pages/private/accreditation-process/AccreditationProcessEdit";
import AccreditationProcessCreate from "../pages/private/accreditation-process/AccreditationProcessCreate";
import Accreditations from "../pages/private/accreditations/Accreditations";
import AccreditationsEdit from "../pages/private/accreditations/AccreditationsEdit";
import AccreditationsCreate from "../pages/private/accreditations/AccreditationsCreate";
import { FiUser } from "react-icons/fi";
import AccountAccreditations from "../pages/private/account/accreditations/AccountAccreditations";
import AccountAccreditationsEdit from "../pages/private/account/accreditations/AccountAccreditationsEdit";
import AccountAccreditationProcesses from "../pages/private/account/accreditation-process/AccountAccreditationProcesses";
import AccountAccreditationProcessesEdit from "../pages/private/account/accreditation-process/AccountAccreditationProcessesEdit";
import Analysts from "../pages/private/analysts/Analysts";
import AnalystsEdit from "../pages/private/analysts/AnalystsEdit";




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
    dashboard: [`${systemCode}-view-dashboard`],
    forms: [`${systemCode}-view-forms`, `${systemCode}-create-forms`, `${systemCode}-update-forms`, `${systemCode}-delete-forms`],
    accreditationProcess: [`${systemCode}-view-accreditation-process`, `${systemCode}-create-accreditation-process`, `${systemCode}-update-accreditation-process`, `${systemCode}-accreditation-process`],
}

const MenuLinks = [
    createLink('DashBoard', null, <Dashboard />, AiOutlineDashboard, '/dashboard', null),

    createLink('Formularios', null, null, FaWpforms, '/formularios-de-acreditacion', null, [
        createLink('Listar', null, <Forms />, null, '/formularios-de-acreditacion/listar', null),
        createLink('Editar', true, <FormsEdit />, null, '/formularios-de-acreditacion/:id', null),
        createLink('Crear', null, <FormsCreate />, null, '/formularios-de-acreditacion/crear', null),
    ]),

    createLink('Procesos de acreditación', null, null, AiOutlineIssuesClose, '/proceso-de-acreditaciones', null, [
        createLink('Listar', null, <AccreditationProcess />, null, '/proceso-de-acreditaciones/listar', null),
        createLink('Editar', true, <AccreditationProcessEdit />, null, '/proceso-de-acreditaciones/:id', null),
        createLink('Iniciar', null, <AccreditationProcessCreate />, null, '/proceso-de-acreditaciones/iniciar-proceso', null),
    ]),

    createLink('Acreditaciones', null, null, MdVerifiedUser, '/acreditaciones', null, [
        createLink('Listar', null, <Accreditations />, null, '/acreditaciones/listar', null),
        createLink('Editar', true, <AccreditationsEdit />, null, '/acreditaciones/:id', null),
        createLink('Crear', null, <AccreditationsCreate />, null, '/acreditaciones/crear', null),
    ]),

    createLink('Analistas', null, null, FaUserSecret, '/analistas', null, [
        createLink('Listar', null, <Analysts />, null, '/analistas/listar', null),
        createLink('Editar', true, <AnalystsEdit />, null, '/analistas/:id', null),
    ]),

    createLink('Mi Cuenta', null, null, FiUser, '/mi-cuenta', null, [
        createLink('Acreditaciones', null, <AccountAccreditations />, null, '/mi-cuenta/acreditaciones', null),
        createLink('Acreditaciones', true, <AccountAccreditationsEdit />, null, '/mi-cuenta/acreditaciones/:id', null),
        createLink('Procesos de acreditación', null, <AccountAccreditationProcesses />, null, '/mi-cuenta/proceso-de-acreditaciones', null),
        createLink('Procesos de acreditación', true, <AccountAccreditationProcessesEdit />, null, '/mi-cuenta/proceso-de-acreditaciones/:id', null),
    ]),

];

export default MenuLinks;