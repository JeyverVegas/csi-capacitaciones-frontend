import useAxios from "../../hooks/useAxios";

const UpdateYearCostCenterStaffComponent = ({ costCenter }) => {

    const [{ data, loading }, updateCostCenterStaff] = useAxios({ url: `/cost-centers/${costCenter?.id}/year-staff`, method: 'PUT' }, { manual: true, useCache: false });

    const handleChange = async (e) => {
        try {
            updateCostCenterStaff({
                data: {
                    value: e.target.value
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <li className="mb-3">
            <div className="d-flex align-tems-center">
                <div className="col-6">
                    {costCenter?.name}
                </div>
                <div className="col-6">
                    <div className="d-flex align-items-center">
                        <div style={{ width: '100%' }}>
                            <input
                                placeholder="Introduzca la dotación"
                                type="number"
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        {
                            loading &&
                            <div className="spinner" style={{ width: 15, height: 15 }}>
                                <div className="double-bounce1 bg-primary"></div>
                                <div className="double-bounce2 bg-primary"></div>
                            </div>
                        }
                    </div>
                    <small>
                        <span className="text-danger mx-1">Importante:</span>
                        Al ingresar el valor estaras actualizando el valor de todos los meses.
                    </small>
                </div>
            </div>
        </li>
    )
}

export default UpdateYearCostCenterStaffComponent;