import { useEffect, useState } from "react";
import DateFormatter from "../DateFormatter";
import useAxios from "../../hooks/useAxios";
import swal from "sweetalert";

const PlanUfComponent = ({ uf, month, userCanUpdate, pathForUfAccounts }) => {

    const [currentUf, setCurrentUf] = useState(null);

    const [{ loading: loadingUpdateUfAccount }, updatePlanUf] = useAxios({ url: `${pathForUfAccounts}/${uf?.ufId}`, method: 'PUT' }, { manual: true, useCache: false });

    useEffect(() => {
        if (uf) {
            setCurrentUf(uf);
        }
    }, [uf])

    const handleChange = (e) => {

        if (!userCanUpdate) return alert('No tienes permisos.');

        if (currentUf?.ufId) {
            updatePlanUf({
                data: {
                    amount: e.target.value,
                    applyForAllMonths: 'no'
                }
            });
        }

        setCurrentUf((oldValue) => {
            return {
                ...oldValue,
                [e.target.name]: e.target.value
            }
        });
    }

    const handleApply = () => {

        if (!userCanUpdate) return alert('No tienes permisos.');


        swal({
            title: "¿Estas Seguro(a)?",
            text: "Esto sobreescribira los valores de los demas meses.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willUpdate) => {
            if (willUpdate) updatePlanUf({
                data: {
                    amount: Number(currentUf?.amount),
                    applyForAllMonths: 'si'
                }
            })
        })

    }

    return (
        <>
            <h4>
                Ingresos UF:
            </h4>

            <div className="form-group mb-3">
                <div className="d-flex align-items-center justify-content-between">
                    <label htmlFor="" className="text-primary">
                        Ingresos
                    </label>
                    {
                        userCanUpdate && uf?.ufId ?
                            <span className="text-primary" style={{ cursor: 'pointer' }} onClick={handleApply}>
                                Aplicar a los demas meses
                            </span>
                            :
                            null
                    }
                </div>
                <input
                    type="text"
                    value={currentUf?.amount}
                    className="form-control"
                    readOnly={!userCanUpdate || !uf?.ufId}
                    onChange={handleChange}
                    name="amount"
                />
            </div>

            {
                currentUf?.ufId &&
                <div className="form-group mb-3">
                    <label className="text-primary">
                        Tasa del mes de <DateFormatter value={`2023-${month}-15 12:00:00`} dateFormat='LLLL' />:
                    </label>
                    <input
                        readOnly
                        type="text"
                        value={currentUf?.rate}
                        className="form-control"
                    />
                </div>
            }

            <div className="form-group mb-3">
                <label className="text-primary">
                    Total en $:
                </label>
                <input
                    readOnly
                    type="text"
                    value={currentUf?.total}
                    className="form-control"
                />
            </div>
        </>
    )
}

export default PlanUfComponent;