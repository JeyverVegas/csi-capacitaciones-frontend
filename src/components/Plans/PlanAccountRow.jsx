import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { TbCalendarStats } from "react-icons/tb";
import swal from "sweetalert";
import DateFormatter from "../DateFormatter";
import { dateFine } from "../../util/Utilities";

const PlanAccountRow = ({ planAccount, planAccountClassificationName, forYear, pathForUpdatePlanAccount }) => {

    const [currentPlanAccount, setCurrentPlanAccount] = useState(null);

    const [{ data: updatePlanAccountData, loading: loadingUpdatePlanAccount }, updatePlanAccount] = useAxios({ url: `${pathForUpdatePlanAccount}/${planAccount?.id}`, method: 'PUT' }, { useCache: false, manual: true });

    useEffect(() => {
        if (planAccount) {
            setCurrentPlanAccount(planAccount);
        }
    }, [planAccount])

    const handleChange = async (e) => {

        if (!currentPlanAccount?.userCanUpdate) return alert('No tienes permisos para editar esta cuenta.');

        if (currentPlanAccount?.userCanUpdate && !forYear) {
            setCurrentPlanAccount((oldValues) => {
                return {
                    ...oldValues,
                    [e.target.name]: e.target.value
                }
            });

            updatePlanAccount({
                data: {
                    amount: Number(e.target.value),
                    applyForAllMonths: 'no'
                }
            });
        }
    }

    const handleApply = () => {

        if (!currentPlanAccount?.userCanUpdate) return alert('No tienes permisos para editar esta cuenta.');

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
                {
                    currentPlanAccount?.staff &&
                    <div className="mb-2">
                        <span className="text-danger" style={{ fontWeight: 'bold', marginRight: 5 }}>
                            Importante:
                        </span>
                        El monto de esta cuenta será multiplicado por la dotación solicitada al calcular el total.
                    </div>
                }
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
        </tr >
    )
}

export default PlanAccountRow;