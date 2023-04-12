import ActionDropdown from "../../ActionDropdown";
import TableCheck from "../TableCheck";
import { dateFine } from "../../../util/Utilities";
import DateFormatter from "../../DateFormatter";
import ProgressComponent from "../../ProgressComponent";
import { Dropdown } from "react-bootstrap";

const AccreditationsColumns = [
    {
        Label: TableCheck,
        Component: TableCheck

    },
    {
        Label: () => 'id',
        accessor: 'id'
    },
    {
        Label: () => 'Trabajador',
        Component: ({ value }) => value?.user?.name || '--'
    },
    {
        Label: () => 'Centro de costo',
        Component: ({ value }) => value?.costCenter?.name || '--'
    },
    {
        Label: () => 'Acreditado por',
        Component: ({ value }) => value?.accreditateBy?.name || '--'
    },
    {
        Label: () => 'Proceso de acreditación',
        Component: ({ value }) => value?.accreditationProcessId ? `Proceso #${value?.accreditationProcessId}` : 'Acreditación directa'
    },
    {
        Label: () => 'Fecha de creación',
        Component: ({ value }) => <DateFormatter value={dateFine(value?.createdAt)} dateFormat="dd/MM/yyyy" />
    },
    {
        Label: () => 'Acciones',
        Component: ActionDropdown
    }
];

export default AccreditationsColumns;

