import ActionDropdown from "../../ActionDropdown";
import DocumentNumber from "../../DocumentNumber";
import ImageAndName from "../../ImageAndName";
import TableCheck from "../TableCheck";
import { format } from "date-fns";
import DateFormatter from "../../DateFormatter";
import { dateFine } from "../../../util/Utilities";

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
        Component: ({ value }) => <DateFormatter value={dateFine(value?.createdAt)} dateFormat="dd/MM/yyyy hh:mm:ss" />
    },
    {
        Label: () => 'Acciones',
        Component: ActionDropdown
    }
];

export default UsersColumns;

