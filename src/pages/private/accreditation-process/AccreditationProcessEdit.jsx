import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import handleChange from "../../../util/handleChange";
import update from 'immutability-helper';
import useAxios from "../../../hooks/useAxios";
import { useFeedBack } from "../../../context/FeedBackContext";
import imgUrl from "../../../util/imgUrl";
import DateFormatter from "../../../components/DateFormatter";
import Toggle from "react-toggle";
import { ProgressBar } from "react-bootstrap";

const AccreditationProcessEdit = () => {

    const navigate = useNavigate();

    const [data, setData] = useState({

    });

    const [currentUser, setCurrentUser] = useState(null);

    const { id } = useParams();

    const { setLoading, setCustomAlert } = useFeedBack();

    const [{ data: dataToUpdate, loading: loadingData }, getRecord] = useAxios({ url: `/accreditation-processes/${id}` }, { useCache: false });

    const [{ data: updateData, loading }, updateRecord] = useAxios({ url: `/accreditation-processes/${id}`, method: 'PUT' }, { manual: true, useCache: false });

    useEffect(() => {
        setLoading({
            show: loading,
            message: 'Actualizando el registro'
        })
    }, [loading]);

    useEffect(() => {
        setLoading({
            show: loadingData,
            message: 'Obteniendo el registro'
        })
    }, [loadingData]);


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
            navigate('/accreditation-processes/listar');
        }
    }, [updateData])

    const handleCurrentChange = (e) => {
        handleChange(e, setData, data);
    }

    const handleArrayChange = (e, index, arrayName) => {
        var newArrayValues = [];

        newArrayValues = update(data?.[arrayName], { [index]: { [e.target.name]: { $set: e.target.type === 'file' ? e.target.files[0] : e.target.value } } });

        setData((oldData) => {
            return {
                ...oldData,
                [arrayName]: newArrayValues
            }
        });
    }

    const handleSubmit = (e) => {
        e?.preventDefault();

        updateRecord({ data });
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
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <h4>Detalles del usuario</h4>
                            <div className="text-center">
                                <img src={imgUrl(currentUser?.imgPath)} style={{ borderRadius: '100%', width: '150px', height: '140px' }} />
                                <br />
                                <br />
                                <p>
                                    {currentUser?.name}
                                </p>
                                <p>
                                    {currentUser?.costCenter?.name}
                                </p>
                                <p>
                                    {currentUser?.documentNumber}
                                </p>
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
                                    <li key={i} className="d-flex justify-content-between w-100 mb-3 align-items-center" style={{ borderBottom: '1px solid gray' }}>
                                        <div>
                                            <h4>
                                                Paso #{i + 1}:
                                            </h4>
                                            <p style={{ textAlign: 'justify' }}>
                                                {step?.description}
                                            </p>
                                        </div>
                                        <div title={step?.checked ? 'Desmarcar' : 'Marcar'} style={{ marginLeft: '20px' }}>
                                            <Toggle checked={step?.checked} />
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <div className="row mt-5 align-items-center">
                        <div className="col-md-8">
                            <h4 className="text-center">Progreso {50}%</h4>
                            <ProgressBar
                                now={50}
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
        </div>
    )
}

export default AccreditationProcessEdit;