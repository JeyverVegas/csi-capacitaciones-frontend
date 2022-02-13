import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";

const PositionsUpdate = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const { setCustomAlert, setLoading } = useFeedBack();

    const [name, setName] = useState('');

    const [{ data: positionData, error: positionError, loading: positionLoading }, getPosition] = useAxios({ url: `/positions/${id}` }, { useCache: false });

    const [{ data: updateData, loading: updateLoading, error: updateError }, updatePosition] = useAxios({ url: `/positions/${id}`, method: 'PUT' }, { manual: true, useCache: false });

    useEffect(() => {
        if (positionData) {
            setName(positionData?.data?.name);
            console.log(positionData);
        }
    }, [positionData])

    useEffect(() => {
        setLoading({
            show: positionLoading,
            message: 'Obteniendo información'
        })
    }, [positionLoading])

    useEffect(() => {
        if (updateData) {
            window.scrollTo({ top: 0 });
            setCustomAlert({
                title: '¡Operacion Exitosa!',
                severity: 'success',
                message: 'El cargo fue actualizado exitosamente.',
                show: true
            });
        }
    }, [updateData])

    useEffect(() => {
        if (updateError) {
            setCustomAlert({
                title: 'Error',
                severity: 'danger',
                message: 'Ha ocurrido un error.',
                show: true
            });
        }

        if (positionError) {
            setCustomAlert({
                title: 'Error',
                severity: 'danger',
                message: 'Ha ocurrido un error al obtener el registro.',
                show: true
            });
        }
    }, [updateError, positionError])

    const handleSubmit = (e) => {
        e?.preventDefault?.();

        if (updateLoading) {
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
        updatePosition({ data: { name } })
    }

    return (
        <div>
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Actualizar cargo</h4>
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
                                <button disabled={updateLoading} type="submit" className="btn btn-primary mx-2">
                                    {
                                        updateLoading ?
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
export default PositionsUpdate;