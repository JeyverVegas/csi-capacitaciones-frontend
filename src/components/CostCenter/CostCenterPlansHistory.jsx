import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { AiFillFileExcel, AiFillFilePdf, AiOutlineMinus, AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import clsx from "clsx";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";


const CostCenterPlansHistory = ({ costCenterId }) => {

    const [filters, setFilters] = useState({
        perPage: 10,
        page: 1
    });

    const [currentPlans, setCurrentPlans] = useState([]);

    const [{ data: plansResponse, loading: plansLoading }, getPlans] = useAxios({ url: `cost-centers/${costCenterId}/plans`, params: filters }, { useCache: false });



    useEffect(() => {
        if (plansResponse) {
            setCurrentPlans((oldPlans) => {
                return [...oldPlans, ...plansResponse?.data]
            });
        }
    }, [plansResponse]);

    const handleRefresh = () => {
        setCurrentPlans([]);
        setFilters({
            perPage: 10,
            page: 1
        });

        getPlans();
    }

    return (
        <div className="card p-4">
            <div className="text-end">
                <button onClick={handleRefresh} className="btn btn-primary btn-xs">
                    Refrescar
                </button>
            </div>
            <h3>
                Historial de planes
            </h3>
            <ul className="custom-scrollbar scrollbar-primary px-2" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {
                    currentPlans?.length === 0 && !plansLoading ?
                        <li className="text-center">
                            No se encontrarón resultados.
                        </li>
                        :
                        null
                }
                {
                    currentPlans?.map((plan, i) => {
                        return (
                            <li key={i} className="py-3 d-flex justify-content-between align-items-center" style={{ borderBottom: '1px solid' }}>
                                <div>
                                    <small className="text-primary">
                                        Año:
                                    </small>
                                    <br />
                                    <p className="m-0">{plan?.planningProcess?.forYear}</p>
                                </div>
                                <div>
                                    <small className="text-success">
                                        <AiOutlineArrowUp />
                                        Ingresos:
                                    </small>
                                    <br />
                                    <p className="m-0">{plan?.totalIncome}$</p>
                                </div>
                                <div>
                                    <small className="text-danger">
                                        <AiOutlineArrowDown />
                                        Gastos:
                                    </small>
                                    <br />
                                    <p className="m-0">{plan?.totalSpent}$</p>
                                </div>
                                <div>
                                    <small className={clsx({
                                        "text-warning": plan?.total === 0,
                                        "text-danger": plan?.total < 0,
                                        "text-success": plan?.total > 0
                                    })}>
                                        {
                                            plan?.total === 0 &&
                                            <AiOutlineMinus />
                                        }
                                        {
                                            plan?.total < 0 &&
                                            <AiOutlineArrowDown />
                                        }
                                        {
                                            plan?.total > 0 &&
                                            <AiOutlineArrowUp />
                                        }
                                        Total:
                                    </small>
                                    <br />
                                    <p className="m-0">{plan?.total}$</p>
                                </div>
                                <div className="d-flex align-items-center">
                                    <Link to={`/centros-de-costos/plans/${plan?.id}`} className="btn btn-primary btn-xs">
                                        Detalles
                                    </Link>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="warning" style={{ padding: 6 }} size="sm" id="dropdown-basic">
                                            Exportar
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item as="button" className="text-success">
                                                <AiFillFileExcel style={{ fontSize: 15 }} />
                                                Excel
                                            </Dropdown.Item>
                                            <Dropdown.Item as="button" className="text-danger">
                                                <AiFillFilePdf style={{ fontSize: 15 }} />
                                                Pdf
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </li>
                        )
                    })
                }
                {
                    plansLoading &&
                    <li>
                        <div className="spinner my-5">
                            <div className="double-bounce1 bg-primary"></div>
                            <div className="double-bounce2 bg-primary"></div>
                        </div>
                    </li>
                }
                {
                    plansResponse?.meta?.last_page > filters?.page && !plansLoading ?
                        <li className="text-center">
                            <button
                                onClick={(e) => setFilters((oldFilters) => {
                                    return {
                                        ...oldFilters,
                                        page: oldFilters?.page + 1
                                    }
                                })}
                                type="button"
                                className="btn btn-primary btn-xs"
                            >
                                Cargar más
                            </button>
                        </li>
                        :
                        null

                }
            </ul>
        </div>
    )
}

export default CostCenterPlansHistory;