import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import DateFormatter from "../DateFormatter";
import swal from "sweetalert";

const PlanStaffForm = ({ planId, month, costCenterId }) => {

    const [{ data: planStaffResponse, loading: planStaffLoading }, getPlanStaff] = useAxios({ url: `cost-centers/plans/${planId}/staff`, params: { month } }, { useCache: false });

    const [{ data: updatePlanStaffResponse, loading: updatePlanStaffLoading }, updatePlanStaff] = useAxios({ method: 'PUT' }, { manual: true, useCache: false });

    const [{ data: costCenterStaffResponse, loading: costCenterStaffLoading }, getCostCenterStaff] = useAxios({ params: { month: month } }, { manual: true, useCache: false });

    const [currentPlanStaff, setCurrentPlanStaff] = useState(null);

    useEffect(() => {
        if (costCenterId) {
            getCostCenterStaff({
                url: `cost-centers/${costCenterId}/staff`
            });
        }
    }, [costCenterId])

    useEffect(() => {
        if (planStaffResponse) {
            setCurrentPlanStaff(planStaffResponse?.data?.[0]);
        }
    }, [planStaffResponse])

    const handleChange = (e) => {

        if (!currentPlanStaff?.userCanUpdate) return alert('No tienes permisos.');

        if (currentPlanStaff?.id) {
            updatePlanStaff({
                url: `cost-centers/plans/staff/${currentPlanStaff?.id}`,
                data: {
                    [e.target.name]: e.target.value,
                    applyForAllMonths: 'no'

                }
            });
        }

        setCurrentPlanStaff((oldValue) => {
            return {
                ...oldValue,
                [e.target.name]: e.target.value
            }
        });
    }

    const handleApply = () => {

        if (!currentPlanStaff?.userCanUpdate) return alert('No tienes permisos.');


        swal({
            title: "¿Estas Seguro(a)?",
            text: "Esto sobreescribira los valores de los demas meses.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willUpdate) => {
            if (willUpdate) updatePlanStaff({
                data: {
                    url: `cost-centers/plans/staff/${currentPlanStaff?.id}`,
                    amount: Number(currentPlanStaff?.amount),
                    applyForAllMonths: 'si'
                }
            })
        })

    }

    return (
        <div className="mb-4">
            <div className="row">
                <div className="col-md-6">
                    <label htmlFor="" className="text-primary">
                        Dotación Asignada al centro de costo
                    </label>
                    <input type="text" className="form-control" value={costCenterStaffResponse?.data?.[0]?.amount} readOnly />
                </div>
                <div className="col-md-6">
                    <div className="d-flex align-items-center justify-content-between">
                        <label htmlFor="" className="text-primary">
                            {
                                month ?
                                    <>
                                        Dotación para el mes de  <DateFormatter value={`2023-${month}-15 12:00:00`} dateFormat='LLLL' />
                                    </>
                                    :
                                    'Dotación total'
                            }
                        </label>
                        <span className="text-primary" style={{ cursor: 'pointer' }} onClick={handleApply}>
                            Aplicar a los demas meses
                        </span>
                    </div>
                    <div className="d-flex align-items-center">
                        <input
                            type="number"
                            className="form-control"
                            name="amount"
                            readOnly={!currentPlanStaff?.userCanUpdate}
                            value={currentPlanStaff?.amount}
                            onChange={handleChange}
                        />
                        {
                            updatePlanStaffLoading &&
                            <div className="spinner" style={{ height: 15, width: 15, marginLeft: 10 }}>
                                <div className="double-bounce1 bg-primary"></div>
                                <div className="double-bounce2 bg-primary"></div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlanStaffForm;