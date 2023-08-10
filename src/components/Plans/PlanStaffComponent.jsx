import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import swal from "sweetalert";

const PlanStaffComponent = ({ staff, userCanUpdate }) => {

    const [currentStaff, setCurrentStaff] = useState(null);

    const [{ data: updatePlanStaffResponse, loading: updatePlanStaffLoading }, updatePlanStaff] = useAxios({ url: `cost-centers/plans/staff/${staff?.staffId}`, method: 'PUT' }, { manual: true, useCache: false });

    useEffect(() => {
        if (staff) {
            setCurrentStaff(staff);
        }
    }, [staff])

    const handleChange = (e) => {

        if (!userCanUpdate) return alert('No tienes permisos.');

        if (currentStaff?.staffId) {
            updatePlanStaff({
                data: {
                    amount: e.target.value,
                    applyForAllMonths: 'no'
                }
            });
        }

        setCurrentStaff((oldValue) => {
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
            if (willUpdate) updatePlanStaff({
                data: {
                    amount: Number(currentStaff?.total),
                    applyForAllMonths: 'si'
                }
            })
        })

    }

    return (
        <>
            <h4>
                Dotación:
            </h4>
            <div className="form-group mb-3">
                <label className="text-primary">
                    Asignada:
                </label>
                <input readOnly type="text" value={currentStaff?.assigned} className="form-control" />
            </div>

            <div className="form-group mb-3">
                <div className="d-flex align-items-center justify-content-between">
                    <label htmlFor="" className="text-primary">
                        Solicitada
                    </label>
                    {
                        userCanUpdate && staff?.staffId ?
                            <span className="text-primary" style={{ cursor: 'pointer' }} onClick={handleApply}>
                                Aplicar a los demas meses
                            </span>
                            :
                            null
                    }
                </div>
                <input
                    type="number"
                    value={currentStaff?.total}
                    className="form-control"
                    name="total"
                    readOnly={!userCanUpdate || !staff?.staffId}
                    onChange={handleChange}
                />
            </div>
        </>
    )
}

export default PlanStaffComponent;