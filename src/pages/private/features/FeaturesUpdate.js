import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useAxios from "../../../hooks/useAxios";
import { useFeedBack } from "../../../context/FeedBackContext";
import { mainPermissions } from "../../../util/MenuLinks";
import FeatureOptionsForm from "../../../components/Forms/FeatureOptionsForm";

const FeaturesUpdate = () => {

    const { id } = useParams();

    const { setLoading, setCustomAlert } = useFeedBack();

    const [data, setData] = useState({
        name: ''
    });

    const [{ data: featureData, loading: featureLoading }, getFeature] = useAxios({ url: `/product-features/${id}` }, { useCache: false });

    const [{ data: updateData, loading: updateLoading }, updateFeature] = useAxios({ url: `/product-features/${id}`, method: 'PUT' }, { manual: true, useCache: false });

    useEffect(() => {
        if (featureData) {
            setData((oldData) => {
                return {
                    ...oldData,
                    name: featureData?.data?.name
                }
            })
            console.log(featureData);
        }
    }, [featureData])

    useEffect(() => {
        setLoading?.({
            show: updateLoading,
            message: `'Actualizando Caracteristica`
        });
    }, [updateLoading]);

    useEffect(() => {
        setLoading?.({
            show: featureLoading,
            message: `'Obteniendo Datos`
        });
    }, [featureLoading]);

    useEffect(() => {
        if (updateData) {
            setCustomAlert({
                title: '¡Operacion Exitosa!',
                severity: 'success',
                message: `La caracteristica fue actualizada exitosamente.`,
                show: true
            });
        }
    }, [updateData]);

    const handleSubmit = (e) => {
        e.preventDefault?.();

        updateFeature({ data });
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
        <div>
            <div className="text-end">
                <Link to={'/caracteristicas'} className="mx-2 my-2 btn btn-primary">
                    volver al listado
                </Link>
                <Link to={'/caracteristicas/crear'} className="mx-2 my-2 btn btn-primary">
                    Crear nueva
                </Link>
            </div>
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
                                <Link to={`/caracteristicas`} className="btn btn-danger mx-2">
                                    Volver
                                </Link>
                                <button type="submit" className="btn btn-primary mx-2">
                                    Actualizar
                                </button>
                            </div>
                        </form>
                        <FeatureOptionsForm initialOptions={featureData?.data?.options} featureId={id} />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default FeaturesUpdate;