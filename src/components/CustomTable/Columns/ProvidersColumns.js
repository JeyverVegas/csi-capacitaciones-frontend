import ActionDropdown from "../../ActionDropdown";
import DocumentNumber from "../../DocumentNumber";
import ImageAndName from "../../ImageAndName";
import TableCheck from "../TableCheck";
import DateFormatter from "../../DateFormatter";
import { dateFine } from "../../../util/Utilities";

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
        Label: () => 'Teléfono',
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
        Component: ({ value }) => <DateFormatter value={dateFine(value?.createdAt)} dateFormat="dd/MM/yyyy hh:mm:ss" />
    },
    {
        Label: () => 'Acciones',
        Component: ActionDropdown
    }
];

export default ProvidersColumns;

