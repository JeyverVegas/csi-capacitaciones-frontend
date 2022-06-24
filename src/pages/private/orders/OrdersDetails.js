import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import RenderStatus from "../../../components/RenderStatus";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";
import useOrderStatuses from "../../../hooks/useOrderStatuses";
import SystemInfo from "../../../util/SystemInfo";

const OrdersDetails = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const { setCustomAlert, setLoading } = useFeedBack();

    const [currentOrderDetails, setCurrentOrderDetails] = useState(null);

    const [observationText, setObservationText] = useState('');

    const [showModalTemplateName, setShowModalTemplateName] = useState(false);

    const [templateName, setTemplateName] = useState('');

    const [showObservationModal, setShowObservationModal] = useState(false);

    const [filters, setFilters] = useState({
        perPage: 200,
        page: 1
    });

    const [template, setTemplate] = useState(null);

    const [{ data: orderDetails, loading: loadingOrderDetails }] = useAxios({ url: `/orders/${id}` }, { useCache: false });

    const [{ data: changeStatusData, loading: changeStatusLoading }, changeStatus] = useAxios({ url: `/orders/${id}/status`, method: 'PUT' }, { useCache: false, manual: true });

    const [{ data: deleteData, loading: deleteLoading }, deleteOrder] = useAxios({ url: `/orders/${id}`, method: 'DELETE' }, { useCache: false, manual: true });

    const [{ data: createTemplateData, loading: createTemplateLoading }, createTemplate] = useAxios({ url: `/orders-templates`, method: 'POST' }, { useCache: false, manual: true });

    const [{ data: generateExcelData, loading: generateExcelLoading }, generateExcelUrl] = useAxios({ url: `/orders/${id}/excel` }, { useCache: false, manual: true });

    const [{ loading: deleteTemplateLoading }, deleteTemplate] = useAxios({ method: 'DELETE' }, { useCache: false, manual: true });

    const [{ orderStatuses, loading: loadingOrderStatuses }, getOrderStatuses] = useOrderStatuses();

    useEffect(() => {
        if (generateExcelData) {
            window.open(`${SystemInfo?.host}/${generateExcelData?.filePath}`);
            console.log(generateExcelData);
        }
    }, [generateExcelData])

    useEffect(() => {
        if (createTemplateData) {
            setTemplate(createTemplateData?.data);
        }
    }, [createTemplateData]);

    useEffect(() => {
        if (orderDetails) {
            setCurrentOrderDetails((oldOrderDetails) => {
                return {
                    ...oldOrderDetails,
                    ...orderDetails?.data
                }
            });

            setTemplate(orderDetails?.data?.template);
        }
    }, [orderDetails]);

    useEffect(() => {
        setLoading?.({
            show: loadingOrderDetails,
            message: 'Obteniendo Información'
        })
    }, [loadingOrderDetails]);

    const handleStatusChange = (statusCode) => {
        swal({
            title: "¿Estas Seguro?",
            text: "Esta acción es irreversible",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((confirm) => {
            if (confirm) {
                handleAcceptChangeStatus(statusCode);
            }
        });
    }

    const handleAcceptChangeStatus = (newStatusCode) => {
        setShowObservationModal({ show: true, statusCode: newStatusCode });
    };

    const handleDelete = () => {
        swal({
            title: "¿Estas Seguro?",
            text: "Esta acción es irreversible",
            icon: "warning",
            buttons: true,
        }).then((willDelete) => {
            if (willDelete) {
                deleteOrder().then(() => {
                    setCustomAlert({
                        message: 'El pedido se ha eliminado exitosamente.',
                        show: true,
                        severity: 'success'
                    });
                    navigate('/pedidos');
                });
            } else {

            }
        });
    }

    const handleAccepChangeStatus = () => {
        changeStatus({
            data: {
                order_status_code: showObservationModal?.statusCode,
                observation: observationText || 'Ninguna...'
            }
        }).then((response) => {
            setCustomAlert({
                message: 'El status se ha cambiado exitosamente.',
                show: true,
                severity: 'success'
            });
            setCurrentOrderDetails((oldOrdersDetails) => {
                return {
                    ...oldOrdersDetails,
                    orderStatus: response?.data?.data?.orderStatus,
                    observation: response?.data?.data?.observation
                }
            });
        }).finally(() => {
            setShowObservationModal(false);
            setObservationText('');
        });
    }

    const handleCreateTemplate = (e) => {
        e?.preventDefault();

        if (currentOrderDetails?.orderTypeId !== 3) {
            createTemplate({
                data: {
                    name: templateName,
                    order_id: id
                }
            }).then((response) => {
                setShowModalTemplateName(false);
                setTemplateName('');

            })
        }
    }

    const handleDeleteTemplate = () => {
        if (!template) {
            alert('No es una plantilla');
            return;
        }

        deleteTemplate({ url: `/orders-templates/${template?.id}` })
            .then(() => {
                setTemplate(null);
            })
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
                                    <RenderStatus styles={{ marginBottom: '10px' }} value={currentOrderDetails} />

                                </div>
                                <div className="col-md-12 my-4">
                                    <b>Elaborado Por:  </b> {currentOrderDetails?.user?.name}
                                </div>
                                {
                                    currentOrderDetails?.observation &&
                                    <div className="col-md-12">
                                        <b>Observaciones:  </b> {currentOrderDetails?.observation}
                                    </div>
                                }

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
                                                Codigo
                                            </th>
                                            <th>
                                                imagen
                                            </th>
                                            <th>
                                                Nombre
                                            </th>
                                            <th>
                                                Cantidad
                                            </th>
                                            <th>
                                                Precio Unitario
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
                                                    <tr key={i}>
                                                        <td>{i + 1}</td>
                                                        <td>
                                                            {item?.productCode || '--'}
                                                        </td>
                                                        <td>
                                                            <img className="rounded" style={{ width: 60, height: 60 }} src={`${SystemInfo?.host}${item?.imagePath}`} alt="" />
                                                        </td>
                                                        <td>{item?.name}</td>
                                                        <td>{item?.quantity}</td>
                                                        <td>{item?.price}$</td>
                                                        <td>{item?.price * item?.quantity}$</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        <tr>
                                            <td colSpan={4}>
                                                <h3>Total</h3>
                                            </td>
                                            <td colSpan={4} className="text-end">
                                                <h3>{currentOrderDetails?.total}$</h3>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card p-5">
                        <div>
                            <h4>Cambiar Estatus</h4>
                            {
                                loadingOrderStatuses ?
                                    <h6>Cargando...</h6>
                                    :
                                    currentOrderDetails?.orderStatus?.code === 'ors-001' ?
                                        <div className="row">
                                            {
                                                orderStatuses?.map((status, i) => {
                                                    return (
                                                        status?.code !== 'ors-001' &&
                                                        <button
                                                            onClick={() => handleStatusChange(status?.code)}
                                                            type="button"
                                                            className="btn mx-4 my-2"
                                                            key={i}
                                                            value={status?.code}
                                                            style={{ textTransform: 'capitalize', background: status?.color, color: 'white' }}
                                                        >
                                                            {status?.name}
                                                        </button>
                                                    )
                                                })
                                            }
                                        </div>
                                        :
                                        <button className="btn btn-block" style={{ background: currentOrderDetails?.orderStatus?.color, color: 'white', textTransform: 'capitalize' }}>
                                            {
                                                currentOrderDetails?.orderStatus?.name
                                            }
                                        </button>
                            }
                            <br />
                            <br />
                            <div>
                                <h4>Exportar a:</h4>
                                <button onClick={() => generateExcelUrl()} className="btn btn-success mx-2">
                                    EXCEL
                                </button>
                                <a target="_blank" href={`${SystemInfo?.api}/orders/${id}/pdf`} className="btn btn-danger mx-2">
                                    PDF
                                </a>
                            </div>
                            <br />
                            <br />
                            <div>
                                <h4>Acciones</h4>
                                <button disabled={deleteLoading} onClick={handleDelete} className="btn btn-block btn-danger">
                                    {
                                        deleteLoading ? 'Cargando' : 'Eliminar'
                                    }
                                </button>
                                <br />

                                {
                                    currentOrderDetails?.orderTypeId !== 3 ?
                                        template ?
                                            <button onClick={handleDeleteTemplate} disabled={deleteTemplateLoading} className="btn btn-block btn-danger">
                                                {
                                                    deleteTemplateLoading ?
                                                        'Cargando...'
                                                        :
                                                        'Eliminar Como Plantilla'
                                                }
                                            </button>
                                            :
                                            <button onClick={() => setShowModalTemplateName(true)} disabled={createTemplateLoading} className="btn btn-block btn-primary">
                                                {
                                                    createTemplateLoading ?
                                                        'Cargando...'
                                                        :
                                                        'Guardar Como Plantilla'
                                                }
                                            </button>
                                        :
                                        null
                                }
                            </div>

                        </div>

                    </div>
                </div>
            </div>
            <Modal size="lg" className="fade" show={showModalTemplateName}>
                <form onSubmit={handleCreateTemplate}>
                    <Modal.Header>
                        <Modal.Title>Nombre del Template:</Modal.Title>
                        <Button
                            variant=""
                            className="btn-close"
                            onClick={() => setShowModalTemplateName(false)}
                        >
                        </Button>
                    </Modal.Header>
                    <Modal.Body>
                        <input
                            autoFocus
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            className="form-control"
                            placeholder="Ingrese el nombre de la plantilla..."
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="row">
                            <div className="col-md-6">
                                <button type="button" onClick={() => setShowModalTemplateName(false)} className="btn btn-danger btn-block">
                                    Cancelar
                                </button>
                            </div>
                            <div className="col-md-6">
                                <button disabled={createTemplateLoading} type="submit" className="btn btn-success btn-block">
                                    {
                                        createTemplateLoading ?
                                            'Cargando...'
                                            :
                                            'Aceptar'
                                    }
                                </button>
                            </div>
                        </div>
                    </Modal.Footer>
                </form>
            </Modal>
            <Modal size="lg" className="fade" show={showObservationModal}>
                <Modal.Header>
                    <Modal.Title>Observaciones:</Modal.Title>
                    <Button
                        variant=""
                        className="btn-close"
                        onClick={() => setShowObservationModal(false)}
                    >
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <p>Por favor indique las observaciones en caso de que hubiera de lo contrario coloque la palabra <b>"Ninguna"</b>.</p>
                    <textarea
                        style={{
                            minHeight: '200px'
                        }}
                        value={observationText}
                        onChange={(e) => setObservationText(e.target.value)}
                        className="form-control"
                        cols="30"
                        placeholder="Ingrese el texto..."
                        rows="10"></textarea>
                </Modal.Body>
                <Modal.Footer>
                    <div className="row">
                        <div className="col-md-6">
                            <button onClick={() => setShowObservationModal(false)} className="btn btn-danger btn-block">
                                Cancelar
                            </button>
                        </div>
                        <div className="col-md-6">
                            <button disabled={changeStatusLoading} onClick={handleAccepChangeStatus} className="btn btn-success btn-block">
                                Aceptar
                            </button>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
export default OrdersDetails;