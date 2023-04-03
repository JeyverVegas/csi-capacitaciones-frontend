import ActionDropdown from "../../ActionDropdown";
import TableCheck from "../TableCheck";
import { dateFine } from "../../../util/Utilities";
import DateFormatter from "../../DateFormatter";

const FormsColumns = [
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
        Label: () => 'Pasos',
        Component: ({ value }) => value?.steps?.length || '0'
    },
    {
        Label: () => 'Actividades',
        Component: ({ value }) => value?.steps?.reduce((prevValue, step, i) => {
            return prevValue + Number(step?.activities?.length);
        }, 0) || '0'
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

export default FormsColumns;

