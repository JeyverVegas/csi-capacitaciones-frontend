/// Menu
import Metismenu from "metismenujs";
import { Component, useEffect, useState } from "react";

/// Scroll
import PerfectScrollbar from "react-perfect-scrollbar";

/// Link
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import MenuLinks from "../../util/MenuLinks";
import SystemInfo from "../../util/SystemInfo";
import UserHavePermission from "../../util/UserHavePermission";

class MM extends Component {
    componentDidMount() {
        this.$el = this.el;
        this.mm = new Metismenu(this.$el);
    }
    componentWillUnmount() {
    }
    render() {
        return (
            <div className="mm-wrapper">
                <ul className="metismenu" ref={(el) => (this.el = el)}>
                    {this.props.children}
                </ul>
            </div>
        );
    }
}

const SideBar = () => {

    const location = useLocation();

    const { iconHover } = useTheme();

    const [path, setPath] = useState('');

    useEffect(() => {
        var btn = document.querySelector(".nav-control");
        var aaa = document.querySelector("#main-wrapper");
        function toggleFunc() {
            return aaa.classList.toggle("menu-toggle");
        }
        btn.addEventListener("click", toggleFunc);

        //sidebar icon Heart blast
        var handleheartBlast = document.querySelector('.heart');
        function heartBlast() {
            return handleheartBlast.classList.toggle("heart-blast");
        }
        handleheartBlast.addEventListener('click', heartBlast);

    }, []);

    useEffect(() => {
        setPath(location?.pathname)
    }, [location?.pathname]);


    return (
        <div
            className={`deznav ${iconHover}`}
        >
            <PerfectScrollbar className="deznav-scroll">
                <MM className="metismenu" id="menu">
                    {MenuLinks?.map(({ Icon, ...menuLink }, i) => {
                        return (
                            UserHavePermission(MenuLinks?.permissions) && !menuLink.hidden ?
                                <li className={`${path.includes(menuLink?.path) && !menuLink?.children ? "mm-active" : ""}`} key={i}>
                                    <Link to={menuLink?.children?.length > 0 ? '#' : menuLink?.path} className={`${menuLink?.children?.length > 0 ? 'has-arrow' : ''} ai-icon`}>
                                        {
                                            Icon &&
                                            <Icon className="link-icon" style={{ color: path.includes(menuLink?.path) && !menuLink?.children ? 'white' : null, minHeight: '25px', minWidth: '25px' }} />
                                        }
                                        <span className="nav-text">{menuLink?.title}</span>
                                    </Link>
                                    {
                                        menuLink?.children?.length > 0 ?
                                            <ul>
                                                {
                                                    menuLink?.children?.map?.((childrenMenu, i2) => {
                                                        return (
                                                            UserHavePermission(menuLink?.permissions) && !childrenMenu.hidden ?
                                                                <li key={`${i}-${i2}`}>
                                                                    <Link className={`${path === childrenMenu?.path ? "mm-active" : ""}`} to={childrenMenu?.path}>
                                                                        {childrenMenu?.title}
                                                                    </Link>
                                                                </li>
                                                                :
                                                                null
                                                        )
                                                    })
                                                }
                                            </ul>
                                            :
                                            null
                                    }
                                </li>
                                :
                                null
                        )
                    })}
                </MM>
                <div className="copyright">
                    <p><strong>CSI CA</strong> © Sistema {SystemInfo.name} 2023</p>
                    <p className="fs-12"><span className="heart"></span></p>
                </div>
            </PerfectScrollbar>
        </div >
    );
};

export default SideBar;
