import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAxios from "../../../hooks/useAxios";
import { useFeedBack } from "../../../context/FeedBackContext";
import { dateFine } from "../../../util/Utilities";
import { format } from "date-fns";
import DateFormatter from "../../../components/DateFormatter";


const PlanificationsEdit = () => {

    const { id } = useParams();

    const entity = {
        name: 'Proceso de planificación',
        url: 'planning-processes',
        frontendUrl: '/planificacion-de-gastos',
        camelName: 'planningProcesses',
    };

    const [yearsOptions, setYearsOptions] = useState([]);

    useEffect(() => {

        var year = new Date().getFullYear();

        var yearsBack = year - 50;

        var yearsNext = year + 50;

        var years = [];

        for (let index = yearsBack; index < yearsNext; index++) {
            years.push(index);
        }

        setYearsOptions(years);
    }, [])

    const navigate = useNavigate();

    const [data, setData] = useState({
        start: '',
        end: '',
        forYear: new Date().getFullYear(),
        open: ''
    });

    const { setLoading, setCustomAlert } = useFeedBack();

    const [{ data: dataToUpdate, loading: loadingDataToUpdate }, getRecord] = useAxios({ url: `/${entity?.url}/${id}` }, { useCache: false });

    const [{ data: updateData, loading }, updateRecord] = useAxios({ url: `/${entity?.url}/${id}`, method: 'PUT' }, { manual: true, useCache: false });


    useEffect(() => {
        if (dataToUpdate) {
            console.log(dataToUpdate);
            setData((oldData) => {
                return {
                    ...oldData,
                    ...dataToUpdate?.data,
                    start: DateFormatter({ value: dateFine(dataToUpdate?.data?.start), dateFormat: 'yyyy-MM-dd' }),
                    end: DateFormatter({ value: dateFine(dataToUpdate?.data?.end), dateFormat: 'yyyy-MM-dd' }),
                    open: dataToUpdate?.data?.open ? 'si' : 'no'
                }
            });
        }
    }, [dataToUpdate])

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
                [e.target.name]: e.target.value
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
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <div className="form-group">
                            <label className="text-primary">
                                Inicia <small className="text-danger">*</small>
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                onChange={handleChange}
                                name="start"
                                value={data?.start}
                            />
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="form-group">
                            <label className="text-primary">
                                Finaliza <small className="text-danger">*</small>
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                onChange={handleChange}
                                name="end"
                                value={data?.end}
                            />
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="form-group">
                            <label className="text-primary">
                                Planificación del año: <small className="text-danger">*</small>
                            </label>
                            <select
                                value={data?.forYear}
                                className="form-control"
                                name="forYear"
                                onChange={handleChange}
                            >
                                <option value="" disabled>Seleccione una opción</option>
                                {
                                    yearsOptions.map((year, i) => {
                                        return (
                                            <option value={year} key={i}>{year}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="form-group">
                            <label className="text-primary">
                                Estado del proceso: <small className="text-danger">*</small>
                            </label>
                            <select
                                value={data?.open}
                                className="form-control"
                                name="open"
                                onChange={handleChange}
                            >
                                <option value="" disabled>Seleccione una opción</option>
                                <option value="no">Cerrado</option>
                                <option value="si">Abierto</option>
                            </select>
                        </div>
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

export default PlanificationsEdit;