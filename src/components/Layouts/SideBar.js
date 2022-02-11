/// Menu
import Metismenu from "metismenujs";
import { Component, useEffect, useState } from "react";

/// Scroll
import PerfectScrollbar from "react-perfect-scrollbar";

/// Link
import { Link, useLocation } from "react-router-dom";
import useScrollPosition from "use-scroll-position";
import { useTheme } from "../../context/ThemeContext";

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

    const { pathname } = useLocation();

    const { iconHover, sidebarposition, headerposition, sidebarLayout } = useTheme();

    const scrollPosition = useScrollPosition();

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
        setPath(pathname)
    }, [pathname]);


    return (
        <div
            className={`deznav ${iconHover} ${sidebarposition.value === "fixed" &&
                sidebarLayout.value === "horizontal" &&
                headerposition.value === "static"
                ? scrollPosition > 120
                    ? "fixed"
                    : ""
                : ""
                }`}
        >
            <PerfectScrollbar className="deznav-scroll">
                <MM className="metismenu" id="menu">
                    <li className={`${path.includes('/dashboard') ? "mm-active" : ""}`}>
                        <Link to="/dashboard" className="ai-icon" >
                            <i className="flaticon-025-dashboard"></i>
                            <span className="nav-text">Dashboard</span>
                        </Link>
                    </li>
                    <li className={`${path.includes('/cargos') ? "mm-active" : ""}`}>
                        <Link className="has-arrow ai-icon" to="/#">
                            <i className="flaticon-038-gauge"></i>
                            <span className="nav-text">Cargos</span>
                        </Link>
                        <ul>
                            <li>
                                <Link className={`${path === "cargos" ? "mm-active" : ""}`} to="/cargos">
                                    Listar cargos
                                </Link>
                            </li>
                            <li>
                                <Link className={`${path.includes('/cargos/crear') ? "mm-active" : ""}`} to="/cargos/crear">
                                    Crear Cargo
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <Link className="has-arrow ai-icon" to="/#">
                            <i className="flaticon-052-inside"></i>
                            <span className="nav-text">Servicios</span>
                        </Link>
                        <ul>
                            <li>
                                <Link className={`${path === "servicios" ? "mm-active" : ""}`} to="/servicios">
                                    Listar servicios
                                </Link>
                            </li>
                            <li>
                                <Link className={`${path.includes('/servicios/crear') ? "mm-active" : ""}`} to="/servicios/crear">
                                    Crear Servicios
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <Link className="has-arrow ai-icon" to="/#">
                            <i className="flaticon-381-user-9"></i>
                            <span className="nav-text">Usuarios</span>
                        </Link>
                        <ul>
                            <li>
                                <Link className={`${path === "/usuarios" ? "mm-active" : ""}`} to="/usuarios">
                                    Listar usuarios
                                </Link>
                            </li>
                            <li>
                                <Link className={`${path.includes('/usuarios/crear') ? "mm-active" : ""}`} to="/usuarios/crear">
                                    Crear Usuario
                                </Link>
                            </li>
                        </ul>
                    </li>
                </MM>
                <div className="copyright">
                    <p><strong>CSI PEDIDOS</strong> © 2022 All Rights Reserved</p>
                    <p className="fs-12">Realizado con <span className="heart"></span> por J.V. & A.N.</p>
                </div>
            </PerfectScrollbar>
        </div>
    );
};

export default SideBar;
