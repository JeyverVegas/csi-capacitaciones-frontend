import ActionDropdown from "../../ActionDropdown";
import TableCheck from "../TableCheck";
import { format } from "date-fns";
import ImageAndName from "../../ImageAndName";

const ProductsColumns = [
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
        Label: () => 'Categoria',
        Component: ({ categoryName }) => categoryName
    },
    {
        Label: () => 'Proveedor',
        Component: ({ provider }) => provider?.name
    },
    {
        Label: () => 'Repuesto',
        Component: ({ value }) => <span style={{ fontSize: '25px' }}>{value?.isReplacement ? '✔️' : '🚫'}</span>
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

export default ProductsColumns;

