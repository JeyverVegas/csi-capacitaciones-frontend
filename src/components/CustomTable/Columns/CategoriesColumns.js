import ActionDropdown from "../../ActionDropdown";
import TableCheck from "../TableCheck";
import { dateFine } from "../../../util/Utilities";
import DateFormatter from "../../DateFormatter";

const CategoriesColumns = [
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
        Label: () => 'Categoría Padre',
        Component: ({ parentCategory }) => parentCategory?.name ? parentCategory?.name : 'No tiene.'
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

export default CategoriesColumns;

