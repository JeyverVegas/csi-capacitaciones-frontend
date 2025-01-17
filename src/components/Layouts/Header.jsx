import React, { useEffect, useState } from "react";

import { useLocation, useSearchParams } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

import NotificationsComponent from "../Notifications/NotificationsComponent";
import UserAccountInfo from "../UserAccountInfo";

import SystemInfo from "../../util/SystemInfo";

const Header = ({ onNote }) => {

    const { changeBackground, darkMode, setDarkMode } = useTheme();

    const location = useLocation();

    const [searchParams] = useSearchParams();

    const [nameForUpdate, setNameForUpdate] = useState('');

    useEffect(() => {
        const dark = localStorage.getItem(`${SystemInfo?.systemCode}-DARKMODE`) === 'true' ? true : false;
        setDarkMode(dark);
    }, []);

    useEffect(() => {
        if (nameForUpdate) {
            document.title = `${SystemInfo?.name} - ${nameForUpdate}`;
        } else {
            document.title = SystemInfo?.name;
        }
    }, [nameForUpdate])

    useEffect(() => {
        setNameForUpdate(searchParams?.get('name'));
    }, [searchParams])

    useEffect(() => {
        if (darkMode) {
            changeBackground({ value: "dark", label: "dark" });
        } else {
            changeBackground({ value: "light", label: "light" });
        }

        localStorage.setItem(`${SystemInfo?.systemCode}-DARKMODE`, darkMode);
    }, [darkMode]);

    return (
        <div className="header" style={{ paddingLeft: 0, background: darkMode ? '#171622' : '' }}>
            <div className="header-content">
                <nav className="navbar navbar-expand">
                    <div className="collapse navbar-collapse justify-content-between">
                        <div className="header-left">
                            <div className="dashboard_bar" style={{ textTransform: "capitalize" }}>
                                {
                                    nameForUpdate ?
                                        `${nameForUpdate}`
                                        :
                                        location?.pathname?.split?.('/')[location?.pathname?.split('/').length - 1]
                                }
                            </div>
                        </div>
                        <ul className="navbar-nav header-right main-notification" style={{ alignItems: "center" }}>
                            <NotificationsComponent />
                            {/* <div style={{ margin: '0 30px', display: 'flex', alignItems: 'center' }}>
                                {
                                    !darkMode ?
                                        <img className="d-none d-sm-block" style={{ maxWidth: '40px', marginRight: 10 }} src={sun} alt="" />
                                        :
                                        null
                                }
                                <Toggle onChange={() => { setDarkMode((oldDarkMode) => !oldDarkMode) }} checked={darkMode} />
                                {
                                    darkMode ?
                                        <img className="d-none d-sm-block" style={{ maxWidth: '40px', marginLeft: 10 }} src={moon} alt="" />
                                        :
                                        null
                                }
                            </div> */}
                            <UserAccountInfo />
                        </ul>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Header;
