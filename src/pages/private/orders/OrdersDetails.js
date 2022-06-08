import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";

const OrdersDetails = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const { setCustomAlert, setLoading } = useFeedBack();

    const [currentOrderDetails, setCurrentOrderDetails] = useState(null);

    const [filters, setFilters] = useState({
        perPage: 200,
        page: 1
    });

    const [{ data: orderDetails, loading: loadingOrderDetails }] = useAxios({ url: `/orders/${id}` }, { useCache: false });

    useEffect(() => {
        if (orderDetails) {
            setCurrentOrderDetails((oldOrderDetails) => {
                return {
                    ...oldOrderDetails,
                    ...orderDetails?.data
                }
            });
        }
    }, [orderDetails]);

    useEffect(() => {
        setLoading?.({
            show: loadingOrderDetails,
            message: 'Obteniendo Información'
        })
    }, [loadingOrderDetails]);

    return (
        <div>
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <b>Numero de Pedido</b>
                            <p>{currentOrderDetails?.id}</p>
                            <b>Servicio</b>
                            <p>{currentOrderDetails?.service?.name || '--'}</p>
                            <b>Tipo</b>
                            <p>{currentOrderDetails?.orderType?.name || '--'}</p>
                        </div>
                        <div className="col-md-6 text-end">
                            <b>Fecha de Creación</b>
                            {
                                currentOrderDetails?.createdAt ?
                                    <p>{format(new Date(currentOrderDetails?.createdAt), 'dd/MM/yyyy hh:mm:ss a')}</p>
                                    :
                                    <p>--</p>
                            }
                            <b>Estatus</b>
                            <p>{currentOrderDetails?.status?.name || '--'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default OrdersDetails;