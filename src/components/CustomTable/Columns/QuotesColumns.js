import ActionDropdown from "../../ActionDropdown";
import TableCheck from "../TableCheck";
import RenderStatus from "../../RenderStatus";
import DateFormatter from "../../DateFormatter";
import { dateFine } from "../../../util/Utilities";

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
        Component: ({ value }) => <DateFormatter value={dateFine(value?.createdAt)} dateFormat="dd/MM/yyyy hh:mm:ss" />
    },
    {
        Label: () => 'Acciones',
        Component: ActionDropdown
    }
];

export default QuotesColumns;

