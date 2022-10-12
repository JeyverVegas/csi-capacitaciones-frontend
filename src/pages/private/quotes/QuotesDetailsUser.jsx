import { useState } from "react";
import { useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import DateFormatter from "../../../components/DateFormatter";
import RenderStatus from "../../../components/RenderStatus";
import { useAuth } from "../../../context/AuthContext";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";
import imgUrl from "../../../util/imgUrl";
import { mainPermissions } from "../../../util/MenuLinks";


const QuotesDetails = () => {

    const { permissions } = useAuth();

    const { setLoading } = useFeedBack();

    const { id } = useParams();

    const [currentQuote, setCurrentQuote] = useState(null);

    const [currentFileName, setCurrentFileName] = useState('');

    const [{ data: quoteData, loading: quoteLoading }] = useAxios({ url: `/user/quotes/${id}` }, { useCache: false });

    const [{ }, getQuoteFile] = useAxios({ method: 'GET', responseType: 'blob' }, { useCache: false });

    useEffect(() => {
        if (quoteData) {
            setCurrentQuote(quoteData?.data);
        }
    }, [quoteData])

    useEffect(() => {
        setLoading({
            message: 'Obteniendo información',
            show: quoteLoading
        });
    }, [quoteLoading])

    const handleFindFile = (filePath, fileName) => {
        setCurrentFileName(fileName);
        getQuoteFile({
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
                <Link to="/mis-cotizaciones" className="mx-4 btn btn-primary">
                    Volver Al listado
                </Link>
                {
                    permissions?.includes?.(mainPermissions?.quotes[1]) ?
                        <Link to="/cotizaciones/crear" className="mx-4 btn btn-primary">
                            Crear Nueva
                        </Link>
                        :
                        null
                }
            </div>
            <div className="row">
                <div className="col-md-8">
                    <div className="card p-4">
                        <div className="row">
                            <div className="col-md-6">
                                <h4>Detalles de la cotización</h4>
                            </div>
                            <div className="col-md-6 text-right">
                                <div className="d-flex justify-content-end">
                                    <Dropdown>
                                        <Dropdown.Toggle size="xs" variant={currentQuote?.quoteStatus?.variantColor}>
                                            {currentQuote?.quoteStatus?.name}
                                        </Dropdown.Toggle>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div>
                            <b>Servicio:</b> {currentQuote?.service?.name}
                        </div>
                        <br />
                        {
                            currentQuote?.authorizedBy ||
                                currentQuote?.account ||
                                currentQuote?.seven ?
                                <div className="row">
                                    <div className="col-md-4">
                                        <b>Autorizado por</b>
                                        <br />
                                        {currentQuote?.authorizedBy || '--'}
                                    </div>
                                    <div className="col-md-4">
                                        <b>Cuenta:</b>
                                        <br />
                                        {currentQuote?.account || '--'}
                                    </div>
                                    <div className="col-md-4">
                                        <b>Ceb:</b>
                                        <br />
                                        {currentQuote?.seven || '--'}
                                    </div>
                                </div>
                                :
                                null
                        }
                        <br />
                        <div className="row">
                            <div className="col-md-4">
                                <b>Elaborado Por</b>:
                                <br />
                                {currentQuote?.user?.name}
                            </div>
                            <div className="col-md-4">
                                <b>Estatus</b>
                                <RenderStatus hiddenBar styles={{ marginBottom: '10px' }} value={currentQuote} />
                            </div>
                            <div className="col-md-4">
                                <b>Fecha de Creación:</b>
                                <br />
                                <DateFormatter value={currentQuote?.createdAt} dateFormat={'dd/MM/yyyy hh:mm:ss'} />
                            </div>
                        </div>
                        <br />
                        <h1 className="text-center">Items</h1>
                        <div className="table-responsive">
                            <table className="table text-center">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Imagen</th>
                                        <th>Nombre</th>
                                        <th>Cantidad</th>
                                        <th>Documento</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        currentQuote?.quoteItems?.map((item, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td><b>{i + 1}</b></td>
                                                    <td>
                                                        <img src={imgUrl(item?.imagePath)}
                                                            style={{
                                                                borderRadius: '100%',
                                                                height: '50px',
                                                                width: '50px'
                                                            }}
                                                        />
                                                    </td>
                                                    <td>{item?.name}</td>
                                                    <td>{item?.quantity}</td>
                                                    <td>
                                                        {
                                                            item?.filePath ?
                                                                <a href={imgUrl(item?.filePath, '#')} target="_blank" className="btn btn-danger btn-xs">
                                                                    Descargar
                                                                </a>
                                                                :
                                                                <a className="btn btn-light btn-xs">
                                                                    No tiene
                                                                </a>
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card p-4">
                        <h4 className="">Cotizaciones de los proveedores</h4>
                        <ul>
                            {
                                currentQuote?.files?.map((quoteFile, i) => {
                                    return (
                                        <li key={i} className="border-bottom d-flex align-items-center justify-content-between py-2">
                                            <p style={{ margin: 0 }} title={quoteFile?.originalName}>
                                                {quoteFile?.originalName?.length > 20 ?
                                                    `${quoteFile?.originalName?.slice(0, 20)}...`
                                                    :
                                                    quoteFile?.originalName
                                                }
                                            </p>
                                            <div>
                                                <button onClick={() => handleFindFile(quoteFile?.filePath, quoteFile?.originalName)} className="btn btn-xs btn-primary">
                                                    Descargar
                                                </button>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default QuotesDetails;