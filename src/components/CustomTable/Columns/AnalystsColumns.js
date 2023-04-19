import ActionDropdown from "../../ActionDropdown";
import TableCheck from "../TableCheck";

const AnalystsColumns = [
    {
        Label: TableCheck,
        Component: TableCheck

    },
    {
        Label: () => 'id',
        accessor: 'id'
    },
    {
        Label: () => 'Nombre',
        Component: ({ value }) => value?.name || '--'
    },
    {
        Label: () => 'Centro de costo',
        Component: ({ value }) => value?.costCenter?.name || '--'
    },
    {
        Label: () => 'Procesos de acreditación',
        Component: ({ value }) => value?.accreditationProcesses?.length
    },
    {
        Label: () => 'Acciones',
        Component: ActionDropdown
    }
];

export default AnalystsColumns;

