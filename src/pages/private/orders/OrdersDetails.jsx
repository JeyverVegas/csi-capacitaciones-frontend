import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Button, Modal, ProgressBar } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import ObservationsForm from "../../../components/Observations/ObservationsForm";
import OrdersSideCard from "../../../components/Order/OrdersSideCard";
import OrderItemRow from "../../../components/OrderItemRow";
import RenderStatus from "../../../components/RenderStatus";
import { useAuth } from "../../../context/AuthContext";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";


const OrdersDetails = () => {

    const { user } = useAuth();

    const { id } = useParams();

    const { setLoading } = useFeedBack();

    const [currentOrderDetails, setCurrentOrderDetails] = useState(null);

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

    const canUpdateStatus = () => {
        if (currentOrderDetails?.isReplacement) {
            if (currentOrderDetails?.service?.adquisicionReplacementUser?.id != user?.id) return false;
        } else {
            if (currentOrderDetails?.service?.adquisicionUser?.id != user?.id) return false;
        }
        return true;
    }

    return (
        <div>
            <div className="text-end my-4">
                <Link to="/pedidos" className="mx-4 btn btn-primary">
                    Volver Al listado
                </Link>
                <Link to="/pedidos/crear" className="mx-4 btn btn-primary">
                    Crear Nuevo
                </Link>
            </div>
            <h4 className="text-center">Progreso {currentOrderDetails?.orderStatus?.progress}%</h4>
            <ProgressBar
                now={currentOrderDetails?.orderStatus?.progress}
                variant={currentOrderDetails?.orderStatus?.variantColor}
                className="my-3"
            />
            <div className="row">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-4">
                                    <b>Numero de Pedido</b>
                                    <p>{currentOrderDetails?.id}</p>
                                    <b>Servicio</b>
                                    <p style={{ textTransform: 'capitalize' }}>{currentOrderDetails?.service?.name || '--'}</p>
                                </div>
                                <div className="col-4">
                                    <b>Tipo</b>
                                    <p>{currentOrderDetails?.orderType?.displayText || '--'}</p>
                                    <b>¿Es para repuestos?</b>
                                    <p>{currentOrderDetails?.isReplacement ? 'SI' : 'NO'}</p>
                                </div>
                                <div className="col-4">
                                    <b>Fecha de Creación</b>
                                    {
                                        currentOrderDetails?.createdAt ?
                                            <p>{format(new Date(currentOrderDetails?.createdAt), 'dd/MM/yyyy hh:mm:ss a')}</p>
                                            :
                                            <p>--</p>
                                    }
                                    <b>Estatus</b>
                                    <RenderStatus hiddenBar styles={{ marginBottom: '10px' }} value={currentOrderDetails} />
                                </div>
                                <div className="col-md-4 my-4">
                                    <b>Gestionado Por:  </b> {currentOrderDetails?.user?.name}
                                </div>
                                <div className="col-md-4 my-4">
                                    <b>Jefe del servicio:  </b> {!currentOrderDetails?.isReplacement ? currentOrderDetails?.service?.ordersBoss?.name || '--' : currentOrderDetails?.service?.ordersReplacementBoss?.name || '--'}
                                </div>
                                <div className="col-md-4 my-4">
                                    <b>Enc. de Adquisiciones:  </b> {!currentOrderDetails?.isReplacement ? currentOrderDetails?.service?.adquisicionUser?.name || '--' : currentOrderDetails?.service?.adquisicionReplacementUser?.name || '--'}
                                </div>
                            </div>
                            <h3 className="text-center">Productos</h3>
                            <div className="table-responsive">
                                <table className="table text-center">
                                    <thead>
                                        <tr>
                                            <th>
                                                #
                                            </th>
                                            <th>
                                                Código
                                            </th>
                                            <th>
                                                Nombre
                                            </th>
                                            <th>
                                                Proveedor
                                            </th>
                                            <th>
                                                Estatus
                                            </th>
                                            <th>
                                                Cantidad
                                            </th>
                                            <th>
                                                P.U
                                            </th>
                                            <th>
                                                Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentOrderDetails?.orderItems?.map((item, i) => {
                                                return (
                                                    <OrderItemRow canUpdateStatus={canUpdateStatus()} orderItem={item} key={i} index={i} />
                                                )
                                            })
                                        }
                                        <tr>
                                            <td colSpan={4}>
                                                <h3>Total</h3>
                                            </td>
                                            <td colSpan={4} className="text-end">
                                                <h3>${currentOrderDetails?.total}</h3>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <br />
                            <ObservationsForm
                                defaultObservations={currentOrderDetails?.observations}
                                orderId={currentOrderDetails?.id}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <OrdersSideCard
                        order={currentOrderDetails}
                        orderStateFunct={setCurrentOrderDetails}
                    />
                </div>
            </div>
        </div>
    )
}

export default OrdersDetails;