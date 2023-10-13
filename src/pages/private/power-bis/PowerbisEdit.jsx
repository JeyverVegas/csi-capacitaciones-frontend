import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAxios from "../../../hooks/useAxios";
import { useFeedBack } from "../../../context/FeedBackContext";


const PowerbisEdit = () => {

    const { id } = useParams();

    const entity = {
        name: 'Power Bi',
        url: 'power-bi',
        frontendUrl: '/power-bi',
        camelName: 'powerBi',
    };

    const navigate = useNavigate();

    const [data, setData] = useState({
        title: '',
        url: '',
        zone: ''
    });

    const { setLoading, setCustomAlert } = useFeedBack();

    const [{ data: dataToUpdate, loading: loadingDataToUpdate }, getRecord] = useAxios({ url: `/${entity?.url}/${id}` }, { useCache: false });

    const [{ data: updateData, loading }, updateRecord] = useAxios({ url: `/${entity?.url}/${id}`, method: 'PUT' }, { manual: true, useCache: false });

    useEffect(() => {
        if (dataToUpdate) {
            setData((oldData) => {
                return {
                    ...oldData,
                    ...dataToUpdate?.data,
                    zone: { label: dataToUpdate?.data?.zone?.name, value: dataToUpdate?.data?.zone?.id }
                }
            });
        }
    }, [dataToUpdate]);

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
        setData((oldData) => {
            return {
                ...oldData,
                [e.target.name]: e.target.value
            }
        });
    }

    const handleSubmit = (e) => {
        e?.preventDefault();

        updateRecord({
            data: {
                ...data,
                zoneId: data?.zone?.value || null
            }
        });
    }

    return (
        <div>
            <div className="my-4 align-items-center justify-content-between d-flex">
                <h3>
                    Editar {entity?.name}
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
                                Titulo <small className="text-danger">*</small>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                onChange={handleChange}
                                name="title"
                                value={data?.title}
                                placeholder="titulo"
                            />
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="form-group">
                            <label className="text-primary">
                                Url <small className="text-danger">*</small>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                onChange={handleChange}
                                name="url"
                                value={data?.url}
                                placeholder="url"
                            />
                        </div>
                    </div>
                </div>
                <br />
                <div className="text-center">
                    <button className="btn btn-block btn-primary">
                        Actualizar
                    </button>
                </div>
            </form>
        </div >
    )
}

export default PowerbisEdit;