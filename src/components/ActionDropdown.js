import { Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { mainPermissions } from "../util/MenuLinks";
import SystemInfo from "../util/SystemInfo";
import UserHavePermission from "../util/UserHavePermission";
import { BsThreeDots } from "react-icons/bs";
import { useTheme } from "../context/ThemeContext";


const ActionDropdown = ({
    updateOptionString = 'Actualizar',
    id,
    updatePath,
    onDelete,
    withOutUpdate,
    roleDisplayText,
    value,
    entity,
    style,
    showDelete = true
}) => {

    const { darkMode } = useTheme();

    const { permissions } = useAuth();

    let navigate = useNavigate();

    const handleDelete = () => {
        onDelete?.();
    }

    const handleUpdate = () => {
        navigate(`${updatePath}/${id}?name=${roleDisplayText || value?.name || ''}`);
    }

    return (
        <Dropdown className="dropdown ms-auto text-right" style={{
            ...style,
        }}>
            <Dropdown.Toggle
                variant=""
                className="btn-link i-false"
                data-toggle="dropdown"
            >
                <BsThreeDots style={{ color: darkMode ? 'white' : '', fontSize: 20 }} />
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                {
                    showDelete &&
                    <Dropdown.Item onClick={handleDelete}>Eliminar</Dropdown.Item>
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