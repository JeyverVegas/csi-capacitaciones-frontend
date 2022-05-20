import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";

const OrdersUpdate = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const { setCustomAlert, setLoading } = useFeedBack();

    const [filters, setFilters] = useState({
        perPage: 200,
        page: 1
    });

    const [data, setData] = useState({
        name: '',
        documentNumberTypeId: '',
        documentNumber: '',
        address: '',
        phoneNumber: '',
        email: '',
        image: null,
    });

    const [{ data: updateData, loading: updateLoading, error: updateError }, updateRegister] = useAxios({ url: `/orders/${id}`, method: 'PUT' }, { manual: true, useCache: false });

    useEffect(() => {
        if (updateData) {
            setCustomAlert({
                title: '¡Operacion Exitosa!',
                severity: 'success',
                message: 'El pedido fue actualizado exitosamente.',
                show: true
            });
            navigate('/pedidos');
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
    }, [updateError])

    const handleSubmit = (e) => {
        e?.preventDefault?.();

        if (updateLoading) {
            return;
        }

        console.log('hola');
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
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Actualizar Pedido</h4>
                </div>
                <div className="card-body">
                    <div className="basic-form">
                        <form onSubmit={handleSubmit}>
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
export default OrdersUpdate;