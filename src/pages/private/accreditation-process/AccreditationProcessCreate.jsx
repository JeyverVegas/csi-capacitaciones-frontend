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

const AccreditationProcessCreate = () => {

    const navigate = useNavigate();

    const [data, setData] = useState({
        userId: '',
        formId: '',
    });

    const { setLoading, setCustomAlert } = useFeedBack();

    const [{ users, loading: usersLoading }, getUsers] = useUsers({ options: { useCache: false, manual: true } });

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
                message: 'El registro fue creado exitosamente.'
            });

            navigate(`/proceso-de-acreditaciones/${createData?.data?.id}`);
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
                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="form-label">Usuario</label>
                            <AsyncSelect
                                isClearable
                                onFocus={() => {
                                    getUsers();
                                }}
                                defaultOptions={mapValues(users)}
                                isLoading={usersLoading}
                                loadOptions={(e) => handleLoadSelectOptions(e, getUsers)}
                                placeholder='Escriba el nombre para buscar...'
                                onChange={(e) => { handleCurrentChange({ target: { value: e?.value, name: 'userId' } }) }}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="form-label">Formulario</label>
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