import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Button, Modal, ProgressBar } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import RenderStatus from "../../../components/RenderStatus";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";
import SystemInfo from "../../../util/SystemInfo";
import OrderItemRow from "../../../components/OrderItemRow";
import { useAuth } from "../../../context/AuthContext";
import ObservationsForm from "../../../components/Observations/ObservationsForm";
import OrdersSideCard from "../../../components/Order/OrdersSideCard";

const OrdersDetailsUser = () => {

    const { user } = useAuth();

    const { id } = useParams();

    const { setLoading } = useFeedBack();

    const [currentOrderDetails, setCurrentOrderDetails] = useState(null);

    const [{ data: orderDetails, loading: loadingOrderDetails }] = useAxios({ url: `/user/orders/${id}` }, { useCache: false });

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
                <Link to="/mis-pedidos" className="mx-4 btn btn-primary">
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
                                    <b>Número de Pedido</b>
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
                                    <b>Gestionado Por:  </b>
                                    <br />
                                    {currentOrderDetails?.user?.name}
                                </div>
                                <div className="col-md-4 my-4">
                                    <b>Jefe de zona:  </b>
                                    <br />
                                    {!currentOrderDetails?.isReplacement ? currentOrderDetails?.service?.ordersBoss?.name || '--' : currentOrderDetails?.service?.ordersReplacementBoss?.name || '--'}
                                </div>
                                <div className="col-md-4 my-4">
                                    <b>Enc. de Adquisiciones:  </b>
                                    <br />
                                    {!currentOrderDetails?.isReplacement ? currentOrderDetails?.service?.adquisicionUser?.name || '--' : currentOrderDetails?.service?.adquisicionReplacementUser?.name || '--'}
                                </div>
                                <div className="col-md-4 mb-4">
                                    <b>Cobro por Formular:  </b>
                                    <br />
                                    {
                                        currentOrderDetails?.authorizedBy ||
                                            currentOrderDetails?.account ||
                                            currentOrderDetails?.seven ?
                                            'SI'
                                            :
                                            'NO'
                                    }
                                </div>
                            </div>
                            {
                                currentOrderDetails?.authorizedBy ||
                                    currentOrderDetails?.account ||
                                    currentOrderDetails?.seven ?
                                    <div className="row">
                                        <div className="col-md-4">
                                            <b>Autorizado por</b>
                                            <br />
                                            {currentOrderDetails?.authorizedBy || '--'}
                                        </div>
                                        <div className="col-md-4">
                                            <b>Cuenta:</b>
                                            <br />
                                            {currentOrderDetails?.account || '--'}
                                        </div>
                                        <div className="col-md-4">
                                            <b>Cebe:</b>
                                            <br />
                                            {currentOrderDetails?.seven || '--'}
                                        </div>
                                    </div>
                                    :
                                    null
                            }
                            <br />
                            <h3 className="text-center">Productos</h3>
                            <div className="table-responsive">
                                <table className="table text-center">
                                    <thead>
                                        <tr>
                                            <th>
                                                #
                                            </th>
                                            <th>
                                                Cód.
                                            </th>
                                            <th>
                                                Nombre
                                            </th>
                                            <th>
                                                Prov.
                                            </th>
                                            {
                                                currentOrderDetails?.orderTypeId === 3 &&
                                                <th>
                                                    Archivo
                                                </th>
                                            }
                                            <th>
                                                Estatus
                                            </th>
                                            <th>
                                                Cant.
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
                                                    <OrderItemRow
                                                        orderTypeId={currentOrderDetails?.orderTypeId}
                                                        withOutCheck
                                                        canUpdateStatus={canUpdateStatus()}
                                                        orderItem={item}
                                                        key={i}
                                                        index={i}
                                                    />
                                                )
                                            })
                                        }
                                        <tr>
                                            <td colSpan={5}>
                                                <h3>Total</h3>
                                            </td>
                                            <td colSpan={5} className="text-end">
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
        </div >
    )
}

export default OrdersDetailsUser;