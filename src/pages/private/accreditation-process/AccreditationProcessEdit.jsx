import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import update from 'immutability-helper';
import useAxios from "../../../hooks/useAxios";
import { useFeedBack } from "../../../context/FeedBackContext";
import imgUrl from "../../../util/imgUrl";
import DateFormatter from "../../../components/DateFormatter";
import { Button, Dropdown, Modal, ProgressBar } from "react-bootstrap";
import { MdAdminPanelSettings } from "react-icons/md";
import { BsFillFileEarmarkArrowUpFill } from "react-icons/bs";
import { useAuth } from "../../../context/AuthContext";
import swal from "sweetalert";



const AccreditationProcessEdit = () => {

    const navigate = useNavigate();

    const { user } = useAuth();

    const [data, setData] = useState({});

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

    const [{ data: dataToUpdate, loading: loadingData }, getRecord] = useAxios({ url: `/accreditation-processes/${id}` }, { useCache: false });

    const [{ data: updateData, loading }, updateRecord] = useAxios({ url: `/accreditation-processes/${id}`, method: 'PUT' }, { manual: true, useCache: false });

    const [{ data: updateStatusData, loading: updateStatusLoading }, updateStatusRecord] = useAxios({ url: `/accreditation-processes/${id}/status`, method: 'PUT' }, { manual: true, useCache: false });

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
                <div className="d-flex align-items-center justify-content-end">
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
                    <button onClick={() => setShow(old => !old)} type="button" className="btn btn-danger mx-2" title="Analistas encargados">
                        <BsFillFileEarmarkArrowUpFill />
                    </button>
                    <button onClick={() => setShow(old => !old)} type="button" className="btn btn-primary" title="Analistas encargados">
                        <MdAdminPanelSettings />
                    </button>
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
                        <h4>Detalles del proceso de acreditación</h4>
                        <div className="form-group">
                            <label>Duración del proceso</label>
                            <input type="text" className="form-control" readOnly value={`${data?.days} Días`} />
                        </div>
                        <br />
                        <div className="form-group">
                            <label>Fecha de inicio</label>
                            <input type="text" className="form-control" readOnly value={`${DateFormatter({ value: data?.createdAt, dateFormat: 'dd-MM-yyyy' })}`} />
                        </div>
                        <br />
                        <div className="form-group">
                            <label>Fecha de finalización</label>
                            <input type="text" className="form-control" readOnly value={`${DateFormatter({ value: data?.end, dateFormat: 'dd-MM-yyyy' })}`} />
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
                                        <div>
                                            <h4>
                                                {step?.description} <small style={{ fontSize: 10 }}>(Hasta el: <DateFormatter value={step?.end} dateFormat="dd-MM-yyyy" />)</small> <small style={{ fontSize: 10 }}>(Responsable: {step?.responsable?.name || 'Externo'})</small>
                                            </h4>
                                        </div>
                                        <ul style={{ paddingLeft: '20px', width: '100%' }}>
                                            {
                                                step?.activities?.map((activity, i2) => {
                                                    return (
                                                        <li key={i2} className="d-flex justify-content-between mb-3 align-items-center">
                                                            <p className="m-0" style={{ textAlign: 'justify' }}>
                                                                {activity?.description}
                                                            </p>
                                                            <div title={activity?.checked ? 'Desmarcar' : 'Marcar'} style={{ marginLeft: '20px' }}>
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
                        <div className="col-md-8">
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
                                            <tr>
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
        </div>
    )
}

export default AccreditationProcessEdit;