import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { Table } from "react-bootstrap";
import PlanAccountRow from "./PlanAccountRow";
import DateFormatter from "../DateFormatter";
import { TbCalendarStats } from "react-icons/tb";
import swal from "sweetalert";

const PlanAccountsForm = ({ planId, month, pathForAccounts, pathForUfAccounts }) => {

    const [filters, setFilters] = useState({
        planId,
        month
    })

    const [{ data: ufAccountResponse, loading: loadingUfAccount, error: errorUfAccount }, getUfAccount] = useAxios({ url: pathForUfAccounts, params: filters }, { useCache: false });

    const [{ data: accountsResponse, loading: loadingAccounts, error: errorAccounts }, getAccounts] = useAxios({ url: pathForAccounts, params: filters }, { useCache: false });

    const [{ loading: loadingUpdateUfAccount }, updateUfAccount] = useAxios({ method: 'PUT' }, { manual: true, useCache: false });

    const [planAccounts, setPlanAccounts] = useState([]);

    const [currentUfAccount, setCurrentUfAccount] = useState(null);

    const [canEdit, setCanEdit] = useState(false);

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
        if (currentUfAccount) setCanEdit(true);
    }, [currentUfAccount]);

    useEffect(() => {
        if (ufAccountResponse) {
            setCurrentUfAccount(ufAccountResponse?.data?.[0]);
        }
    }, [ufAccountResponse])

    useEffect(() => {
        if (accountsResponse) {
            if (!month) setPlanAccounts(accountsResponse);

            if (month) setPlanAccounts(accountsResponse?.data);
        }
    }, [accountsResponse])

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
        <div>
            {
                currentUfAccount &&
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
            }

            {
                loadingAccounts || loadingUfAccount ?
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
                                                planAccountClassificationName={planAccount?.accountClassification?.name || planAccount?.accountClassificationName || '--'}
                                                planAccount={planAccount}
                                                key={i}
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