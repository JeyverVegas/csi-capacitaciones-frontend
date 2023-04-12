import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import handleChange from "../../../util/handleChange";
import useAxios from "../../../hooks/useAxios";
import { useFeedBack } from "../../../context/FeedBackContext";
import handleLoadSelectOptions from "../../../util/handleLoadSelectOptions";
import mapValues from "../../../util/mapValues";
import useUsers from "../../../hooks/useUsers";
import useForms from "../../../hooks/useForms";
import AsyncSelect from 'react-select/async';
import useCostCenters from "../../../hooks/useCostCenters";

const AccreditationsCreate = () => {

    const navigate = useNavigate();

    const [data, setData] = useState({
        userId: '',
        costCenterId: '',
    });

    const { setLoading, setCustomAlert } = useFeedBack();

    const [{ users, loading: usersLoading }, getUsers] = useUsers({ options: { useCache: false, manual: true } });

    const [{ costCenters, loading: costCentersLoading }, getCostCenters] = useCostCenters({ options: { useCache: false, manual: true } });

    const [{ data: createData, loading }, createRecord] = useAxios({ url: `/accreditations`, method: 'POST' }, { manual: true, useCache: false });

    useEffect(() => {
        setLoading({
            show: loading,
            message: 'Creando el registro'
        })
    }, [loading]);



    useEffect(() => {
        if (createData) {
            setCustomAlert({
                show: true,
                severity: 'success',
                title: 'Operación Exitosa',
                message: 'Los registros fueron creados exitosamente.'
            });

            navigate(`/acreditaciones/listar`);
        }
    }, [createData])

    const handleCurrentChange = (e) => {
        handleChange(e, setData, data);
    }

    const handleSubmit = (e) => {
        e?.preventDefault();

        createRecord({ data });
    }

    return (
        <div>
            <div className="my-4 align-items-center justify-content-between d-flex">
                <h3>
                    Acreditar Trabajador
                </h3>
                {
                    <>
                        <Link to={"/acreditaciones/listar"} className="btn btn-primary">
                            Volver al listado
                        </Link>
                    </>
                }
            </div>

            <form className="card p-4" onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <div className="form-group">
                            <label className="form-label">Seleccione el trabajador</label>
                            <AsyncSelect
                                isClearable
                                onFocus={() => {
                                    getUsers();
                                }}
                                defaultOptions={mapValues(users)}
                                value={data?.userId}
                                isLoading={usersLoading}
                                loadOptions={(e) => handleLoadSelectOptions(e, getUsers)}
                                placeholder='Escriba el nombre para buscar...'
                                onChange={(e) => { handleCurrentChange({ target: { value: e, name: 'userId' } }) }}
                            />
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="form-group">
                            <label className="form-label">Seleccione el centro de costo</label>
                            <AsyncSelect
                                isClearable
                                onFocus={() => {
                                    getCostCenters();
                                }}
                                defaultOptions={mapValues(costCenters)}
                                isLoading={costCentersLoading}
                                loadOptions={(e) => handleLoadSelectOptions(e, getCostCenters)}
                                placeholder='Escriba el nombre para buscar...'
                                onChange={(e) => { handleCurrentChange({ target: { value: e?.value, name: 'costCenterId' } }) }}
                            />
                        </div>
                    </div>
                </div>
                <br />
                <div className="text-end">
                    <button className="btn btn-primary">
                        Iniciar
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AccreditationsCreate;