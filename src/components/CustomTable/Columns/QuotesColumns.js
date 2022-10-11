import ActionDropdown from "../../ActionDropdown";
import TableCheck from "../TableCheck";
import { format } from "date-fns";
import RenderStatus from "../../RenderStatus";

const QuotesColumns = [
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
        Label: () => 'Servicio',
        Component: ({ value }) => value?.service?.name || '--'
    },
    {
        Label: () => 'Estatus',
        Component: RenderStatus
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

export default QuotesColumns;

