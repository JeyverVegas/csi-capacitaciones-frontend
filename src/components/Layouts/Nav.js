import React, { Fragment, useState } from "react";
import SideBar from "./SideBar";
import Header from "./Header";
import NavHeader from "./NavHeader";

const Nav = ({ title, onClick: ClickToAddEvent, onClick2, onClick3 }) => {
    const [toggle, setToggle] = useState("");
    const onClick = (name) => setToggle(toggle === name ? "" : name);
    return (
        <Fragment>
            <NavHeader />
            <Header
                onNote={() => onClick("chatbox")}
                onNotification={() => onClick("notification")}
                onProfile={() => onClick("profile")}
                toggle={toggle}
                title={title}
                onBox={() => onClick("box")}
                onClick={() => ClickToAddEvent()}
            />
            <SideBar />
        </Fragment>
    );
};

export default Nav;
