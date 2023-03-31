import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import handleChange from "../../../util/handleChange";
import update from 'immutability-helper';
import useAxios from "../../../hooks/useAxios";
import { useFeedBack } from "../../../context/FeedBackContext";

const FormsCreate = () => {

    const navigate = useNavigate();

    const [data, setData] = useState({
        name: '',
        days: 1,
        steps: [],

    });

    const { setLoading, setCustomAlert } = useFeedBack();

    const [{ data: createData, loading }, createRecord] = useAxios({ url: `/forms`, method: 'POST' }, { manual: true, useCache: false });

    useEffect(() => {
        setLoading({
            show: loading,
            message: 'Creando el registro'
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
            navigate('/formularios-de-acreditacion/listar');
        }
    }, [createData])

    const handleCurrentChange = (e) => {
        handleChange(e, setData, data);
    }

    const removeStep = () => {
        data.steps.pop();

        console.log(data);

        setData((oldData) => {
            return {
                ...oldData,
                steps: data?.steps
            };
        });
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

        createRecord({ data });
    }

    return (
        <div>
            <div className="my-4 align-items-center justify-content-between d-flex">
                <h3>
                    Crear formulario
                </h3>
                {
                    <>
                        <Link to={"/formularios-de-acreditacion/listar"} className="btn btn-primary">
                            Volver al listado
                        </Link>
                    </>
                }
            </div>

            <form className="card p-4" onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="form-label">Nombre</label>
                            <input
                                value={data.name}
                                required
                                type="text"
                                className="form-control"
                                name="name"
                                onChange={handleCurrentChange}
                                placeholder="Ej. Acreditación personal copiapo."
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="form-label">Nro de días</label>
                            <input
                                required
                                type="number"
                                className="form-control"
                                name="days"
                                onChange={handleCurrentChange}
                                value={data.days}
                            />
                        </div>
                    </div>
                </div>
                <br />
                <div className="text-center">
                    <h3>Pasos</h3>
                    <p>
                        Por favor ingrese los pasos que se deben cumplir para ser acreditado.
                    </p>
                    {
                        data?.steps?.map((step, i) => {
                            return (
                                <div key={i} className="text-start mb-3">
                                    <p className="text-center" style={{ color: 'black' }}><b>Paso #{i + 1}</b></p>
                                    <div className="row">
                                        <div className="col-md-6 form-group">
                                            <label style={{ color: 'black' }}><b>Descripción</b></label>
                                            <input
                                                required
                                                name="description"
                                                onChange={(e) => handleArrayChange(e, i, 'steps')}
                                                type="text"
                                                value={step?.description}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label style={{ color: 'black' }}><b>Responsable</b></label>
                                            <input
                                                required
                                                name="description"
                                                onChange={(e) => handleArrayChange(e, i, 'steps')}
                                                type="text"
                                                value={step?.description}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div className="d-flex justify-content-center align-items-center my-4">
                        <button type="button" className="btn mx-2 btn-xs btn-warning" onClick={removeStep}>
                            Eliminar ultimo paso
                        </button>
                        <button type="button" className="btn mx-2 btn-xs btn-danger" onClick={() => setData(oldData => {
                            return {
                                ...oldData,
                                steps: []
                            }
                        })}>
                            Eliminar todos los pasos
                        </button>
                        <button type="button" className="btn mx-2 btn-xs btn-primary" onClick={() => setData(oldData => {
                            return {
                                ...oldData,
                                steps: [...oldData.steps, { description: '' }]
                            }
                        })}>
                            Agregar paso
                        </button>
                    </div>
                    <div className="text-end">
                        <button className="btn btn-primary">
                            Crear Formulario
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default FormsCreate;