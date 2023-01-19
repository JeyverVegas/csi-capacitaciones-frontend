import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ImgUploadInput from "../../../components/ImgUploadInput";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";
import useDocumentNumberTypes from "../../../hooks/useDocumentNumberTypes";
import SystemInfo from "../../../util/SystemInfo";

const ProvidersUpdate = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const { setCustomAlert, setLoading } = useFeedBack();

    const [filters, setFilters] = useState({
        perPage: 200,
        page: 1
    });

    const [data, setData] = useState({
        name: '',
        documentNumberTypeId: '',
        documentNumber: '',
        address: '',
        phoneNumber: '',
        email: '',
        image: null,
        _method: 'PUT'
    });

    const [canRemove, setCanRemove] = useState(false);

    const [firstLoading, setFirstLoading] = useState(true);

    const [imagePreview, setImagePreview] = useState('');

    const [{ data: providerData, error: providerError, loading: providerLoading }, getProvider] = useAxios({ url: `/providers/${id}` }, { useCache: false });

    const [{ data: updateData, loading: updateLoading, error: updateError }, updateProvider] = useAxios({ url: `/providers/${id}`, method: 'POST' }, { manual: true, useCache: false });

    const [{ documentNumberTypes, error: documentNumberTypesError, loading: documentNumberTypesLoading }, getDocumentNumberTypes] = useDocumentNumberTypes({ options: { useCache: false } });

    useEffect(() => {
        if (providerData) {
            const { createdAt, documentNumberType, id, imagePath, ...rest } = providerData?.data;
            setData((oldData) => {
                return {
                    ...oldData,
                    ...rest
                }
            });

            setImagePreview(imagePath);
        }
    }, [providerData])

    useEffect(() => {
        if (!documentNumberTypesLoading && !providerLoading) {
            setFirstLoading(false);
        } else {
            setFirstLoading(true)
        }
    }, [documentNumberTypesLoading, providerLoading]);

    useEffect(() => {
        setLoading({
            show: firstLoading,
            message: 'Obteniendo información'
        });
    }, [firstLoading]);



    useEffect(() => {
        if (data?.documentNumber?.length > 7 && !data?.documentNumber?.includes('-') && !canRemove) {
            setCanRemove(true);
            setData((oldData) => {
                return {
                    ...oldData,
                    documentNumber: `${oldData?.documentNumber}-`
                }
            })
        }

        if (data?.documentNumber?.length < 7 && canRemove) {
            setCanRemove(false);
        }

    }, [data?.documentNumber, canRemove])

    useEffect(() => {
        if (updateData) {
            setCustomAlert({
                title: '¡Operacion Exitosa!',
                severity: 'success',
                message: 'El proveedor fue actualizado exitosamente.',
                show: true
            });
            navigate('/proveedores')
        }
    }, [updateData])

    useEffect(() => {
        if (updateError) {
            setCustomAlert({
                title: 'Error',
                severity: 'danger',
                message: 'Ha ocurrido un error.',
                show: true
            });
        }

        if (documentNumberTypesError) {
            setCustomAlert({
                title: 'Error',
                severity: 'danger',
                message: 'Ha ocurrido un error al obtener los tipos de documentos.',
                show: true
            });
        }

        if (providerError) {
            setCustomAlert({
                title: 'Error',
                severity: 'danger',
                message: 'Ha ocurrido un error al obtener proveedor.',
                show: true
            });
        }
    }, [updateError, documentNumberTypesError, providerError])

    const handleSubmit = (e) => {
        let hasError = false;
        e?.preventDefault?.();

        if (updateLoading) {
            return;
        }

        const { image: image2, ...requireValues } = data;
        Object.keys(requireValues).forEach((key, i) => {
            if (!data[key]) {
                hasError = true;
                setCustomAlert({
                    title: 'Error',
                    severity: 'danger',
                    message: <div>Hay un error en el campo <strong>{key}</strong>.</div>,
                    show: true
                });
            }
        });

        if (hasError) {
            return;
        }

        const formdata = new FormData();
        const { image, ...rest } = data;
        Object.keys(rest).forEach((key, i) => {
            formdata?.append(key, data[key]);
        });

        if (image) {
            formdata?.append('image', image, image?.name);
        }

        updateProvider({ data: formdata });
    }

    const handleChange = (e) => {
        setData((oldData) => {
            return {
                ...oldData,
                [e.target.name]: e.target.type === 'file' ? e.target.files[0] : e.target.value
            }
        })
    }

    return (
        <div>
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Actualizar Proveedor</h4>
                </div>
                <div className="card-body">
                    <div className="basic-form">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group col-1 mb-3">
                                <ImgUploadInput previewImage={imagePreview} description="imagen" name="image" change={handleChange} style={{ height: 80 }} />
                            </div>
                            <div className="row mb-5">
                                <div className="form-group mb-3 col-md-6">
                                    <label>Nombre</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Nombre"
                                        name="name"
                                        value={data?.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group mb-3 col-md-6">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Email"
                                        name="email"
                                        value={data?.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group mb-3 col-md-6">
                                    <label>Dirección</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ingrese una direccion"
                                        name="address"
                                        value={data?.address}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group mb-3 col-md-6">
                                    <label>Numero de teléfono</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ingrese un numero teléfonico"
                                        name="phoneNumber"
                                        value={data?.phoneNumber}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group mb-3 col-md-6">
                                    <label>Numero de documento</label>
                                    <div className="d-flex">
                                        <select
                                            className="form-control w-25"
                                            name="documentNumberTypeId"
                                            disabled={documentNumberTypesLoading}
                                            value={data?.documentNumberTypeId}
                                            onChange={handleChange}
                                        >
                                            <option value="">
                                                Tipo...
                                            </option>
                                            {
                                                documentNumberTypes?.map?.((type, i) => {
                                                    return (
                                                        <option value={type?.id} key={i}>
                                                            {type?.name}
                                                        </option>
                                                    )
                                                })
                                            }
                                        </select>
                                        <input
                                            type="text"
                                            className="form-control "
                                            placeholder="Ej: 26629346"
                                            name="documentNumber"
                                            value={data?.documentNumber}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3 d-flex justify-content-end">
                                <Link to={`#`} onClick={() => { navigate(-1) }} className="btn btn-danger mx-2">
                                    Cancelar
                                </Link>
                                <button disabled={updateLoading} type="submit" className="btn btn-primary mx-2">
                                    {
                                        updateLoading ?
                                            'Cargando'
                                            :
                                            'Actualizar'
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ProvidersUpdate;