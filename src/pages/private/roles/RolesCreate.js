import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";
import usePermissions from "../../../hooks/usePermissions";
import { mainPermissions } from "../../../util/MenuLinks";

const RolesCreate = () => {

    const navigate = useNavigate();

    const { setCustomAlert } = useFeedBack();

    const [data, setData] = useState({
        name: '',
        permissions: []
    });

    const [filters, setFilters] = useState({
        page: 1,
        perPage: 200,
        grouped: true
    });

    const [{ data: createData, loading: createLoading, error: createError }, createRole] = useAxios({ url: `/roles`, method: 'POST' }, { manual: true, useCache: false });

    const [{ permissions, error: permissionsError, loading: permissionsLoading }, getPermissions] = usePermissions({ params: { ...filters } }, { useCache: false });

    useEffect(() => {
        console.log(permissions);
    }, [permissions])

    useEffect(() => {
        getPermissions({ params: { ...filters } })
    }, [filters])

    useEffect(() => {
        if (createData) {
            window.scrollTo({ top: 0 });
            setCustomAlert({
                title: '¡Operacion Exitosa!',
                severity: 'success',
                message: 'El rol fue creado exitosamente.',
                show: true
            });
            setData({
                name: '',
                permissions: []
            })
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

        if (permissionsError) {
            setCustomAlert({
                title: 'Error',
                severity: 'danger',
                message: 'Ha ocurrido un error al obtener los permisos.',
                show: true
            });
        }
    }, [createError, permissionsError]);

    const handleSubmit = (e) => {
        e?.preventDefault?.();

        if (createLoading) {
            return;
        }

        if (!data?.name) {
            setCustomAlert({
                title: 'Error',
                severity: 'danger',
                message: 'El campo nombre es obligatorio.',
                show: true
            });
            return;
        }
        createRole({ data });
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
                [e.target.name]: e.target.value
            }
        })
    }

    const handlePermissionAll = (values) => {
        let hash = {};
        if (checker(values, data?.permissions)) {
            values.forEach((value) => {
                hash[value] = true;
            });
            setData((oldData) => {
                return {
                    ...oldData,
                    permissions: data?.permissions?.filter((permission) => !hash[permission])
                }
            });
        } else {
            values.forEach((value) => {
                hash[value] = true;
            });

            let oldPermissions = data?.permissions?.filter((permission) => !hash[permission]);

            setData((oldData) => {
                return {
                    ...oldData,
                    permissions: [...oldPermissions, ...values]
                }
            });

        }
    }

    const checker = (arr, target) => arr.every((value) => target?.includes(value))

    return (
        <div>
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Crear Rol</h4>
                </div>
                <div className="card-body">
                    <div className="basic-form">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3 row">
                                <label className="col-sm-3 col-form-label"><h3>Nombre</h3></label>
                                <div className="col-sm-9">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Nombre"
                                        name="name"
                                        value={data?.name}
                                        required
                                        onChange={handleChange}

                                    />
                                </div>
                            </div>

                            <h3 className="mb-5">Permisos</h3>
                            <div className="mb-3 row">
                                {
                                    permissionsLoading ?
                                        <div>
                                            <h5>Obteniendo permisos...</h5>
                                        </div>
                                        :
                                        permissions?.map?.((module, i) => {
                                            return (
                                                <div className="col-md-3 text-capitalize form-group" key={i}>
                                                    <div className="form-check mb-2">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            name="permissions"
                                                            id={`permission-all-${i}`}
                                                            checked={checker(module?.permissions?.map?.(permission => permission?.name), data?.permissions)}
                                                            onChange={() => { handlePermissionAll(module?.permissions?.map?.(permission => permission?.name)) }}
                                                        />
                                                        <label className="form-check-label" htmlFor={`permission-all-${i}`}>
                                                            <h5>{module?.name}</h5>
                                                        </label>
                                                    </div>
                                                    {
                                                        module?.permissions?.map((permission, i2) => {
                                                            return (
                                                                <div className="form-check mb-2" key={i2}>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        name="permissions"
                                                                        id={`permission-${i}-${i2}`}
                                                                        value={permission?.name}
                                                                        onChange={handleChange}
                                                                        checked={data?.permissions?.includes(permission?.name)}
                                                                    />
                                                                    <label className="form-check-label" htmlFor={`permission-${i}-${i2}`}>
                                                                        {permission?.displayText}
                                                                    </label>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            )
                                        })
                                }
                            </div>
                            <div className="mb-3 d-flex justify-content-end">
                                <Link to={`#`} onClick={() => { navigate(-1) }} className="btn btn-danger mx-2">
                                    Cancelar
                                </Link>
                                <button disabled={createLoading || permissionsLoading} type="submit" className="btn btn-primary mx-2">
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
export default RolesCreate;