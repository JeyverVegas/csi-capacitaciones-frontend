import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { Table } from "react-bootstrap";
import PlanAccountRow from "./PlanAccountRow";
import UfAccountForm from "./UfAccountForm";
import PlanStaffForm from "./PlanStaffForm";
import PlanTotalSummary from "./PlanTotalSummary";

const PlanAccountsForm = ({
    planId,
    month,
    pathForAccounts,
    pathForUfAccounts,
    costCenterId,
    forYear,
    additionalFilters,
    pathForSummary,
    pathForUpdatePlanAccount,
    disabledAccounts
}) => {

    const [filters, setFilters] = useState({
        planId,
        month,
        forYear
    })

    const [{ data: accountsResponse, loading: loadingAccounts, error: errorAccounts }, getAccounts] = useAxios({ url: pathForAccounts, params: { ...filters, ...additionalFilters } }, { useCache: false });

    const [planAccounts, setPlanAccounts] = useState([]);

    useEffect(() => {
        if (accountsResponse) {
            setPlanAccounts(accountsResponse?.data);
        }
    }, [accountsResponse])

    return (
        <div>

            <PlanTotalSummary
                planId={planId}
                month={month}
                pathForUfAccounts={pathForUfAccounts}
                pathForSummary={pathForSummary}
            />

            {
                loadingAccounts ?
                    <div className="spinner my-5">
                        <div className="double-bounce1 bg-primary"></div>
                        <div className="double-bounce2 bg-primary"></div>
                    </div>
                    :
                    null
            }

            {
                !loadingAccounts && errorAccounts ?
                    <div className="my-5 text-center">
                        <p>
                            Ha ocurrido un error al obtener los datos.
                        </p>
                        <button className="btn btn-danger" onClick={() => getAccounts()}>
                            Reintentar
                        </button>
                    </div>
                    :
                    null
            }
            {
                !loadingAccounts ?
                    planAccounts && planAccounts?.length > 0 ?
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Estructura Costos CSI</th>
                                    <th>Lib. Mayor</th>
                                    <th>Nombre</th>
                                    <th>Monto $</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    planAccounts?.map((planAccount, i) => {
                                        return (
                                            <PlanAccountRow
                                                pathForUpdatePlanAccount={pathForUpdatePlanAccount}
                                                forYear={forYear}
                                                planAccountClassificationName={planAccount?.accountClassification?.name || planAccount?.accountClassificationName || '--'}
                                                planAccount={planAccount}
                                                key={i}
                                                disabledAccounts={disabledAccounts}
                                            />
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                        :
                        <p className="text-center">
                            No se encontrarón resultados.
                        </p>
                    :
                    null
            }

        </div>
    )
}

export default PlanAccountsForm;