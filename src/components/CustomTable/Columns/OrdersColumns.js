import ActionDropdown from "../../ActionDropdown";
import DocumentNumber from "../../DocumentNumber";
import ImageAndName from "../../ImageAndName";
import TableCheck from "../TableCheck";
import { format } from "date-fns";

const OrdersColumns = [
    {
        Label: TableCheck,
        Component: TableCheck

    },
    {
        Label: () => 'id',
        accessor: 'id'
    },
    {
        Label: () => 'Tipo',
        Component: ({ value }) => value?.orderType?.name || '--'
    },
    {
        Label: () => 'Servicio',
        Component: ({ value }) => value?.service?.name || '--'
    },
    {
        Label: () => '¿Repuestos?',
        Component: ({ value }) => `${value?.isReplacement ? 'SI' : 'NO'}`
    },
    {
        Label: () => 'Monto',
        Component: ({ value }) => `${value?.total}`
    },
    {
        Label: () => 'Estatus',
        Component: ({ value }) => value?.status?.name || '--'
    },
    {
        Label: () => 'Fecha de Creación',
        Component: ({ date }) => format(new Date(date), 'dd/MM/yyyy')
    },
    {
        Label: () => 'Acciones',
        Component: ActionDropdown
    }
];

export default OrdersColumns;

