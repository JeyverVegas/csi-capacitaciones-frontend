import { useEffect } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { OrderCrudProvider } from "../../../context/OrderCrudContext";
import CreateOrderForm from "../../../components/Forms/FormsSteppers/Orders/CreateOrderForm";

const OrdersCreate = () => {

    const { openMenuToggle, customMenuToggle, sideBarStyle } = useTheme();

    useEffect(() => {
        customMenuToggle(true);
    }, []);

    return (
        <OrderCrudProvider>
            <CreateOrderForm />
        </OrderCrudProvider>
    )
}
export default OrdersCreate;