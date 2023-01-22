import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";
import useCategories from "../../../hooks/useCategories";
import handleLoadSelectOptions from "../../../util/loadSelectValues";
import mapValues from "../../../util/mapValues";
import AsyncSelect from 'react-select/async';

const CategoriesCreate = () => {

    const navigate = useNavigate();

    const { setCustomAlert, setLoading } = useFeedBack();

    const [data, setData] = useState({
        name: '',
        parent: '',
        description: ''
    });

    const [{ data: createData, loading: createLoading, error: createError }, createCategory] = useAxios({ url: `/categories`, method: 'POST' }, { manual: true, useCache: false });

    const [{ categories, loading: categoriesLoading }, getCategories] = useCategories({ options: { manual: true, useCache: false } });

    useEffect(() => {
        if (createData) {
            setCustomAlert({
                title: '¡Operacion Exitosa!',
                severity: 'success',
                message: 'El registro fue creado exitosamente.',
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
    }, [createError])

    const handleSubmit = (e) => {
        e?.preventDefault?.();

        if (createLoading) {
            return;
        }

        createCategory({
            data: {
                ...data,
                parentId: data?.parent?.value || null
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
                                    <AsyncSelect
                                        isClearable
                                        onFocus={() => {
                                            getCategories({
                                                params: {
                                                    parentsOnly: true,
                                                    perPage: 30
                                                }
                                            });
                                        }}
                                        value={data?.parent}
                                        defaultOptions={mapValues(categories)}
                                        isLoading={categoriesLoading}
                                        loadOptions={(e) => handleLoadSelectOptions(e, getCategories, { parentsOnly: true })}
                                        placeholder='Escriba el nombre para buscar...'
                                        onChange={(e) => { handleChange({ target: { value: e, name: 'parent' } }) }}
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