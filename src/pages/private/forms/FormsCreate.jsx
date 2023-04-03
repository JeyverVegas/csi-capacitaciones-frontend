import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import handleChange from "../../../util/handleChange";
import update from 'immutability-helper';
import useAxios from "../../../hooks/useAxios";
import { useFeedBack } from "../../../context/FeedBackContext";
import AsyncSelect from 'react-select/async';
import mapValues from "../../../util/mapValues";
import handleLoadSelectOptions from "../../../util/handleLoadSelectOptions";
import useUsers from "../../../hooks/useUsers";

const FormsCreate = () => {

    const navigate = useNavigate();

    const [data, setData] = useState({
        name: '',
        days: 1,
        steps: [],
    });

    const { setLoading, setCustomAlert } = useFeedBack();

    const [{ data: createData, loading }, createRecord] = useAxios({ url: `/forms`, method: 'POST' }, { manual: true, useCache: false });

    const [{ users, loading: usersLoading }, getUsers] = useUsers({ options: { useCache: false, manual: true } });

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

    const handleAddActivity = (i) => {
        var newArrayValues = [];

        newArrayValues = update(data?.steps, { [i]: { activities: { $push: [{ description: '' }] } } });

        setData((oldData) => {
            return {
                ...oldData,
                steps: newArrayValues
            }
        });
    }

    const handleRemoveActivity = (i) => {
        var newArrayValues = [];

        const length = data?.steps[i]?.activities?.length - 1;

        newArrayValues = update(data?.steps, { [i]: { ['activities']: { $splice: [[length, 1]] } } });

        setData((oldData) => {
            return {
                ...oldData,
                steps: newArrayValues
            }
        });
    }

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
                            <label className="form-label">
                                Nombre
                                <span className="text-danger">*</span>
                            </label>
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
                            <label className="form-label">
                                Nro de días
                                <span className="text-danger">*</span>
                            </label>
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
                                    <h4 className="text-center">
                                        <b>Paso #{i + 1}</b>
                                    </h4>
                                    <div className="row align-items-end">
                                        <div className="col-md-4 mb-3 form-group">
                                            <label>
                                                <b>Titulo</b>
                                                <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                required
                                                name="description"
                                                onChange={(e) => handleArrayChange(e, i, 'steps')}
                                                type="text"
                                                value={step?.description}
                                                className="form-control"
                                                placeholder="Titulo"
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label><b>Responsable</b></label>
                                            <AsyncSelect
                                                isClearable
                                                onFocus={() => {
                                                    getUsers();
                                                }}
                                                defaultOptions={mapValues(users)}
                                                isLoading={usersLoading}
                                                loadOptions={(e) => handleLoadSelectOptions(e, getUsers)}
                                                placeholder='Escriba el nombre para buscar...'
                                                onChange={(e) => { handleArrayChange({ target: { value: e?.value, name: 'responsableId' } }, i, 'steps') }}
                                            />
                                        </div>
                                        <div className="col-md-2 mb-3">
                                            <div className="form-group">
                                                <label className="form-label">
                                                    Nro de días
                                                    <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    required
                                                    type="number"
                                                    className="form-control"
                                                    name="days"
                                                    onChange={(e) => handleArrayChange(e, i, 'steps')}
                                                    value={step?.days}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-2 mb-3 text-end">
                                            <button onClick={() => handleAddActivity(i)} type="button" title="Agregar Actividad" className="btn btn-xs mx-1 btn-primary">
                                                +
                                            </button>
                                            <button onClick={() => handleRemoveActivity(i)} type="button" title="Eliminar ultima actividad" className="btn btn-xs mx-1 btn-danger">
                                                X
                                            </button>
                                        </div>
                                        {
                                            step?.activities?.map((activity, i2) => {
                                                return (
                                                    <div className="col-md-12 my-2">
                                                        <div className="row align-items-center">
                                                            <div className="col-md-2">
                                                                <b>Actividad #{i2 + 1}:</b>
                                                            </div>
                                                            <div className="col-md-10">
                                                                <input
                                                                    name="description"
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={activity?.description}
                                                                    onChange={(e) => handleActivityChange(e, i, i2)}
                                                                    placeholder="Describa la actividad..."
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
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
                                steps: [...oldData.steps, { description: '', responsableId: '', activities: [], days: 1 }]
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