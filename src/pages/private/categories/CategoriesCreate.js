import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomSelect from "../../../components/CustomSelect";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";
import useCategories from "../../../hooks/useCategories";

const CategoriesCreate = () => {

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
        parentId: '',
        description: ''
    });

    const [{ data: createData, loading: createLoading, error: createError }, createCategory] = useAxios({ url: `/categories`, method: 'POST' }, { manual: true, useCache: false });

    const [{ categories, error: categoriesError, loading: categoriesLoading }, getCategories] = useCategories({ axiosConfig: { params: { ...filters } }, options: { useCache: false } });

    useEffect(() => {
        if (createData) {
            setCustomAlert({
                title: '¡Operacion Exitosa!',
                severity: 'success',
                message: 'La categorías fue creada exitosamente.',
                show: true
            });
            navigate('/categorias');
        }
    }, [createData])

    useEffect(() => {
        if (createError) {
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
                message: 'Ha ocurrido un error al obtener las categorías.',
                show: true
            });
        }
    }, [createError, categoriesError])

    const handleSubmit = (e) => {
        e?.preventDefault?.();

        if (createLoading) {
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

        createCategory({ data });
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
                    <h4 className="card-title">Crear Categoría</h4>
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
                                    <label>Categoría padre</label>
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
                                    <label>Descripción</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Descripción"
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
                                <button disabled={createLoading} type="submit" className="btn btn-primary mx-2">
                                    {
                                        createLoading ?
                                            'Cargando'
                                            :
                                            'Crear'
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
export default CategoriesCreate;