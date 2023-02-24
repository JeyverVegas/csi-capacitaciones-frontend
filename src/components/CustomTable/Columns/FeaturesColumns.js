import ActionDropdown from "../../ActionDropdown";
import TableCheck from "../TableCheck";
import DateFormatter from "../../DateFormatter";
import { dateFine } from "../../../util/Utilities";

const FeaturesColumns = [
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
        Label: () => 'Valores',
        Component: ({ optionsCount }) => optionsCount
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

export default FeaturesColumns;

