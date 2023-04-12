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

const AccreditationProcessCreate = () => {

    const navigate = useNavigate();

    const [data, setData] = useState({
        users: '',
        formId: '',
        costCenterId: '',
        responsibles: '',
        contractAdminId: ''
    });

    const { setLoading, setCustomAlert } = useFeedBack();

    const [{ users, loading: usersLoading }, getUsers] = useUsers({ options: { useCache: false, manual: true } });

    const [{ costCenters, loading: costCentersLoading }, getCostCenters] = useCostCenters({ options: { useCache: false, manual: true } });

    const [{ forms, loading: formsLoading }, getForms] = useForms({ options: { useCache: false, manual: true } });

    const [{ data: createData, loading }, createRecord] = useAxios({ url: `/accreditation-processes`, method: 'POST' }, { manual: true, useCache: false });

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

            navigate(`/proceso-de-acreditaciones/listar`);
        }
    }, [createData])

    const handleCurrentChange = (e) => {
        handleChange(e, setData, data);
    }

    const handleSubmit = (e) => {
        e?.preventDefault();

        const dataTosend = {
            userIds: data?.users?.map(user => user?.value),
            formId: data.formId,
            costCenterId: data?.costCenterId,
            responsibleIds: data?.responsibles?.map(responsible => responsible?.value),
            contractAdminId: data?.contractAdminId?.value
        }

        createRecord({ data: dataTosend });
    }

    return (
        <div>
            <div className="my-4 align-items-center justify-content-between d-flex">
                <h3>
                    Iniciar Proceso de Acreditación
                </h3>
                {
                    <>
                        <Link to={"/proceso-de-acreditaciones/listar"} className="btn btn-primary">
                            Volver al listado
                        </Link>
                    </>
                }
            </div>

            <form className="card p-4" onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <div className="form-group">
                            <label className="form-label">Seleccione los trabajadores</label>
                            <AsyncSelect
                                isClearable
                                isMulti
                                onFocus={() => {
                                    getUsers();
                                }}
                                defaultOptions={mapValues(users)}
                                value={data?.users}
                                isLoading={usersLoading}
                                loadOptions={(e) => handleLoadSelectOptions(e, getUsers)}
                                placeholder='Escriba el nombre para buscar...'
                                onChange={(e) => { handleCurrentChange({ target: { value: e, name: 'users' } }) }}
                            />
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="form-group">
                            <label className="form-label">Seleccione el formulario</label>
                            <AsyncSelect
                                isClearable
                                onFocus={() => {
                                    getForms();
                                }}
                                defaultOptions={mapValues(forms)}
                                isLoading={formsLoading}
                                loadOptions={(e) => handleLoadSelectOptions(e, getForms)}
                                placeholder='Escriba el nombre para buscar...'
                                onChange={(e) => { handleCurrentChange({ target: { value: e?.value, name: 'formId' } }) }}
                            />
                        </div>
                    </div>
                    <div className="col-md-12 mb-3">
                        <div className="form-group">
                            <label className="form-label">Seleccione los analistas</label>
                            <AsyncSelect
                                isClearable
                                isMulti
                                onFocus={() => {
                                    getUsers();
                                }}
                                defaultOptions={mapValues(users)}
                                value={data?.responsibles}
                                isLoading={usersLoading}
                                loadOptions={(e) => handleLoadSelectOptions(e, getUsers)}
                                placeholder='Escriba el nombre para buscar...'
                                onChange={(e) => { handleCurrentChange({ target: { value: e, name: 'responsibles' } }) }}
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
                    <div className="col-md-6 mb-3">
                        <div className="form-group">
                            <label className="form-label">Seleccione el administrador de contrato</label>
                            <AsyncSelect
                                isClearable
                                onFocus={() => {
                                    getUsers();
                                }}
                                defaultOptions={mapValues(users)}
                                value={data?.contractAdminId}
                                isLoading={usersLoading}
                                loadOptions={(e) => handleLoadSelectOptions(e, getUsers)}
                                placeholder='Escriba el nombre para buscar...'
                                onChange={(e) => { handleCurrentChange({ target: { value: e, name: 'contractAdminId' } }) }}
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

export default AccreditationProcessCreate;