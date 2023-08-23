import { Button, Image, Modal, Table } from "react-bootstrap";
import useAxios from "../../hooks/useAxios";
import { useEffect, useState } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { useFeedBack } from "../../context/FeedBackContext";

const AddGeneralResponsibleModal = ({ costCenterId, responsibleId, show, onClose }) => {

    const { setCustomAlert } = useFeedBack();

    const [filters, setFilters] = useState({
        page: 1,
        perPage: 10,
        costCenterId,
        search: ''
    });

    const [data, setData] = useState({
        userId: ''
    });

    const [{ data: response, loading }, getUsers] = useAxios({ url: `/cost-centers/users-for-general-responsible`, params: filters }, { manual: true, useCache: false });

    const [{ data: createResponse, loading: createLoading }, createResponsibles] = useAxios({ url: `/cost-centers/${costCenterId}/general-responsibles`, method: 'POST' }, { manual: true, useCache: false });

    const [currentUsers, setCurrentUsers] = useState([]);

    useEffect(() => {
        if (createResponse) {
            setCustomAlert({
                show: true,
                severity: 'success',
                title: 'Operación Exitosa',
                message: 'El registro fue creado exitosamente.'
            });
            onClose?.(createResponse?.data);
        }
    }, [createResponse])

    useEffect(() => {
        if (response) {
            setCurrentUsers((oldUsers) => {
                return [...oldUsers, ...response?.data]
            })
        }
    }, [response])

    useEffect(() => {
        if (show) {
            getUsers();
        }
    }, [show, filters]);

    useEffect(() => {
        if (!show) {
            setFilters((oldFilters) => {
                return {
                    ...oldFilters,
                    page: 1,
                    perPage: 10,
                    search: '',
                    costCenterId
                }
            });
            setCurrentUsers([]);

            setData({
                userIds: []
            });
        }
    }, [show])

    const handleChange = (e) => {
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

    const handleResponsible = (userId) => {

        setData((oldData) => {
            return {
                ...oldData,
                userId: userId
            }
        });
    }

    const handleCreate = () => {

        createResponsibles({ data });
    }

    return (
        <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={show}
            onHide={() => onClose?.()}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Añadir Responsable General
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input
                    type="text"
                    className="form-control"
                    value={filters?.search}
                    onChange={handleChange}
                    name="search"
                    placeholder="Buscar..."
                />
                <br />
                <small>
                    Por favor seleccione a la persona que sera el responsable general de aprobar la planificación:
                </small>
                <br />
                <br />

                <ul className="custom-scrollbar scrollbar-primary" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    {
                        currentUsers?.length > 0 ?
                            currentUsers?.map((user, i) => {
                                return (
                                    <li
                                        key={i}
                                        onClick={(e) => handleResponsible(user?.id)}
                                        className="d-flex custom-responsible-option mb-3 px-1 py-2"
                                        style={{ alignItems: 'center', cursor: 'pointer', justifyContent: 'space-between' }}
                                    >
                                        <div className="d-flex align-items-center">
                                            <Image style={{ height: 40, width: 40, marginRight: 5 }} src={user?.imagePath} roundedCircle />
                                            <div>
                                                <h5 className="m-0">
                                                    {user?.name}
                                                </h5>
                                                <p className="m-0">
                                                    Rut: {user?.documentNumber}
                                                </p>
                                            </div>
                                        </div>
                                        {
                                            data?.userId === user?.id &&
                                            <div>
                                                <AiFillCheckCircle className="text-primary" style={{ fontSize: 22 }} />
                                            </div>
                                        }
                                    </li>
                                )
                            })
                            :
                            <li className="text-center">
                                No se encontrarón resultados
                            </li>
                    }
                    {
                        loading &&
                        <li>
                            <div className="spinner">
                                <div className="double-bounce1 bg-primary"></div>
                                <div className="double-bounce2 bg-primary"></div>
                            </div>
                        </li>
                    }
                    {response?.meta?.last_page ?
                        response?.meta?.last_page > filters?.page && !loading ?
                            <li className="text-center">
                                <button type="button" onClick={handleAddPage} className="btn btn-xs btn-primary" >
                                    Cargar mas
                                </button>
                            </li>
                            :
                            null
                        :
                        null
                    }
                </ul>
            </Modal.Body>
            <Modal.Footer>
                <button
                    className="btn btn-primary btn-block"
                    disabled={createLoading || !data?.userId || !costCenterId}
                    onClick={handleCreate}
                >
                    {
                        createLoading ?
                            <div className="spinner">
                                <div className="double-bounce1 bg-light"></div>
                                <div className="double-bounce2 bg-light"></div>
                            </div>
                            :
                            'Agregar Responsable'
                    }
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddGeneralResponsibleModal;