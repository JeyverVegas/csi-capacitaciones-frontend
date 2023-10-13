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
        Label: () => 'Titulo',
        Component: ({ value }) => value?.title || '--'
    },
    {
        Label: () => 'URL',
        Component: ({ value }) => value?.url ? <a href={value?.url} target="_blank" title={value?.url}>{cutString(value?.url, 50, null, '...')}</a> : '--'
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