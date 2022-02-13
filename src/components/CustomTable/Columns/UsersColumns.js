import ActionDropdown from "../../ActionDropdown";
import DocumentNumber from "../../DocumentNumber";
import ImageAndName from "../../ImageAndName";
import TableCheck from "../TableCheck";

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
        Label: () => 'Servicio',
        Component: ({ serviceName }) => `${serviceName ? serviceName : ''}`
    },
    {
        Label: () => 'Rol',
        Component: ({ roleName }) => `${roleName ? roleName : ''}`
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

export default UsersColumns;

