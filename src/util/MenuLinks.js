import Categories from "../pages/private/categories/Categories";
import CategoriesCreate from "../pages/private/categories/CategoriesCreate";
import CategoriesUpdate from "../pages/private/categories/CategoriesUpdate";
import Dashboard from "../pages/private/Dashboard";
import Positions from "../pages/private/positions/Positions";
import PositionsCreate from "../pages/private/positions/PositionsCreate";
import PositionsUpdate from "../pages/private/positions/PositionsUpdate";
import Products from "../pages/private/products/Products";
import ProductsCreate from "../pages/private/products/ProductsCreate";
import ProductsUpdate from "../pages/private/products/ProductsUpdate";
import Providers from "../pages/private/providers/Providers";
import ProvidersCreate from "../pages/private/providers/ProvidersCreate";
import ProvidersUpdate from "../pages/private/providers/ProvidersUpdate";
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
    permissions: ['view-permissions'],
    positions: ['view-positions', 'create-positions', 'update-positions', 'delete-positions'],
    services: ['view-services', 'create-services', 'update-services', 'delete-services'],
    users: ['view-users', 'create-users', 'update-users', 'delete-users'],
    roles: ['view-roles', 'create-roles', 'update-roles', 'delete-roles'],
    providers: ['view-users', 'create-users', 'update-users', 'delete-users'],
    products: ['view-users', 'create-users', 'update-users', 'delete-users', 'view-users', 'create-users'],
    categories: ['view-categories', 'create-categories', 'update-categories', 'delete-categories']
}

const MenuLinks = [
    createLink('DashBoard', null, <Dashboard />, 'flaticon-025-dashboard', '/dashboard', mainPermissions?.dashboard[0]),

    createLink('Cargos', null, null, 'flaticon-381-id-card-2', '/cargos', mainPermissions?.positions, [
        createLink('Crear Cargos', null, <PositionsCreate />, '', '/cargos/crear', mainPermissions?.positions[1]),
        createLink('Listar Cargos', null, <Positions />, '', '/cargos', mainPermissions?.positions[0]),
        createLink('Actualizar Cargos', true, <PositionsUpdate />, '', '/cargos/:id', mainPermissions?.positions[2]),
    ]),

    createLink('Servicios', null, null, 'flaticon-381-settings-7', '/servicios', mainPermissions?.services, [
        createLink('Crear Servicio', null, <ServicesCreate />, '', '/servicios/crear', mainPermissions?.services[1]),
        createLink('Listar Servicios', null, <Services />, '', '/servicios', mainPermissions?.services[0]),
        createLink('Actualizar Servicios', true, <ServicesUpdate />, '', '/servicios/:id', mainPermissions?.services[2]),
    ]),


    

    createLink('Proveedores', null, null, 'flaticon-052-inside', '/proveedores', mainPermissions?.providers, [
        createLink('Crear Proveedor', null, <ProvidersCreate />, '', '/proveedores/crear', mainPermissions?.providers[1]),
        createLink('Listar Proveedores', null, <Providers />, '', '/proveedores', mainPermissions?.providers[0]),
        createLink('Actualizar Proveedores', true, <ProvidersUpdate />, '', '/proveedores/:id', mainPermissions?.providers[2]),
    ]),

    createLink('Productos', null, null, 'flaticon-381-tab', '/productos', mainPermissions?.products, [
        createLink('Crear Producto', null, <ProductsCreate />, '', '/productos/crear', mainPermissions?.products[1]),
        createLink('Listar Productos', null, <Products />, '', '/productos', mainPermissions?.products[0]),
        createLink('Crear Categoria', null, <CategoriesCreate />, '', '/categorias/crear', mainPermissions?.products[5]),
        createLink('Categorias', null, <Categories />, '', '/categorias', mainPermissions?.products[4]),
        createLink('Actualizar Productos', true, <ProductsUpdate />, '', '/productos/:id', mainPermissions?.products[2]),
        createLink('Actualizar Categoria', true, <CategoriesUpdate />, '', '/categorias/:id', mainPermissions?.categories[2]),
    ]),

    createLink('Roles', null, null, 'flaticon-381-user-8', '/roles', mainPermissions?.roles, [

        createLink('Crear Rol', null, <RolesCreate />, '', '/roles/crear', mainPermissions?.roles[1]),
        createLink('Listar Roles', null, <Roles />, '', '/roles', mainPermissions?.roles[0]),
        createLink('Actualizar Roles', true, <RolesUpdate />, '', '/roles/:id', mainPermissions?.roles[2]),
    ]),

    createLink('Usuarios', null, null, 'flaticon-381-user-9', '/usuarios', mainPermissions?.users, [
        createLink('Crear Usuario', null, <UsersCreate />, '', '/usuarios/crear', mainPermissions?.users[1]),
        createLink('Listar Usuarios', null, <Users />, '', '/usuarios', mainPermissions?.users[0]),
        createLink('Actualizar Usuarios', true, <UsersUpdate />, '', '/usuarios/:id', mainPermissions?.users[2]),
    ])
];

export default MenuLinks;