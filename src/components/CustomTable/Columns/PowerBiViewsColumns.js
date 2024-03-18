import ActionDropdown from "../../ActionDropdown";
import TableCheck from "../TableCheck";
import { cutString, dateFine } from "../../../util/Utilities";
import DateFormatter from "../../DateFormatter";
import clsx from "clsx";
import UserHavePermission from "../../../util/UserHavePermission";
import SystemInfo from "../../../util/SystemInfo";

const PowerBiViewsColumns = [
    {
        Label: TableCheck,
        Component: TableCheck

    },
    {
        Label: () => 'id',
        accessor: 'id'
    },
    {
        Label: () => 'Usuario',
        Component: ({ value }) => value?.user?.name || '--'
    },
    {
        Label: () => 'Power Bi',
        Component: ({ value }) => value?.powerbi?.title || '--'
    },
    {
        Label: () => 'Ultima Visita',
        Component: ({ value }) => value?.createdAt || '--'
    },
    {
        Label: () => 'Acciones',
        Component: (props) => <ActionDropdown
            {...props}
            withOutUpdate
            showDelete={UserHavePermission(`${SystemInfo?.systemCode}-delete-${props?.entity}`)}
        />
    }
];

export default PowerBiViewsColumns;