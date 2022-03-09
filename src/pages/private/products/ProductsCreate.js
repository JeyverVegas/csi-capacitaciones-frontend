import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';

import CustomSelect from "../../../components/CustomSelect";
import ImgUploadInput from "../../../components/ImgUploadInput";
import { useTheme } from "../../../context/ThemeContext";
import useCategories from "../../../hooks/useCategories";
import useProviders from "../../../hooks/useProviders";
import clsx from "clsx";
import ProductVersionForm from "../../../components/Forms/ProductVersionsForm";
import swal from "sweetalert";
import useAxios from "../../../hooks/useAxios";
import { useFeedBack } from "../../../context/FeedBackContext";




const ProductsCreate = () => {

    const { setLoading, setCustomAlert } = useFeedBack();

    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        name: '',
        page: 1
    });

    const [swiper, setSwiper] = useState(null);

    const [categoriesFilters, setCategoriesFilters] = useState({
        name: '',
        page: 1
    });

    const [data, setData] = useState({
        name: '',
        image: null,
        reference: '',
        providerId: '',
        categoryId: '',
        dataSheet: '',
        certificate: '',
        description: ''
    });

    const [productVersions, setProductVersions] = useState([]);

    const { openMenuToggle, customMenuToggle, sideBarStyle } = useTheme();

    const [{ providers, total, numberOfPages, size, error, loading }, getProviders] = useProviders({ options: { manual: true, useCache: false } });

    const [{ categories, loading: loadingCategories }, getCategories] = useCategories({ options: { manual: true, useCache: false } });

    const [{ data: createData, loading: createLoading }, createProduct] = useAxios({ url: `/products`, method: 'POST' }, { manual: true, useCache: false });

    useEffect(() => {
        setLoading?.({
            show: createLoading,
            message: `${data?.id ? 'Actualizando' : 'Creando'} Producto`
        });
    }, [createLoading])

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
                message: `El producto fue ${data?.id ? 'actualizado' : 'creado'} exitosamente.`,
                show: true
            });
            console.log(createData);
        }
    }, [createData])

    useEffect(() => {
        if (productVersions?.length > 0) {
            swiper?.slideTo(productVersions?.length);
        }
    }, [productVersions])

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

        Object.keys(data).forEach((key, i) => {
            if (key !== 'id') {
                if (data[key]) {
                    if (key === 'image' || key === 'dataSheet' || key === 'certificate') {
                        formData.append(key, data[key], data[key].name);
                    } else {
                        formData.append(key, data[key]);
                    }
                }
            }
        })
        if (data?.id) {
            formData?.append('_method', 'PUT');
            createProduct({ data: formData, url: `/products/${data?.id}`, method: 'POST' });
        } else {
            createProduct({ data: formData });
        }
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
        })
    }

    const handleChange = (e) => {
        setData((oldData) => {
            return {
                ...oldData,
                [e.target.name]: e.target.type === 'file' ? e.target.files[0] : e.target.value
            }
        })
    }

    const handleAddVersion = () => {
        swal({
            title: "¿Estas Seguro?",
            text: "¿Quieres agregar una nueva version de este producto?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willAdded) => {
            if (willAdded) {
                setProductVersions((oldVersions) => {
                    return [...oldVersions, { name: '', code: '', image: null, features: [] }];
                });
            } else {

            }
        });
    }

    return (
        <div className="card" style={{ width: '100%' }}>
            <div className="card-body">
                <div className="basic-form">
                    <form onSubmit={handleSubmit}>
                        <div className="row mb-5">
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
                                <div>
                                    <label>
                                        Categoria
                                    </label>
                                    <CustomSelect
                                        options={categories}
                                        optionLabel="name"
                                        inputPlaceholder="Escribe el nombre..."
                                        isLoading={loadingCategories}
                                        onSelectValue={handleCategory}
                                        handleInputChange={(e) => { setCategoriesFilters((oldFilters) => { return { ...oldFilters, name: e.target.value } }) }}
                                        inputValue={categoriesFilters?.name}
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
                            <div className="col-md-12">
                                <label>
                                    Descripción
                                </label>
                                <textarea name="description" onChange={handleChange} className="form-control" style={{ height: 120 }} rows={8}></textarea>
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
        </div>
    )
}
export default ProductsCreate;