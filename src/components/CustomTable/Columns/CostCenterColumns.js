import ActionDropdown from "../../ActionDropdown";
import TableCheck from "../TableCheck";
import { dateFine } from "../../../util/Utilities";
import DateFormatter from "../../DateFormatter";

const CostCenterColumns = [
    {
        Label: TableCheck,
        Component: TableCheck

    },
    {
        Label: () => 'id',
        accessor: 'id'
    },
    {
        Label: () => 'Codigo',
        Component: ({ value }) => value?.code || '--'
    },
    {
        Label: () => 'Nombre',
        accessor: 'name'
    },
    {
        Label: () => 'Responsable General',
        Component: ({ value }) => value?.generalResponsible?.name || '--'
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

export default CostCenterColumns;

