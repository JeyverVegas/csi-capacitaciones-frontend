import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";

const PositionsCreate = () => {

    const navigate = useNavigate();

    const { setCustomAlert } = useFeedBack();

    const [name, setName] = useState('');

    const [{ data: createData, loading: createLoading, error: createError }, createPosition] = useAxios({ url: `/positions`, method: 'POST' }, { manual: true, useCache: false });

    useEffect(() => {
        if (createData) {
            window.scrollTo({ top: 0 });
            setCustomAlert({
                title: '¡Operacion Exitosa!',
                severity: 'success',
                message: 'El cargo fue creado exitosamente.',
                show: true
            });
            setName('');
        }
    }, [createData])

    useEffect(() => {
        if (createError) {
            setCustomAlert({
                title: 'Error',
                severity: 'danger',
                message: 'Ha ocurrido un error.',
                show: true
            });
        }
    }, [createError])

    const handleSubmit = (e) => {
        e?.preventDefault?.();

        if (createLoading) {
            return;
        }

        if (!name) {
            setCustomAlert({
                title: 'Error',
                severity: 'danger',
                message: 'El campo nombre es obligatorio.',
                show: true
            });
            return;
        }
        createPosition({ data: { name } })
    }

    return (
        <div>
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Crear cargo</h4>
                </div>
                <div className="card-body">
                    <div className="basic-form">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3 row">
                                <label className="col-sm-3 col-form-label">Nombre</label>
                                <div className="col-sm-9">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Nombre"
                                        value={name}
                                        required
                                        onChange={(e) => { setName(e.target.value) }}
                                    />
                                </div>
                            </div>
                            <div className="mb-3 d-flex justify-content-end">
                                <Link to={`#`} onClick={() => { navigate(-1) }} className="btn btn-danger mx-2">
                                    Cancelar
                                </Link>
                                <button disabled={createLoading} type="submit" className="btn btn-primary mx-2">
                                    {
                                        createLoading ?
                                            'Cargando'
                                            :
                                            'Crear'
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PositionsCreate;