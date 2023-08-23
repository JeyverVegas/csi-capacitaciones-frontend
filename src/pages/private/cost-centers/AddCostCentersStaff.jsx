import { useState } from "react";
import usePaginatedResourceWithAppend from "../../../hooks/usePaginatedResourceWithAppend";
import UpdateYearCostCenterStaffComponent from "../../../components/CostCenter/UpdateYearCostCenterStaffComponent";

const AddCostCentersStaff = () => {

    const { loadMore, results: costCenters, loading: loadingCostCenters, canLoadMore, reset, filters, setFilters } = usePaginatedResourceWithAppend(`/cost-centers`, {
        params: {
            name: ''
        }
    });

    return (
        <div>
            <div className="card p-4">
                <input
                    type="text"
                    className="form-control"
                    value={filters?.name}
                    onChange={(e) => setFilters((old) => {
                        return {
                            ...old,
                            name: e.target.value
                        }
                    })}
                    placeholder="Buscar por nombre"
                />
                <br />
                <br />
                <ul className="custom-scrollbar scrollbar-primary px-2" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {
                        costCenters?.length === 0 && !loadingCostCenters ?
                            <li className="text-center">
                                No se encontrarón resultados.
                            </li>
                            :
                            null
                    }
                    {
                        costCenters?.map((costCenter, i) => {
                            return (
                                <UpdateYearCostCenterStaffComponent
                                    key={i}
                                    costCenter={costCenter}
                                />
                            )
                        })
                    }
                    {
                        loadingCostCenters &&
                        <li>
                            <div className="spinner">
                                <div className="double-bounce1 bg-primary"></div>
                                <div className="double-bounce2 bg-primary"></div>
                            </div>
                        </li>
                    }

                    {
                        canLoadMore && !loadingCostCenters ?
                            <li className="text-center">
                                <button
                                    onClick={(e) => loadMore()}
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