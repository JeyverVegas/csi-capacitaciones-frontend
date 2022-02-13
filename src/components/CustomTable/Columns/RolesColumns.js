import ActionDropdown from "../../ActionDropdown";
import TableCheck from "../TableCheck";

const RolesColumns = [
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
        accessor: 'name'
    },
    {
        Label: () => 'Fecha de Creación',
        accessor: 'created_at'
    },
    {
        Label: () => 'Acciones',
        Component: ActionDropdown
    }
];

export default RolesColumns;

