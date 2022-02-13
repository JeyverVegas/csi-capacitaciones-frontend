import Dashboard from "../pages/private/Dashboard";
import Positions from "../pages/private/positions/Positions";
import PositionsCreate from "../pages/private/positions/PositionsCreate";
import PositionsUpdate from "../pages/private/positions/PositionsUpdate";
import Roles from "../pages/private/roles/Roles";
import RolesCreate from "../pages/private/roles/RolesCreate";
import RolesUpdate from "../pages/private/roles/RolesUpdate";
import Services from "../pages/private/services/Services";
import ServicesCreate from "../pages/private/services/ServicesCreate";
import ServicesUpdate from "../pages/private/services/ServicesUpdate";
import Users from "../pages/private/users/Users";
import UsersCreate from "../pages/private/users/UsersCreate";
import UsersUpdate from "../pages/private/users/UsersUpdate";

const createLink = (
    title,
    forUpdate,
    component,
    icon,
    path,
    permissions,
    children
) => ({ title, forUpdate, component, icon, path, permissions, children });

export const mainPermissions = {
    dashboard: ['view-dashboard'],
    positions: ['view-positions', 'create-positions', 'update-positions', 'delete-positions'],
    services: ['view-services', 'create-services', 'update-services', 'delete-services'],
    users: ['view-users', 'create-users', 'update-users', 'delete-users'],
    roles: ['view-roles', 'create-roles', 'update-roles', 'delete-roles'],
}

const MenuLinks = [
    createLink('DashBoard', null, <Dashboard />, 'flaticon-025-dashboard', '/dashboard', mainPermissions?.dashboard[0]),

    createLink('Cargos', null, null, 'flaticon-038-gauge', '/cargos', mainPermissions?.positions, [
        createLink('Crear Cargos', null, <PositionsCreate />, '', '/cargos/crear', mainPermissions?.positions[1]),
        createLink('Listar Cargos', null, <Positions />, '', '/cargos', mainPermissions?.positions[0]),
        createLink('Actualizar Cargos', true, <PositionsUpdate />, '', '/cargos/:id', mainPermissions?.positions[2]),
    ]),

    createLink('Servicios', null, null, 'flaticon-052-inside', '/servicios', mainPermissions?.services, [
        createLink('Crear Servicio', null, <ServicesCreate />, '', '/servicios/crear', mainPermissions?.services[1]),
        createLink('Listar Servicios', null, <Services />, '', '/servicios', mainPermissions?.services[0]),
        createLink('Actualizar Servicios', true, <ServicesUpdate />, '', '/servicios/:id', mainPermissions?.services[2]),
    ]),

    createLink('Roles', null, null, 'flaticon-381-user-9', '/roles', mainPermissions?.roles, [
        createLink('Crear Rol', null, <RolesCreate />, '', '/roles/crear', mainPermissions?.roles[1]),
        createLink('Listar Roles', null, <Roles />, '', '/roles', mainPermissions?.roles[0]),
        createLink('Actualizar Roles', true, <RolesUpdate />, '', '/roles/:id', mainPermissions?.roles[2]),
    ]),

    createLink('Usuarios', null, null, 'flaticon-381-user-9', '/users', mainPermissions?.users, [
        createLink('Crear Usuario', null, <UsersCreate />, '', '/usuarios/crear', mainPermissions?.users[1]),
        createLink('Listar Usuarios', null, <Users />, '', '/users', mainPermissions?.users[0]),
        createLink('Actualizar Usuarios', true, <UsersUpdate />, '', '/users/:id', mainPermissions?.users[2]),
    ])
];

export default MenuLinks;