import clsx from "clsx";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Dropdown, ProgressBar } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import ObservationsForm from "../../../components/Observations/ObservationsForm";
import OrdersSideCard from "../../../components/Order/OrdersSideCard";
import OrderItemRow from "../../../components/OrderItemRow";
import RenderStatus from "../../../components/RenderStatus";
import { useAuth } from "../../../context/AuthContext";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";
import useOrderStatuses from "../../../hooks/useOrderStatuses";


const OrdersDetails = () => {

    const { user } = useAuth();

    const { id } = useParams();

    const { setLoading } = useFeedBack();

    const [orderStatusesFilter, setOrderStatusesFilter] = useState({
        page: 1,
        exceptCodes: ['ors-002', 'ors-003', 'ors-005', 'ors-006']
    })

    const [currentOrderDetails, setCurrentOrderDetails] = useState(null);

    const [selectAll, setSelectAll] = useState(false);

    const [selectedValues, setSelectedValues] = useState([]);

    const [{ data: orderDetails, loading: loadingOrderDetails }] = useAxios({ url: `/orders/${id}` }, { useCache: false });

    const [{ data: updateStatusData, loading: updateStatusLoading }, updateStatus] = useAxios({ url: `/order-items/update-status/multiple`, method: 'POST' }, { manual: true, useCache: false });

    const [{ orderStatuses, total, numberOfPages, size, error, loading }, getOrderStatuses] = useOrderStatuses({ params: { ...orderStatusesFilter, exceptCodes: orderStatusesFilter?.exceptCodes?.join(',') } });

    useEffect(() => {
        if (updateStatusData) {
            console.log(updateStatusData?.data);
            setCurrentOrderDetails((oldOrderDetails) => {
                return {
                    ...oldOrderDetails,
                    ...updateStatusData?.data
                }
            })
        }
    }, [updateStatusData])

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

    useEffect(() => {
        if (selectAll) {
            setSelectedValues(currentOrderDetails?.orderItems?.map?.((value) => value?.id))
        } else {
            setSelectedValues([])
        }
    }, [selectAll])

    const canUpdateStatus = () => {
        if (currentOrderDetails?.isReplacement) {
            if (currentOrderDetails?.service?.adquisicionReplacementUser?.id != user?.id) return false;
        } else {
            if (currentOrderDetails?.service?.adquisicionUser?.id != user?.id) return false;
        }
        return true;
    }

    const handleSelectALL = () => {
        setSelectAll((oldSelectAll) => !oldSelectAll);
    }

    const handleCheck = (selectedValue) => {
        const value = selectedValues?.includes(Number(selectedValue?.id));
        if (value) {
            const newValues = selectedValues?.filter(n => n !== Number(selectedValue?.id));
            setSelectedValues(newValues);
        } else {
            setSelectedValues((oldSelectedValues) => [...oldSelectedValues, Number(selectedValue?.id)])
        }
    }

    const handleStatusCode = (statusCode) => {
        if (updateStatusLoading) return;

        updateStatus({
            data: {
                status_code: statusCode,
                itemsIds: selectedValues
            }
        });
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
                                    <b>Gestionado Por:  </b>
                                    <br />
                                    {currentOrderDetails?.user?.name}
                                </div>
                                <div className="col-md-4 my-4">
                                    <b>Jefe del servicio:  </b>
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
                                            <b>Ceb:</b>
                                            <br />
                                            {currentOrderDetails?.seven || '--'}
                                        </div>
                                    </div>
                                    :
                                    null
                            }
                            <br />
                            <div className="row align-items-center">
                                <div style={{ transition: 'all .3s' }} className={clsx({
                                    'col-md-6 text-left': selectedValues?.length > 0,
                                    'col-md-12 text-center': selectedValues?.length === 0,
                                })}>
                                    <h3>Productos</h3>
                                </div>
                                <div style={{ transition: 'all .5s' }} className={clsx({
                                    'col-md-6 text-end': selectedValues?.length > 0,
                                    'col-md-12 text-center d-none': selectedValues?.length === 0,
                                })}>
                                    <Dropdown>
                                        {
                                            updateStatusLoading ?
                                                <Dropdown.Toggle size="xs" variant='light'>
                                                    Cargando...
                                                </Dropdown.Toggle>
                                                :
                                                <Dropdown.Toggle size="xs" variant="primary">
                                                    Cambiar Estatus
                                                </Dropdown.Toggle>
                                        }


                                        <Dropdown.Menu>
                                            {
                                                loading ?
                                                    <Dropdown.Item href="#">Cargando...</Dropdown.Item>
                                                    :
                                                    orderStatuses?.map((status, i) => {
                                                        return (
                                                            <Dropdown.Item onClick={() => handleStatusCode(status?.code)} href="#" key={i}>
                                                                {status?.name}
                                                            </Dropdown.Item>
                                                        )
                                                    })
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table text-center">
                                    <thead>
                                        <tr>
                                            <th>
                                                <div className="form-check custom-checkbox ">
                                                    <input
                                                        type="checkbox"
                                                        onChange={handleSelectALL}
                                                        className="form-check-input"
                                                        id="customCheckBox2"
                                                        required
                                                        checked={selectAll}
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor="customCheckBox2"
                                                    />
                                                </div>
                                            </th>
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
                                                    <OrderItemRow
                                                        orderTypeId={currentOrderDetails?.orderTypeId}
                                                        canUpdateStatus={canUpdateStatus()}
                                                        orderItem={item}
                                                        selectValues={selectedValues}
                                                        key={i}
                                                        index={i}
                                                        onCheck={handleCheck}
                                                    />
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
        </div >
    )
}

export default OrdersDetails;