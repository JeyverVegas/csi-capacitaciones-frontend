import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";
import useCategories from "../../../hooks/useCategories";
import AsyncSelect from 'react-select/async';
import mapValues from "../../../util/mapValues";
import handleLoadSelectOptions from "../../../util/loadSelectValues";

const CategoriesUpdate = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const { setCustomAlert, setLoading } = useFeedBack();

    const [data, setData] = useState({
        name: '',
        description: '',
        parent: ''
    });

    const [{ data: category, error: categoryError, loading: categoryLoading }, getCategory] = useAxios({ url: `/categories/${id}` }, { useCache: false });

    const [{ data: updateData, loading: updateLoading, error: updateError }, updateCategory] = useAxios({ url: `/categories/${id}`, method: 'PUT' }, { manual: true, useCache: false });

    const [{ categories, loading: categoriesLoading }, getCategories] = useCategories({ options: { manual: true, useCache: false } });

    useEffect(() => {
        if (category) {
            setData((oldData) => {
                return {
                    ...oldData,
                    name: category?.data?.name,
                    description: category?.data?.description,
                    parent: category?.data?.parentCategory ? mapValues([category?.data?.parentCategory])[0] : null
                }
            })
        }
    }, [category]);

    useEffect(() => {
        if (updateData) {
            setCustomAlert({
                title: '¡Operacion Exitosa!',
                severity: 'success',
                message: 'El registro fue actualizado exitosamente.',
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
    }, [updateError])

    const handleSubmit = (e) => {
        e?.preventDefault?.();

        if (updateLoading) {
            return;
        }

        updateCategory({
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
                    <h4 className="card-title">Actualizar Categoría</h4>
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
                                    <AsyncSelect
                                        isClearable
                                        onFocus={() => {
                                            getCategories({
                                                params: {
                                                    parentsOnly: true,
                                                    exceptIds: [id],
                                                    perPage: 30
                                                }
                                            });
                                        }}
                                        value={data?.parent}
                                        defaultOptions={mapValues(categories)}
                                        isLoading={categoriesLoading}
                                        loadOptions={(e) => handleLoadSelectOptions(e, getCategories, { parentsOnly: true, exceptIds: [id] })}
                                        placeholder='Escriba el nombre para buscar...'
                                        onChange={(e) => { handleChange({ target: { value: e, name: 'parent' } }) }}
                                    />
                                </div>
                                <div className="form-group mb-3 col-md-12">
                                    <label>Descripción</label>
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