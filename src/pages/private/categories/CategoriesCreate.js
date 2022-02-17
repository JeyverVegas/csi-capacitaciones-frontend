import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";
import useCategories from "../../../hooks/useCategories";

const CategoriesCreate = () => {

    const navigate = useNavigate();

    const { setCustomAlert, setLoading } = useFeedBack();

    const [filters, setFilters] = useState({
        perPage: 200,
        page: 1
    });

    const [data, setData] = useState({
        name: '',
        parentCategoryId: ''
    });

    const [{ data: createData, loading: createLoading, error: createError }, createCategory] = useAxios({ url: `/categories`, method: 'POST' }, { manual: true, useCache: false });

    const [{ categories, error: categoriesError, loading: categoriesLoading }, getCategories] = useCategories({ options: { useCache: false } });

    useEffect(() => {
        setLoading({
            show: categoriesLoading,
            message: 'Obteniendo informacion'
        });
    }, [categoriesLoading]);

    useEffect(() => {
        if (createData) {
            setCustomAlert({
                title: '¡Operacion Exitosa!',
                severity: 'success',
                message: 'La categoria fue creada exitosamente.',
                show: true
            });
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
                message: 'Ha ocurrido un error al obtener las categorias.',
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
                                    <select
                                        className="form-control"
                                        name="parentCategoryId"
                                        value={data?.parentCategoryId}
                                        onChange={handleChange}
                                    >
                                        <option value="">
                                            Seleccione...
                                        </option>
                                        {
                                            categories?.map?.((category, i) => {
                                                return (
                                                    <option value={category?.id} key={i}>
                                                        {category?.name}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
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