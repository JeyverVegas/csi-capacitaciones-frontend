import ActionDropdown from "../../ActionDropdown";
import DocumentNumber from "../../DocumentNumber";
import ImageAndName from "../../ImageAndName";
import TableCheck from "../TableCheck";
import { format } from "date-fns";
import RenderStatus from "../../RenderStatus";
import DateFormatter from "../../DateFormatter";
import { dateFine } from "../../../util/Utilities";

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
        Label: () => 'Elaborado por',
        Component: ({ value }) => value?.user?.name || '--'
    },
    {
        Label: () => 'Tipo',
        Component: ({ value }) => value?.orderType?.displayText || '--'
    },
    {
        Label: () => 'Servicio',
        Component: ({ value }) => value?.service?.name || '--'
    },
    {
        Label: () => 'Jefe de Operaciones',
        Component: ({ value }) => `${!value?.isReplacement ? value?.service?.ordersBoss?.name || '--' : value?.service?.ordersReplacementBoss?.name || '--'}`
    },
    {
        Label: () => 'Enc. Adquisiciones',
        Component: ({ value }) => `${!value?.isReplacement ? value?.service?.adquisicionUser?.name || '--' : value?.service?.adquisicionReplacementUser?.name || '--'}`
    },
    {
        Label: () => '¿Repuestos?',
        Component: ({ value }) => `${value?.isReplacement ? 'SI' : 'NO'}`
    },
    {
        Label: () => 'Monto',
        Component: ({ value }) => `$${value?.total}`
    },
    {
        Label: () => 'Estatus',
        Component: RenderStatus
    },
    {
        Label: () => 'Fecha de Creación',
        Component: ({ value }) => <DateFormatter value={dateFine(value?.createdAt)} dateFormat="dd/MM/yyyy hh:mm:ss" />
    },
    {
        Label: () => 'Acciones',
        Component: ActionDropdown
    }
];

export default OrdersColumns;

