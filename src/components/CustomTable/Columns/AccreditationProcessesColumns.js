import ActionDropdown from "../../ActionDropdown";
import TableCheck from "../TableCheck";
import { dateFine } from "../../../util/Utilities";
import DateFormatter from "../../DateFormatter";

const AccreditationProcessesColumns = [
    {
        Label: TableCheck,
        Component: TableCheck

    },
    {
        Label: () => 'id',
        accessor: 'id'
    },
    {
        Label: () => 'Usuario',
        Component: ({ value }) => value?.user?.name || '--'
    },
    {
        Label: () => 'Tareas',
        Component: ({ value }) => value?.steps?.length || '0'
    },
    {
        Label: () => 'Duración',
        Component: ({ value }) => `${value?.days || 0} Días`
    },
    {
        Label: () => 'Fecha de inicio',
        Component: ({ value }) => <DateFormatter value={dateFine(value?.createdAt)} dateFormat="dd/MM/yyyy" />
    },
    {
        Label: () => 'Fecha de finalización',
        Component: ({ value }) => <DateFormatter value={dateFine(value?.end)} dateFormat="dd/MM/yyyy" />
    },
    {
        Label: () => 'Acciones',
        Component: ActionDropdown
    }
];

export default AccreditationProcessesColumns;

