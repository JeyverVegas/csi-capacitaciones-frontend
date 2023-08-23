import React, { Fragment, useState } from "react";
/// React router dom
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import SystemInfo from "../../util/SystemInfo";


const NavHeader = () => {
    const { navigationHader, openMenuToggle, menuToggle, background, darkMode } = useTheme();

    return (
        <div className="nav-header" style={{ zIndex: 4, background: darkMode ? '#171622' : '' }}>
            <Link to="/dashboard" className="brand-logo">
                {darkMode ?
                    <img src={SystemInfo?.logoBlanco} style={{ maxWidth: '60%' }} alt="" />
                    :
                    <img src={SystemInfo?.logo} style={{ maxWidth: '60%' }} alt="" />
                }
            </Link>

            <div
                className="nav-control"
                onClick={() => {
                    openMenuToggle();
                }}
            >
                <div className={`hamburger ${menuToggle ? "is-active" : ""}`}>
                    <span className="line"></span>
                    <span className="line"></span>
                    <span className="line"></span>
                </div>
            </div>
        </div>
    );
};

export default NavHeader;
