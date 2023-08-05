import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAxios from "../../../hooks/useAxios";
import { useFeedBack } from "../../../context/FeedBackContext";
import AsyncSelect from 'react-select/async';
import mapValues from "../../../util/mapValues";
import handleLoadSelectOptions from "../../../util/handleLoadSelectOptions";
import useAccountClassifications from "../../../hooks/useAccountClassifications";


const AccountsEdit = () => {

    const { id } = useParams();

    const entity = {
        name: 'Cuentas',
        url: 'accounts',
        frontendUrl: '/cuentas',
        camelName: 'accounts',
    };

    const navigate = useNavigate();

    const [data, setData] = useState({
        name: '',
        code: '',
        type: '',
        staff: '',
        accountClassification: ''
    });

    const { setLoading, setCustomAlert } = useFeedBack();

    const [{ accountClassifications, total, numberOfPages, loading: loadingAccountClassifications }, getAccountClassifications] = useAccountClassifications({ options: { useCache: false } });

    const [{ data: dataToUpdate, loading: loadingDataToUpdate }, getRecord] = useAxios({ url: `/${entity?.url}/${id}` }, { useCache: false });

    const [{ data: updateData, loading }, updateRecord] = useAxios({ url: `/${entity?.url}/${id}`, method: 'PUT' }, { manual: true, useCache: false });


    useEffect(() => {
        if (dataToUpdate) {
            setData((oldData) => {
                return {
                    ...oldData,
                    ...dataToUpdate?.data,
                    staff: dataToUpdate?.data?.staff ? 'si' : 'no',
                    accountClassification: { label: dataToUpdate?.data?.accountClassification?.name, value: dataToUpdate?.data?.accountClassification?.id }
                }
            });
        }
    }, [dataToUpdate])

    useEffect(() => {
        setLoading({
            show: loading,
            message: 'Actualizando el registro'
        })
    }, [loading]);

    useEffect(() => {
        setLoading({
            show: loadingDataToUpdate,
            message: 'Obteniendo información'
        });
    }, [loadingDataToUpdate]);


    useEffect(() => {
        if (updateData) {
            setCustomAlert({
                show: true,
                severity: 'success',
                title: 'Operación Exitosa',
                message: 'El registro fue actualizado exitosamente.'
            });
            navigate(`${entity?.frontendUrl}/listar`);
        }
    }, [updateData])

    const handleChange = (e) => {
        console.log(e);
        setData((oldData) => {
            return {
                ...oldData,
                [e.target.name]: e.target.value
            }
        });
    }

    const handleSubmit = (e) => {
        e?.preventDefault();

        const { accountClassification, ...rest } = data;

        const dataToSend = {
            ...rest,
            accountClassificationId: accountClassification?.value
        }

        updateRecord({ data: dataToSend });
    }

    return (
        <div>
            <div className="my-4 align-items-center justify-content-between d-flex">
                <h3>
                    Crear {entity?.name}
                </h3>
                {
                    <>
                        <Link to={`${entity?.frontendUrl}/listar`} className="btn btn-primary">
                            Volver al listado
                        </Link>
                    </>
                }
            </div>

            <form className="card p-4" onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <div className="form-group">
                            <label className="text-primary">
                                Nombre <small className="text-danger">*</small>
                            </label>
                            <input
                                type="text"
                                placeholder="Escriba el nombre..."
                                className="form-control"
                                value={data?.name}
                                name="name"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="form-group">
                            <label className="text-primary">
                                Codigo <small className="text-danger">*</small>
                            </label>
                            <input
                                type="number"
                                placeholder="Codigo..."
                                className="form-control"
                                value={data?.code}
                                name="code"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="form-group">
                            <label className="text-primary">
                                ¿Esta cuenta es afectada por la dotación? <small className="text-danger">*</small>
                            </label>
                            <select name="staff" className="form-control" value={data?.staff} onChange={handleChange}>
                                <option value="" disabled>Seleccione una opción</option>
                                <option value="si">Si</option>
                                <option value="no">No</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="form-group">
                            <label className="text-primary">
                                Tipo de cuenta <small className="text-danger">*</small>
                            </label>
                            <select name="type" className="form-control" value={data?.type} onChange={handleChange}>
                                <option value="" disabled>Seleccione una opción</option>
                                <option value="spent">Gasto</option>
                                <option value="income">Ingreso</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-12 mb-3">
                        <div className="form-group">
                            <label className="text-primary">
                                Clasificación de la cuenta <small className="text-danger">*</small>
                            </label>
                            <AsyncSelect
                                isClearable
                                value={data?.accountClassification}
                                onFocus={() => {
                                    getAccountClassifications();
                                }}
                                defaultOptions={mapValues(accountClassifications)}
                                isLoading={loadingAccountClassifications}
                                loadOptions={(e) => handleLoadSelectOptions(e, getAccountClassifications)}
                                placeholder='Escriba el nombre para buscar...'
                                onChange={(e) => { handleChange({ target: { value: e, name: 'accountClassification' } }) }}
                            />
                        </div>
                    </div>
                </div>

                <br />
                <div className="text-end">
                    <button className="btn btn-primary">
                        Actualizar
                    </button>
                </div>
            </form>
        </div >
    )
}

export default AccountsEdit;