import useAxios from "../../hooks/useAxios";
import DateFormatter from "../DateFormatter";
import PlanStaffComponent from "./PlanStaffComponent";
import PlanUfComponent from "./PlanUfComponent";

const PlanTotalSummary = ({ month, pathForUfAccounts, pathForSummary }) => {

    const [{ data, loading: planSummaryLoading }, getSummary] = useAxios({ params: { month }, url: pathForSummary }, { useCache: false });



    return (
        <div className="row mb-5">
            <div className="col-md-4" style={{ borderRight: '1px solid' }}>
                <PlanStaffComponent
                    staff={data?.staff}
                    userCanUpdate={data?.staff?.userCanUpdate && month}
                />
            </div>
            <div className="col-md-4">
                <PlanUfComponent
                    pathForUfAccounts={pathForUfAccounts}
                    uf={data?.uf}
                    userCanUpdate={data?.uf?.userCanUpdate && month}
                    month={month}
                />
            </div>
            <div className="col-md-4" style={{ borderLeft: '1px solid' }}>
                <h4>
                    Resumen:
                </h4>

                <div className="form-group mb-3">
                    <label className="text-primary">
                        Ingresos:
                    </label>
                    <input type="text" value={data?.totals?.totalIncome} className="form-control" />
                </div>

                <div className="form-group mb-3">
                    <label className="text-primary">
                        Gastos:
                    </label>
                    <input type="text" value={data?.totals?.totalSpent} className="form-control" />
                </div>

                <div className="form-group mb-3">
                    <label className="text-primary">
                        Resultado:
                    </label>
                    <input type="text" value={data?.totals?.total} className="form-control" />
                </div>
            </div>
            <div className="col-md-12 text-center">
                <button className="btn btn-primary" onClick={() => getSummary()}>
                    Refrescar
                </button>
            </div>
        </div>
    )
}

export default PlanTotalSummary;