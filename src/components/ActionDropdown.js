import { Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { mainPermissions } from "../util/MenuLinks";
import SystemInfo from "../util/SystemInfo";
import UserHavePermission from "../util/UserHavePermission";

const ActionDropdown = ({
    updateOptionString = 'Actualizar',
    id,
    updatePath,
    onDelete,
    withOutUpdate,
    roleDisplayText,
    value,
    entity
}) => {

    const { permissions } = useAuth();

    console.log(permissions);

    let navigate = useNavigate();

    const handleDelete = () => {
        onDelete?.();
    }

    const handleUpdate = () => {
        navigate(`${updatePath}/${id}?name=${roleDisplayText || value?.name || ''}`);
    }

    return (
        <Dropdown className="dropdown ms-auto text-right">
            <Dropdown.Toggle
                variant=""
                className="btn-link i-false"
                data-toggle="dropdown"
            >
                <svg
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    version="1.1"
                >
                    <g
                        stroke="none"
                        strokeWidth={1}
                        fill="none"
                        fillRule="evenodd"
                    >
                        <rect x={0} y={0} width={24} height={24} />
                        <circle fill="#000000" cx={5} cy={12} r={2} />
                        <circle fill="#000000" cx={12} cy={12} r={2} />
                        <circle fill="#000000" cx={19} cy={12} r={2} />
                    </g>
                </svg>
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                {
                    UserHavePermission(`${SystemInfo?.systemCode}-delete-${entity}`) || true ?
                        <Dropdown.Item onClick={handleDelete}>Eliminar</Dropdown.Item>
                        :
                        null
                }
                {
                    !withOutUpdate ?
                        <Dropdown.Item onClick={handleUpdate}>
                            {updateOptionString}
                        </Dropdown.Item>
                        :
                        null
                }
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default ActionDropdown;