import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAxios from "../../../hooks/useAxios";
import { useFeedBack } from "../../../context/FeedBackContext";


const AccountClassificationsEdit = () => {

    const { id } = useParams();

    const entity = {
        name: 'Editar Clasificación de cuentas',
        url: 'account-classifications',
        frontendUrl: '/clasificación-de-cuentas',
        camelName: 'accountClassifications',
    };

    const navigate = useNavigate();

    const [data, setData] = useState({
        name: ''
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
                    ...dataToUpdate?.data
                }
            });
        }
    }, [dataToUpdate])

    useEffect(() => {
        setLoading({
            show: loading,
            message: 'Creando el registro'
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
                message: 'El registro fue creado exitosamente.'
            });
            navigate(`${entity?.frontendUrl}/listar`);
        }
    }, [updateData])

    const handleSubmit = (e) => {
        e?.preventDefault();

        updateRecord({ data });
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
                <br />
                <div className="text-end">
                    <button className="btn btn-primary">
                        Crear
                    </button>
                </div>
            </form>
        </div >
    )
}

export default AccountClassificationsEdit;