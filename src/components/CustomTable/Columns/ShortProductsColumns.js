import ImageAndName from "../../ImageAndName";
import TableCheck from "../TableCheck";

const ShortProductsColumns = [
    {
        Label: () => 'Seleccionar',
        Component: TableCheck
    },
    {
        Label: () => 'Codigo',
        accessor: 'code'
    },
    {
        Label: () => 'Nombre',
        Component: ImageAndName
    },
    {
        Label: () => 'Categoria',
        Component: ({ value }) => `${value?.category ? value?.category?.name : '--'}`
    }
];

export default ShortProductsColumns;