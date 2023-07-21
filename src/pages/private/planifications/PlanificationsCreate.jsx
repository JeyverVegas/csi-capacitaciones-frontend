import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAxios from "../../../hooks/useAxios";
import { useFeedBack } from "../../../context/FeedBackContext";


const PlanificationsCreate = () => {

    const entity = {
        name: 'Proceso de Planificación',
        url: 'planning-processes',
        frontendUrl: '/planificacion-de-gastos',
        camelName: 'planningProcesses',
    };

    const navigate = useNavigate();

    const [yearsOptions, setYearsOptions] = useState([]);

    const [data, setData] = useState({
        start: '',
        end: '',
        forYear: new Date().getFullYear()
    });

    const { setLoading, setCustomAlert } = useFeedBack();

    const [{ data: createData, loading }, createRecord] = useAxios({ url: `/${entity?.url}`, method: 'POST' }, { manual: true, useCache: false });

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

    useEffect(() => {
        setLoading({
            show: loading,
            message: 'Iniciando el proceso de planificación'
        })
    }, [loading]);


    useEffect(() => {
        if (createData) {
            setCustomAlert({
                show: true,
                severity: 'success',
                title: 'Operación Exitosa',
                message: 'El registro fue creado exitosamente.'
            });
            navigate(`${entity?.frontendUrl}/listar`);
        }
    }, [createData])

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

        createRecord({ data });
    }

    return (
        <div>
            <div className="my-4 align-items-center justify-content-between d-flex">
                <h3>
                    Crear {entity?.name}
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
                    <div className="col-md-12 mb-3">
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
                </div>
                <br />
                <div className="text-center">
                    <button className="btn btn-block btn-primary">
                        Iniciar
                    </button>
                </div>
            </form>
        </div >
    )
}

export default PlanificationsCreate;