import useAxios from "../../hooks/useAxios";

const UpdateYearCostCenterPlanUfIcome = ({ plan }) => {

    const [{ data, loading }, updateCostCenterPlanUfIncome] = useAxios({ url: `/cost-centers/plans/${plan?.id}/year-uf-income`, method: 'PUT' }, { manual: true, useCache: false });

    const handleChange = async (e) => {
        try {
            updateCostCenterPlanUfIncome({
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
                <div className="col-2">
                    {plan?.costCenter?.code}
                </div>
                <div className="col-2">
                    {plan?.costCenter?.name}
                </div>
                <div className="col-8">
                    <div className="d-flex align-items-center">
                        <div style={{ width: '100%' }}>
                            <input
                                placeholder="Introduzca los ingresos en uf"
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

export default UpdateYearCostCenterPlanUfIcome;