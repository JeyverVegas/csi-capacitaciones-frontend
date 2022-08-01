import { useEffect } from "react";
import { useState } from "react";
import { Alert } from "react-bootstrap";
import Toggle from "react-toggle";
import useAxios from "../../../hooks/useAxios";
import useServices from "../../../hooks/useServices";
import alertEmojis from "../../../util/AlertsEmojis";


const ProductsAssociate = () => {

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

    const [{ data: dataExcel, loading }, sendExcel] = useAxios({ url: `/excel-products-services`, method: 'POST' }, { manual: true });

    const [{ services, loading: servicesLoading }, getServices] = useServices({ axiosConfig: { params: { perPage: 200, currentUserServices: true, page: 1 } }, options: { useCache: false } });

    useEffect(() => {
        console.log(data);
    }, [data])

    useEffect(() => {
        if (dataExcel) {
            setShowMessage(true);
            setProductCodes({
                invalidCodes: dataExcel?.invalidCodes,
                validCodes: dataExcel?.validCodes
            });
            console.log(dataExcel);
        }
    }, [dataExcel])

    const handleChange = (e) => {

        if (e.target.type === 'checkbox') {
            const value = data[e.target.name]?.includes(e.target.value);
            if (value) {
                const newValues = data[e.target.name]?.filter(n => n !== e.target.value);
                setData((oldData) => {
                    return {
                        ...oldData,
                        [e.target.name]: newValues
                    }
                });
            } else {
                setData((oldData) => {
                    return {
                        ...oldData,
                        [e.target.name]: [...data[e.target.name], e.target.value]
                    }
                });
            }
            return;
        }

        setData((oldData) => {
            return {
                ...oldData,
                [e.target.name]: e.target.type === 'file' ? e.target.files[0] : e.target.value
            }
        })
    }

    const handleAllServices = () => {
        let hash = {};
        if (checker(services?.map(service => service?.id), data?.serviceIds)) {
            services?.forEach((service) => {
                hash[service?.id] = true;
            });
            setData((oldData) => {
                return {
                    ...oldData,
                    serviceIds: data?.serviceIds?.filter((serviceId) => !hash[serviceId])
                }
            });
        } else {
            services.forEach((service) => {
                hash[service?.id] = true;
            });

            let oldServicesIds = data?.serviceIds?.filter((serviceId) => !hash[serviceId]);

            setData((oldData) => {
                return {
                    ...oldData,
                    serviceIds: [...oldServicesIds, ...services?.map((service) => service?.id)]
                }
            });

        }
    }

    const checker = (arr, target) => arr.every((value) => target?.includes(value));

    const handleSubmit = () => {
        const formData = new FormData();

        formData.append('file', data?.file, data?.file?.name);

        data?.serviceIds?.forEach((serviceId, i) => {
            formData.append(`serviceIds[${i}]`, serviceId);
        });

        formData?.append('action', data?.action ? 'connect' : 'disconnect');

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

    const handleAction = () => {
        setData((oldData) => {
            return {
                ...oldData,
                action: !oldData?.action
            }
        });
    }

    return (
        <div>
            <div className="card p-5 text-end">
                <div className="row">
                    <div className="col-md-6">
                        <h3 className="text-start">Archivo excel</h3>
                        <input
                            name="file"
                            onChange={handleChange}
                            type="file"
                            accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        />
                    </div>
                    <div className="col-md-6 text-start">
                        <h3 className="text-start">Acción: {data?.action ? 'Asociar' : 'Desligar'}</h3>

                        <Toggle onChange={handleAction} checked={data?.action} />
                    </div>
                </div>
                <h3 className="text-start mt-5">Servicios</h3>
                <div className="text-start">
                    <div className="form-check form-check-inline">
                        <label className="form-check-label">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                name="serviceIds"
                                checked={checker(services?.map(service => service.id), data?.serviceIds)}
                                onChange={handleAllServices}
                            />
                            Seleccionar todos
                        </label>
                    </div>
                    {
                        services?.map((service, i) => {
                            return (
                                <div className="form-check form-check-inline" key={i}>
                                    <label className="form-check-label">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            name="serviceIds"
                                            value={service?.id}
                                            checked={data?.serviceIds?.includes(service?.id)}
                                            onChange={() => { handleChange({ target: { name: 'serviceIds', value: Number(service?.id), type: 'checkbox' } }) }}
                                        />
                                        {service?.name}
                                    </label>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="text-end">
                    <button onClick={handleSubmit} className="btn btn-primary" disabled={!data?.file || loading || data?.serviceIds?.length === 0}>
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
                                <h3 className="mt-5">Codigos No encontrados</h3>
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
                                <h3 className="mt-5">Codigos encontrados</h3>
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
                                                    <strong>Codigo "{message}" encontrado.</strong>
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

export default ProductsAssociate;