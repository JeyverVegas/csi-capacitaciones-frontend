import ActionDropdown from "../../ActionDropdown";
import TableCheck from "../TableCheck";
import { dateFine } from "../../../util/Utilities";
import DateFormatter from "../../DateFormatter";
import ProgressComponent from "../../ProgressComponent";
import { Dropdown } from "react-bootstrap";

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
        Label: () => 'Pasos',
        Component: ({ value }) => value?.steps?.length || '0'
    },
    {
        Label: () => 'Progreso',
        Component: ProgressComponent
    },
    {
        Label: () => 'Estado',
        Component: ({ value }) => <Dropdown>
            <Dropdown.Toggle size="xs" variant={value?.status?.variant_color}>
                {value?.status?.name}
            </Dropdown.Toggle>
        </Dropdown>
    },
    {
        Label: () => 'Aprobado por el A/C',
        Component: ({ value }) => value?.adminApprovedAt ? 'Si' : 'No'
    },
    {
        Label: () => 'Centro de costo',
        Component: ({ value }) => value?.costCenter?.name || '--'
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

