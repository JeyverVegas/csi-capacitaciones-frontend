const createLink = (
    title,
    icon,
    path,
    permissions,
    children
) => ({ title, icon, path, permissions, children });

export const mainPermissions = {
    dashboard: ['view-dashboard'],
    positions: ['view-positions', 'create-positions', 'update-positions', 'delete-positions'],
    services: ['view-services', 'create-services', 'update-services', 'delete-services'],
    users: ['view-users', 'create-users', 'update-users', 'delete-users'],
    roles: ['view-roles', 'create-roles', 'update-roles', 'delete-roles'],
}

const MenuLinks = [
    createLink('DashBoard', 'flaticon-025-dashboard', '/dashboard', mainPermissions?.dashboard),

    createLink('Cargos', 'flaticon-038-gauge', '/cargos', mainPermissions?.positions, [
        createLink('Crear Cargos', '', '/cargos/crear', mainPermissions?.positions[1]),
        createLink('Listar Cargos', '', '/cargos', mainPermissions?.positions[0]),
    ]),

    createLink('Servicios', 'flaticon-052-inside', '/servicios', mainPermissions?.services, [
        createLink('Crear Servicio', '', '/servicios/crear', mainPermissions?.services[1]),
        createLink('Listar Servicios', '', '/servicios', mainPermissions?.services[0]),
    ]),

    createLink('Roles', 'flaticon-381-user-9', '/roles', mainPermissions?.roles, [
        createLink('Crear Rol', '', '/roles/crear', mainPermissions?.roles[1]),
        createLink('Listar Roles', '', '/roles', mainPermissions?.roles[0]),
    ]),

    createLink('Usuarios', 'flaticon-381-user-9', '/users', mainPermissions?.users, [
        createLink('Crear Usuario', '', '/usuarios/crear', mainPermissions?.users[1]),
        createLink('Listar Usuarios', '', '/users', mainPermissions?.users[0]),
    ])
];

export default MenuLinks;