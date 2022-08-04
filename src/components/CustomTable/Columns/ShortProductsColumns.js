import ImageAndName from "../../ImageAndName";
import TableCheck from "../TableCheck";

const ShortProductsColumns = [
    {
        Label: () => 'Seleccionar',
        Component: TableCheck
    },
    {
        Label: () => 'Código',
        accessor: 'code'
    },
    {
        Label: () => 'Nombre',
        Component: ImageAndName
    },
    {
        Label: () => 'Categoría',
        Component: ({ value }) => `${value?.category ? value?.category?.name : '--'}`
    }
];

export default ShortProductsColumns;