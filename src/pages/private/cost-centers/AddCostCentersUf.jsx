import { useEffect, useState } from "react";
import usePaginatedResourceWithAppend from "../../../hooks/usePaginatedResourceWithAppend";
import UpdateYearCostCenterPlanUfIcome from "../../../components/CostCenter/UpdateYearCostCenterPlanUfIcome";
import usePlans from "../../../hooks/usePlans";

const AddCostCentersUf = () => {

    const [filters, setFilters] = useState({
        planningProcessId: '',
        page: '',
        costCenterName: '',
        costCenterCode: ''
    });

    const [currentPlans, setCurrentPlans] = useState([]);

    const { loadMore, results: planningProcesses, loading: loadingplanningProcesses, canLoadMore, reset } = usePaginatedResourceWithAppend(`/planning-processes`);

    const [{ plans, total, numberOfPages, size, error, loading: loadingPlans }, getPlans] = usePlans({ params: { ...filters }, options: { useCache: false, manual: true } });

    useEffect(() => {
        if (plans) {
            setCurrentPlans((oldPlans) => {
                return [...oldPlans, ...plans];
            })
            console.log(plans)
        }
    }, [plans])

    useEffect(() => {
        if (filters?.planningProcessId) {
            getPlans();
        }
    }, [filters])

    const handleChange = (e) => {

        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                [e.target.name]: e.target.value,
                page: 1
            }
        });

        setCurrentPlans([]);
    }

    const handleLoadMore = () => {
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                page: oldFilters.page + 1
            }
        })
    }

    return (
        <div>
            <div className="card p-4">
                <h3>Cargar ingresos UF</h3>
                <div className="row">
                    <div className="col-md-12 mb-3">
                        <label htmlFor="">Seleccione el año de planificación</label>
                        <select
                            name="planningProcessId"
                            className="form-control"
                            value={filters?.planningProcessId}
                            onChange={(e) => {
                                if (!e.target.value) return alert('Debe seleccionar un año.');
                                setFilters((oldFilters) => {
                                    return {
                                        ...oldFilters,
                                        [e.target.name]: e.target.value,
                                        page: 1
                                    }
                                })
                            }}
                        >
                            <option value="">Seleccione una opcion</option>
                            {
                                planningProcesses?.map((planningProcess, i) => {
                                    return (
                                        <option value={planningProcess?.id} key={i}>
                                            {planningProcess?.forYear}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="">Nombre del centro de costo</label>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={filters?.costCenterName}
                            onChange={handleChange}
                            name="costCenterName"
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="">Codigo</label>
                        <input
                            type="text"
                            placeholder="Codigo"
                            value={filters?.costCenterCode}
                            onChange={handleChange}
                            name="costCenterCode"
                            className="form-control"
                        />
                    </div>
                </div>
                <ul className="custom-scrollbar scrollbar-primary px-2 mt-5" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {
                        currentPlans?.length === 0 && !loadingPlans && filters?.planningProcessId ?
                            <li className="text-center">
                                No se encontrarón resultados.
                            </li>
                            :
                            null
                    }
                    {
                        currentPlans?.map((plan, i) => {
                            return (
                                <UpdateYearCostCenterPlanUfIcome
                                    key={i}
                                    plan={plan}
                                />
                            )
                        })
                    }
                    {
                        loadingPlans &&
                        <li>
                            <div className="spinner">
                                <div className="double-bounce1 bg-primary"></div>
                                <div className="double-bounce2 bg-primary"></div>
                            </div>
                        </li>
                    }

                    {
                        filters?.page < numberOfPages && !loadingPlans && filters?.planningProcessId ?
                            <li className="text-center">
                                <button
                                    onClick={handleLoadMore}
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
        </div>
    )
}

export default AddCostCentersUf;