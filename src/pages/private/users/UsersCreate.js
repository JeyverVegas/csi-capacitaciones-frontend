import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";

const UsersCreate = () => {

    const navigate = useNavigate();

    const { setCustomAlert } = useFeedBack();

    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        address: '',
        image: null,
        phoneNumber: '',
        positionId: '',
        documentNumber: '',
        documentNumberTypeId: '',
        role: '',
    });

    const [{ data: createData, loading: createLoading, error: createError }, createUser] = useAxios({ url: `/users`, method: 'POST' }, { manual: true, useCache: false });

    useEffect(() => {
        if (createData) {
            window.scrollTo({ top: 0 });
            setCustomAlert({
                title: '¡Operacion Exitosa!',
                severity: 'success',
                message: 'El cargo fue creado exitosamente.',
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
    }, [createError])

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
        createUser({ data })
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

    return (
        <div>
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Crear usuario</h4>
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
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Email"
                                        name="email"
                                        value={data?.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group mb-3 col-md-6">
                                    <label>Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Contraseña"
                                        name="password"
                                        value={data?.password}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group mb-3 col-md-6">
                                    <label>Dirección</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ingrese una direccion"
                                        name="address"
                                        value={data?.address}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group mb-3 col-md-6">
                                    <label>Numero de telefono</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ingrese un numero telefonico"
                                        name="phoneNumber"
                                        value={data?.phoneNumber}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group mb-3 col-md-6">
                                    <label>Cargo</label>
                                    <select
                                        defaultValue={""}
                                        className="form-control"
                                        value={data?.positionId}
                                        name="positionId"
                                    >
                                        <option value="" disabled>
                                            Selecciona...
                                        </option>
                                        <option value="1">
                                            Encargado
                                        </option>
                                    </select>
                                </div>

                                <div className="form-group mb-3 col-md-6">
                                    <label>Numero de documento</label>
                                    <div className="d-flex">
                                        <select
                                            defaultValue={""}
                                            className="form-control w-25"
                                            name="positionId"
                                            value={data?.positionId}
                                            onChange={handleChange}
                                        >
                                            <option value="">
                                                Tipo...
                                            </option>
                                            <option value={1}>
                                                RUT
                                            </option>
                                        </select>
                                        <input
                                            type="text"
                                            className="form-control "
                                            placeholder="Ej: 26629346"
                                            name="documentNumber"
                                            value={data?.documentNumber}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-group mb-3 col-md-6">
                                    <label>Rol</label>
                                    <select
                                        defaultValue={""}
                                        className="form-control"
                                        value={data?.role}
                                        name="role"
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>
                                            Selecciona...
                                        </option>
                                        <option value="1" >
                                            Administrador
                                        </option>
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
export default UsersCreate;