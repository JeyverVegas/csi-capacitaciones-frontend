import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ImgUploadInput from "../../../components/ImgUploadInput";
import { useAuth } from "../../../context/AuthContext";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";
import useDocumentNumberTypes from "../../../hooks/useDocumentNumberTypes";
import usePositions from "../../../hooks/usePositions";
import useRoles from "../../../hooks/useRoles";
import useServices from "../../../hooks/useServices";
import SystemInfo from "../../../util/SystemInfo";

const UsersUpdate = () => {

    const { user: currentUser, setAuthInfo } = useAuth();

    const { id } = useParams();

    const navigate = useNavigate();

    const { setCustomAlert, setLoading } = useFeedBack();

    const [filters, setFilters] = useState({
        perPage: 200,
        page: 1
    })

    const [firstLoading, setFirstLoading] = useState(true);

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
        serviceIds: [],
        _method: 'PUT'
    });

    const [imagePreview, setImagePreview] = useState('');

    const [{ data: user, error: userError, loading: userLoading }, getUser] = useAxios({ url: `/users/${id}` }, { useCache: false });

    const [{ data: updateData, loading: updateLoading, error: updateError }, updateUser] = useAxios({ url: `/users/${id}`, method: 'POST' }, { manual: true, useCache: false });

    const [{ positions, error: positionsError, loading: positionsLoading }, getPositions] = usePositions({ axiosConfig: { params: { ...filters } }, options: { useCache: false } });

    const [{ documentNumberTypes, error: documentNumberTypesError, loading: documentNumberTypesLoading }, getDocumentNumberTypes] = useDocumentNumberTypes({ options: { useCache: false } });

    const [{ roles, error: rolesError, loading: rolesLoading }, getRoles] = useRoles({ axiosConfig: { params: { ...filters } }, options: { useCache: false } });

    const [{ services, error: servicesError, loading: servicesLoading }, getServices] = useServices({ axiosConfig: { params: { ...filters } }, options: { useCache: false } });

    useEffect(() => {
        console.log(data);
    }, [data])

    useEffect(() => {
        if (user) {
            const { createdAt, documentNumberType, id, imagePath, position, role, services, ...rest } = user?.data;
            setData((oldData) => {
                return {
                    ...oldData,
                    ...rest,
                    role: role?.name,
                    serviceIds: services?.map(service => service?.id)
                }
            });

            setImagePreview(`${SystemInfo?.host}${imagePath}`);
            console.log(user);
        }
    }, [user]);

    useEffect(() => {
        if (!documentNumberTypesLoading && !rolesLoading && !positionsLoading && !servicesLoading && !userLoading) {
            setFirstLoading(false);
        } else {
            setFirstLoading(true)
        }
    }, [documentNumberTypesLoading, rolesLoading, positionsLoading, servicesLoading, userLoading]);

    useEffect(() => {
        setLoading({
            show: firstLoading,
            message: 'Obteniendo informacion'
        });
    }, [firstLoading]);

    const [canRemove, setCanRemove] = useState(false);

    useEffect(() => {
        if (data?.documentNumber?.length > 7 && !data?.documentNumber?.includes('-') && !canRemove) {
            setCanRemove(true);
            setData((oldData) => {
                return {
                    ...oldData,
                    documentNumber: `${oldData?.documentNumber}-`
                }
            })
        }

        if (data?.documentNumber?.length < 7 && canRemove) {
            setCanRemove(false);
        }

    }, [data?.documentNumber, canRemove])

    useEffect(() => {
        if (updateData) {
            setCustomAlert({
                title: '¡Operacion Exitosa!',
                severity: 'success',
                message: 'El usuario fue creado exitosamente.',
                show: true
            });
            navigate('/usuarios');
            if (updateData?.data?.id === currentUser?.id) {
                const { createdAt, role, ...rest } = updateData?.data;
                setAuthInfo((oldAuthInfo) => {
                    return {
                        ...oldAuthInfo,
                        user: {
                            ...oldAuthInfo?.user,
                            ...rest
                        }
                    }
                });
            }
        }
    }, [updateData])

    useEffect(() => {
        if (updateError) {
            setCustomAlert({
                title: 'Error',
                severity: 'danger',
                message: 'Ha ocurrido un error.',
                show: true
            });
        }

        if (positionsError) {
            setCustomAlert({
                title: 'Error',
                severity: 'danger',
                message: 'Ha ocurrido un error al obtener los cargos.',
                show: true
            });
        }

        if (documentNumberTypesError) {
            setCustomAlert({
                title: 'Error',
                severity: 'danger',
                message: 'Ha ocurrido un error al obtener los tipos de documentos.',
                show: true
            });
        }

        if (rolesError) {
            setCustomAlert({
                title: 'Error',
                severity: 'danger',
                message: 'Ha ocurrido un error al obtener los roles.',
                show: true
            });
        }

        if (servicesError) {
            setCustomAlert({
                title: 'Error',
                severity: 'danger',
                message: 'Ha ocurrido un error al obtener los servicios.',
                show: true
            });
        }

        if (userError) {
            setCustomAlert({
                title: 'Error',
                severity: 'danger',
                message: 'Ha ocurrido un error al obtener los datos del usuario.',
                show: true
            });
        }
    }, [updateError, positionsError, documentNumberTypesError, rolesError, servicesError, userError])

    const handleSubmit = (e) => {
        let hasError = false;
        e?.preventDefault?.();

        if (updateLoading) {
            return;
        }
        const { image: image2, password: password2, ...requireValues } = data;
        Object.keys(requireValues).forEach((key, i) => {
            if (!data[key]) {
                hasError = true;
                setCustomAlert({
                    title: 'Error',
                    severity: 'danger',
                    message: <div>Hay un error en el campo <strong>{key}</strong>.</div>,
                    show: true
                });
            }
        });

        if (hasError) {
            return;
        }

        const formdata = new FormData();
        const { image, serviceIds, password, ...rest } = data;
        Object.keys(rest).forEach((key, i) => {
            formdata?.append(key, data[key]);
        });

        serviceIds?.forEach?.((serviceId, i) => {
            formdata?.append(`serviceIds[${i}]`, serviceId);
        });

        if (password) {
            formdata?.append(`password`, password);
        }

        if (image) {
            formdata?.append('image', image, image?.name);
        }

        updateUser({ data: formdata });
    }

    const handleChange = (e) => {
        console.log(e);
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

    const checker = (arr, target) => arr.every((value) => target?.includes(value));

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

    return (
        <div>
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Crear usuario</h4>
                </div>
                <div className="card-body">
                    <div className="basic-form">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group col-1 mb-3">
                                <ImgUploadInput previewImage={imagePreview} description="imagen" name="image" change={handleChange} style={{ height: 80 }} />
                            </div>
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
                                        className="form-control"
                                        value={data?.positionId}
                                        name="positionId"
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>
                                            Selecciona...
                                        </option>
                                        {
                                            positions?.map((position, i) => {
                                                return (
                                                    <option value={position?.id} key={i}>
                                                        {position?.name}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>

                                <div className="form-group mb-3 col-md-6">
                                    <label>Numero de documento</label>
                                    <div className="d-flex">
                                        <select
                                            className="form-control w-25"
                                            name="documentNumberTypeId"
                                            value={data?.documentNumberTypeId}
                                            onChange={handleChange}
                                        >
                                            <option value="">
                                                Tipo...
                                            </option>
                                            {
                                                documentNumberTypes?.map?.((type, i) => {
                                                    return (
                                                        <option value={type?.id} key={i}>
                                                            {type?.name}
                                                        </option>
                                                    )
                                                })
                                            }
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
                                        className="form-control"
                                        value={data?.role}
                                        name="role"
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>
                                            Selecciona...
                                        </option>
                                        {
                                            roles?.map((role, i) => {
                                                return (
                                                    <option value={role?.name} key={i} >
                                                        {role?.name}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="form-group mb-3 col-md-12">
                                    <h6>Servicios</h6>
                                    <p>Seleccione los servicios a los cuales tendra acceso el usuario.</p>
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
export default UsersUpdate;