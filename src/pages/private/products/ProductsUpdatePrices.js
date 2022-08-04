import { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import useAxios from "../../../hooks/useAxios";
import alertEmojis from "../../../util/AlertsEmojis";

const ProductsUpdatePrices = () => {
    const [data, setData] = useState({
        serviceIds: [],
        file: null,
        action: true
    });

    const [productCodes, setProductCodes] = useState({
        invalidCodes: [],
        validCodes: []
    });

    const [showMessage, setShowMessage] = useState(false);

    const [{ data: dataExcel, loading }, sendExcel] = useAxios({ url: `/excel-product-prices`, method: 'POST' }, { manual: true });

    useEffect(() => {
        if (dataExcel) {
            setShowMessage(true);
            setProductCodes({
                invalidCodes: dataExcel?.invalidCodes,
                validCodes: dataExcel?.validCodes
            });
        }
    }, [dataExcel])

    const handleChange = (e) => {
        setData((oldData) => {
            return {
                ...oldData,
                [e.target.name]: e.target.type === 'file' ? e.target.files[0] : e.target.value
            }
        })
    }

    const handleSubmit = () => {
        const formData = new FormData();

        formData.append('file', data?.file, data?.file?.name);

        sendExcel({ data: formData });
    }

    const handleRemoveMessage = (arrayName, index) => {
        productCodes?.[arrayName]?.splice(index, 1);
        const arraynew = productCodes?.[arrayName];
        setProductCodes((oldProducCodes) => {
            return {
                ...oldProducCodes,
                [arrayName]: arraynew
            }
        });
    }

    return (
        <div>
            <div className="card p-5">
                <div className="row">
                    <div className="col-md-12">
                        <h3>Archivo excel</h3>
                        <input
                            name="file"
                            onChange={handleChange}
                            type="file"
                            accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        />
                    </div>
                </div>

                <div className="text-end">
                    <button onClick={handleSubmit} className="btn btn-primary" disabled={!data?.file || loading}>
                        {
                            loading ?
                                'Cargando...'
                                :
                                "Enviar"
                        }
                    </button>
                </div>
            </div>

            {
                showMessage &&
                <div>
                    <Alert
                        variant="light"
                        className="alert-dismissible fade show d-flex align-items-center justify-content-between"
                    >
                        <div>
                            {alertEmojis?.welcome}
                            <strong>Mensaje</strong>
                            <br />
                            {dataExcel.message}.
                        </div>
                        <button onClick={() => { setShowMessage(false) }} title="Cerrar" className={`btn btn-${'light'}`}>X</button>
                    </Alert>

                    {
                        productCodes?.invalidCodes?.length > 0 ?
                            <>
                                <h3 className="mt-5">Códigos No encontrados</h3>
                                {
                                    productCodes?.invalidCodes?.map((message, i) => {
                                        return (
                                            <Alert
                                                key={i}
                                                variant="danger"
                                                className="alert-dismissible fade show d-flex align-items-center justify-content-between"
                                            >
                                                <div>
                                                    {alertEmojis?.error}
                                                    <strong>Codigo "{message}" no encontrado.</strong>
                                                </div>
                                                <button onClick={() => handleRemoveMessage('invalidCodes', i)} title="Cerrar" className={`btn btn-${'danger'}`}>X</button>
                                            </Alert>
                                        )
                                    })
                                }
                            </>
                            :
                            null
                    }

                    {
                        productCodes?.validCodes?.length > 0 ?
                            <>
                                <h3 className="mt-5">Códigos encontrados</h3>
                                {
                                    productCodes?.validCodes?.map((message, i) => {
                                        return (
                                            <Alert
                                                key={i}
                                                variant="success"
                                                className="alert-dismissible fade show d-flex align-items-center justify-content-between"
                                            >
                                                <div>
                                                    {alertEmojis?.success}
                                                    <strong>Código "{message}" encontrado.</strong>
                                                </div>
                                                <button onClick={() => handleRemoveMessage('validCodes', i)} title="Cerrar" className={`btn btn-${'success'}`}>X</button>
                                            </Alert>
                                        )
                                    })
                                }
                            </>
                            :
                            null
                    }
                </div>
            }
        </div >
    )
}

export default ProductsUpdatePrices;