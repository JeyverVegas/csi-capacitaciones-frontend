import { Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SystemInfo from "../util/SystemInfo";
import profile from '../images/profile.png';

const UserAccountInfo = () => {

    const navigate = useNavigate();

    const { user, setAuthInfo } = useAuth();

    const handleLogOut = () => {
        setAuthInfo?.(false);
        navigate('/iniciar-sesion', { replace: true });
    }

    return (
        <Dropdown as="li" className="nav-item dropdown header-profile">
            <Dropdown.Toggle variant="" as="a" className="nav-link i-false c-pointer">
                <img src={user?.imagePath !== '/storage/' ? `${SystemInfo?.host}${user?.imagePath}` : profile} width={20} alt="profile-image" />
                <div className="header-info ms-3">
                    <span>{user?.name}</span>
                    <small>{user?.role?.name}</small>
                </div>
            </Dropdown.Toggle>
            <Dropdown.Menu align="right" className="mt-3 dropdown-menu dropdown-menu-end">
                <Link to="/my-account" className="dropdown-item ai-icon">
                    <svg
                        id="icon-user1" xmlns="http://www.w3.org/2000/svg" className="text-primary"
                        width={18} height={18} viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                    >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx={12} cy={7} r={4} />
                    </svg>
                    <span className="ms-2">Profile</span>
                </Link>
                <button onClick={handleLogOut} className="dropdown-item ai-icon">
                    <svg
                        id="icon-logout" xmlns="http://www.w3.org/2000/svg"
                        className="text-danger" width={18} height={18} viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                    >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1={21} y1={12} x2={9} y2={12} />
                    </svg>
                    <span className="ms-2">Cerrar Sesión</span>
                </button>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default UserAccountInfo;