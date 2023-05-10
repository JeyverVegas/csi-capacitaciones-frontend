import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import update from 'immutability-helper';
import useAxios from "../../../hooks/useAxios";
import { useFeedBack } from "../../../context/FeedBackContext";
import imgUrl from "../../../util/imgUrl";
import DateFormatter from "../../../components/DateFormatter";
import { Button, Dropdown, Modal, ProgressBar } from "react-bootstrap";
import { useAuth } from "../../../context/AuthContext";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import { AiOutlineCheck } from "react-icons/ai";
import swal from "sweetalert";
import clsx from "clsx";
import AccreditationProccessFilesComponent from "../../../components/AccreditationProccessFilesComponent";



const AccreditationProcessEdit = () => {

    const navigate = useNavigate();

    const { user } = useAuth();

    const [data, setData] = useState({});

    const [showObservationsChat, setShowObservationsChat] = useState(null);

    const [showFilesModal, setShowFilesModal] = useState(false);

    const [show, setShow] = useState(false);

    const [currentUser, setCurrentUser] = useState(null);

    const { id } = useParams();

    const { setLoading, setCustomAlert } = useFeedBack();

    const [tasksInfo, setTaskInfo] = useState({
        completeTasks: 0,
        inCompleteTasks: 0,
        total: 0,
        percent: 0
    });

    const [currentObservations, setCurrentObservations] = useState([]);

    const [{ data: dataToUpdate, loading: loadingData }, getRecord] = useAxios({ url: `/accreditation-processes/${id}` }, { useCache: false });

    const [{ data: updateData, loading }, updateRecord] = useAxios({ url: `/accreditation-processes/${id}`, method: 'PUT' }, { manual: true, useCache: false });

    const [{ data: adminApproveData, loading: loadingAdminApprove }, adminApprove] = useAxios({ url: `/accreditation-processes/${id}/contract-admin-approved`, method: 'PUT' }, { manual: true, useCache: false });

    const [{ data: updateStatusData, loading: updateStatusLoading }, updateStatusRecord] = useAxios({ url: `/accreditation-processes/${id}/status`, method: 'PUT' }, { manual: true, useCache: false });

    const [{ data: observations, loading: loadingObservations }, getObservations] = useAxios({ useCache: false, manual: true });

    const [{ data: observationData, loading: loadingObservationCreate }, createObservation] = useAxios({ method: 'POST' }, { useCache: false, manual: true });

    useEffect(() => {
        if (adminApproveData) {
            const { user, ...rest } = adminApproveData?.data;

            setData((oldData) => {
                return {
                    ...oldData,
                    ...rest
                }
            });

            setCurrentUser(user);
        }
    }, [adminApproveData]);

    useEffect(() => {
        if (observationData) {
            setCurrentObservations((oldObservations) => {
                return [observationData?.data, ...oldObservations]
            })
            setShowObservationsChat((oldValues) => {
                return {
                    ...oldValues,
                    message: ''
                }
            })
        }
    }, [observationData])

    useEffect(() => {
        if (observations) {
            console.log(observations);
            setCurrentObservations((oldObservations) => {
                return [...oldObservations, ...observations?.data]
            });
        }
    }, [observations])

    useEffect(() => {
        if (!showObservationsChat) {
            setCurrentObservations([]);
        }
    }, [showObservationsChat])

    useEffect(() => {
        if (showObservationsChat?.filters) {
            getObservations({
                url: showObservationsChat?.filters?.accreditationProcessStepId ? '/accreditation-process-step-observations' : '/accreditation-process-observations',
                params: {
                    ...showObservationsChat?.filters
                }
            });
        }
    }, [showObservationsChat?.filters])

    useEffect(() => {
        setLoading({
            show: loading,
            message: 'Actualizando el registro'
        })
    }, [loading]);

    useEffect(() => {
        setLoading({
            show: updateStatusLoading,
            message: 'Actualizando el estado.'
        })
    }, [updateStatusLoading])

    useEffect(() => {
        if (data?.steps?.length > 0) {
            var completeTasks = 0;
            var inCompleteTasks = 0;
            data?.steps?.forEach((step, i) => {
                step?.activities?.forEach((activity, i) => {
                    if (activity?.checked) {
                        completeTasks = completeTasks + 1;
                    } else {
                        inCompleteTasks = inCompleteTasks + 1;
                    };
                });
            });

            var total = inCompleteTasks + completeTasks;

            var percent = (completeTasks / total) * 100;

            setTaskInfo({
                inCompleteTasks,
                completeTasks,
                total,
                percent: percent?.toFixed(2)
            });
        }
    }, [data]);

    useEffect(() => {
        setLoading({
            show: loadingData,
            message: 'Obteniendo el registro'
        })
    }, [loadingData]);

    useEffect(() => {
        if (updateStatusData) {
            const { user, ...rest } = updateStatusData?.data;

            setData((oldData) => {
                return {
                    ...oldData,
                    ...rest
                }
            });

            setCurrentUser(user);
        }
    }, [updateStatusData])


    useEffect(() => {
        if (dataToUpdate) {
            const { user, ...rest } = dataToUpdate?.data;

            setData((oldData) => {
                return {
                    ...oldData,
                    ...rest
                }
            });

            setCurrentUser(user);
        }
    }, [dataToUpdate]);

    useEffect(() => {
        if (updateData) {
            setCustomAlert({
                show: true,
                severity: 'success',
                title: 'Operación Exitosa',
                message: 'El registro fue actualizado exitosamente.'
            });
        }
    }, [updateData]);

    const handleActivityChange = (e, stepIndex, activityIndex) => {
        var newArrayValues = [];

        newArrayValues = update(data?.steps, { [stepIndex]: { ['activities']: { [activityIndex]: { [e.target.name]: { $set: e.target.type === 'file' ? e.target.files[0] : e.target.value } } } } });

        setData((oldData) => {
            return {
                ...oldData,
                steps: newArrayValues
            }
        });
    }

    const handleStatusId = (statusId) => {
        swal({
            title: "¿Estás Seguro?",
            text: "Esta acción es irreversible",
            icon: "warning",
            buttons: true,
        }).then((willUpdate) => {
            if (willUpdate) {
                updateStatusRecord({
                    data: {
                        statusId
                    }
                });
            }
        });
    }

    const handleSubmit = (e) => {
        e?.preventDefault();

        const activities = [];

        data?.steps?.forEach((step, i) => {
            activities.push(...step?.activities?.map((activity) => {
                return {
                    id: activity?.id,
                    checked: activity?.checked
                }
            }));
        });

        updateRecord({
            data: {
                activities
            }
        });
    }

    const handleSubmitMessage = (e) => {
        e.preventDefault();

        if (!showObservationsChat?.message) return alert('El mensaje es obligatorio.');

        if (loadingObservationCreate) return;

        const url = showObservationsChat?.filters?.accreditationProcessStepId ? '/accreditation-process-step-observations' : '/accreditation-process-observations'

        var dataToSend = {
            message: showObservationsChat?.message
        };

        if (showObservationsChat?.filters?.accreditationProcessStepId) {
            dataToSend = {
                ...dataToSend,
                accreditationProcessStepId: showObservationsChat?.filters?.accreditationProcessStepId
            }
        }

        if (showObservationsChat?.filters?.accreditationProcessId) {
            dataToSend = {
                ...dataToSend,
                accreditationProcessId: showObservationsChat?.filters?.accreditationProcessId
            }
        }

        createObservation({ url, data: dataToSend });
    }

    const handleApprove = () => {
        adminApprove();
    }

    return (
        <div>
            <div className="my-4 align-items-center justify-content-between d-flex">
                <h3>
                    Detalle del proceso de acreditación
                </h3>
                {
                    <>
                        <Link to={"/proceso-de-acreditaciones/listar"} className="btn btn-primary">
                            Volver al listado
                        </Link>
                    </>
                }
            </div>

            <form className="card p-4" onSubmit={handleSubmit}>
                <div className="d-flex align-items-center justify-content-end mb-3 flex-wrap">
                    <span style={{ marginRight: 5 }}>Estado:</span>
                    <div className="basic-dropdown" style={{ marginRight: 10 }}>
                        <Dropdown>
                            <Dropdown.Toggle size="xs" variant={data?.status?.variant_color}>
                                {data?.status?.name}
                            </Dropdown.Toggle>
                            {
                                data?.status?.id === 1 && data?.responsibles?.map(responsible => responsible?.id).includes(user?.id) ?
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => handleStatusId(2)} href="#">
                                            Finalizar Proceso
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleStatusId(3)} href="#">
                                            Cancelar Proceso
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                    :
                                    null
                            }
                        </Dropdown>
                    </div>
                    {
                        data?.adminApprovedAt ?
                            <button
                                type="button"
                                className="btn btn-xs btn-success"
                            >
                                Aprobado por el administrador
                            </button>
                            :
                            data?.contractAdminId === user?.id ?
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    title="Aprobar el proceso"
                                    onClick={handleApprove}
                                >
                                    {loadingAdminApprove ? 'cargando' : <AiOutlineCheck />}
                                </button>
                                :
                                null

                    }
                    <div className="basic-dropdown mx-2" style={{ marginRight: 10 }}>
                        <Dropdown>
                            <Dropdown.Toggle size="xs" variant="primary">
                                Opciones
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setShowObservationsChat({
                                    filters: {
                                        accreditationProcessId: id,
                                        page: 1
                                    },
                                    message: ''
                                })}>
                                    Abrir chat de observaciones
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => setShow(old => !old)} >
                                    Mostrar Analistas
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => setShowFilesModal(old => !old)}>
                                    Ver archivos
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <h4>Detalles del usuario</h4>
                            <div className="text-center">
                                <img src={imgUrl(currentUser?.imagePath)} style={{ borderRadius: '100%', width: '150px', height: '140px' }} />
                                <br />
                                <br />
                                <div className="row">
                                    <div className="col-md-6">
                                        <b>Nombre</b>
                                        <p>
                                            {currentUser?.name}
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <b>Rut</b>
                                        <p>
                                            {currentUser?.documentNumber}
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <b>Cargo</b>
                                        <p>
                                            {currentUser?.position?.name}
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <b>Centro de costo</b>
                                        <p>
                                            {currentUser?.costCenter?.name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <h4 className="mb-3">Detalles del proceso de acreditación</h4>
                        <div className="row">
                            <div className="col-md-12 mb-3">
                                <div className="form-group">
                                    <label>Duración del proceso</label>
                                    <input type="text" className="form-control" readOnly value={`${data?.days} Días`} />
                                </div>
                            </div>
                            <div className="col-md-12 mb-3">
                                <div className="form-group">
                                    <label>El trabajador sera acreditado en:</label>
                                    <input type="text" className="form-control" readOnly value={`${data?.costCenter?.name}`} />
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <div className="form-group">
                                    <label>Fecha de inicio</label>
                                    <input type="text" className="form-control" readOnly value={`${DateFormatter({ value: data?.createdAt, dateFormat: 'dd-MM-yyyy' })}`} />
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <div className="form-group">
                                    <label>Fecha de finalización</label>
                                    <input type="text" className="form-control" readOnly value={`${DateFormatter({ value: data?.end, dateFormat: 'dd-MM-yyyy' })}`} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br />
                <div>
                    <h3 className="text-center">Tareas</h3>
                    <ul>
                        {
                            data?.steps?.map((step, i) => {
                                return (
                                    <li key={i} className="mb-3" style={{ borderBottom: '1px solid gray' }}>
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <h4>
                                                {step?.description} <small style={{ fontSize: 10 }}>(Hasta el: <DateFormatter value={step?.end} dateFormat="dd-MM-yyyy" />)</small> <small style={{ fontSize: 10 }}>(Responsable: {step?.responsable?.name || 'Externo'})</small>
                                            </h4>
                                            <div>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowObservationsChat({
                                                        filters: {
                                                            accreditationProcessStepId: step?.id,
                                                            page: 1
                                                        },
                                                        message: '',
                                                        stepTitle: step?.description
                                                    })}
                                                    className="btn btn-xs btn-primary"
                                                    title="Mostrar observaciones"
                                                >
                                                    <BsFillChatLeftTextFill />
                                                </button>
                                            </div>
                                        </div>
                                        <ul style={{ paddingLeft: '20px', width: '100%' }}>
                                            {
                                                step?.activities?.map((activity, i2) => {
                                                    return (
                                                        <li key={i2} className="d-flex justify-content-between mb-3 align-items-center">
                                                            <p className="m-0" style={{ textAlign: 'justify' }}>
                                                                {activity?.description}
                                                            </p>

                                                            <div title={activity?.checked ? 'Desmarcar' : 'Marcar'} style={{ marginLeft: '20px', display: 'flex', alignItems: 'center' }}>
                                                                <input
                                                                    type="checkbox"
                                                                    name="checked"
                                                                    checked={activity?.checked}
                                                                    onChange={(e) => handleActivityChange({ target: { value: !activity?.checked, name: 'checked' } }, i, i2)}
                                                                />
                                                            </div>
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <div className="row mt-5 align-items-center">
                        <div className="col-md-8 mb-3 mb-md-0">
                            <h4 className="text-center">Progreso {tasksInfo?.percent}%</h4>
                            <ProgressBar
                                now={tasksInfo?.percent}
                                variant={'primary'}
                            />
                        </div>
                        <div className="col-md-4 text-end">
                            <button className="btn btn-primary">
                                Actualizar Proceso
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Analistas encargados</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Imagen</th>
                                    <th>Nombre</th>
                                    <th>Rut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data?.responsibles?.map((responsible, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>
                                                    {i + 1}
                                                </td>
                                                <td>
                                                    <img src={imgUrl(responsible?.imagePath)} style={{ height: 70, width: 70, borderRadius: '100%' }} alt="" />
                                                </td>
                                                <td>
                                                    {responsible?.name}
                                                </td>
                                                <td>
                                                    {responsible?.documentNumber}
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showObservationsChat} onHide={() => setShowObservationsChat(null)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Observaciones del {showObservationsChat?.filters?.accreditationProcessStepId ? `paso "${showObservationsChat?.stepTitle}"` : 'Proceso de acreditación'}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ height: '60vh', overflowY: 'auto', display: 'flex', flexDirection: 'column-reverse' }}>
                    {
                        currentObservations?.map((observation, i) => {
                            return (
                                <div key={i} className={clsx(["row mb-3"], {
                                    "justify-content-end": user?.id === observation?.userId
                                })}>
                                    <div className={clsx(["p-2 rounded col-md-6"], {
                                        "bg-primary text-white": user?.id === observation?.userId,
                                        "bg-light text-dark": user?.id !== observation?.userId
                                    })}>
                                        <div className="text-start">
                                            <b>
                                                {user?.id === observation?.userId ?
                                                    'Tú'
                                                    :
                                                    observation?.user?.name
                                                }
                                            </b>
                                        </div>
                                        <p className={clsx({
                                            "text-end": user?.id === observation?.userId,
                                        })}
                                            style={{ marginBottom: 0 }}
                                        >
                                            {observation?.message}
                                        </p>
                                        <p className="mb-0 text-end">
                                            <small><DateFormatter value={observation?.createdAt} dateFormat={'dd-MM-yyyy hh:mm:ss'} /></small>
                                        </p>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div className="text-center mb-3">
                        {
                            loadingObservations ?
                                'Cargando'
                                :
                                showObservationsChat?.filters?.page < observations?.meta?.last_page ?
                                    <button onClick={() => setShowObservationsChat((oldValue) => {
                                        return {
                                            ...oldValue,
                                            filters: {
                                                ...oldValue?.filters,
                                                page: oldValue?.filters?.page + 1
                                            }
                                        }
                                    })} type="button" className="btn btn-secondary btn-xs">
                                        Cargar mas
                                    </button>
                                    :
                                    null
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <form onSubmit={handleSubmitMessage} className="d-flex align-items-center w-100" style={{ width: '100%' }}>
                        <input placeholder="Escribe un mensaje..." type="text" name="message" className="form-control" value={showObservationsChat?.message} onChange={(e) => {
                            setShowObservationsChat(oldValues => {
                                return {
                                    ...oldValues,
                                    message: e.target.value
                                }
                            })
                        }} />
                        <Button
                            type="submit"
                            disabled={!showObservationsChat?.message || loadingObservationCreate}
                            variant="secondary"
                            style={{ marginLeft: 10 }}
                        >
                            {loadingObservationCreate ? 'Enviando' : 'Enviar'}
                        </Button>
                    </form>
                </Modal.Footer>
            </Modal>
            <AccreditationProccessFilesComponent
                show={showFilesModal}
                accreditationProcessId={id}
                onClose={() => setShowFilesModal(false)}
                defaultFiles={data?.files}
            />
        </div>
    )
}

export default AccreditationProcessEdit;