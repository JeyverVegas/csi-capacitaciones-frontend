import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { Link } from "react-router-dom";
import { BsPencilSquare, BsEyeFill, BsFillArrowRightCircleFill } from "react-icons/bs";
import { Button, Dropdown } from "react-bootstrap";
import PlanningProcessHistoryLi from "../../components/PlanningProcessHistoryLi";


const Dashboard = () => {

    const [{ data: responseData, loading: costCentersLoading }, getCostCenters] = useAxios({ url: `my-account/cost-centers` }, { useCache: false });

    const [{ data: planningProcessResponse, loading: planningProcessLoading }, getPlanningProcess] = useAxios({ url: `/my-account/planning-processes` }, { useCache: false });

    const [currentCostCenters, setCurrentCostCenters] = useState([]);

    useEffect(() => {
        if (responseData) {
            setCurrentCostCenters(responseData?.data);
        }
    }, [responseData]);

    return (
        <div>
            <div className="row">
                <div className="col-md-6">
                    <div className="card p-4">
                        {
                            !costCentersLoading ?
                                <div>
                                    <h3 className="my-3">Tus centros de costos</h3>
                                    <div className="row">
                                        {
                                            currentCostCenters.length == 0 ?
                                                <div className="col-md-12 text-center">
                                                    <h3>No se encontrarón centros de costo</h3>
                                                </div>
                                                :
                                                null
                                        }
                                        {
                                            currentCostCenters?.map((costCenter, i) => {
                                                return (
                                                    <div className="col-md-4" key={i}>
                                                        <div className="p-4">
                                                            <div>
                                                                <h5 className="text-center">
                                                                    {costCenter?.name}
                                                                </h5>
                                                                <br />
                                                                <div>
                                                                    <div className="d-flex align-items-center">
                                                                        <Link to={`/gestionar-centro-de-costo/${costCenter?.id}`} className="btn btn-block btn-primary">
                                                                            Gestionar
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                :
                                null
                        }
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card p-4">
                        <h3 className="my-3">
                            Historial de planificaciones donde has participado:
                        </h3>
                        <ul>
                            {
                                planningProcessResponse?.map((planningProcess, i) => {
                                    return (
                                        <PlanningProcessHistoryLi
                                            key={i}
                                            planningProcess={planningProcess}
                                        />
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;