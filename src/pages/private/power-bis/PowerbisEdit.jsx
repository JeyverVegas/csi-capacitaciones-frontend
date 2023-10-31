import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAxios from "../../../hooks/useAxios";
import { useFeedBack } from "../../../context/FeedBackContext";
import handleLoadSelectOptions from "../../../util/handleLoadSelectOptions";
import mapValues from "../../../util/mapValues";
import useZones from "../../../hooks/useZones";
import ImgUploadInput from "../../../components/ImgUploadInput";
import AsyncSelect from 'react-select/async';
import useUsers from "../../../hooks/useUsers";
import { Image } from "react-bootstrap";
import profileImg from "../../../assets/images/profile.png";
import { AiFillCheckCircle } from "react-icons/ai";
import useCostCenters from "../../../hooks/useCostCenters";


const PowerbisEdit = () => {

    const { id } = useParams();

    const entity = {
        name: 'Power Bi',
        url: 'power-bi',
        frontendUrl: '/power-bi',
        camelName: 'powerBi',
    };

    const navigate = useNavigate();

    const [data, setData] = useState({
        title: '',
        url: '',
        zone: ''
    });

    const [filters, setFilters] = useState({
        page: 1,
        perPage: 12,
        search: '',
        zoneId: '',
        costCenterId: ''
    });

    const { setLoading, setCustomAlert } = useFeedBack();

    const [{ data: dataToUpdate, loading: loadingDataToUpdate }, getRecord] = useAxios({ url: `/${entity?.url}/${id}` }, { useCache: false });

    const [{ data: updateData, loading }, updateRecord] = useAxios({ url: `/${entity?.url}/${id}`, method: 'POST' }, { manual: true, useCache: false });

    const [{ zones, loading: zonesLoading }, getZones] = useZones({ params: { perPage: 50 } }, { useCache: false });

    const [{ users, total, numberOfPages, loading: loadingUsers }, getUsers] = useUsers({ params: { ...filters }, options: { useCache: false } });

    const [{ costCenters, loading: costCentersLoading }, getCostCenters] = useCostCenters({ params: { perPage: 50, orderBy: 'name ASC' } }, { useCache: false });

    const [currentUsers, setCurrentUsers] = useState([]);

    useEffect(() => {
        if (users) {
            setCurrentUsers((oldUsers) => {
                return [...oldUsers, ...users]
            })
        }
    }, [users])

    useEffect(() => {
        if (dataToUpdate) {

            const { createdAt, imagePath, zone, id, ...rest } = dataToUpdate?.data;

            setData((oldData) => {
                return {
                    ...oldData,
                    ...rest,
                    zone: { label: zone?.name, value: zone?.id }
                }
            });
        }
    }, [dataToUpdate]);

    useEffect(() => {
        setLoading({
            show: loading,
            message: 'Actualizando el registro'
        })
    }, [loading]);

    useEffect(() => {
        setLoading({
            show: loadingDataToUpdate,
            message: 'Obteniendo información'
        });
    }, [loadingDataToUpdate]);

    useEffect(() => {
        if (updateData) {
            setCustomAlert({
                show: true,
                severity: 'success',
                title: 'Operación Exitosa',
                message: 'El registro fue actualizado exitosamente.'
            });
            navigate(`${entity?.frontendUrl}/listar`);
        }
    }, [updateData])

    const handleChange = (e) => {
        setData((oldData) => {
            return {
                ...oldData,
                [e.target.name]: e.target?.type === 'file' ? e.target?.files : e.target.value
            }
        });
    }

    const handleFilters = (e) => {
        setCurrentUsers([]);
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                [e.target.name]: e.target.value,
                page: 1
            }
        })
    }

    const handleAddPage = () => {
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                page: oldFilters?.page + 1
            }
        })
    }

    const handleUser = (userId) => {

        const haveValue = data?.userIds?.includes(userId);

        var newValues = [];

        if (haveValue) newValues = data?.userIds?.filter(value => value !== userId);

        if (!haveValue) newValues = [...data?.userIds, userId];

        setData((oldData) => {
            return {
                ...oldData,
                userIds: newValues
            }
        });
    }

    const handleSubmit = (e) => {
        e?.preventDefault();

        const formData = new FormData();

        Object.keys(data).map((key, i) => {
            if (data[key]) {
                if (key === 'zone' && data[key]?.value) {
                    formData.append('zoneId', data[key]?.value);
                    return;
                }

                if (key === 'image') {
                    formData.append(key, data[key][0], data[key]?.[0]?.name);
                    return;
                }

                if (key === 'userIds') {
                    data[key]?.forEach((userId, i) => {
                        formData.append(`${key}[${i}]`, userId);
                    });
                    return;
                }
                formData.append(key, data[key]);
            }
        });

        formData.append('_method', 'PUT');

        updateRecord({ data: formData });
    }

    return (
        <div>
            <div className="my-4 align-items-center justify-content-between d-flex">
                <h3>
                    Editar {entity?.name}
                </h3>
                {
                    <>
                        <Link to={`${entity?.frontendUrl}/listar`} className="btn btn-primary">
                            Volver al listado
                        </Link>
                    </>
                }
            </div>

            <form className="card p-4" onSubmit={handleSubmit}>
                <div className="row align-items-center">
                    <div className="col-md-6 mb-3" style={{ padding: "0 100px" }}>
                        <ImgUploadInput
                            previewImage={dataToUpdate?.data?.imagePath}
                            name="image"
                            style={{
                                boxShadow: "0rem 0.3125rem 0.3125rem 0rem rgba(82, 63, 105, 0.05)"
                            }}
                            imageStyle={{
                                borderRadius: 10,
                                boxShadow: "0rem 0.3125rem 0.3125rem 0rem rgba(82, 63, 105, 0.05)"
                            }}
                            change={handleChange}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="form-group mb-3">
                            <label className="text-primary">
                                Titulo <small className="text-danger">*</small>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                onChange={handleChange}
                                name="title"
                                value={data?.title}
                                placeholder="titulo"
                            />
                        </div>
                        <div className="form-group mb-3">
                            <div className="form-group">
                                <label className="text-primary">
                                    Url <small className="text-danger">*</small>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    onChange={handleChange}
                                    name="url"
                                    value={data?.url}
                                    placeholder="url"
                                />
                            </div>
                        </div>
                        <div className="form-group mb-3">
                            <label>Zona<span className="text-danger">*</span></label>
                            <AsyncSelect
                                isClearable
                                onFocus={() => { getZones() }}
                                value={data?.zone}
                                isLoading={zonesLoading}
                                defaultOptions={mapValues(zones)}
                                name="zone"
                                loadOptions={(e) => handleLoadSelectOptions(e, getZones)}
                                placeholder='Escriba el nombre para buscar...'
                                onChange={(e) => { handleChange({ target: { value: e, name: 'zone' } }) }}
                            />
                        </div>
                    </div>
                    <div className="col-md-12 mb-5">
                        <h2>
                            👨‍👦‍👦 Usuarios con acceso:
                        </h2>
                        <small>
                            Por favor seleccione los usuarios con acceso a este powerBi:
                        </small>
                        <br />
                        <br />
                        <div className="row align-items-center">
                            <div className="col-md-8">
                                <div className="row align-items-center">
                                    <div className="col-3 mb-4">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={filters?.search}
                                            onChange={handleFilters}
                                            name="search"
                                            placeholder="Buscar..."
                                        />
                                    </div>
                                    <div className="col-md-3 mb-4">
                                        <AsyncSelect
                                            isClearable
                                            onFocus={() => { getCostCenters() }}
                                            isLoading={costCentersLoading}
                                            defaultOptions={mapValues(costCenters)}
                                            name="costCenterId"
                                            loadOptions={(e) => handleLoadSelectOptions(e, getCostCenters, { orderBy: 'name ASC' })}
                                            placeholder='Escriba el nombre para buscar...'
                                            onChange={(e) => {
                                                handleFilters({ target: { value: e?.value, name: 'costCenterId' } })
                                            }}
                                        />
                                    </div>
                                    <div className="col-6 mb-4">
                                        <div className="d-flex align-items-center">
                                            <span className="d-none d-md-block" style={{ marginRight: 10 }}>Mostrar:</span>
                                            <select
                                                name="perPage"
                                                onChange={handleFilters}
                                                value={filters?.perPage}
                                                className="form-control"
                                                style={{ maxWidth: "30%" }}
                                            >
                                                <option value="12">12</option>
                                                <option value="20">20</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                                <option value="200">200</option>
                                                <option value="500">500</option>
                                            </select>
                                            <span style={{ marginLeft: 5 }}>Registros por pagina</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 text-end mb-4">
                                <button className="btn btn-primary btn-xs" type="button" onClick={() => {
                                    setData((oldData) => {
                                        return {
                                            ...oldData,
                                            userIds: currentUsers?.map((user) => user?.id)
                                        }
                                    })
                                }}>
                                    Seleccionar todos
                                </button>
                                <button className="btn btn-primary btn-xs" type="button" onClick={() => {
                                    setData((oldData) => {
                                        return {
                                            ...oldData,
                                            userIds: []
                                        }
                                    })
                                }}>
                                    Remover todos
                                </button>
                            </div>
                        </div>


                        <ul className="custom-scrollbar scrollbar-primary mt-3 row align-items-center" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            {
                                currentUsers?.length > 0 ?
                                    currentUsers?.map((user, i) => {
                                        return (
                                            <li
                                                key={i}
                                                onClick={(e) => handleUser(user?.id)}
                                                className="mb-3 px-3 col-md-6 col-lg-4"
                                            >
                                                <div
                                                    className="d-flex custom-responsible-option p-2 border-primary"
                                                    style={{
                                                        borderLeft: '1px solid',
                                                        alignItems: 'center',
                                                        minHeight: 80,
                                                        cursor: 'pointer',
                                                        justifyContent: 'space-between',
                                                        boxShadow: "0rem 0.3125rem 0.3125rem 0rem rgba(82, 63, 105, 0.05)"
                                                    }}
                                                >
                                                    <div className="d-flex align-items-center">
                                                        <p className="text-primary" style={{ marginRight: 10, marginBottom: 0 }}>
                                                            {user?.id}.-
                                                        </p>
                                                        <Image
                                                            style={{ height: 40, width: 40, marginRight: 5 }}
                                                            src={user?.imagePath || profileImg}
                                                            roundedCircle
                                                        />
                                                        <div>
                                                            <h5 className="m-0">
                                                                {user?.name} - ({user?.email})
                                                            </h5>
                                                            <p className="m-0">
                                                                Rut: {user?.documentNumber}
                                                            </p>
                                                            <p className="m-0 text-primary">
                                                                {user?.costCenter?.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {
                                                        data?.userIds?.includes(user?.id) &&
                                                        <div>
                                                            <AiFillCheckCircle className="text-primary" style={{ fontSize: 22 }} />
                                                        </div>
                                                    }
                                                </div>
                                            </li>
                                        )
                                    })
                                    :
                                    <li className="text-center">
                                        No se encontrarón resultados
                                    </li>
                            }
                            {
                                loadingUsers &&
                                <li>
                                    <div className="spinner">
                                        <div className="double-bounce1 bg-primary"></div>
                                        <div className="double-bounce2 bg-primary"></div>
                                    </div>
                                </li>
                            }
                            {
                                numberOfPages > filters?.page && !loadingUsers ?
                                    <li className="text-center">
                                        <button type="button" onClick={handleAddPage} className="btn btn-xs btn-primary" >
                                            Cargar mas
                                        </button>
                                    </li>
                                    :
                                    null
                            }
                        </ul>
                    </div>
                </div>
                <br />
                <div className="text-center">
                    <button className="btn btn-block btn-primary">
                        Actualizar
                    </button>
                </div>
            </form>
        </div >
    )
}

export default PowerbisEdit;