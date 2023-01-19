import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import CustomSelect from "../../../components/CustomSelect";
import ImgUploadInput from "../../../components/ImgUploadInput";
import { useTheme } from "../../../context/ThemeContext";
import useCategories from "../../../hooks/useCategories";
import useProviders from "../../../hooks/useProviders";
import clsx from "clsx";
import useAxios from "../../../hooks/useAxios";
import { useFeedBack } from "../../../context/FeedBackContext";
import SystemInfo from "../../../util/SystemInfo";
import useServices from "../../../hooks/useServices";
import Toggle from "react-toggle";
import useProducts from "../../../hooks/useProducts";
import { Button, Modal } from "react-bootstrap";
import CustomTable from "../../../components/CustomTable/CustomTable";
import ShortProductsColumns from "../../../components/CustomTable/Columns/ShortProductsColumns";
import useFeatures from "../../../hooks/useFeatures";
import imgUrl from "../../../util/imgUrl";



const ProductsUpdate = () => {

    const { id } = useParams();

    const { setLoading, setCustomAlert } = useFeedBack();

    const navigate = useNavigate();

    const { openMenuToggle, customMenuToggle, sideBarStyle } = useTheme();

    const [showProductsModal, setShowProductsModal] = useState(false);

    const [servicesFilters, setServicesFilters] = useState({
        perPage: 200,
        page: 1
    })

    const [featuresFilters, setFeaturesFilters] = useState({
        page: 1,
        perPage: 100
    })

    const [productsFilters, setProductsFilters] = useState({
        perPage: 10,
        page: 1,
        parentsOnly: 'true',
        exceptId: id
    })

    const [filters, setFilters] = useState({
        name: '',
        page: 1
    });

    const [categoriesFilters, setCategoriesFilters] = useState({
        name: '',
        page: 1,
        parentsOnly: true,
        perPage: 100
    });

    const [subCategoriesFilters, setSubCategoriesFilters] = useState({
        page: 1,
        perPage: 200
    });

    const [modalSubCategoriesFilters, setModalSubCategoriesFilters] = useState({
        page: 1,
        perPage: 200
    });

    const [data, setData] = useState({
        name: '',
        image: null,
        reference: '',
        providerId: '',
        categoryId: '',
        subCategoryId: '',
        dataSheet: '',
        certificate: '',
        certificateExpiryDate: '',
        notifyCertificateExpiryDays: '',
        description: '',
        serviceIds: [],
        code: '',
        price: 0,
        isReplacement: false,
        _method: 'PUT',
        parentId: [],
        parent: '',
        productFeatureOptionIds: [],
    });

    const [imagePreview, setImagePreview] = useState('');

    const [certificatePreview, setCertificatePreview] = useState('');

    const [dataSheetPreview, setDataSheetPreview] = useState('');

    const [{ providers, total, numberOfPages, size, error, loading }, getProviders] = useProviders({ options: { manual: true, useCache: false } });

    const [{ features, total: featuresTotal, numberOfPages: featuresPages, loading: featuresLoading }, getFeatures] = useFeatures({ options: { manual: true, useCache: false } });

    const [{ products, numberOfPages: productsPages, loading: loadingProducts, total: productsTotal }, getProducts] = useProducts({ options: { manual: true, useCache: false } });

    const [{ categories, loading: loadingCategories }, getCategories] = useCategories({ options: { manual: true, useCache: false } });

    const [{ categories: subCategories, loading: subCategoriesLoading }, getSubCategories] = useCategories({ options: { manual: true, useCache: false } });

    const [{ categories: modalSubCategories, loading: modalSubCategoriesLoading }, getModalSubCategories] = useCategories({ options: { manual: true, useCache: false } });

    const [{ services, error: servicesError, loading: servicesLoading }, getServices] = useServices({ axiosConfig: { params: { ...servicesFilters } }, options: { useCache: false } });

    const [{ data: product, loading: productLoading }, getProduct] = useAxios({ url: `/products/${id}` }, { useCache: false });

    const [{ data: updateData, loading: updateLoading }, updateProduct] = useAxios({ url: `/products/${id}`, method: 'POST' }, { manual: true, useCache: false });

    useEffect(() => {
        if (product) {

            const {
                parentId,
                features,
                category,
                subCategory,
                certificate,
                dataSheet,
                createdAt,
                id,
                imagePath,
                provider,
                certificateExpiryDate,
                ...rest
            } = product?.data;
            setData((oldData) => {
                return {
                    ...oldData,
                    ...rest,
                    categoryId: category?.id || '',
                    subCategoryId: subCategory?.id || '',
                    parentId: parentId ? [parentId] : [],
                    productFeatureOptionIds: product?.data?.features?.map(feature => feature?.id),
                    certificateExpiryDate: certificateExpiryDate
                }
            });

            if (provider) {
                setFilters((oldFilters) => {
                    return {
                        ...oldFilters,
                        name: provider?.name
                    }
                });
            }
            if (dataSheet) setDataSheetPreview(`${SystemInfo?.host}${dataSheet}`);
            if (certificate) setCertificatePreview(`${SystemInfo?.host}${certificate}`);
            if (imagePath) setImagePreview(imgUrl(imagePath));

        }
    }, [product]);

    useEffect(() => {
        getProducts({
            params: {
                ...productsFilters
            }
        });
    }, [productsFilters]);

    useEffect(() => {
        getSubCategories({
            params: {
                ...subCategoriesFilters,
                parentId: data?.categoryId
            }
        });
    }, [data?.categoryId])

    useEffect(() => {
        setProductsFilters((oldProductsFilters) => {
            return {
                ...oldProductsFilters,
                subCategoryId: ''
            }
        })
        getModalSubCategories({
            params: {
                ...modalSubCategoriesFilters,
                parentId: productsFilters?.categoryId,
            }
        });
    }, [productsFilters?.categoryId])

    useEffect(() => {
        setLoading?.({
            show: updateLoading,
            message: `Actualizando`
        });
    }, [updateLoading]);

    useEffect(() => {
        setLoading?.({
            show: productLoading,
            message: `Obteniendo información`
        });
    }, [productLoading])

    useEffect(() => {
        if (updateData) {
            setCustomAlert({
                title: '¡Operación Exitosa!',
                severity: 'success',
                message: `El producto fue actualizado exitosamente.`,
                show: true
            });
        }
    }, [updateData]);

    useEffect(() => {
        getProviders({
            params: {
                ...filters
            }
        });
    }, [filters]);

    useEffect(() => {
        getFeatures({
            params: {
                ...featuresFilters
            }
        });
    }, [featuresFilters]);

    useEffect(() => {
        getServices({
            params: {
                ...servicesFilters
            }
        });
    }, [servicesFilters])

    useEffect(() => {
        getCategories({
            params: {
                ...categoriesFilters
            }
        });
    }, [categoriesFilters])

    useEffect(() => {
        customMenuToggle(true);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault?.();

        const formData = new FormData();

        const { parent, parentId, productVersions, productFeatureOptionIds, serviceIds, ...rest } = data;

        Object.keys(rest).forEach((key, i) => {
            if (key !== 'id') {
                if (key === 'isReplacement') {
                    formData.append(key, data[key] ? 1 : 0);
                } else {
                    if (data[key]) {
                        if (key === 'image' || key === 'dataSheet' || key === 'certificate') {
                            formData.append(key, data[key], data[key].name);
                        } else {
                            if (key === 'serviceIds') {
                                data[key].forEach((id, i) => {
                                    formData.append(`${key}[${i}]`, id);
                                })
                            } else {
                                formData.append(key, data[key]);
                            }
                        }
                    }
                }
            }
        });

        serviceIds?.forEach((serviceId, key) => {
            formData.append(`serviceIds[${key}]`, serviceId);
        });

        productFeatureOptionIds?.forEach((featureId, i) => {
            formData?.append(`productFeatureOptionIds[${i}]`, featureId);
        })

        if (parentId?.length > 0) {
            formData?.append('parentId', parentId[0]);
        }

        updateProduct({ data: formData });
    }

    const handleProvider = (provider) => {
        setData((oldData) => {
            return {
                ...oldData,
                providerId: provider?.id
            }
        });

        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                name: provider?.name
            }
        });
    }

    const handleCategory = (category) => {
        setData((oldData) => {
            return {
                ...oldData,
                categoryId: category?.id
            }
        });

        setCategoriesFilters((oldFilters) => {
            return {
                ...oldFilters,
                name: category?.name
            }
        });
    }

    const handleChange = (e) => {
        if (e.target.type === 'checkbox') {
            const value = data[e.target.name]?.includes(Number(e.target.value));
            if (value) {
                const newValues = data[e.target.name]?.filter(n => n !== Number(e.target.value));
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
                        [e.target.name]: [...data[e.target.name], Number(e.target.value)]
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

    const handleProduct = (value) => {
        setData((oldData) => {
            return {
                ...oldData,
                parent: value?.id === oldData?.['parentId']?.[0] ? '' : value,
                parentId: value?.id === oldData?.['parentId']?.[0] ? [] : [value?.id]
            }
        });
    }

    const handlePage = (page) => {
        setProductsFilters((oldFilters) => {
            return {
                ...oldFilters,
                page: page
            }
        });
    }

    return (
        <div>
            <div className="text-end">
                <Link to={'/productos'} className="mx-2 my-2 btn btn-primary">
                    volver al listado
                </Link>
                <Link to={'/productos/crear'} className="mx-2 my-2 btn btn-primary">
                    Crear nuevo
                </Link>
            </div>
            <div className="card" style={{ width: '100%', marginBottom: 200 }}>
                <div className="card-body">
                    <div className="basic-form">
                        <form onSubmit={handleSubmit}>
                            <div className="row mb-5">
                                <div className="col-md-6 mb-4">
                                    <h5>¿Es un Repuesto?</h5>
                                    <Toggle onChange={() => { setData((oldData) => { return { ...oldData, isReplacement: !oldData?.isReplacement } }) }} checked={data?.isReplacement} />
                                </div>

                                <div className="col-md-6 mb-4">
                                    {
                                        product?.data?.childrens?.length === 0 &&
                                        <>
                                            <h5>Producto padre</h5>
                                            {
                                                !data?.parent &&
                                                <>
                                                    <span>
                                                        Escoja un producto padre si este es una versión de otro producto.
                                                    </span>
                                                    <br />
                                                </>
                                            }
                                            {
                                                data?.parent &&
                                                <h4 title="remover" className="animate__animated animate__fadeInLeft rounded bg-light p-3" style={{ color: "#505050", cursor: 'pointer' }} onClick={() => handleProduct(data?.parent)}>
                                                    "{data?.parent?.code}": {data?.parent?.name}
                                                </h4>
                                            }
                                            <button type="button" onClick={() => setShowProductsModal(true)} className="btn btn-success">Añadir</button>
                                        </>
                                    }
                                </div>
                                <div className="form-group mb-3 col-md-8">
                                    <div className="mb-4">
                                        <label>
                                            <h5>
                                                Nombre del Producto
                                            </h5>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Nombre"
                                            name="name"
                                            autoFocus
                                            value={data?.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label>
                                            Código
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Código"
                                            name="code"
                                            value={data?.code}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label>
                                            Referencia
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Referencia"
                                            name="reference"
                                            value={data?.reference}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label>
                                            Proveedor
                                        </label>
                                        <CustomSelect
                                            options={providers}
                                            optionLabel="name"
                                            inputPlaceholder="Escribe el nombre..."
                                            isLoading={loading}
                                            onSelectValue={handleProvider}
                                            handleInputChange={(e) => { setFilters((oldFilters) => { return { ...oldFilters, name: e.target.value } }) }}
                                            inputValue={filters?.name}
                                        />
                                    </div>
                                </div>
                                <div className="form-group mb-3 col-md-4">
                                    <label>
                                        <h5>
                                            Imagen Base del Producto
                                        </h5>
                                    </label>
                                    <ImgUploadInput
                                        previewImage={imagePreview}
                                        style={{ width: '65%' }}
                                        description="imagen del producto"
                                        name="image"
                                        change={handleChange}
                                    />
                                    <div className="text-center mt-4 row">
                                        <div className="col-md-6">
                                            <a href={dataSheetPreview} target="_blank" style={{ margin: 0 }}>Mostrar Ficha Técnica</a>
                                            <label className={clsx(['btn'], {
                                                "btn-primary": !dataSheetPreview && !data?.dataSheet,
                                                "btn-success": dataSheetPreview || data?.dataSheet,
                                            })} htmlFor="datasheet-input">
                                                Ficha técnica
                                            </label>
                                            <input type="file" hidden name="dataSheet" onChange={handleChange} id="datasheet-input" />
                                        </div>
                                        <div className="col-md-6">
                                            <a href={certificatePreview} target="_blank" style={{ margin: 0 }}>Mostrar Certificado</a>
                                            <label className={clsx(['btn'], {
                                                "btn-primary": !certificatePreview && !data?.certificate,
                                                "btn-success": certificatePreview || data?.certificate,
                                            })} htmlFor="certificate-input">
                                                Certificado
                                            </label>
                                            <input type="file" hidden name="certificate" onChange={handleChange} id="certificate-input" />
                                        </div>
                                    </div>
                                </div>
                                {
                                    certificatePreview || data?.certificate ?
                                        <>
                                            <div className="col-md-6 mb-5 form-group animate__animated animate__fadeInLeft">
                                                <label htmlFor="certificate-expiry-input">
                                                    Fecha de expiración del certificado
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="date"
                                                    value={data?.certificateExpiryDate}
                                                    name="certificateExpiryDate"
                                                    onChange={handleChange}
                                                    id="certificate-expiry-input" />
                                            </div>
                                            <div className="col-md-6 mb-5 form-group animate__animated animate__fadeInLeft">
                                                <label htmlFor="certificate-expiry-days-input">
                                                    Días para notificar
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="number"
                                                    value={data?.notifyCertificateExpiryDays}
                                                    name="notifyCertificateExpiryDays"
                                                    onChange={handleChange}
                                                    id="certificate-expiry-days-input" />
                                            </div>
                                        </>
                                        :
                                        null
                                }
                                <div className="col-md-6">
                                    <div>
                                        <label>
                                            Categoría
                                        </label>
                                        <select className="form-control" disabled={loadingCategories} name="categoryId" value={data?.categoryId} onChange={handleChange}>
                                            <option value="">
                                                Seleccione una categoría
                                            </option>
                                            {
                                                categories?.map?.((category, i) => {
                                                    return <option key={i} value={category?.id}>{category?.name}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div>
                                        <label>
                                            Sub-Categoría
                                        </label>
                                        <select className="form-control" disabled={subCategoriesLoading || !data?.categoryId} name="subCategoryId" value={data?.subCategoryId} onChange={handleChange}>
                                            <option value="">
                                                Seleccione una sub categoría
                                            </option>
                                            {
                                                subCategories?.map?.((category, i) => {
                                                    return <option key={i} value={category?.id}>{category?.name}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-12 mt-4">
                                    <div>
                                        <label>
                                            Precio
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Precio del producto"
                                            name="price"
                                            value={data?.price}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 mt-4">
                                    <label>
                                        Descripción
                                    </label>
                                    <textarea name="description" onChange={handleChange} value={data?.description} className="form-control" style={{ height: 120 }} rows={8}></textarea>
                                </div>
                                <div className="mt-4">
                                    <h2>
                                        Características
                                    </h2>
                                    <div className="row">
                                        {
                                            features?.length > 0 ?
                                                features?.map((feature, i) => {
                                                    return (
                                                        <div className="col-md-3" key={i}>
                                                            <h5>
                                                                {feature?.name}
                                                            </h5>
                                                            <div
                                                                className="custom-scrollbar scrollbar-primary"
                                                                style={{ maxHeight: '150px', overflowY: 'auto' }}
                                                            >
                                                                {
                                                                    feature?.options?.map((option, i) => {
                                                                        return (
                                                                            <div key={i}>
                                                                                <input
                                                                                    value={option?.id}
                                                                                    type="checkbox"
                                                                                    name="productFeatureOptionIds"
                                                                                    style={{ cursor: 'pointer' }}
                                                                                    checked={data?.productFeatureOptionIds?.includes(option?.id)}
                                                                                    onChange={handleChange}
                                                                                    className="mx-2"
                                                                                    id={`feature-options-${option?.id}`}
                                                                                />
                                                                                <label htmlFor={`feature-options-${option?.id}`} style={{ cursor: 'pointer' }}>
                                                                                    {option?.name}
                                                                                </label>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                                :
                                                <div className="text-center">
                                                    No hay Características.
                                                </div>
                                        }
                                    </div>
                                </div>
                                <div className="form-group mb-3 col-md-12 mt-4">
                                    <h6>Servicios</h6>
                                    <p>Seleccione los servicios a los cuales Pertenece el producto.</p>
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
                                    <div className="row">
                                        {
                                            services?.map((service, i) => {
                                                return (
                                                    <div className="col-md-3" key={i}>
                                                        <div className="form-check form-check-inline">
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
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3 d-flex justify-content-end">
                                <Link to={`#`} onClick={() => { navigate(-1) }} className="btn btn-danger mx-2">
                                    Volver
                                </Link>
                                <button type="submit" className="btn btn-primary mx-2">
                                    Actualizar
                                </button>
                            </div>
                        </form>
                        <br />
                        <div style={{ borderTop: '1px solid gray', padding: '15px 0px' }}>
                            <div className="row">
                                <div className="col-md-6">
                                    <h3>Versiones</h3>
                                </div>
                                <div className="col-md-6 text-end">
                                    <a style={{ marginLeft: 'auto' }} className="btn btn-primary" href={`/productos/crear?parentId=${product?.data?.id}`}>
                                        Añadir versión
                                    </a>
                                </div>
                            </div>
                            {
                                product?.data?.childrens?.length > 0 ?
                                    product?.data?.childrens?.map((productChild, i) => {
                                        return (
                                            <div className="row align-items-center">
                                                <div className="col-md-2">
                                                    <img
                                                        style={{ height: '80px', width: '80px', borderRadius: '10px' }}
                                                        src={imgUrl(productChild?.imagePath)}
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <a href={`/productos/${productChild?.id}?name="${productChild?.name}"`}>
                                                        <h5>
                                                            {productChild?.name}
                                                        </h5>
                                                    </a>
                                                </div>
                                                <div className="col-md-3">
                                                    <h5>
                                                        {productChild?.code}
                                                    </h5>
                                                </div>
                                                <div className="col-md-2">
                                                    <h5>
                                                        {productChild?.price}$
                                                    </h5>
                                                </div>
                                                <div className="col-md-2">
                                                    <a className="btn btn-block btn-warning" href={`/productos/${productChild?.id}?name="${productChild?.name}"`}>
                                                        Editar
                                                    </a>
                                                    <button type="button" className="btn btn-block btn-danger mt-2">
                                                        Remover
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })
                                    :
                                    <div className="text-center text-danger">
                                        <h4>
                                            No tiene versiones
                                        </h4>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={showProductsModal} className="fade" size="lg">
                <Modal.Header>
                    <Modal.Title>Productos</Modal.Title>
                    <Button
                        variant=""
                        className="btn-close"
                        onClick={() => setShowProductsModal(false)}
                    >
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-4">
                            <div>
                                <label style={{ marginRight: '10px' }}>Nombre:</label>
                                <input
                                    placeholder="Escriba el nombre..."
                                    className="form-control"
                                    value={productsFilters?.name}
                                    type="text"
                                    onChange={(e) => {
                                        setProductsFilters((oldFilters) => {
                                            return {
                                                ...oldFilters,
                                                name: e.target.value,
                                                page: 1
                                            }
                                        })
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div>
                                <label>
                                    Categoría
                                </label>
                                <select
                                    className="form-control"
                                    disabled={loadingCategories}
                                    name="categoryId"
                                    value={productsFilters?.categoryId}
                                    onChange={(e) => {
                                        setProductsFilters((oldFilters) => {
                                            return {
                                                ...oldFilters,
                                                [e.target.name]: e.target.value,
                                                page: 1
                                            }
                                        })
                                    }}
                                >
                                    <option value="">
                                        Seleccione una categoría
                                    </option>
                                    {
                                        categories?.map?.((category, i) => {
                                            return <option key={i} value={category?.id}>{category?.name}</option>
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div>
                                <label>
                                    Sub-Categoría
                                </label>
                                <select
                                    className="form-control"
                                    disabled={modalSubCategoriesLoading || !productsFilters?.categoryId}
                                    name="subCategoryId"
                                    value={filters?.subCategoryId}
                                    onChange={(e) => {
                                        setProductsFilters((oldFilters) => {
                                            return {
                                                ...oldFilters,
                                                [e.target.name]: e.target.value,
                                                page: 1
                                            }
                                        })
                                    }}
                                >
                                    <option value="">
                                        Seleccione una sub categoría
                                    </option>
                                    {
                                        modalSubCategories?.map?.((category, i) => {
                                            return <option key={i} value={category?.id}>{category?.name}</option>
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <CustomTable
                        onSelectValue={handleProduct}
                        loading={loadingProducts}
                        withoutGlobalActions
                        variant="simple"
                        hideSelectAll
                        selectedValues={data?.parentId}
                        total={productsTotal}
                        values={products}
                        currentPage={productsFilters.page}
                        collumns={ShortProductsColumns}
                        changePage={handlePage}
                        pages={productsPages}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={() => { setShowProductsModal(false) }} className="btn btn-danger">
                        Cerrar
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
export default ProductsUpdate;