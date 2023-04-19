import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useAxios from "../../../../hooks/useAxios";
import { useFeedBack } from "../../../../context/FeedBackContext";
import DateFormatter from "../../../../components/DateFormatter";



const AccountAccreditationsEdit = () => {

    const [data, setData] = useState({});


    const [currentUser, setCurrentUser] = useState(null);

    const { id } = useParams();

    const { setLoading, setCustomAlert } = useFeedBack();

    const [{ data: dataToUpdate, loading: loadingData }, getRecord] = useAxios({ url: `/my-account/accreditations/${id}` }, { useCache: false });

    useEffect(() => {
        setLoading({
            show: loadingData,
            message: 'Obteniendo el registro'
        })
    }, [loadingData]);

    useEffect(() => {
        if (dataToUpdate) {
            setData(dataToUpdate?.data);
        }
    }, [dataToUpdate]);

    return (
        <div>
            <div className="my-4 align-items-center justify-content-end d-flex">
                {
                    <>
                        <Link to={"/acreditaciones/listar"} className="btn btn-primary">
                            Volver al listado
                        </Link>
                    </>
                }
            </div>

            <div className="card p-4">
                <div className="card-header">
                    <h3>
                        Detalle de la acreditación
                    </h3>
                </div>
                <div className="card-body">
                    <div className="row align-items-center">
                        <div className="col-md-6 mb-3">
                            <div className="form-group">
                                <label>Trabajador</label>
                                <input type="text" value={data?.user?.name} className="form-control" readOnly />
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className="form-group">
                                <label>Centro de costo o Servicio</label>
                                <input type="text" value={data?.costCenter?.name} className="form-control" readOnly />
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className="form-group">
                                <label>Fecha de la acreditación</label>
                                <input type="text" value={DateFormatter({ value: data?.createdAt, dateFormat: 'dd/MM/yyyy' })} className="form-control" readOnly />
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className="form-group">
                                <label>Acreditado Por:</label>
                                <input type="text" value={data?.accreditateBy?.name} className="form-control" readOnly />
                            </div>
                        </div>
                        {
                            data?.accreditationProcess ?
                                <>
                                    <div className="col-md-6">
                                        <label>Proceso de acreditación</label>
                                        <input type="text" value={data?.accreditationProcess?.id} className="form-control" readOnly />
                                    </div>
                                    <div className="col-md-6 text-center">
                                        <Link className="btn btn-primary" to={`/proceso-de-acreditaciones/${data?.accreditationProcess?.id}`}>
                                            Ver detalle del proceso
                                        </Link>
                                    </div>
                                </>
                                :
                                <div className="col-md-12">
                                    <label>Acreditación directa</label>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountAccreditationsEdit;