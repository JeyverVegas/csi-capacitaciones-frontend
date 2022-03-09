import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

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
import SystemInfo from "../../../util/SystemInfo";
import update from 'immutability-helper';




const ProductsUpdate = () => {

    const { id } = useParams();

    const { setLoading, setCustomAlert } = useFeedBack();

    const navigate = useNavigate();

    const { openMenuToggle, customMenuToggle, sideBarStyle } = useTheme();

    const [filters, setFilters] = useState({
        name: '',
        page: 1
    });

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
        description: '',
        _method: 'PUT'
    });

    const [imagePreview, setImagePreview] = useState('');

    const [productVersions, setProductVersions] = useState([]);

    const [{ providers, total, numberOfPages, size, error, loading }, getProviders] = useProviders({ options: { manual: true, useCache: false } });

    const [{ categories, loading: loadingCategories }, getCategories] = useCategories({ options: { manual: true, useCache: false } });

    const [{ data: product, loading: productLoading }, getProduct] = useAxios({ url: `/products/${id}` }, { useCache: false });

    const [{ data: updateData, loading: updateLoading }, updateProduct] = useAxios({ url: `/products/${id}`, method: 'POST' }, { manual: true, useCache: false });

    useEffect(() => {
        if (product) {

            const { category, certificate, dataSheet, createdAt, id, imagePath, provider, ...rest } = product?.data;
            setData((oldData) => {
                return {
                    ...oldData,
                    ...rest
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

            if (provider) {
                setFilters((oldFilters) => {
                    return {
                        ...oldFilters,
                        name: provider?.name
                    }
                });
            }

            if (imagePath) {
                setImagePreview(`${SystemInfo?.host}/${imagePath}`);
            }
        }
    }, [product]);

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
            text: "¿Quieres agregar una nueva versión de este producto?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willAdded) => {
            if (willAdded) {
                setProductVersions((oldVersions) => {
                    return [{ name: '', code: '', image: null, features: [], price: '' }, ...oldVersions];
                });
            }
        });
    }

    const handleDeleteVersion = (productVersion, index) => {
        swal({
            title: "¿Estas Seguro?",
            text: "¿Deseas eliminar esta version?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((wantDelete) => {
            if (wantDelete) {
                hadleWantDelete(productVersion, index);
            }
        });

    }

    const hadleWantDelete = (productVersion, index) => {
        if (!productVersion?.id) {
            setProductVersions(productVersions.filter((product, i) => i !== index));
        }
    }

    const handleVersionChange = (event, index) => {
        const newCollection = update(productVersions, { [index]: { [event?.target?.name]: { $set: event.target.type === 'file' ? event.target.files[0] : event.target.value } } });
        setProductVersions(newCollection);
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
                                    previewImage={imagePreview}
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
                                <textarea name="description" onChange={handleChange} value={data?.description} className="form-control" style={{ height: 120 }} rows={8}></textarea>
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
                    <div className="col-md-12 my-4 border-top py-4">
                        <h3>Versiones del producto</h3>
                        <div className="d-flex justify-content-end">
                            <button type="button" className="btn btn-primary mx-2" onClick={handleAddVersion}>
                                Nueva Version
                            </button>
                        </div>
                    </div>
                    {
                        productVersions?.map((productVersion, i) => {
                            return (
                                <ProductVersionForm
                                    onDelete={handleDeleteVersion}
                                    productId={id}
                                    productVersion={productVersion}
                                    onChange={handleVersionChange}
                                    key={i}
                                    index={i}
                                />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}
export default ProductsUpdate;