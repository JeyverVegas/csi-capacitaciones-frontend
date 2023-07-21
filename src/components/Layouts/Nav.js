import React, { Fragment, useState } from "react";
import SideBar from "./SideBar";
import Header from "./Header";
import NavHeader from "./NavHeader";
import { useTheme } from "../../context/ThemeContext";
import HorizontalBar from "./HorizontalBar";

const Nav = ({ title, onClick: ClickToAddEvent, onClick2, onClick3 }) => {
    const [toggle, setToggle] = useState("");

    const { sidebarLayout } = useTheme();

    const onClick = (name) => setToggle(toggle === name ? "" : name);

    return (
        <>
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
            {
                sidebarLayout === 'vertical' &&
                <SideBar />
            }

            {
                sidebarLayout === 'horizontal' &&
                <HorizontalBar />
            }

        </>
    );
};

export default Nav;
