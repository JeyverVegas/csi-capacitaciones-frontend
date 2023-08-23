import { useParams } from "react-router-dom"
import useAxios from "../../../hooks/useAxios";
import usePaginatedResourceWithAppend from "../../../hooks/usePaginatedResourceWithAppend";
import ColumnChart from "../../../components/Charts/ColumnChart";
import PlanLiComponent from "../../../components/Plans/PlanLiComponent";

const CostCenterManagement = () => {

    const { id } = useParams();

    const [{ data: costCenter, loading: costCenterLoading }, getCostCenter] = useAxios({ url: `/my-account/cost-centers/${id}` }, { useCache: false });

    const { loadMore, results: plans, loading: loadingPlans, canLoadMore, reset } = usePaginatedResourceWithAppend(`/my-account/cost-centers/${id}/plans`);

    const [{ data: accountClassificationsAmount, loading: loadingAccountClassificationsAmount }, getAccountClassificationsAmount] = useAxios({ url: `/my-account/cost-centers/${id}/total-by-account-classifications` }, { useCache: false });

    return (
        <div>

            <div className="row">
                <div className="col-md-12">
                    <h2>
                        {costCenter?.data?.name}
                    </h2>
                </div>
                <div className="col-md-12">
                    <div className="card p-4">
                        <div className="text-end">
                            <button onClick={() => reset()} className="btn btn-primary btn-xs">
                                Refrescar
                            </button>
                        </div>
                        <h3>
                            Historial de planes
                        </h3>
                        <ul className="custom-scrollbar scrollbar-primary px-2">
                            {
                                plans?.length === 0 && !loadingPlans ?
                                    <li className="text-center">
                                        No se encontrarón resultados.
                                    </li>
                                    :
                                    null
                            }
                            {
                                plans?.map((plan, i) => {
                                    return (
                                        <PlanLiComponent
                                            key={i}
                                            plan={plan}
                                            planDetailPath={`/gestionar-centro-de-costo/${id}/plans/${plan?.id}`}
                                        />
                                    )
                                })
                            }
                            {
                                loadingPlans &&
                                <li>
                                    <div className="spinner my-5">
                                        <div className="double-bounce1 bg-primary"></div>
                                        <div className="double-bounce2 bg-primary"></div>
                                    </div>
                                </li>
                            }
                            {
                                canLoadMore && !loadingPlans ?
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
                <div className="col-md-12">
                    <div className="card p-4">
                        <h3>
                            Montos por clasificación de cuentas:
                        </h3>
                        <br />
                        {
                            accountClassificationsAmount &&
                            <ColumnChart
                                categories={accountClassificationsAmount?.data?.map(value => value?.name)}
                                title=""
                                defaultSeries={[
                                    {
                                        name: 'Total',
                                        data: accountClassificationsAmount?.data?.map(value => value?.amount ? Number(value?.amount) : 0)
                                    }
                                ]}
                                labelEndAdornment="$"
                            />
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}

export default CostCenterManagement