import React, { useEffect, useState } from "react";

import { Link, useLocation } from "react-router-dom";

import NotificationsComponent from "../Notifications/NotificationsComponent";
import UserAccountInfo from "../UserAccountInfo";

const Header = ({ onNote }) => {

    const location = useLocation();

    return (
        <div className="header">
            <div className="header-content">
                <nav className="navbar navbar-expand">
                    <div className="collapse navbar-collapse justify-content-between">
                        <div className="header-left">
                            <div className="dashboard_bar" style={{ textTransform: "capitalize" }}>
                                {location?.pathname?.split?.('/')?.filter?.((value) => { if (value) return value; }).join(' - ')}
                            </div>
                        </div>
                        <ul className="navbar-nav header-right main-notification">
                            <li className="nav-item">
                                <div className="input-group search-area">
                                    <input type="text" className="form-control" placeholder="Search Here" />
                                    <span className="input-group-text"><Link to={"#"}><i className="flaticon-381-search-2"></i></Link></span>
                                </div>
                            </li>
                            <NotificationsComponent />
                            <UserAccountInfo />
                        </ul>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Header;
