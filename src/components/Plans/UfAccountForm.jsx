import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import DateFormatter from "../DateFormatter";
import { TbCalendarStats } from "react-icons/tb";
import swal from "sweetalert";

const UfAccountForm = ({ pathForUfAccounts, planId, month }) => {

    const [filters, setFilters] = useState({
        planId,
        month
    })

    const [currentUfAccount, setCurrentUfAccount] = useState(null);

    const [canEdit, setCanEdit] = useState(false);

    const [{ data: ufAccountResponse, loading: loadingUfAccount, error: errorUfAccount }, getUfAccount] = useAxios({ url: pathForUfAccounts, params: filters }, { useCache: false });

    const [{ loading: loadingUpdateUfAccount }, updateUfAccount] = useAxios({ method: 'PUT' }, { manual: true, useCache: false });

    useEffect(() => {
        if (currentUfAccount) setCanEdit(true);
    }, [currentUfAccount]);

    useEffect(() => {
        if (canEdit && currentUfAccount?.userCanUpdate) {
            updateUfAccount({
                url: `${pathForUfAccounts}/${currentUfAccount?.id}`,
                data: {
                    amount: Number(currentUfAccount?.amount),
                    applyForAllMonths: 'no'
                }
            });
        }
    }, [currentUfAccount])

    useEffect(() => {
        if (ufAccountResponse) {
            setCurrentUfAccount(ufAccountResponse?.data?.[0]);
        }
    }, [ufAccountResponse])

    const handleUfChange = (e) => {
        setCurrentUfAccount((oldValue) => {
            return {
                ...oldValue,
                amount: e.target.value
            }
        })
    }

    const handleApply = () => {
        if (currentUfAccount?.userCanUpdate) {
            swal({
                title: "¿Estas Seguro(a)?",
                text: "Esto sobreescribira los valores de los demas meses.",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willUpdate) => {
                if (willUpdate) {
                    updateUfAccount({
                        url: `${pathForUfAccounts}/${currentUfAccount?.id}`,
                        data: {
                            amount: Number(currentUfAccount?.amount),
                            applyForAllMonths: 'si'
                        }
                    })
                }
            })
        }
    }

    return (
        <div className="row mb-5 align-items-center">
            <div className="col-md-4">
                <h3>
                    Valor uf del mes <DateFormatter
                        value={`2023-${month}-15 12:00:00`}
                        dateFormat='LLLL'
                    />:
                </h3>
                <input
                    type="number"
                    step=".01"
                    className="form-control"
                    value={currentUfAccount?.financialUnit?.amount}
                    readOnly
                />
            </div>
            <div className="col-md-4">
                <h3>
                    Ingresos en UF:
                </h3>
                <div className="d-flex align-items-center">
                    <input
                        type="number"
                        step=".01"
                        className="form-control"
                        value={currentUfAccount?.amount}
                        readOnly={!currentUfAccount?.userCanUpdate}
                        placeholder="Por favor ingrese el monto"
                        onChange={handleUfChange}
                    />
                    {
                        currentUfAccount?.userCanUpdate &&
                        <button onClick={handleApply} className="btn btn-primary btn-xs" title="Aplicar este valor a todos los meses.">
                            <TbCalendarStats />
                        </button>
                    }
                </div>

                {
                    loadingUpdateUfAccount &&
                    <div className="animate__animated animate__fadeIn">
                        <small>
                            Actualizando...
                        </small>
                    </div>
                }
            </div>
            <div className="col-md-4">
                <h3>
                    Total UF Ingresos del mes:
                </h3>
                <input
                    type="number"
                    step=".01"
                    className="form-control"
                    value={currentUfAccount?.amount * currentUfAccount?.financialUnit?.amount} $
                    placeholder="Total ingresos en uf"
                />
            </div>
        </div>
    )
}

export default UfAccountForm;