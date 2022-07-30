import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import CustomSelect from "../../../components/CustomSelect";
import ImgUploadInput from "../../../components/ImgUploadInput";
import { useTheme } from "../../../context/ThemeContext";
import useCategories from "../../../hooks/useCategories";
import useProviders from "../../../hooks/useProviders";
import clsx from "clsx";
import useAxios from "../../../hooks/useAxios";
import { useFeedBack } from "../../../context/FeedBackContext";
import useServices from "../../../hooks/useServices";
import Toggle from "react-toggle";
import useProducts from "../../../hooks/useProducts";
import { Button, Modal } from "react-bootstrap";
import CustomTable from "../../../components/CustomTable/CustomTable";
import ShortProductsColumns from "../../../components/CustomTable/Columns/ShortProductsColumns";
import useFeatures from "../../../hooks/useFeatures";
import FeatureOptionsContainer from "../../../components/FeaturesComponents/FeatureOptionsContainer";



const ProductsCreate = () => {

    const [searchParams] = useSearchParams();

    const { setLoading, setCustomAlert } = useFeedBack();

    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        name: '',
        page: 1
    });

    const [servicesFilters, setServicesFilters] = useState({
        perPage: 200,
        page: 1
    })

    const [productsFilters, setProductsFilters] = useState({
        perPage: 100,
        page: 1,
        parentsOnly: true,
        name: ''
    });

    const [featuresFilters, setFeaturesFilters] = useState({
        page: 1,
        perPage: 100
    })

    const [categoriesFilters, setCategoriesFilters] = useState({
        name: '',
        page: 1,
        perPage: 200,
        parentsOnly: true
    });

    const [subCategoriesFilters, setSubCategoriesFilters] = useState({
        page: 1,
        perPage: 200
    });

    const [modalSubCategoriesFilters, setModalSubCategoriesFilters] = useState({
        page: 1,
        perPage: 200
    });

    const [showProductsModal, setShowProductsModal] = useState(false);

    const [data, setData] = useState({
        name: '',
        image: null,
        reference: '',
        providerId: '',
        categoryId: '',
        subCategoryId: '',
        dataSheet: '',
        certificate: '',
        description: '',
        code: '',
        price: 0,
        serviceIds: [],
        isReplacement: false,
        parentId: [],
        parent: '',
        productFeatureOptionIds: []
    });

    const { openMenuToggle, customMenuToggle, sideBarStyle } = useTheme();

    const [{ providers, total, numberOfPages, size, error, loading }, getProviders] = useProviders({ options: { manual: true, useCache: false } });

    const [{ features, total: featuresTotal, numberOfPages: featuresPages, loading: featuresLoading }, getFeatures] = useFeatures({ options: { manual: true, useCache: false } });

    const [{ products, numberOfPages: productsPages, loading: loadingProducts, total: productsTotal }, getProducts] = useProducts({ options: { manual: true, useCache: false } });

    const [{ categories, loading: loadingCategories }, getCategories] = useCategories({ options: { manual: true, useCache: false } });

    const [{ categories: subCategories, loading: subCategoriesLoading }, getSubCategories] = useCategories({ options: { manual: true, useCache: false } });

    const [{ categories: modalSubCategories, loading: modalSubCategoriesLoading }, getModalSubCategories] = useCategories({ options: { manual: true, useCache: false } });

    const [{ data: createData, loading: createLoading }, createProduct] = useAxios({ url: `/products`, method: 'POST' }, { manual: true, useCache: false });

    const [{ loading: findParentLoading }, findParent] = useAxios({ manual: true, useCache: false });

    const [{ services, error: servicesError, loading: servicesLoading }, getServices] = useServices({ axiosConfig: { params: { ...servicesFilters } }, options: { useCache: false } });

    useEffect(() => {
        const productParentId = searchParams?.get('parentId');
        if (productParentId) {
            findParent({ url: `/products/${productParentId}` }).then((response) => {
                const parentData = response?.data?.data;
                console.log(parentData);
                setData((oldData) => {
                    return {
                        ...oldData,
                        parent: parentData,
                        parentId: [parentData?.id]
                    }
                })
            });
        }
    }, [searchParams])

    useEffect(() => {
        setLoading?.({
            show: createLoading,
            message: `Creando Producto`
        });
    }, [createLoading])

    useEffect(() => {
        setData((oldData) => {
            return {
                ...oldData,
                subCategoryId: ''
            }
        });
        getSubCategories({
            params: {
                ...subCategoriesFilters,
                parentId: data?.categoryId
            }
        });

    }, [data?.categoryId])

    useEffect(() => {
        if (createData) {
            setData((oldData) => {
                return {
                    ...oldData,
                    id: createData?.data?.id,
                    image: null,
                    dataSheet: null,
                    certificate: null
                }
            });
            setCustomAlert({
                title: '¡Operacion Exitosa!',
                severity: 'success',
                message: `El producto fue creado exitosamente.`,
                show: true
            });
            navigate?.(`/productos/${createData?.data?.id}?name=${createData?.data?.name}`)
        }
    }, [createData])

    useEffect(() => {
        getFeatures({
            params: {
                ...featuresFilters
            }
        });
    }, [featuresFilters]);

    useEffect(() => {
        getProviders({
            params: {
                ...filters
            }
        });
    }, [filters]);

    useEffect(() => {
        getProducts({
            params: {
                ...productsFilters
            }
        });
    }, [productsFilters]);

    useEffect(() => {
        getServices({
            params: {
                ...servicesFilters
            }
        });
    }, [servicesFilters])

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
        getCategories({
            params: {
                ...categoriesFilters
            }
        });
    }, [categoriesFilters]);

    useEffect(() => {
        customMenuToggle(true);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault?.();

        const formData = new FormData();

        const { parent, parentId, productFeatureOptionIds, ...rest } = data;

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

        productFeatureOptionIds?.forEach((featureId, i) => {
            formData?.append(`productFeatureOptionIds[${i}]`, featureId);
        })

        if (parentId?.length > 0) {
            formData?.append('parentId', parentId[0]);
        }

        createProduct({ data: formData });
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
                parent: value?.id === oldData['parentId'][0] ? '' : value,
                parentId: value?.id === oldData['parentId'][0] ? [] : [value?.id]
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
        <div className="card" style={{ width: '100%' }}>
            <div className="card-body">
                <div className="basic-form">
                    <form onSubmit={handleSubmit}>
                        <div className="row mb-5">
                            <div className="col-md-6 mb-4">
                                <h5>¿Es un Repuesto?</h5>
                                <Toggle onChange={() => { setData((oldData) => { return { ...oldData, isReplacement: !oldData?.isReplacement } }) }} checked={data?.isReplacement} />
                            </div>
                            <div className="col-md-6 mb-4">
                                <h5>Producto padre</h5>
                                {
                                    !data?.parent &&
                                    <>
                                        <span>
                                            Escoja un producto padre si este es una version de otro producto.
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
                                        Codigo
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
                                    style={{ width: '65%' }}
                                    description="imagen del producto"
                                    name="image"
                                    change={handleChange}
                                />
                                <div className="text-center mt-4">
                                    <label className={clsx(['btn mx-1'], {
                                        "btn-primary": !data?.dataSheet,
                                        "btn-success": data?.dataSheet,
                                    })} htmlFor="datasheet-input">
                                        Ficha tecnica
                                    </label>
                                    <input type="file" hidden name="dataSheet" onChange={handleChange} id="datasheet-input" />
                                    <label className={clsx(['btn mx-1'], {
                                        "btn-primary": !data?.certificate,
                                        "btn-success": data?.certificate,
                                    })} htmlFor="certificate-input">
                                        Certificado
                                    </label>
                                    <input type="file" hidden name="certificate" onChange={handleChange} id="certificate-input" />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div>
                                    <label>
                                        Categoria
                                    </label>
                                    <select className="form-control" disabled={loadingCategories} name="categoryId" value={data?.categoryId} onChange={handleChange}>
                                        <option value="">
                                            Seleccione una categoria
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
                                        Sub-Categoria
                                    </label>
                                    <select className="form-control" disabled={subCategoriesLoading || !data?.categoryId} name="subCategoryId" value={data?.subCategoryId} onChange={handleChange}>
                                        <option value="">
                                            Seleccione una sub categoria
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
                            <div className="col-md-12 mt-3">
                                <label>
                                    Descripción
                                </label>
                                <textarea name="description" onChange={handleChange} className="form-control" style={{ height: 120 }} rows={8}></textarea>
                            </div>
                            <div className="mt-4">
                                <h2>
                                    Caracteristicas
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
                                                No hay Caracteristicas.
                                            </div>
                                    }
                                </div>
                            </div>
                            <div className="form-group mb-3 col-md-12 mt-4">
                                <h6>Servicios</h6>
                                <p>Seleccione los servicios a los cuales Pertenece el producto.</p>
                                {
                                    servicesLoading ?
                                        <span>Obteniendo servicios...</span>
                                        :
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
                                }
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
                                Crear
                            </button>
                        </div>
                    </form>
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
                                    Categoria
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
                                        Seleccione una categoria
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
                                    Sub-Categoria
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
                                        Seleccione una sub categoria
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
export default ProductsCreate;