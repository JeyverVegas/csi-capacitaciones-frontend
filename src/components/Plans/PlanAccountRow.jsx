import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { TbCalendarStats } from "react-icons/tb";
import swal from "sweetalert";
import DateFormatter from "../DateFormatter";
import { dateFine } from "../../util/Utilities";

const PlanAccountRow = ({ planAccount, planAccountClassificationName, forYear }) => {

    const [currentPlanAccount, setCurrentPlanAccount] = useState(null);

    const [canEdit, setCanEdit] = useState(false);

    const [{ data: updatePlanAccountData, loading: loadingUpdatePlanAccount }, updatePlanAccount] = useAxios({ url: `/cost-centers/plan-accounts/${planAccount?.id}`, method: 'PUT' }, { useCache: false, manual: true });

    useEffect(() => {
        if (canEdit && currentPlanAccount?.userCanUpdate && !forYear) {
            updatePlanAccount({
                data: {
                    amount: Number(currentPlanAccount?.amount),
                    applyForAllMonths: 'no'
                }
            });
        }
    }, [currentPlanAccount])

    useEffect(() => {
        if (currentPlanAccount) setCanEdit(true);
    }, [currentPlanAccount])

    useEffect(() => {
        if (planAccount) {
            setCurrentPlanAccount(planAccount);
        }
    }, [planAccount])

    const handleChange = async (e) => {
        if (currentPlanAccount?.userCanUpdate && !forYear) {
            setCurrentPlanAccount((oldValues) => {
                return {
                    ...oldValues,
                    [e.target.name]: e.target.value
                }
            });
        }
    }

    const handleApply = () => {
        if (currentPlanAccount?.userCanUpdate && !forYear) {
            swal({
                title: "¿Estas Seguro(a)?",
                text: "Esto sobreescribira los valores de los demas meses.",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willUpdate) => {
                if (willUpdate) updatePlanAccount({
                    data: {
                        amount: Number(currentPlanAccount?.amount),
                        applyForAllMonths: 'si'
                    }
                })
            })
        }
    }

    return (
        <tr>
            <td>
                {planAccountClassificationName || '--'}
            </td>
            <td>
                {currentPlanAccount?.code || '--'}
            </td>
            <td>

                {currentPlanAccount?.name || '--'}
            </td>
            <td>
                <div className="d-flex align-items-center">
                    <input
                        type="number"
                        className="form-control"
                        name="amount"
                        placeholder="Por favor ingrese el monto..."
                        value={forYear ? currentPlanAccount?.total : currentPlanAccount?.amount || ''}
                        onChange={handleChange}
                        step=".01"
                        readOnly={!currentPlanAccount?.userCanUpdate && forYear}
                        disabled={!currentPlanAccount?.userCanUpdate && forYear}
                    />
                    {
                        loadingUpdatePlanAccount &&
                        <div className="spinner" style={{ height: 15, width: 20, marginLeft: 10 }}>
                            <div className="double-bounce1 bg-primary"></div>
                            <div className="double-bounce2 bg-primary"></div>
                        </div>
                    }
                    {
                        currentPlanAccount?.userCanUpdate && !forYear ?
                            <button onClick={handleApply} title="Aplicar valor a todos los meses" style={{ marginLeft: 10 }} className="btn btn-outline-primary btn-xs">
                                <TbCalendarStats />
                            </button>
                            :
                            null
                    }
                </div>
                {
                    currentPlanAccount?.updatedAt &&
                    <div className="mt-2">
                        <small>
                            Última actualización: <DateFormatter value={dateFine(currentPlanAccount?.updatedAt)} dateFormat="dd/MM/yyyy hh:mm:ss" />
                        </small>
                    </div>
                }
            </td>
        </tr>
    )
}

export default PlanAccountRow;