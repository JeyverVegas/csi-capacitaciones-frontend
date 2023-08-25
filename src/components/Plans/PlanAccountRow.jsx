import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { TbCalendarStats } from "react-icons/tb";
import swal from "sweetalert";
import DateFormatter from "../DateFormatter";
import { dateFine } from "../../util/Utilities";
import { AiFillExclamationCircle } from "react-icons/ai";
import clsx from "clsx";

const PlanAccountRow = ({ planAccount, planAccountClassificationName, forYear, pathForUpdatePlanAccount, disabledAccounts }) => {

    const [hasError, setHasError] = useState(false);

    const [currentPlanAccount, setCurrentPlanAccount] = useState(null);

    const [{ data: updatePlanAccountData, loading: loadingUpdatePlanAccount, error }, updatePlanAccount] = useAxios({ url: `${pathForUpdatePlanAccount}/${planAccount?.id}`, method: 'PUT' }, { useCache: false, manual: true });

    useEffect(() => {
        if (error) {
            setHasError(true);
        }
    }, [error])

    useEffect(() => {
        if (planAccount) {
            setCurrentPlanAccount(planAccount);
        }
    }, [planAccount])

    const handleChange = async (e) => {
        setHasError(false);
        try {
            if (!forYear) {
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
        } catch (error) {
        }
    }

    const handleApply = () => {
        if (!forYear) {
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
                        type={forYear || disabledAccounts ? "text" : "number"}
                        className={clsx(["form-control"], {
                            'border border-danger': hasError
                        })}
                        name="amount"
                        placeholder="Por favor ingrese el monto..."
                        value={forYear || disabledAccounts ? Number(currentPlanAccount?.total).toLocaleString() : currentPlanAccount?.amount || ''}
                        onChange={handleChange}
                        step=".01"
                        readOnly={forYear || disabledAccounts}
                        disabled={forYear || disabledAccounts}
                    />
                    {
                        loadingUpdatePlanAccount &&
                        <div className="spinner" style={{ height: 15, width: 20, marginLeft: 10 }}>
                            <div className="double-bounce1 bg-primary"></div>
                            <div className="double-bounce2 bg-primary"></div>
                        </div>
                    }

                    {
                        !loadingUpdatePlanAccount && hasError ?
                            <AiFillExclamationCircle className="text-danger" style={{ marginLeft: 10, fontSize: 15 }} />
                            :
                            null
                    }

                    {
                        !forYear && !disabledAccounts ?
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