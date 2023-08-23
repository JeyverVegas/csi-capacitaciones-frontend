import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import MenuLinks from '../../util/MenuLinks';
import UserHavePermission from '../../util/UserHavePermission';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useTheme } from '../../context/ThemeContext';

const HorizontalBar = () => {

    const location = useLocation();

    const { darkMode } = useTheme();

    const navigate = useNavigate();

    const [path, setPath] = useState('');

    useEffect(() => {
        setPath(location?.pathname)
    }, [location?.pathname]);

    return (
        <Navbar expand="md" className="">
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    {MenuLinks?.map(({ Icon, ...menuLink }, i) => {
                        return (
                            UserHavePermission(menuLink?.permissions) && !menuLink.hidden && menuLink?.children?.length > 0 ?
                                <NavDropdown key={i} title={<>
                                    <button className={clsx(["btn"], {
                                        'btn-primary': path.includes(menuLink?.path),
                                        'text-white': darkMode
                                    })}>
                                        <Icon />
                                        {menuLink?.title}
                                    </button>
                                </>}
                                    id={`menu-link-${i}`}
                                >
                                    {
                                        menuLink?.children?.map?.((childrenMenu, i2) => {
                                            return (
                                                UserHavePermission(childrenMenu?.permissions) && !childrenMenu.hidden ?
                                                    <NavDropdown.Item
                                                        href={childrenMenu?.path}
                                                        key={`children-${i}-${i2}`}
                                                        className={clsx({
                                                            'text-primary': path.includes(childrenMenu?.path)
                                                        })}
                                                    >
                                                        {childrenMenu?.title}
                                                    </NavDropdown.Item>
                                                    :
                                                    null
                                            )
                                        })
                                    }
                                </NavDropdown>
                                :
                                UserHavePermission(menuLink?.permissions) && !menuLink.hidden ?
                                    <Nav.Link key={i} href={menuLink?.path}>
                                        <button className={clsx(["btn"], {
                                            'btn-primary': path.includes(menuLink?.path),
                                            'text-white': darkMode
                                        })}>
                                            <Icon />
                                            {menuLink?.title}
                                        </button>
                                    </Nav.Link>
                                    :
                                    null

                        )
                    })}
                </Nav>
            </Navbar.Collapse>
        </Navbar >
    )
}

export default HorizontalBar;