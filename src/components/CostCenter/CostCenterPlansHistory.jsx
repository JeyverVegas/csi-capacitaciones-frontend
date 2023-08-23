import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { AiFillFileExcel, AiFillFilePdf, AiOutlineMinus, AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import clsx from "clsx";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import PlanLiComponent from "../Plans/PlanLiComponent";


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
            <ul className="custom-scrollbar scrollbar-primary px-2">
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
                            <PlanLiComponent
                                key={i}
                                plan={plan}
                                planDetailPath={`/centros-de-costos/plans/${plan?.id}`}
                            />
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