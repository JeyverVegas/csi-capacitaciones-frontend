import ActionDropdown from "../../ActionDropdown";
import TableCheck from "../TableCheck";
import { dateFine } from "../../../util/Utilities";
import DateFormatter from "../../DateFormatter";
import { Image } from "react-bootstrap";
import profileImg from "../../../assets/images/profile.png";

const ActivityLogsColumns = [
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
        Component: ({ value }) => <div>
            <Image style={{ height: 35, width: 35, marginRight: 10 }} src={value?.user?.imagePath || profileImg} roundedCircle /> {value?.user?.name}
        </div>
    },
    {
        Label: () => 'Tabla',
        Component: ({ value }) => value?.table || '--'
    },
    {
        Label: () => 'Acción',
        accessor: 'action'
    },
    {
        Label: () => 'Descripción',
        Component: ({ value }) =>  value?.description ? <p className="m-0" style={{fontSize: 12, maxWidth: '30vw'}}>
            {value?.description}
            </p> : '--'
    },
    {
        Label: () => 'Fecha de Creación',
        Component: ({ value }) => <DateFormatter value={dateFine(value?.createdAt)} dateFormat="dd/MM/yyyy hh:mm:ss" />
    }
];

export default ActivityLogsColumns;