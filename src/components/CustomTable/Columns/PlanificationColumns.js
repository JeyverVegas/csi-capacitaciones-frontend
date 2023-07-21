import ActionDropdown from "../../ActionDropdown";
import TableCheck from "../TableCheck";
import { dateFine } from "../../../util/Utilities";
import DateFormatter from "../../DateFormatter";
import clsx from "clsx";

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
        Label: () => 'Inicia',
        Component: ({ value }) => <DateFormatter value={dateFine(value?.start)} dateFormat="dd/MM/yyyy" />
    },
    {
        Label: () => 'Finaliza',
        Component: ({ value }) => <DateFormatter value={dateFine(value?.end)} dateFormat="dd/MM/yyyy" />
    },
    {
        Label: () => 'Estatus',
        Component: ({ value }) => <button className={clsx(["btn btn-xs"], {
            'btn-danger': !value?.open,
            'btn-success': value?.open,
        })}>
            {value?.open ? 'Abierto' : 'Cerrado'}
        </button>
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

