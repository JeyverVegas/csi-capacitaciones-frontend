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
    },
    {
        Label: () => 'Sub Categoría',
        Component: ({ value }) => `${value?.subCategory ? value?.subCategory?.name : '--'}`
    }
];

export default ShortProductsColumns;