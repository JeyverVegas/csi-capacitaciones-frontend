import ActionDropdown from "../../ActionDropdown";
import DocumentNumber from "../../DocumentNumber";
import ImageAndName from "../../ImageAndName";
import TableCheck from "../TableCheck";
import { format } from "date-fns";

const UsersColumns = [
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
        Component: ImageAndName
    },
    {
        Label: () => 'Nro. de documento',
        Component: DocumentNumber
    },
    {
        Label: () => 'Email',
        accessor: 'email'
    },
    {
        Label: () => 'Cargo',
        Component: ({ positionName }) => `${positionName ? positionName : ''}`
    },
    {
        Label: () => 'Rol',
        Component: ({ roleName }) => `${roleName ? roleName : ''}`
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

export default UsersColumns;

