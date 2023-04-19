import { Button, Modal } from "react-bootstrap";
import useAxios from "../hooks/useAxios";
import { useEffect, useState } from "react";
import DateFormatter from "./DateFormatter";
import { useFeedBack } from "../context/FeedBackContext";

const AccreditationProccessFilesComponent = ({ show, accreditationProcessId, defaultFiles, onClose }) => {

    const { setCustomAlert } = useFeedBack();

    const [currentFileName, setCurrentFileName] = useState('');

    const [currentFiles, setCurrentFiles] = useState([]);

    const [{ data: createAccreditationProcessFileData, loading: createAccreditationProcessFileLoading }, createAccreditationProcessFile] = useAxios({ url: `/accreditation-process-files`, method: 'POST' }, { useCache: false, manual: true });

    const [{ }, getAccreditationProcessFile] = useAxios({ method: 'GET', responseType: 'blob' }, { useCache: false });

    useEffect(() => {
        if (defaultFiles?.length > 0) {
            setCurrentFiles(defaultFiles);
        }
    }, [defaultFiles])

    useEffect(() => {
        if (createAccreditationProcessFileData) {
            setCustomAlert({ show: true, message: "El archivo ha sido cargado exitosamente", severity: "success", title: 'Operación exitosa' })

            setCurrentFiles((oldFiles) => {
                return [...oldFiles, createAccreditationProcessFileData?.data];
            });
        }
    }, [createAccreditationProcessFileData]);



    const handleFile = (e) => {
        if (createAccreditationProcessFileLoading || !e.target.files[0]) return;

        const formData = new FormData();

        formData?.append('file', e.target.files[0], e.target.files[0]?.name);
        formData?.append('accreditationProcessId', accreditationProcessId);


        createAccreditationProcessFile({
            data: formData
        });
    }

    const handleBlobResponse = (blobResponse, fileName) => {
        const fileBlobUrl = URL.createObjectURL(blobResponse);
        const aToDownload = document.getElementById('downloadLink');
        console.log(fileName);
        aToDownload.href = fileBlobUrl;
        aToDownload.download = fileName;

        aToDownload?.click();
        window.URL.revokeObjectURL(fileBlobUrl);
    }

    const handleFindFile = (filePath, fileName) => {
        getAccreditationProcessFile({
            url: `/files${filePath}`
        }).then((response) => {
            handleBlobResponse(response?.data, fileName);
        });
    }

    return (
        <Modal className="fade" size="lg" show={show} onHide={() => onClose?.()}>
            <Modal.Header>
                <Modal.Title>Archivos del proceso de acreditación:</Modal.Title>
                <Button
                    variant=""
                    className="btn-close"
                    onClick={() => onClose?.()}
                >
                </Button>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-end mb-3">
                    <label htmlFor="loadFile" className="btn btn-primary btn-xs">
                        {
                            createAccreditationProcessFileLoading ?
                                'Cargando'
                                :
                                'Adjuntar Archivo'
                        }
                    </label>
                    <input type="file" id="loadFile" className="d-none" onChange={handleFile} />
                </div>

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
                                    Fecha de envio
                                </td>
                                <td>
                                    Acciones
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                currentFiles?.length === 0 &&
                                <tr>
                                    <td colSpan={4}>
                                        <h3 className="my-5">No se encontrarón resultados</h3>
                                    </td>
                                </tr>
                            }
                            {
                                currentFiles?.map((file, i) => {
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
                                                <button type="button" onClick={() => handleFindFile(file?.filePath, file?.originalName)} className="btn btn-xs btn-danger">
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
    )
}

export default AccreditationProccessFilesComponent;