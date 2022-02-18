import ActionDropdown from "../../ActionDropdown";
import DocumentNumber from "../../DocumentNumber";
import ImageAndName from "../../ImageAndName";
import TableCheck from "../TableCheck";
import { format } from "date-fns";

const ProvidersColumns = [
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
        Label: () => 'Telefono',
        accessor: 'phoneNumber'
    },
    {
        Label: () => 'Email',
        accessor: 'email'
    },
    {
        Label: () => 'Dirección',
        accessor: 'address'
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

export default ProvidersColumns;

