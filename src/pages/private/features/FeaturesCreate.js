import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAxios from "../../../hooks/useAxios";
import { useFeedBack } from "../../../context/FeedBackContext";

const FeaturesCreate = () => {

    const { setLoading, setCustomAlert } = useFeedBack();

    const navigate = useNavigate();

    const [data, setData] = useState({
        name: ''
    });

    const [{ data: createData, loading: createLoading }, createFeature] = useAxios({ url: `/product-features`, method: 'POST' }, { manual: true, useCache: false });

    useEffect(() => {
        setLoading?.({
            show: createLoading,
            message: `'Creando Caracteristica`
        });
    }, [createLoading])

    useEffect(() => {
        if (createData) {
            setCustomAlert({
                title: '¡Operacion Exitosa!',
                severity: 'success',
                message: `La caracteristica fue creada exitosamente.`,
                show: true
            });
            navigate?.(`/caracteristicas/${createData?.data?.id}`);
        }
    }, [createData]);

    const handleSubmit = (e) => {
        e.preventDefault?.();

        createFeature({ data });
    }

    const handleChange = (e) => {
        setData((oldData) => {
            return {
                ...oldData,
                [e.target.name]: e.target.type === 'file' ? e.target.files[0] : e.target.value
            }
        })
    }

    return (
        <div className="card" style={{ width: '100%' }}>
            <div className="card-body">
                <div className="basic-form">
                    <form onSubmit={handleSubmit}>
                        <div className="row mb-5">
                            <div className="form-group mb-3 col-md-12">
                                <div className="mb-4">
                                    <label>
                                        <h5>
                                            Nombre
                                        </h5>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Nombre"
                                        name="name"
                                        autoFocus
                                        value={data?.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mb-3 d-flex justify-content-end">
                            <Link to={`#`} onClick={() => { navigate(-1) }} className="btn btn-danger mx-2">
                                Volver
                            </Link>
                            <button type="submit" className="btn btn-primary mx-2">
                                Crear
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default FeaturesCreate;