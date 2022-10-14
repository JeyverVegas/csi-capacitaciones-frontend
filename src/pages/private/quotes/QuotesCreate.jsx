import { useState } from "react";
import { useEffect } from "react";
import Toggle from "react-toggle";
import ImgUploadInput from "../../../components/ImgUploadInput";
import useServices from "../../../hooks/useServices";
import update from 'immutability-helper';
import clsx from "clsx";
import useAxios from "../../../hooks/useAxios";
import { useFeedBack } from "../../../context/FeedBackContext";
import { Link, useNavigate } from "react-router-dom";

const QuotesCreate = () => {

    const { setLoading, setCustomAlert } = useFeedBack();

    const navigate = useNavigate();

    const [data, setData] = useState({
        serviceId: '',
        authorizedBy: '',
        account: '',
        seven: '',
        quoteItems: [],
        chargePerForm: false
    });

    const [servicesFilters, setServicesFilters] = useState({
        currentUserServices: true,
        perPage: 100
    });

    const [{ services, loading: servicesLoading }, getServices] = useServices({ params: { ...servicesFilters } }, { useCache: false });

    const [{ data: createQuoteData, loading: createQuoteLoading }, createQuote] = useAxios({ url: `/quotes`, method: 'POST' }, { manual: true, useCache: false });

    useEffect(() => {
        if (services?.length === 1) {
            setData((oldData) => {
                return {
                    ...oldData,
                    serviceId: services[0]?.id
                }
            });
        }
    }, [services])

    useEffect(() => {
        setLoading({
            show: createQuoteLoading,
            message: 'Creando cotización'
        })
    }, [createQuoteLoading])

    useEffect(() => {
        if (createQuoteData) {
            setCustomAlert({
                show: true,
                severity: 'success',
                title: 'Operación Exitosa',
                message: 'La cotización fue creada exitosamente.'
            });
            navigate('/mis-cotizaciones');
        }
    }, [createQuoteData])

    useEffect(() => {
        if (!data.chargePerForm) {
            setData((oldData) => {
                return {
                    ...oldData,
                    authorizedBy: '',
                    seven: '',
                    account: ''
                }
            });
        }
    }, [data.chargePerForm])

    const handleChange = (e) => {
        setData((oldData) => {
            return {
                ...oldData,
                [e.target.name]: e.target.value
            }
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        if (data?.chargePerForm) {
            formData?.append('authorizedBy', data?.authorizedBy);
            formData?.append('account', data?.account);
            formData?.append('seven', data?.seven);
        }

        formData?.append('serviceId', data?.serviceId);

        data?.quoteItems?.forEach((item, i) => {
            formData?.append(`quoteItems[${i}][name]`, item?.name);
            formData?.append(`quoteItems[${i}][quantity]`, item?.quantity);
            if (item?.image) {
                formData?.append(`quoteItems[${i}][image]`, item?.image, item?.image?.name);
            }

            if (item?.file) {
                formData?.append(`quoteItems[${i}][file]`, item?.file, item?.file?.name);
            }
        });

        createQuote({ data: formData });
    }

    const handleArrayChange = (e, arrayName, index) => {
        const newArrayValues = update(data?.[arrayName], { [index]: { [e.target.name]: { $set: e.target.type === 'file' ? e.target.files[0] : e.target.value } } });
        setData((oldData) => {
            return {
                ...oldData,
                [arrayName]: newArrayValues
            }
        });
    }

    const handleRemove = (index, item) => {
        const newDataValue = update(data, { quoteItems: { $splice: [[index, 1]] } });
        setData(newDataValue);
    }

    const handleAddItem = () => {
        setData((oldData) => {
            return {
                ...oldData,
                quoteItems: [...oldData?.quoteItems, { name: '', quantity: 1, image: '', file: '' }]
            }
        })
    }

    const handleRemoveAll = () => {
        setData((oldData) => {
            return {
                ...oldData,
                quoteItems: []
            }
        })
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="card p-4">
                <div className="col-md-6">
                    <label className="d-block">
                        <h4>Cobro por formular:</h4>
                    </label>
                    <Toggle onChange={() => setData((oldData) => {
                        return {
                            ...oldData,
                            chargePerForm: !oldData?.chargePerForm
                        }
                    })} checked={data?.chargePerForm} />
                </div>
                <br />
                <div className="form-group animate__animated animate__fadeInRight text-center">
                    <label>
                        <h3>
                            Servicio
                        </h3>
                    </label>
                    <select
                        name="serviceId"
                        value={data?.serviceId}
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value="">seleccione un servicio</option>
                        {
                            services?.map((service) => {
                                return (
                                    <option value={service?.id} key={service?.id}>{service?.name}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <br />
                {
                    data?.chargePerForm &&
                    <div className="row animate__animated animate__fadeInRight">
                        <div className="col-md-4 form-group">
                            <label>Autorizado por</label>
                            <input
                                type="text"
                                value={data?.authorizedBy}
                                name="authorizedBy"
                                className="form-control"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-4 form-group">
                            <label>Cuenta</label>
                            <input
                                type="text"
                                value={data?.account}
                                name="account"
                                className="form-control"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-4 form-group">
                            <label>Ceb</label>
                            <input
                                type="text"
                                value={data?.seven}
                                name="seven"
                                className="form-control"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                }
                <br />
                <h3 className="text-center">Items</h3>
                <div className="table-responsive">
                    <table className="table text-center">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Cantidad</th>
                                <th>Imagen</th>
                                <th>Documento</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data?.quoteItems?.map((item, i) => {
                                    return (
                                        <tr className="animate__animated animate__fadeInLeft" key={i}>
                                            <td >
                                                <b>{i + 1}</b>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={item?.name}
                                                    name="name"
                                                    placeholder="Nombre del item"
                                                    className="form-control"
                                                    onChange={(e) => handleArrayChange(e, 'quoteItems', i)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={item?.quantity}
                                                    name="quantity"
                                                    className="form-control"
                                                    min={1}
                                                    onChange={(e) => handleArrayChange(e, 'quoteItems', i)}
                                                />
                                            </td>
                                            <td>
                                                {
                                                    item?.image ?
                                                        <ImgUploadInput
                                                            description="imagen del producto"
                                                            style={{ height: '80px', width: '80px' }}
                                                            previewImage={URL.createObjectURL(item?.image)}
                                                            change={(e) => handleArrayChange(e, 'quoteItems', i)}
                                                        />
                                                        :
                                                        <ImgUploadInput
                                                            description="imagen del item"
                                                            style={{ height: '80px', width: '80px' }}
                                                            name="image"
                                                            change={(e) => handleArrayChange(e, 'quoteItems', i)}
                                                        />
                                                }
                                            </td>
                                            <td>
                                                <label
                                                    htmlFor={`file-${i}`}
                                                    className={clsx("btn", {
                                                        "btn-danger": !item?.file,
                                                        "btn-success": item?.file,
                                                    })}
                                                    title="Cargar Archivo"
                                                >
                                                    <i className="flaticon-022-copy"></i>
                                                </label>
                                                {
                                                    item?.file &&
                                                    <>
                                                        <p style={{ margin: 0 }} title={item?.file?.name}>
                                                            {item?.file?.name?.length > 10 ? `${item?.file?.name?.slice(0, 10)}...` : item?.file?.name}
                                                        </p>
                                                        <button
                                                            type="button" onClick={() => handleArrayChange({ target: { files: [''], type: 'file', name: 'file' } }, 'quoteItems', i)}
                                                            className="text-danger btn"
                                                            title="Remover Archivo"
                                                        >
                                                            X
                                                        </button>
                                                    </>
                                                }
                                                <input
                                                    type="file"
                                                    name="file"
                                                    accept="application/pdf,application/vnd.ms-excel,application/msword,image/*"
                                                    className="form-control d-none"
                                                    id={`file-${i}`}
                                                    onChange={(e) => handleArrayChange(e, 'quoteItems', i)}
                                                />
                                            </td>
                                            <td>
                                                <button onClick={() => handleRemove(i)} type="button" className="btn btn-xs btn-danger" title="Remover">
                                                    X
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            <tr>
                                <td colSpan={6} className="text-end">
                                    <button onClick={handleRemoveAll} type="button" className="btn mx-1 btn-xs btn-danger" title="Remover">
                                        Eliminar todos
                                    </button>
                                    <button onClick={handleAddItem} type="button" className="btn mx-1 btn-xs btn-primary" title="Remover">
                                        Añadir Nuevo
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="text-center">
                    <button className="btn btn-primary">
                        Crear Cotización
                    </button>
                </div>
            </form>
        </div>
    )
}
export default QuotesCreate;