import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CustomSelect from "../../../components/CustomSelect";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";
import useCategories from "../../../hooks/useCategories";

const CategoriesUpdate = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const { setCustomAlert, setLoading } = useFeedBack();

    const [filters, setFilters] = useState({
        perPage: 200,
        page: 1,
        name: '',
        parentsOnly: true
    });

    const [data, setData] = useState({
        name: '',
        description: '',
        parentId: ''
    });

    const [firstLoading, setFirstLoading] = useState(true);

    const [{ data: category, error: categoryError, loading: categoryLoading }, getCategory] = useAxios({ url: `/categories/${id}` }, { useCache: false });

    const [{ data: updateData, loading: updateLoading, error: updateError }, updateCategory] = useAxios({ url: `/categories/${id}`, method: 'PUT' }, { manual: true, useCache: false });

    const [{ categories, error: categoriesError, loading: categoriesLoading }, getCategories] = useCategories({ axiosConfig: { params: { ...filters } }, options: { useCache: false } });

    useEffect(() => {
        if (category) {
            console.log(category?.data);
            setFilters((oldFilters) => {
                return {
                    ...oldFilters,
                    name: category?.data?.parentCategory?.name
                }
            })
            setData((oldData) => {
                return {
                    ...oldData,
                    name: category?.data?.name,
                    description: category?.data?.description,
                    parentId: category?.data?.parentCategory ? category?.data?.parentCategory?.id : ''
                }
            })
        }
    }, [category])

    useEffect(() => {
        if (!categoriesLoading && !categoryLoading) {
            setFirstLoading(false);
        } else {
            setFirstLoading(true);
        }
    }, [categoriesLoading, categoryLoading]);

    useEffect(() => {
        setLoading({
            show: firstLoading,
            message: 'Obteniendo informacion'
        });
    }, [firstLoading])

    useEffect(() => {
        if (updateData) {
            setCustomAlert({
                title: '¡Operacion Exitosa!',
                severity: 'success',
                message: 'La categoria fue actualizada exitosamente.',
                show: true
            });

            navigate('/categorias');
        }
    }, [updateData]);

    useEffect(() => {
        if (updateError) {
            setCustomAlert({
                title: 'Error',
                severity: 'danger',
                message: 'Ha ocurrido un error.',
                show: true
            });
        }

        if (categoriesError) {
            setCustomAlert({
                title: 'Error',
                severity: 'danger',
                message: 'Ha ocurrido un error al obtener las categorias.',
                show: true
            });
        }

        if (categoryError) {
            setCustomAlert({
                title: 'Error',
                severity: 'danger',
                message: 'Ha ocurrido un error al obtener la categoria.',
                show: true
            });
        }
    }, [updateError, categoriesError, categoryError])

    const handleSubmit = (e) => {
        e?.preventDefault?.();

        if (updateLoading) {
            return;
        }

        if (!data?.name) {
            setCustomAlert({
                title: 'Error',
                severity: 'danger',
                message: 'El nombre es obligatorio.',
                show: true
            });
            return;
        }

        updateCategory({ data });
    }

    const handleChange = (e) => {
        setData((oldData) => {
            return {
                ...oldData,
                [e.target.name]: e.target.type === 'file' ? e.target.files[0] : e.target.value
            }
        })
    }

    const handleCategory = (category) => {
        setData((oldData) => {
            return {
                ...oldData,
                parentId: category?.id
            }
        });
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                name: category?.name
            }
        });
    }

    return (
        <div>
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Crear Categoria</h4>
                </div>
                <div className="card-body">
                    <div className="basic-form">
                        <form onSubmit={handleSubmit}>
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
                                    <label>Categoria padre</label>
                                    {

                                    }
                                    <CustomSelect
                                        options={categories}
                                        optionLabel="name"
                                        inputPlaceholder="Escribe el nombre..."
                                        isLoading={categoriesLoading}
                                        onSelectValue={handleCategory}
                                        handleInputChange={(e) => { setFilters((oldFilters) => { return { ...oldFilters, name: e.target.value } }) }}
                                        inputValue={filters?.name}
                                    />
                                </div>
                                <div className="form-group mb-3 col-md-12">
                                    <label>Descripcion</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Descripcion"
                                        name="description"
                                        value={data?.description}
                                        onChange={handleChange}
                                    />
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
export default CategoriesUpdate;