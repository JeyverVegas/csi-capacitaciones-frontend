import { useEffect } from "react";
import { useState } from "react";
import { Badge, Button, Modal } from "react-bootstrap";
import swal from "sweetalert";
import { useAuth } from "../../context/AuthContext";
import { useFeedBack } from "../../context/FeedBackContext";
import useAxios from "../../hooks/useAxios";
import DateFormatter from "../DateFormatter";
import DeleteButton from "../DeleteButton";
import ExportButtons from "./ExportButtons";
import StatusesButtons from "./StatusesButtons";
import TemplateSection from "./TemplateSection";

const OrdersSideCard = ({ order, orderStateFunct }) => {

    const { user } = useAuth();

    const { setCustomAlert } = useFeedBack();

    const [showOrderFilesModal, setShowOrderFilesModal] = useState(false);

    const [currentFileName, setCurrentFileName] = useState('');

    const [{ data: createOrderFileData, loading: createOrderFileLoading }, createOrderFile] = useAxios({ url: `/order-files`, method: 'POST' }, { useCache: false, manual: true });

    const [{ }, getOrderFile] = useAxios({ method: 'GET', responseType: 'blob' }, { useCache: false });

    useEffect(() => {
        if (createOrderFileData) {
            setCustomAlert({ show: true, message: "La guia ha sido cargada exitosamente", severity: "success", title: 'Operación exitosa' })
            orderStateFunct((oldOrderDetails) => {
                return {
                    ...oldOrderDetails,
                    files: [...oldOrderDetails?.files, createOrderFileData?.data]
                }
            });
        }
    }, [createOrderFileData]);



    const handleFile = (e) => {
        if (createOrderFileLoading || !e.target.files[0]) return;

        const formData = new FormData();

        formData?.append('file', e.target.files[0], e.target.files[0]?.name);
        formData?.append('orderId', order?.id);


        createOrderFile({
            data: formData
        });
    }

    const handleBlobResponse = (blobResponse) => {
        const fileBlobUrl = URL.createObjectURL(blobResponse);
        const aToDownload = document.getElementById('downloadLink');
        aToDownload.href = fileBlobUrl;
        aToDownload?.click();
        window.URL.revokeObjectURL(fileBlobUrl);
    }

    const handleFindFile = (filePath, fileName) => {
        setCurrentFileName(fileName);
        getOrderFile({
            url: `/files${filePath}`
        }).then((response) => {
            handleBlobResponse(response?.data);
        });
    }

    return (
        <div className="card p-5">
            <a id="downloadLink" style={{ display: 'none' }} download={currentFileName}></a>
            <div>
                <h4>Cambiar Estatus a:</h4>
                <StatusesButtons
                    order={order}
                    orderStateFunct={orderStateFunct}
                />
                <br />
                <br />
                <ExportButtons
                    order={order}
                />
                <br />
                <br />
                <div>
                    <h4>Acciones</h4>
                    <DeleteButton
                        recordId={order?.id}
                        entity={'orders'}
                        redirectUrl='/pedidos'
                    />
                    <br />
                    <TemplateSection
                        order={order}
                        show={order?.orderTypeId !== 3}
                    />
                    <br />
                    {
                        order?.isReplacement ?
                            order?.service?.adquisicionReplacementUser?.id === user?.id ?
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
                            order?.service?.adquisicionUser?.id === user?.id ?
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
                        order?.files?.length > 0 ?
                            <button onClick={() => setShowOrderFilesModal(true)} className="btn btn-block btn-dark position-relative">
                                <p style={{ margin: 0 }}>Mostrar Guias de Despacho</p>
                                <div className="bg-danger rounded" style={{ height: '20px', width: '20px', position: 'absolute', right: '-5px', top: '-5px' }}>
                                    {order?.files?.length}
                                </div>
                            </button>
                            :
                            null
                    }
                </div>
            </div>
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
                                    order?.files?.map((file, i) => {
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

export default OrdersSideCard;