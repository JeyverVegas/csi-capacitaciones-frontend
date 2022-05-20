import React, { Fragment, useState } from "react";
/// React router dom
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import SystemInfo from "../../util/SystemInfo";


const NavHeader = () => {
    const { navigationHader, openMenuToggle, menuToggle, background } = useTheme();

    return (
        <div className="nav-header" style={{ zIndex: 4 }}>
            <Link to="/dashboard" className="brand-logo">
                {background.value === "dark" || navigationHader !== "color_1" ?
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
