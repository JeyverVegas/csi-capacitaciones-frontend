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
import ProductVersionsContainer from "../../../components/Forms/ProductVersionsContainer";
import Toggle from "react-toggle";




const ProductsUpdate = () => {

    const { id } = useParams();

    const { setLoading, setCustomAlert } = useFeedBack();

    const navigate = useNavigate();

    const { openMenuToggle, customMenuToggle, sideBarStyle } = useTheme();

    const [servicesFilters, setServicesFilters] = useState({
        perPage: 200,
        page: 1
    })

    const [filters, setFilters] = useState({
        name: '',
        page: 1
    });

    const [categoriesFilters, setCategoriesFilters] = useState({
        name: '',
        page: 1
    });

    const [subCategoriesFilters, setSubCategoriesFilters] = useState({
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
        description: '',
        serviceIds: [],
        code: '',
        price: 0,
        isReplacement: false,
        _method: 'PUT'
    });

    const [imagePreview, setImagePreview] = useState('');

    const [certificatePreview, setCertificatePreview] = useState('');

    const [dataSheetPreview, setDataSheetPreview] = useState('');

    const [{ providers, total, numberOfPages, size, error, loading }, getProviders] = useProviders({ options: { manual: true, useCache: false } });

    const [{ categories, loading: loadingCategories }, getCategories] = useCategories({ options: { manual: true, useCache: false } });

    const [{ categories: subCategories, loading: subCategoriesLoading }, getSubCategories] = useCategories({ options: { manual: true, useCache: false } });

    const [{ services, error: servicesError, loading: servicesLoading }, getServices] = useServices({ axiosConfig: { params: { ...servicesFilters } }, options: { useCache: false } });

    const [{ data: product, loading: productLoading }, getProduct] = useAxios({ url: `/products/${id}` }, { useCache: false });

    const [{ data: updateData, loading: updateLoading }, updateProduct] = useAxios({ url: `/products/${id}`, method: 'POST' }, { manual: true, useCache: false });

    useEffect(() => {
        if (product) {

            const { category, subCategory, certificate, dataSheet, createdAt, id, imagePath, provider, ...rest } = product?.data;
            setData((oldData) => {
                return {
                    ...oldData,
                    ...rest,
                    categoryId: category?.id || '',
                    subCategoryId: subCategory?.id || ''
                }
            });
            if (category) {
                setCategoriesFilters((oldCategoriesFilters) => {
                    return {
                        ...oldCategoriesFilters,
                        name: category?.name
                    }
                });
            }

            if (subCategory) {

            }

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
            if (imagePath) setImagePreview(`${SystemInfo?.host}${imagePath}`);

        }
    }, [product]);

    useEffect(() => {
        getSubCategories({
            params: {
                ...subCategoriesFilters,
                parentId: data?.categoryId
            }
        });
    }, [data?.categoryId])

    useEffect(() => {
        setLoading?.({
            show: updateLoading,
            message: `Actualizando`
        });
    }, [updateLoading]);

    useEffect(() => {
        setLoading?.({
            show: productLoading,
            message: `Obteniendo informacion`
        });
    }, [productLoading])

    useEffect(() => {
        if (updateData) {
            setCustomAlert({
                title: '¡Operacion Exitosa!',
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

        const { productVersions, serviceIds, ...rest } = data;
        console.log(rest);
        Object.keys(data).forEach((key, i) => {
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
        })

        serviceIds?.forEach((serviceId, key) => {
            formData.append(`serviceIds[${key}]`, serviceId);
        });

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

    return (
        <div className="card" style={{ width: '100%', marginBottom: 200 }}>
            <div className="card-body">
                <div className="basic-form">
                    <form onSubmit={handleSubmit}>
                        <div className="row mb-5">
                            <div className="col-md-12 mb-4">
                                <h5>¿Es un Repuesto?</h5>
                                <Toggle onChange={() => { setData((oldData) => { return { ...oldData, isReplacement: !oldData?.isReplacement } }) }} checked={data?.isReplacement} />
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
                                    previewImage={imagePreview}
                                    style={{ width: '65%' }}
                                    description="imagen del producto"
                                    name="image"
                                    change={handleChange}
                                />
                                <div className="text-center mt-4 row">
                                    <div className="col-md-6">
                                        <a href={dataSheetPreview} target="_blank" style={{ margin: 0 }}>Mostrar Ficha Tecnica</a>
                                        <label className={clsx(['btn'], {
                                            "btn-primary": !dataSheetPreview,
                                            "btn-success": dataSheetPreview,
                                        })} htmlFor="datasheet-input">
                                            Ficha tecnica
                                        </label>
                                        <input type="file" hidden name="dataSheet" onChange={handleChange} id="datasheet-input" />
                                    </div>
                                    <div className="col-md-6">
                                        <a href={certificatePreview} target="_blank" style={{ margin: 0 }}>Mostrar Certificado</a>
                                        <label className={clsx(['btn'], {
                                            "btn-primary": !certificatePreview,
                                            "btn-success": certificatePreview,
                                        })} htmlFor="certificate-input">
                                            Certificado
                                        </label>
                                        <input type="file" hidden name="certificate" onChange={handleChange} id="certificate-input" />
                                    </div>
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
                            <div className="col-md-12">
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
                    <ProductVersionsContainer
                        initialVersions={product?.data?.productVersions}
                        productId={id}
                    />
                </div>
            </div>
        </div>
    )
}
export default ProductsUpdate;