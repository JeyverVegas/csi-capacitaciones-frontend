import Categories from "../pages/private/categories/Categories";
import CategoriesCreate from "../pages/private/categories/CategoriesCreate";
import CategoriesUpdate from "../pages/private/categories/CategoriesUpdate";
import Dashboard from "../pages/private/Dashboard";
import Features from "../pages/private/features/Features";
import FeaturesCreate from "../pages/private/features/FeaturesCreate";
import FeaturesUpdate from "../pages/private/features/FeaturesUpdate";
import MyOrders from "../pages/private/orders/MyOrders";
import Orders from "../pages/private/orders/Orders";
import OrdersCreate from "../pages/private/orders/OrdersCreate";
import OrdersDetails from "../pages/private/orders/OrdersDetails";
import OrdersDetailsUser from "../pages/private/orders/OrdersDetailsUser";
import Products from "../pages/private/products/Products";
import ProductsAssociate from "../pages/private/products/ProductsAssociate";
import ProductsCreate from "../pages/private/products/ProductsCreate";
import ProductsUpdate from "../pages/private/products/ProductsUpdate";
import ProductsUpdatePrices from "../pages/private/products/ProductsUpdatePrices";
import Providers from "../pages/private/providers/Providers";
import ProvidersCreate from "../pages/private/providers/ProvidersCreate";
import ProvidersUpdate from "../pages/private/providers/ProvidersUpdate";
import MyQuotes from "../pages/private/quotes/MyQuotes";
import Quotes from "../pages/private/quotes/Quotes";
import QuotesCreate from "../pages/private/quotes/QuotesCreate";
import QuotesDetails from "../pages/private/quotes/QuotesDetails";
import QuotesDetailsUser from "../pages/private/quotes/QuotesDetailsUser";
import SystemInfo from "./SystemInfo";

const createLink = (
    title,
    hidden,
    component,
    icon,
    path,
    permissions,
    children
) => ({ title, hidden, component, icon, path, permissions, children });

const { systemCode } = SystemInfo;

export const mainPermissions = {
    dashboard: [`${systemCode}-view-dashboard`],
    providers: [`${systemCode}-view-providers`, `${systemCode}-create-providers`, `${systemCode}-update-providers`, `${systemCode}-delete-providers`],
    orders: [`${systemCode}-view-orders`, `${systemCode}-create-orders`, `${systemCode}-update-orders`, `${systemCode}-delete-orders`],
    quotes: [`${systemCode}-view-quotes`, `${systemCode}-create-quotes`, `${systemCode}-update-quotes`, `${systemCode}-delete-quotes`],
    products: [`${systemCode}-view-products`, `${systemCode}-create-products`, `${systemCode}-update-products`, `${systemCode}-delete-products`],
    categories: [`${systemCode}-view-categories`, `${systemCode}-create-categories`, `${systemCode}-update-categories`, `${systemCode}-delete-categories`],
    features: [`${systemCode}-view-product-features`, `${systemCode}-create-product-features`, `${systemCode}-update-product-features`, `${systemCode}-delete-product-features`],
    productFeaturesOptions: [`${systemCode}-view-product-feature-options`, `${systemCode}-create-product-feature-options`, `${systemCode}-update-product-feature-options`, `${systemCode}-delete-product-feature-options`]
}

const MenuLinks = [
    createLink('DashBoard', null, <Dashboard />, 'flaticon-025-dashboard', '/dashboard', mainPermissions?.dashboard[0]),

    createLink('Pedidos', null, null, 'fa fa-shopping-cart', '/pedidos', mainPermissions?.orders, [
        createLink('Crear Pedido', null, <OrdersCreate />, '', '/pedidos/crear', mainPermissions?.orders[1]),
        createLink('Listar Pedidos', null, <Orders />, '', '/pedidos', mainPermissions?.orders[0]),
        createLink('Mis Pedidos', null, <MyOrders />, '', '/mis-pedidos', null),
        createLink('Actualizar Pedido', true, <OrdersDetails />, '', '/pedidos/detalles/:id', null),
        createLink('Ver Pedido', true, <OrdersDetailsUser />, '', '/mis-pedidos/:id', null)
    ]),


    createLink('Cotizaciones', null, null, 'flaticon-381-list', '/cotizaciones', mainPermissions?.quotes, [
        createLink('Crear', null, <QuotesCreate />, '', '/cotizaciones/crear', mainPermissions?.quotes[1]),
        createLink('Listar', null, <Quotes />, '', '/cotizaciones', mainPermissions?.quotes[0]),
        createLink('Mis Cotizaciones', null, <MyQuotes />, '', '/mis-cotizaciones', null),
        createLink('Actualizar Cotización', true, <QuotesDetails />, '', '/cotizaciones/detalles/:id', null),
        createLink('Ver Cotización', true, <QuotesDetailsUser />, '', '/mis-cotizaciones/:id', null)
    ]),

    createLink('Proveedores', null, null, 'flaticon-052-inside', '/proveedores', mainPermissions?.providers, [
        createLink('Crear Proveedor', null, <ProvidersCreate />, '', '/proveedores/crear', mainPermissions?.providers[1]),
        createLink('Listar Proveedores', null, <Providers />, '', '/proveedores', mainPermissions?.providers[0]),
        createLink('Actualizar Proveedores', true, <ProvidersUpdate />, '', '/proveedores/:id', mainPermissions?.providers[2]),
    ]),

    createLink('Productos', null, null, 'fa fa-box', '/productos', mainPermissions?.products, [
        createLink('Crear Producto', null, <ProductsCreate />, '', '/productos/crear', mainPermissions?.products[1]),
        createLink('Asociar Productos', true, <ProductsAssociate />, '', '/productos/asociar-servicios', mainPermissions?.products[1]),
        createLink('Actualizar precios', true, <ProductsUpdatePrices />, '', '/productos/actualizar-precios', mainPermissions?.products[1]),
        createLink('Listar Productos', null, <Products />, '', '/productos', mainPermissions?.products[0]),
        createLink('Actualizar Productos', true, <ProductsUpdate />, '', '/productos/:id', mainPermissions?.products[2]),
        createLink('Crear Categoria', null, <CategoriesCreate />, '', '/categorias/crear', mainPermissions?.categories[1]),
        createLink('Categorias', null, <Categories />, '', '/categorias', mainPermissions?.categories[0]),
        createLink('Actualizar Categoria', true, <CategoriesUpdate />, '', '/categorias/:id', mainPermissions?.categories[2]),
    ]),

    createLink('Caracteristicas', null, null, 'fa fa-sliders-h', '/caracteristicas', mainPermissions?.features, [
        createLink('Crear Caracteristica', null, <FeaturesCreate />, '', '/caracteristicas/crear', mainPermissions?.features[1]),
        createLink('Listar Caracteristicas', null, <Features />, '', '/caracteristicas', mainPermissions?.features[0]),
        createLink('Actualizar Caracteristicas', true, <FeaturesUpdate />, '', '/caracteristicas/:id', mainPermissions?.features[2]),
    ])
];

export default MenuLinks;