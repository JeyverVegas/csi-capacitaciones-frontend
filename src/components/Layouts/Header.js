import React, { useEffect, useState } from "react";

import { Link, useLocation, useSearchParams } from "react-router-dom";
import Toggle from "react-toggle";
import { useTheme } from "../../context/ThemeContext";

import NotificationsComponent from "../Notifications/NotificationsComponent";
import UserAccountInfo from "../UserAccountInfo";

import sun from "../../images/sun.png";
import moon from "../../images/moon.png";

const Header = ({ onNote }) => {

    const { changeBackground } = useTheme();

    const location = useLocation();

    const [searchParams] = useSearchParams();

    const [darkMode, setDarkMode] = useState(false);

    const [nameForUpdate, setNameForUpdate] = useState('');

    useEffect(() => {
        const dark = localStorage.getItem('CSI-PEDIDOS-DARKMODE') === 'true' ? true : false;
        setDarkMode(dark);
    }, []);

    useEffect(() => {
        setNameForUpdate(searchParams?.get('name'));
    }, [searchParams])

    useEffect(() => {
        if (darkMode) {
            changeBackground({ value: "dark", label: "dark" });
        } else {
            changeBackground({ value: "light", label: "light" });
        }

        localStorage.setItem('CSI-PEDIDOS-DARKMODE', darkMode);
    }, [darkMode]);

    return (
        <div className="header">
            <div className="header-content">
                <nav className="navbar navbar-expand">
                    <div className="collapse navbar-collapse justify-content-between">
                        <div className="header-left">
                            <div className="dashboard_bar" style={{ textTransform: "capitalize" }}>
                                {
                                    nameForUpdate ?
                                        `${location?.pathname?.split?.('/')?.filter?.((value) => { if (value) return value; })[0]} - ${nameForUpdate.length > 16 ? `${nameForUpdate.slice(0, 16)}...` : nameForUpdate}`
                                        :
                                        location?.pathname?.split?.('/')?.filter?.((value) => { if (value) return value; }).join(' - ')
                                }
                            </div>
                        </div>
                        <ul className="navbar-nav header-right main-notification" style={{ alignItems: "center" }}>
                            <li className="nav-item" style={{ margin: '0 10px' }}>
                                <div className="input-group search-area">
                                    <input type="text" className="form-control" placeholder="Search Here" />
                                    <span className="input-group-text"><Link to={"#"}><i className="flaticon-381-search-2"></i></Link></span>
                                </div>
                            </li>
                            <NotificationsComponent />
                            <div style={{ margin: '0 30px', display: 'flex', alignItems: 'center' }}>
                                {
                                    !darkMode ?
                                        <img style={{ maxWidth: '40px', marginRight: 10 }} src={sun} alt="" />
                                        :
                                        null
                                }
                                <Toggle onChange={() => { setDarkMode((oldDarkMode) => !oldDarkMode) }} checked={darkMode} />
                                {
                                    darkMode ?
                                        <img style={{ maxWidth: '40px', marginLeft: 10 }} src={moon} alt="" />
                                        :
                                        null
                                }
                            </div>
                            <UserAccountInfo />
                        </ul>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Header;
