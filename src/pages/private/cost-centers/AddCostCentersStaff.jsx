import { useEffect, useState } from "react";
import usePaginatedResourceWithAppend from "../../../hooks/usePaginatedResourceWithAppend";
import UpdateYearCostCenterStaffComponent from "../../../components/CostCenter/UpdateYearCostCenterStaffComponent";
import useCostCenters from "../../../hooks/useCostCenters";

const AddCostCentersStaff = () => {

    const [filters, setFilters] = useState({
        name: '',
        code: '',
        page: 1
    })

    const [{ costCenters, total, numberOfPages, size, error, loading }, getCostCenters] = useCostCenters({ params: { ...filters }, options: { useCache: false } });

    const [currentCostCenters, setCurrentCostCenters] = useState([]);

    useEffect(() => {
        setCurrentCostCenters((old) => {
            return [...old, ...costCenters];
        })
    }, [costCenters])

    const handleChange = (e) => {
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                [e.target.name]: e.target.value,
                page: 1
            }
        });
        setCurrentCostCenters([]);
    }

    return (
        <div>
            <div className="card p-4">
                <div className="row">
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={filters?.name}
                            onChange={handleChange}
                            placeholder="Nombre"
                        />
                    </div>
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            name="code"
                            value={filters?.code}
                            onChange={handleChange}
                            placeholder="Codigo"
                        />
                    </div>
                </div>
                <br />
                <br />
                <ul className="custom-scrollbar scrollbar-primary px-2" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {
                        currentCostCenters?.length === 0 && !loading ?
                            <li className="text-center">
                                No se encontrarón resultados.
                            </li>
                            :
                            null
                    }
                    {
                        currentCostCenters?.map((costCenter, i) => {
                            return (
                                <UpdateYearCostCenterStaffComponent
                                    key={i}
                                    costCenter={costCenter}
                                />
                            )
                        })
                    }
                    {
                        loading &&
                        <li>
                            <div className="spinner">
                                <div className="double-bounce1 bg-primary"></div>
                                <div className="double-bounce2 bg-primary"></div>
                            </div>
                        </li>
                    }

                    {
                        filters?.page < numberOfPages && !loading ?
                            <li className="text-center">
                                <button
                                    onClick={() => setFilters(oldFilters => ({ ...oldFilters, page: oldFilters?.page + 1 }))}
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

export default AddCostCentersStaff;