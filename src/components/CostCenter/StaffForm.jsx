import { useEffect, useState } from "react"
import DateFormatter from "../DateFormatter";
import update from 'immutability-helper';
import useAxios from "../../hooks/useAxios";
import { Alert } from "react-bootstrap";

const StaffForm = ({ staff, costCenterId }) => {

    const [currentStaff, setCurrentStaff] = useState(null);

    const [{ data: updateStaffData, loading: updateStaffLoading }, updateStaff] = useAxios({ url: `/cost-centers/${costCenterId}/staff`, method: 'PUT' }, { manual: true, useCache: false });

    const [responseMessage, setResponseMessage] = useState('');

    useEffect(() => {
        if (responseMessage) {
            setTimeout(() => {
                setResponseMessage('');
            }, 3000)
        }
    }, [responseMessage])

    useEffect(() => {
        if (updateStaffData) {
            setResponseMessage('Los datos se han actualizado exitosamente.');
        }
    }, [updateStaffData])

    useEffect(() => {
        if (staff) {
            setCurrentStaff(staff);
        }
    }, [staff]);

    const handleChange = (e, i) => {
        const newValues = update(currentStaff, { [i]: { [e.target.name]: { $set: e.target.value } } })
        setCurrentStaff(newValues);
    }

    const handleSubmit = (e) => {

        if (updateStaffLoading) return;

        e?.preventDefault();

        updateStaff({
            data: {
                staff: currentStaff?.map(val => val?.amount)
            }
        })
    }

    return (
        <form onSubmit={handleSubmit}>

            <ul className="row align-items-center">
                <Alert show={responseMessage}>{responseMessage}</Alert>
                {
                    currentStaff?.map((staffValue, i) => {
                        return (
                            <li key={i} className="mb-3 col-md-4">
                                <label className="text-primary" style={{ textTransform: 'capitalize' }}>
                                    <DateFormatter
                                        value={`2023-${staffValue?.month}-15 12:00:00`}
                                        dateFormat='LLLL'
                                    />
                                </label>
                                <input
                                    onChange={(e) => handleChange(e, i)}
                                    name="amount"
                                    type="number"
                                    className="form-control"
                                    value={staffValue?.amount}
                                />
                            </li>
                        )
                    })
                }
            </ul>
            {
                currentStaff &&
                <div className="text-center">
                    <button disabled={updateStaffLoading} className="btn btn-primary">
                        {
                            updateStaffLoading ?
                                <div className="spinner">
                                    <div className="double-bounce1 bg-light"></div>
                                    <div className="double-bounce2 bg-light"></div>
                                </div>
                                :
                                'Actualizar'
                        }
                    </button>
                </div>
            }
        </form>

    )
}

export default StaffForm;