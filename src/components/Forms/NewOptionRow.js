import { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import ReactTooltip from "react-tooltip";
import swal from "sweetalert";
import { useAuth } from "../../context/AuthContext";
import useAxios from "../../hooks/useAxios";
import alertEmojis from "../../util/AlertsEmojis";
import { mainPermissions } from "../../util/MenuLinks";

const NewOptionRow = ({ defaultDataOption, featureId, onDelete, index }) => {

    const { permissions } = useAuth();

    const [data, setData] = useState({
        name: '',
        productFeatureId: ''
    });

    const [showAlert, setShowAlert] = useState({
        message: '',
        severity: '',
        title: '',
        show: false
    })

    const [{ data: deleteData, loading: deleteLoading }, deleteOption] = useAxios({ url: `/product-feature-option/${data?.id}`, method: 'DELETE' }, { manual: true, useCache: false });

    const [{ data: saveData, loading: saveLoading }, saveOption] = useAxios({}, { manual: true, useCache: false });

    useEffect(() => {
        if (deleteData !== undefined) {
            onDelete(index);
        }
    }, [deleteData])

    useEffect(() => {
        if (saveData) {
            setData((oldData) => {
                return {
                    ...oldData,
                    ...saveData?.data
                }
            });
            setShowAlert({
                message: '',
                severity: 'success',
                title: 'Accion Exitosa',
                show: true
            })
        }
    }, [saveData]);

    useEffect(() => {
        setTimeout(() => {
            setShowAlert({
                message: '',
                severity: '',
                title: '',
                show: false
            })
        }, 3000)
    }, [showAlert?.show])

    useEffect(() => {
        if (featureId) {
            setData((oldData) => {
                return {
                    ...oldData,
                    productFeatureId: featureId
                }
            })
        }
    }, [featureId])


    useEffect(() => {
        if (defaultDataOption) {
            setData((oldData) => {
                return {
                    ...oldData,
                    ...defaultDataOption
                }
            })
        }
    }, [defaultDataOption])


    const handleChange = (e) => {
        setData((oldData) => {
            return {
                ...oldData,
                [e.target.name]: e.target.type === 'file' ? e.target.files[0] : e.target.value
            }
        });
    }


    const handleDeleteValue = () => {
        swal({
            title: "¿Estas Seguro?",
            text: "¿Deseas eliminar esta opcion?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((wantDelete) => {
            if (wantDelete) {
                handleDelete();
            }
        });

    }


    const handleDelete = () => {
        if (data?.id) {
            if (permissions?.includes(mainPermissions?.productFeaturesOptions[3])) {
                deleteOption();
            } else {
                alert('No tienes permisos para realizar esta acción');
            }
        } else {
            onDelete(index);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault?.();
        if (saveLoading || deleteLoading) {
            return;
        }

        if (!permissions?.includes(mainPermissions?.productFeaturesOptions[2]) && data?.id) {
            alert('No tienes permisos para realizar esta acción.');
            return;
        }

        if (!permissions?.includes(mainPermissions?.productFeaturesOptions[1]) && !data?.id) {
            alert('No tienes permisos para realizar esta acción.');
            return;
        }

        const { id, createdAt, ...rest } = data;

        saveOption({ url: `/product-feature-option${data?.id ? `/${data?.id}` : ''}`, method: data?.id ? 'PUT' : 'POST', data: rest });
    }

    return (
        <form className="col-md-4" onSubmit={handleSubmit}>
            <div className="d-flex align-items-center my-2">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Ej... 'XL', 'G', 'M', 'S'"
                    name="name"
                    value={data?.name}
                    onChange={handleChange}
                />
                {
                    !data?.id ?
                        <button disabled={deleteLoading} onClick={handleDeleteValue} type="button" data-tip="Eliminar" className="btn btn-danger mx-1">
                            {
                                deleteLoading ?
                                    'Eliminando'
                                    :
                                    <i className="flaticon-381-trash-2" />
                            }
                        </button>
                        :
                        permissions?.includes(mainPermissions?.productFeaturesOptions[3]) ?
                            <button disabled={deleteLoading} onClick={handleDeleteValue} type="button" data-tip="Eliminar" className="btn btn-danger mx-1">
                                {
                                    deleteLoading ?
                                        'Eliminando'
                                        :
                                        <i className="flaticon-381-trash-2" />
                                }
                            </button>
                            :
                            null
                }
                {
                    permissions?.includes(mainPermissions?.productFeaturesOptions[1]) && !data?.id ?
                        <button disabled={saveLoading} type="submit" data-tip="Guardar" className="btn btn-success mx-1">
                            {
                                saveLoading ?
                                    'Guardando...'
                                    :
                                    <i className="flaticon-008-check" />
                            }
                        </button>
                        :
                        null
                }

                {
                    permissions?.includes(mainPermissions?.productFeaturesOptions[2]) && data?.id ?
                        <button disabled={saveLoading} type="submit" data-tip="Guardar" className="btn btn-success mx-1">
                            {
                                saveLoading ?
                                    'Guardando...'
                                    :
                                    <i className="flaticon-008-check" />
                            }
                        </button>
                        :
                        null
                }

                <ReactTooltip />
            </div>
            {
                showAlert?.show &&
                <Alert
                    variant={showAlert?.severity}
                    className="alert-dismissible p-2 fade show d-flex align-items-center justify-content-between"
                >
                    <div>
                        {alertEmojis[showAlert?.severity]}
                        <strong>{showAlert?.title}</strong>
                        {
                            showAlert?.message &&
                            <>
                                <br />
                                {showAlert?.message}
                            </>
                        }
                    </div>
                </Alert>
            }
        </form>
    )
}

export default NewOptionRow;