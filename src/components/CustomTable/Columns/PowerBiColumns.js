import ActionDropdown from "../../ActionDropdown";
import TableCheck from "../TableCheck";
import { cutString, dateFine } from "../../../util/Utilities";
import DateFormatter from "../../DateFormatter";
import clsx from "clsx";
import UserHavePermission from "../../../util/UserHavePermission";
import SystemInfo from "../../../util/SystemInfo";

const PowerBiColumns = [
    {
        Label: TableCheck,
        Component: TableCheck

    },
    {
        Label: () => 'id',
        accessor: 'id'
    },
    {
        Label: () => 'Imagen',
        Component: ({ value }) => <img src={value?.imagePath} style={{ width: 200, maxHeight: 150, borderRadius: 10 }} />
    },
    {
        Label: () => 'Titulo',
        Component: ({ value }) => value?.title || '--'
    },
    {
        Label: () => 'Zona',
        Component: ({ value }) => value?.zone?.name || '--'
    },
    {
        Label: () => 'URL',
        Component: ({ value }) => value?.url ? <a href={value?.url} target="_blank" title={value?.url}>{cutString(value?.url, 50, null, '...')}</a> : '--'
    },
    {
        Label: () => 'Usuarios',
        Component: ({ value }) => value?.userIds?.length || '--'
    },
    {
        Label: () => 'Estado',
        Component: ({ value }) => <p className={`btn btn-xs btn-${value?.status?.variantColor}`}>{value?.status?.name || '--'}</p>
    },
    {
        Label: () => 'Fecha de Creación',
        Component: ({ value }) => <DateFormatter value={dateFine(value?.createdAt)} dateFormat="dd/MM/yyyy hh:mm:ss" />
    },
    {
        Label: () => 'Acciones',
        Component: (props) => <ActionDropdown
            {...props}
            showDelete={UserHavePermission(`${SystemInfo?.systemCode}-delete-${props?.entity}`)}
        />
    }
];

export default PowerBiColumns;