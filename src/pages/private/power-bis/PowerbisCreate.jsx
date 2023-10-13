import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAxios from "../../../hooks/useAxios";
import { useFeedBack } from "../../../context/FeedBackContext";
import { generateArray } from "../../../util/Utilities";
import DateFormatter from "../../../components/DateFormatter";
import update from 'immutability-helper';
import { BiLinkExternal } from "react-icons/bi";



const PowerbisCreate = () => {

    const entity = {
        name: 'Power BI',
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

    const [{ data: createData, loading }, createRecord] = useAxios({ url: `/${entity?.url}`, method: 'POST' }, { manual: true, useCache: false });

    useEffect(() => {
        setLoading({
            show: loading,
            message: 'Cargando'
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
            navigate(`${entity?.frontendUrl}/listar`);
        }
    }, [createData])

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

        createRecord({
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
                            Crear
                        </button>
                    </div>
                </form>
            </div >
        </div >
    )
}

export default PowerbisCreate;