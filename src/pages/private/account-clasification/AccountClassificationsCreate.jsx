import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAxios from "../../../hooks/useAxios";
import { useFeedBack } from "../../../context/FeedBackContext";


const AccountClassificationsCreate = () => {

    const entity = {
        name: 'Clasificación de cuentas',
        url: 'account-classifications',
        frontendUrl: '/clasificacion-de-cuentas',
        camelName: 'accountClassifications',
    };

    const navigate = useNavigate();

    const [data, setData] = useState({
        name: ''
    });

    const { setLoading, setCustomAlert } = useFeedBack();

    const [{ data: createData, loading }, createRecord] = useAxios({ url: `/${entity?.url}`, method: 'POST' }, { manual: true, useCache: false });

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

        createRecord({ data });
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
                    <div className="col-md-12">
                        <div className="form-group">
                            <label className="text-primary">
                                Nombre <small className="text-danger">*</small>
                            </label>
                            <input placeholder="Por favor ingrese el nombre..." type="text" className="form-control" name="name" value={data?.name} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <br />
                <div className="text-end">
                    <button className="btn btn-primary">
                        Crear
                    </button>
                </div>
            </form>
        </div >
    )
}

export default AccountClassificationsCreate;