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



const AccreditationsEdit = () => {

    const [data, setData] = useState({});


    const [currentUser, setCurrentUser] = useState(null);

    const { id } = useParams();

    const { setLoading, setCustomAlert } = useFeedBack();

    const [{ data: dataToUpdate, loading: loadingData }, getRecord] = useAxios({ url: `/accreditations/${id}` }, { useCache: false });

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
            <div className="my-4 align-items-center justify-content-between d-flex">
                <h3>
                    Detalle de acreditación
                </h3>
                {
                    <>
                        <Link to={"/acreditaciones/listar"} className="btn btn-primary">
                            Volver al listado
                        </Link>
                    </>
                }
            </div>

            <div className="card p-4">
            </div>
        </div>
    )
}

export default AccreditationsEdit;