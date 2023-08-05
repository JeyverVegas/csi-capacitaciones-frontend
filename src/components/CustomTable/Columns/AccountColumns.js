import ActionDropdown from "../../ActionDropdown";
import TableCheck from "../TableCheck";
import { dateFine } from "../../../util/Utilities";
import DateFormatter from "../../DateFormatter";

const AccountColumns = [
    {
        Label: TableCheck,
        Component: TableCheck

    },
    {
        Label: () => 'id',
        accessor: 'id'
    },
    {
        Label: () => 'Clasificación',
        Component: ({ value }) => value?.accountClassification?.name || '--'
    },
    {
        Label: () => 'Codigo',
        accessor: 'code'
    },
    {
        Label: () => 'Nombre',
        accessor: 'name'
    },
    {
        Label: () => 'Tipo',
        Component: ({ value }) => <p>
            {value?.type === 'income' && 'Ingreso'}
            {value?.type === 'spent' && 'Gasto'}
        </p>
    },
    {
        Label: () => '¿Afecta la dotación?',
        Component: ({ value }) => value?.staff ? 'Si' : 'No'
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

export default AccountColumns;

