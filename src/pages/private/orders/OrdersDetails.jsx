import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Button, Modal, ProgressBar } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import DateFormatter from "../../../components/DateFormatter";
import ObservationsForm from "../../../components/Observations/ObservationsForm";
import OrderItemRow from "../../../components/OrderItemRow";
import RenderStatus from "../../../components/RenderStatus";
import { useAuth } from "../../../context/AuthContext";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";
import { mainPermissions } from "../../../util/MenuLinks";
import SystemInfo from "../../../util/SystemInfo";


const OrdersDetails = () => {

    const { user, permissions } = useAuth();

    const { id } = useParams();

    const navigate = useNavigate();

    const { setCustomAlert, setLoading } = useFeedBack();

    const [currentOrderDetails, setCurrentOrderDetails] = useState(null);

    const [showModalTemplateName, setShowModalTemplateName] = useState(false);

    const [templateName, setTemplateName] = useState('');

    const [template, setTemplate] = useState(null);

    const [showOrderFilesModal, setShowOrderFilesModal] = useState(false);

    const [{ data: orderDetails, loading: loadingOrderDetails }] = useAxios({ url: `/orders/${id}` }, { useCache: false });

    const [{ }, getOrderFile] = useAxios({ method: 'GET', responseType: 'blob' }, { useCache: false });

    const [{ loading: changeStatusLoading }, changeStatus] = useAxios({ url: `/orders/${id}/status`, method: 'PUT' }, { useCache: false, manual: true });

    const [{ loading: deleteLoading }, deleteOrder] = useAxios({ url: `/orders/${id}`, method: 'DELETE' }, { useCache: false, manual: true });

    const [{ data: createTemplateData, loading: createTemplateLoading }, createTemplate] = useAxios({ url: `/orders-templates`, method: 'POST' }, { useCache: false, manual: true });

    const [{ data: createOrderFileData, loading: createOrderFileLoading }, createOrderFile] = useAxios({ url: `/order-files`, method: 'POST' }, { useCache: false, manual: true });

    const [{ data: generateFileData }, generateFile] = useAxios({ responseType: 'blob' }, { useCache: false, manual: true });

    const [{ loading: deleteTemplateLoading }, deleteTemplate] = useAxios({ method: 'DELETE' }, { useCache: false, manual: true });

    const [currentFileName, setCurrentFileName] = useState('');

    useEffect(() => {
        if (createOrderFileData) {
            setCustomAlert({ show: true, message: "La guia ha sido cargada exitosamente", severity: "success", title: 'Operación exitosa' })
            setCurrentOrderDetails((oldOrderDetails) => {
                return {
                    ...oldOrderDetails,
                    files: [...oldOrderDetails?.files, createOrderFileData?.data]
                }
            });
        }
    }, [createOrderFileData])

    useEffect(() => {
        setLoading?.({
            show: changeStatusLoading,
            message: 'Cambiando Estatus'
        });
    }, [changeStatusLoading]);

    useEffect(() => {
        if (generateFileData) {
            console.log(generateFileData);
            //handleBlobResponse(generateFileData);
        }
    }, [generateFileData])

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
            title: "¿Estás Seguro?",
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

    const handleDelete = () => {
        swal({
            title: "¿Estás Seguro?",
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

    const handleAcceptChangeStatus = (statusCode) => {
        changeStatus({
            data: {
                order_status_code: statusCode
            },
            method: 'POST'
        }).then((response) => {
            setCustomAlert({
                message: 'El status se ha cambiado exitosamente.',
                show: true,
                severity: 'success'
            });
            console.log(response?.data?.data);
            setCurrentOrderDetails((oldOrdersDetails) => {
                return {
                    ...oldOrdersDetails,
                    allowedStatuses: response?.data?.data?.allowedStatuses,
                    orderStatus: response?.data?.data?.orderStatus,
                }
            });
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

    const handleGenerate = (fileType) => {
        setCurrentFileName(`pedido-${currentOrderDetails?.id}`);
        generateFile({ url: `orders/${id}/${fileType}` });

    }

    const canUpdateStatus = () => {
        if (currentOrderDetails?.isReplacement) {
            if (currentOrderDetails?.service?.adquisicionReplacementUser?.id != user?.id) return false;
        } else {
            if (currentOrderDetails?.service?.adquisicionUser?.id != user?.id) return false;
        }
        return true;
    }

    const handleFile = (e) => {
        if (createOrderFileLoading || !e.target.files[0]) return;

        const formData = new FormData();

        formData?.append('file', e.target.files[0], e.target.files[0]?.name);
        formData?.append('orderId', currentOrderDetails?.id);


        createOrderFile({
            data: formData
        });
    }

    const handleFindFile = (filePath, fileName) => {
        setCurrentFileName(fileName);
        getOrderFile({
            url: `/files${filePath}`
        }).then((response) => {
            handleBlobResponse(response?.data);
        });
    }

    const handleBlobResponse = (blobResponse) => {
        const fileBlobUrl = URL.createObjectURL(blobResponse);
        const aToDownload = document.getElementById('downloadLink');
        aToDownload.href = fileBlobUrl;
        aToDownload?.click();
        window.URL.revokeObjectURL(fileBlobUrl);
    }

    return (
        <div>
            <a id="downloadLink" style={{ display: 'none' }} download={currentFileName}></a>
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
                    <div className="card p-5">
                        <div>
                            <h4>Cambiar Estatus a:</h4>
                            {
                                currentOrderDetails?.allowedStatuses?.length > 0 ?
                                    <div className="row">
                                        {
                                            currentOrderDetails?.allowedStatuses?.map((status, i) => {
                                                return (
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
                                    <p>
                                        --
                                    </p>
                            }
                            <br />
                            <br />
                            <div>
                                <h4>Exportar a:</h4>
                                <button onClick={() => handleGenerate('excel')} className="btn btn-success mx-2">
                                    EXCEL
                                </button>
                                <button onClick={() => handleGenerate('pdf')} className="btn btn-danger mx-2">
                                    PDF
                                </button>
                            </div>
                            <br />
                            <br />
                            <div>
                                <h4>Acciones</h4>
                                {
                                    permissions?.includes(mainPermissions?.orders?.[3]) &&
                                    <button disabled={deleteLoading} onClick={handleDelete} className="btn btn-block btn-danger">
                                        {
                                            deleteLoading ? 'Cargando' : 'Eliminar'
                                        }
                                    </button>
                                }
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
                                <br />
                                {
                                    currentOrderDetails?.isReplacement ?
                                        currentOrderDetails?.service?.adquisicionReplacementUser?.id === user?.id ?
                                            <label className="btn btn-block btn-warning">
                                                {
                                                    createOrderFileLoading ?
                                                        'Enviando...'
                                                        :
                                                        'Adjuntar Guia de Despacho'
                                                }
                                                <input disabled={createOrderFileLoading} type="file" style={{ display: 'none' }} onChange={handleFile} />
                                            </label>
                                            :
                                            null
                                        :
                                        currentOrderDetails?.service?.adquisicionUser?.id === user?.id ?
                                            <label className="btn btn-block btn-warning">
                                                {
                                                    createOrderFileLoading ?
                                                        'Enviando...'
                                                        :
                                                        'Adjuntar Guia de Despacho'
                                                }
                                                <input disabled={createOrderFileLoading} type="file" style={{ display: 'none' }} onChange={handleFile} />
                                            </label>
                                            :
                                            null
                                }
                                <br />
                                {
                                    currentOrderDetails?.files?.length > 0 ?
                                        <button onClick={() => setShowOrderFilesModal(true)} className="btn btn-block btn-dark">
                                            Mostrar Guias de Despacho
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

            <Modal className="fade" show={showOrderFilesModal}>
                <Modal.Header>
                    <Modal.Title>Guias de despacho:</Modal.Title>
                    <Button
                        variant=""
                        className="btn-close"
                        onClick={() => setShowOrderFilesModal(false)}
                    >
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <div className="table-responsive">
                        <table className="display dataTable no-footer w-100 text-center">
                            <thead>
                                <tr>
                                    <td>
                                        #
                                    </td>
                                    <td>
                                        Nombre
                                    </td>
                                    <td>
                                        Fecha de creación
                                    </td>
                                    <td>
                                        Acciones
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    currentOrderDetails?.files?.map((file, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>
                                                    {i + 1}
                                                </td>
                                                <td>
                                                    {file?.originalName}
                                                </td>
                                                <td>
                                                    <DateFormatter value={file?.createdAt} dateFormat="dd-MM-yyyy hh:mm:ss" />
                                                </td>
                                                <td>
                                                    <button onClick={() => handleFindFile(file?.filePath, `guia-de-despacho-${i + 1}`)} className="btn btn-xs btn-danger">
                                                        Descargar
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default OrdersDetails;