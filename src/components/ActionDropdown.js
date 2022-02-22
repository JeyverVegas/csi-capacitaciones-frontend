import { Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const ActionDropdown = ({ id, updatePath, onDelete, withOutUpdate, nameValue }) => {

    let navigate = useNavigate();

    const handleDelete = () => {
        onDelete?.();
    }

    const handleUpdate = () => {
        navigate(`${updatePath}/${id}?name=${nameValue}`);
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
                <Dropdown.Item onClick={handleDelete}>Eliminar</Dropdown.Item>
                {
                    !withOutUpdate ?
                        <Dropdown.Item onClick={handleUpdate}>
                            Actualizar
                        </Dropdown.Item>
                        :
                        null
                }
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default ActionDropdown;