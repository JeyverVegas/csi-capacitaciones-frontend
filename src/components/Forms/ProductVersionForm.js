import { useEffect, useState } from "react";
import swal from "sweetalert";
import useAxios from "../../hooks/useAxios";
import ImgUploadInput from "../ImgUploadInput";
import ReactTooltip from 'react-tooltip';
import { Alert } from "react-bootstrap";
import alertEmojis from "../../util/AlertsEmojis";
import ProductVersionsFeaturesContainer from "./ProductVersionsFeaturesContainer";
import SystemInfo from "../../util/SystemInfo";
import _ from "lodash";

const ProductVersionForm = ({ defaultProductVersion, productId, index, onDelete }) => {

    const [show, setShow] = useState(false);

    const [data, setData] = useState({
        code: '',
        name: '',
        image: null,
        price: 0,
        features: [],
        productId: ''
    });

    const [previewImage, setPreviewImage] = useState('');

    const [showAlert, setShowAlert] = useState({
        message: '',
        severity: '',
        title: '',
        show: false
    });

    const [defaultFeatures, setDefaultFeatures] = useState([]);

    const [{ data: deleteData, loading: deleteLoading }, deleteProductVersion] = useAxios({ url: `/product-versions/${data?.id}`, method: 'DELETE' }, { manual: true, useCache: false });

    const [{ data: saveData, loading: saveLoading }, saveProductVersion] = useAxios({}, { manual: true, useCache: false });

    useEffect(() => {
        if (deleteData !== undefined) {
            onDelete(index);
        }
    }, [deleteData])

    useEffect(() => {
        if (saveData) {
            setData((oldData) => {
                return {
                    ...oldData,
                    ...saveData?.data
                }
            });
            setShowAlert({
                message: '',
                severity: 'success',
                title: 'Accion Exitosa',
                show: true
            })
        }
    }, [saveData]);

    useEffect(() => {
        if (productId) {
            setData((oldData) => {
                return {
                    ...oldData,
                    productId: productId
                }
            })
        }
    }, [productId])

    useEffect(() => {
        if (defaultProductVersion) {
            console.log(defaultProductVersion);
            if (defaultProductVersion?.productFeatureSelectedOptions?.length > 0) {
                var features = [];
                var featuresGrouped = _.groupBy(defaultProductVersion?.productFeatureSelectedOptions, 'productFeatureId');
                Object?.keys(featuresGrouped).forEach((key) => {
                    features = [
                        ...features,
                        {
                            name: featuresGrouped[key][0].productFeature?.name,
                            featureId: key,
                            id: key,
                            options: featuresGrouped[key]?.map((feature) => {
                                return {
                                    id: feature?.id,
                                    name: feature?.name
                                }
                            })
                        }
                    ]
                });
                setDefaultFeatures(features);
            }
            if (defaultProductVersion?.imagePath) {
                setPreviewImage(`${SystemInfo?.host}/${defaultProductVersion?.imagePath}`)
            } else {
                setPreviewImage(null)
            }
            setData((oldData) => {
                return {
                    ...oldData,
                    ...defaultProductVersion
                }
            })
        }
    }, [defaultProductVersion]);

    useEffect(() => {
        setTimeout(() => {
            setShowAlert({
                message: '',
                severity: '',
                title: '',
                show: false
            })
        }, 3000)
    }, [showAlert?.show])

    const handleChange = (e) => {
        setData((oldData) => {
            return {
                ...oldData,
                [e.target.name]: e.target.type === 'file' ? e.target.files[0] : e.target.value
            }
        });
    }

    const handleDeleteVersion = () => {
        swal({
            title: "¿Estas Seguro?",
            text: "¿Deseas eliminar esta opcion?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((wantDelete) => {
            if (wantDelete) {
                handleDelete();
            }
        });
    }

    const handleDelete = () => {
        if (data?.id) {
            deleteProductVersion();
        } else {
            onDelete(index);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault?.();
        if (saveLoading || deleteLoading) {
            return;
        }

        const { id, createdAt, ...rest } = data;

        const formData = new FormData();

        Object?.keys(rest).forEach((key, i) => {
            if (rest[key]) {
                if (key === 'image') {
                    formData?.append(key, rest[key], rest[key].name);
                } else {
                    formData?.append(key, rest[key]);
                }
            }
        });

        saveProductVersion({ url: `/product-versions${data?.id ? `/${data?.id}` : ''}`, method: data?.id ? 'PUT' : 'POST', data: formData });
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="mt-4">
                {
                    showAlert?.show &&
                    <Alert
                        variant={showAlert?.severity}
                        className="alert-dismissible p-2 fade show d-flex align-items-center justify-content-between"
                    >
                        <div>
                            {alertEmojis[showAlert?.severity]}
                            <strong>{showAlert?.title}</strong>
                            {
                                showAlert?.message &&
                                <>
                                    <br />
                                    {showAlert?.message}
                                </>
                            }
                        </div>
                    </Alert>
                }
                <div className="d-flex my-4 border-bottom pb-2 align-items-center justify-content-between">
                    <div className="d-flex">
                        <div className="mx-5">
                            <ImgUploadInput previewImage={previewImage ? previewImage : null} change={handleChange} name="image" description="Imagen de la version" style={{ height: 100, width: 100 }} />
                        </div>
                        <div className="mx-2">
                            <label>
                                <p>
                                    Codigo
                                </p>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Codigo"
                                name="code"
                                value={data?.code}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mx-2">
                            <label>
                                <p>
                                    Nombre de la Version
                                </p>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre de la Version"
                                name="name"
                                value={data?.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mx-2">
                            <label>
                                <p>
                                    Precio de la Version
                                </p>
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Precio de la Version"
                                name="price"
                                value={data?.price}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="d-flex">
                        <button disabled={deleteLoading} onClick={handleDeleteVersion} type="button" data-tip="Eliminar" className="btn btn-danger mx-1">
                            {
                                deleteLoading ?
                                    'Eliminando'
                                    :
                                    <i className="flaticon-381-trash-2" />
                            }
                        </button>
                        {
                            data?.id ?
                                <button onClick={() => { setShow((oldShow) => !oldShow) }} type="button" data-tip="Caracteristicas" className="btn btn-warning mx-1 animate__animated animate__zoomIn" title="Mostrar detalles">
                                    {
                                        show ?
                                            <i className="flaticon-003-arrow-up" />
                                            :
                                            <i className="flaticon-002-arrow-down" />
                                    }
                                </button>
                                :
                                null
                        }
                        <button disabled={saveLoading} type="submit" data-tip="Guardar" className="btn btn-success mx-1">
                            {
                                saveLoading ?
                                    'Guardando...'
                                    :
                                    <i className="flaticon-008-check" />
                            }
                        </button>
                    </div>
                    <ReactTooltip />
                </div>
            </form>
            {
                data?.id ?
                    <ProductVersionsFeaturesContainer defaultFeatures={defaultFeatures} productVersionId={data?.id} show={show} />
                    :
                    null
            }
        </div>
    )
}

export default ProductVersionForm;