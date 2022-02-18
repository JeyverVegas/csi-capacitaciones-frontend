import React, { Fragment, useState } from "react";
/// React router dom
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import SystemInfo from "../../util/SystemInfo";


const NavHeader = () => {
    const [toggle, setToggle] = useState(false);
    const { navigationHader, openMenuToggle, background } = useTheme();

    return (
        <div className="nav-header">
            <Link to="/dashboard" className="brand-logo">
                {background.value === "dark" || navigationHader !== "color_1" ? (
                    <Fragment>
                        <img src={SystemInfo?.logoBlanco} style={{ maxWidth: '60%' }} alt="" />
                    </Fragment>
                ) : (
                    <Fragment>
                        <img src={SystemInfo?.logo} style={{ maxWidth: '60%' }} alt="" />
                    </Fragment>
                )}
            </Link>

            <div
                className="nav-control"
                onClick={() => {
                    setToggle(!toggle);
                    openMenuToggle();
                }}
            >
                <div className={`hamburger ${toggle ? "is-active" : ""}`}>
                    <span className="line"></span>
                    <span className="line"></span>
                    <span className="line"></span>
                </div>
            </div>
        </div>
    );
};

export default NavHeader;
